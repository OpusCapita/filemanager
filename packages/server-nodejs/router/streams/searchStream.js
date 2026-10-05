'use strict';

const SearchFsStream = require('./searchFsStream');
const SearchContentStream = require('./searchContentStream');
const FsItem2ResourceStream = require('./fsItem2ResourceStream');

const {
  TYPE_FILE,
  TYPE_DIR
} = require('../../constants');

/**
 * @param   {string} rootPath
 *          Dir full path (either process-relative or absolute) which subtree should be searched,
 *          excluding the dir itself.
 * @param   {Object} config
 *          Application configuration, including `fsRoot`, `logger`, etc.
 * @param   {Object} options
 *          Search options.
 * @param   {boolean} options.recursive
 *          Whether to search whole root's subtree (`true`) or its direct children only (`false`).
 * @param   {string[]} options.itemType
 *          One or two elements: TYPE_FILE and/or TYPE_DIR.
 *          XXX: the param _must_ be ["file"] if `options.fileContentSubstring` is non-empty string.
 * @param   {string} options.itemNameSubstring
 *          Dir/file name substring. Empty string if dir/file should be filtered accoring to `options.itemType` only.
 *          Non-empty string, if in addition to `options.itemType` filtering,
 *          dir/file name should contain specific substring.
 * @param   {boolean} options.itemNameCaseSensitive
 *          Whether dir/file name search is case sensitive.
 *          The param is ignored if `options.itemNameSubstring` is an empty string.
 * @param   {string} options.fileContentSubstring
 *          File content search string. Empty string if no file content search should be performed.
 * @param   {boolean} options.fileContentCaseSensitive
 *          Whether file content search is case sensitive.
 *          The param is ignored if `options.fileContentSubstring` is an empty string.
 * @returns {ReadableStream}
 */
module.exports = (rootPath, config, session, {
  itemNameSubstring,
  itemNameCaseSensitive,
  itemType,
  recursive,
  fileContentSubstring,
  fileContentCaseSensitive
}) => {
  // export `fsCaseSensitive` from '../lib' and uncomment the line below to disable case-sensitive search on Windows.
  // itemNameCaseSensitive = itemNameCaseSensitive && fsCaseSensitive;

  if (!itemNameCaseSensitive) {
    itemNameSubstring = itemNameSubstring.toLowerCase(); // eslint-disable-line no-param-reassign
  }

  const itemNameFilter = itemNameSubstring ?
    ({ basename }) => (itemNameCaseSensitive ? basename : basename.toLowerCase()).includes(itemNameSubstring) :
    true

  const streams = [new SearchFsStream(rootPath, config, {
    includeRoot: false,
    dirsFilter: itemType.includes(TYPE_DIR) && itemNameFilter,
    filesFilter: itemType.includes(TYPE_FILE) && itemNameFilter,
    ...(recursive ? {} : { maxLevel: 1 })
  })];

  if (fileContentSubstring) {
    streams.push(new SearchContentStream(fileContentSubstring, config, {
      caseSensitive: fileContentCaseSensitive
    }));
  }

  streams.push(new FsItem2ResourceStream(config, session));

  streams.slice(1).forEach((targetStream, i) => {
    const sourceStream = streams[i];
    const allowUnpipe = () => targetStream.removeAllListeners('unpipe');

    sourceStream.

      // Forward all errors to the last stream in the chain of piped streams =>
      // allow a user to listen to errors occured in all streams of the chain without knowing streams number and order.
      on('error', (err, item) => streams[streams.length - 1].emit('error', err, item)).

      // "end" event is emitted in Readable Stream after
      // 1. its buffer is emptied and there will be no more data available.
      on('end', allowUnpipe).

      on('close', allowUnpipe).

      pipe(targetStream).

      // "finish" event is emitted in Transform Stream after
      //   1. `stream.end()` is called by source steam
      //   and
      //   2. all data is generated and pushed by `_transfortm()` (but not necessarily consumed yet,
      //      so may remain in the buffer of its ReadableStream's side).
      // XXX: "finish" event may be called after "unpipe" =>
      //      duplicate "unpipe" listerner removal in source's stream "end" event listener.
      on('finish', () => targetStream.removeAllListeners('unpipe')).

      // If Transform stream emits an error it gets automatically unpiped from the source stream,
      // causing the pipeline to break => repipe it.
      on('unpipe', sourceStream => sourceStream.pipe(targetStream));
  });

  streams[streams.length - 1].destroyAll = () => streams.forEach((stream, i) => stream.destroy());
  return streams[streams.length - 1];
}
