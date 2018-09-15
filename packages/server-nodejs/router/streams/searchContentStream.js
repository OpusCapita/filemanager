'use strict';

const { Transform } = require('stream');
const { extname } = require('path');
const fs = require('fs-extra');
const PdfParser = require('pdf2json');

const { isBinaryFile } = require('../lib');

module.exports = class extends Transform {
  /**
   * @param {string} str
   *        String to search.
   * @param {Object} config
   *        Application configuration, including `fsRoot`, `logger`, etc.
   * @param {Object} options
   *        String search options.
   * @param {boolean} [options.caseSensitive]
   *        Whether string search is case sensitive.
   * @param {boolean} [options.wholeWords]
   *        Whether string search for whole words (word boundary is expected on both ends of `options.str`.
   */
  constructor(str, config, options = {}) {
    super({
      objectMode: true,
      highWaterMark: 16 // Max number of objects the buffer might contain.
    });

    this.options = {
      caseSensitive: false,
      wholeWords: false,
      ...options
    };

    this.str = this.options.caseSensitive ?
      str :
      str.toLowerCase();

    this.config = config;
    this.isDestroyed = false; // Whether the stream has been destroyed by `destroy()` call.
  }

  /**
   * Analyze a file and determine whether its content can be analyzed as text.
   *
   * @param   {string} filePath
   *          File full path (either process-relative or absolute).
   * @returns {Promise|undefined}
   *          Promise of a function returning ReadableStream if the file content can be analyzed as text,
   *          undefine otherwise.
   *          In case of a promise, the file's text is read from the ReadableStream.
   *          It may be the file's raw content if the file is text file,
   *          or the file's extracted text if it is binary and the module knows how to extract text
   *          from this kind of binary files.
   */
  async getReadStreamBuilder(filePath) {
    return new Promise(async (resolve, reject) => { // eslint-disable-line consistent-return
      if (extname(filePath).slice(1).toLowerCase() === 'pdf') {
        const pdfParser = new PdfParser(undefined, 1);

        return pdfParser.
          on('pdfParser_dataError', reject).
          on('pdfParser_dataReady', pdfData => resolve(_ => pdfParser.getRawTextContentStream())).
          loadPDF(filePath);
      }

      try {
        if (await isBinaryFile(filePath)) {
          return resolve();
        }
      } catch (err) {
        // Ignore the error and try to read the file as UTF8-encoded.
        this.config.logger.error(
          `Error determining whether file "${filePath}" is binary: ${err}` + '\n' + (err.stack && err.stack.split('\n'))
        );
      }

      resolve(_ => fs.createReadStream(filePath, {
        encoding: 'utf8',
        autoClose: true // Automatically close the file descriptor on 'error' and 'end' events.
      }));
    });
  }

  /**
   * Analyze input file content and if it is a text file containing required substring,
   * asyncronously forward (push) its descriptor to ReadableStream part of TransformStream.
   *
   * @param {Item} file
   *        File descriptor.
   * @param {string} encoding
   *        Ignore this parameter since the stream is operating in Object Mode.
   * @param {Function} done
   *        A callback function (optionally with an error argument and data)
   *        to be called after the supplied file has been processed.
   *
   * @typeof   {Object} Item
   *           File descriptor.
   * @property {string} path
   *           File full path (either process-relative or absolute).
   * @property {string} basename
   *           File basename (undefined for the root).
   * @property {number} level
   *           File depth relative to the root (0 for root, 1 for its direct children, etc.).
   * @property {Object} stats
   *           `fs.Stats` object providing information about dir/file.
   *
   * XXX: the method is called automatically when internal buffer has some data (not necessarily full buffer).
   * The stream will handle items in a sequence, i.e.`_transform()` will never be invoked again with the next file,
   * until the previous invocation completes by executing `done()` callback.
   */
  async _transform(file, encoding, done) { // eslint-disable-line consistent-return
    let readStreamBuilder;

    try {
      readStreamBuilder = await this.getReadStreamBuilder(file.path);
    } catch (err) {
      // Log error and get next file for content analysis.
      this.config.logger.error(
        `Error searching file "${file.path}": ${err}` + '\n' + (err.stack && err.stack.split('\n'))
      );

      return done(null);
    }

    if (!readStreamBuilder || this.isDestroyed) {
      return done(null);
    }

    let chunkPrefix = '';

    this.readStream = readStreamBuilder().
      /*
       * "If a file is read till its end, the 'end' event occurs followed by 'close'. And if a file is not entirely
       * read - for instance, because of an error or upon calling the `destroy()` method - there will be no 'end'
       * because the file hasn't been ended. But the 'close' event is always ensured upon a file closure."
       * https://www.reddit.com/user/soshace/comments/91kq9a/20_nodejs_lessons_data_streams_in_nodejs/
       */
      on('close', _ => done(null)).
      on('end', _ => done(null)).
      on('error', err => {
        // Use `this.emit('error',err,file)` instead of `done(err,file)` since the later causes 'data' event to occur.
        this.emit('error', err, file);

        // XXX: contrary to the above quote, neither 'close' nor 'end' event is never emitted in case of 'error' event
        //      => call `done()` here as well as in 'close' event listener.
        done(null);
      }).
      on('readable', _ => {
        let chunk;

        while ((chunk = this.readStream.read()) !== null) { // eslint-disable-line no-cond-assign
          chunk = chunkPrefix + (this.options.caseSensitive ?
            chunk :
            chunk.toLowerCase()
          );

          if (chunk.includes(this.str)) {
            done(file);
            break;
          }

          chunkPrefix = chunk.slice(1 - this.str.length);
        }
      });

    done = ((done, invoked) => satisfactoryFile => { // eslint-disable-line no-param-reassign
      if (invoked) { return; }

      if (!this.isDestroyed) {
        if (satisfactoryFile) {
          this.push(satisfactoryFile);
        }

        invoked = true; // eslint-disable-line no-param-reassign
        this.readStream.removeAllListeners();
        this.readStream.destroy(); // Implicitly emits 'close' event.
        this.readStream = undefined;
      }

      done(null);
    })(done);
  }

  _destroy(err, done) {
    if (this.readStream) {
      this.readStream.removeAllListeners();
      this.readStream.destroy();
    }

    this.isDestroyed = true;
    this.emit('close');
    done();
  }
}
