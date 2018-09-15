'use strict';

const { Transform } = require('stream');
const { relative, sep } = require('path');
const { getResource } = require('../lib');

module.exports = class extends Transform {
  constructor(config) {
    super({
      objectMode: true,
      highWaterMark: 16 // Max number of objects the buffer might contain.
    });

    this.isDestroyed = false; // Whether the stream has been destroyed by `destroy()` call.
    this.config = config;
  }

  /**
   * The method is called automatically when internal buffer has some data (not necessarily full buffer).
   * The stream will handle items in a sequence, i.e.`_transform()` will never be invoked again with the next file,
   * until the previous invocation completes by executing `done()` callback.
   */
  async _transform(item, encoding, done) {
    // XXX: if `this.push()` below returns false, `this._transform()` will not be called again
    // (even if writable part of the stream has data to write)
    // untill the buffer is drained.
    const resource = await getResource({
      config: this.config,
      stats: item.stats,
      path: sep + relative(this.config.fsRoot, item.path) // `path.relative()` never starts/ends with `path.sep`.
    });

    if (!this.isDestroyed) {
      this.push(resource);
    }

    done(null);
  }

  _destroy(err, done) {
    this.isDestroyed = true;
    this.emit('close');
    done();
  }
}
