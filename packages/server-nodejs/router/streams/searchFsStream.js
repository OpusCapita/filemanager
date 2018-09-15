'use strict';

const { Readable } = require('stream');
const { join } = require('path');
const fs = require('fs-extra');

/**
 * Default sorting order:
 * 1. Dirs sorted by basename, taking into consideration whether the platform is case-sensitive.
 * 2. Files sorted by basename, taking into consideration whether the platform is case-sensitive.
 */
const defaultSorter = (itemA, itemB) => itemB.stats.isDirectory() - itemA.stats.isDirectory() ||
  itemA.basename.localeCompare(itemB.basename, {
    sensitivity: 'accent' // Case-insensitive. Change to 'variant' for case-sensitive sort.
  });

module.exports = class extends Readable {
  /**
   * @param {string} rootPath
   *        dir full path (either process-relative or absolute) which descendant dirs/files must be streamed,
   *        including the dir itself.
   * @param {Object} config
   *        Application configuration, including `fsRoot`, `logger`, etc.
   * @param {Object} [options]
   *        Traversal options.
   * @param {function} [options.sorter]
   *        sorter of children of a directory.
   * @param {boolean} [options.includeRoot]
   *        Whether to push the root to the stream if it satisfies `options.dirsFilter`.
   * @param {function|boolean} [options.filesFilter]
   *        Whether to push a file to the stream. If a function, it may be asynchronous or synchronous.
   * @param {function|boolean} [options.dirsFilter]
   *        Whether to push a dir to the stream. If a function, it may be asynchronous or synchronous.
   * @param {number>0} [options.maxLevel]
   *        Traverse the root subtree up to this level. Whole subtree is traversed by default.
   *        (the root is at level 0, its direct children - at level 1, etc.).
   */
  constructor(rootPath, config, options = {}) {
    super({
      objectMode: true,
      highWaterMark: 16 // Max number of objects the buffer might contain.
    });

    this.options = {
      sorter: defaultSorter,
      includeRoot: true,
      filesFilter: _ => true,
      dirsFilter: _ => true,
      maxLevel: Number.POSITIVE_INFINITY,
      ...options,
    };

    if (typeof this.options.filesFilter === 'boolean') {
      this.options.filesFilter = this.options.filesFilter ?
        _ => true :
        _ => false
    }

    if (typeof this.options.dirsFilter === 'boolean') {
      this.options.dirsFilter = this.options.dirsFilter ?
        _ => true :
        _ => false
    }

    this.config = config;
    this.processing = false; // Whether a file/dir is in the process of being alalyzed.
    this.allowMoreChunks = true; // Whether a buffer is able to accept more chunks.
    this.isDestroyed = false; // Whether the stream has been destroyed by `destroy()` call.

    this.items = [{
      path: rootPath,
      level: 0
    }];
  }

  async flushItem(item) {
    if ((item.level || this.options.includeRoot) &&
      (
        item.stats.isFile() && (await this.options.filesFilter(item)) ||
        item.stats.isDirectory() && (await this.options.dirsFilter(item))
      ) &&
      !this.isDestroyed
    ) {
      this.allowMoreChunks = this.push(item);
    }
  }

  async collectSubitems(item) {
    if (!item.stats.isDirectory() || item.level === this.options.maxLevel) {
      return;
    }

    const children = [];
    let child;

    try {
      for (const childBasename of (await fs.readdir(item.path))) {
        child = {
          path: join(item.path, childBasename),
          basename: childBasename,
          level: item.level + 1
        };

        child.stats = await fs.stat(child.path);

        if (this.isDestroyed) {
          return;
        }

        if (child.stats.isFile() || child.stats.isDirectory()) {
          children.push(child);
        }
      }
    } catch (err) {
      this.emit('error', err, child || item);
    }

    this.items.push(...children.sort(this.options.sorter));
  }

  /**
   * A dir/file descriptor with the following properties is pushed to the stream:
   *
   * @typeof   {Object} Item
   *           dir/file descriptor.
   * @property {string} path
   *           dir/file full path (either process-relative or absolute).
   * @property {string} basename
   *           dir/file basename (undefined for the root).
   * @property {number} level
   *           dir/file depth relative to the root (0 for root, 1 for its direct children, etc.).
   * @property {Object} stats
   *           `fs.Stats` object providing information about dir/file.
   *
   * ORDER OF PUSHING.
   * 1. Root (if `this.options.includeRoot` is true).
   * 2. All dirs/files of level 1, sorted according to `this.options.sorter()`.
   * 3. All dirs/files of level 2, sorted according to `this.options.sorter()`.
   * ...
   *
   * "Once the readable._read() method has been called,
   * it will not be called again until the readable.push() method is called."
   * https://nodejs.org/docs/latest-v8.x/api/stream.html#stream_readable_read_size_1
   */
  async _read() {
    // Reset `this.allowMoreChunks` regardless of whether another `this._read()` is still running.
    this.allowMoreChunks = true;

    // XXX: another `this._read()` can be called after any `this.push()` call without waiting for previous
    //      `this._read()` call completion => prevent subsequent `this._read()` calls untill previous call completes.
    if (this.processing) {
      // Another `this._read()` is still running.
      return;
    }

    this.processing = true;
    let item;

    // XXX: "_read() should continue reading from the resource and pushing data until readable.push() returns false"
    //      https://nodejs.org/docs/latest-v8.x/api/stream.html#stream_readable_read_size_1
    while (this.allowMoreChunks && (item = this.items.shift())) { // eslint-disable-line no-cond-assign
      try {
        if (!item.stats) {
          item.stats = await fs.stat(item.path);
        }

        await Promise.all([
          this.flushItem(item),
          this.collectSubitems(item)
        ]);
      } catch (err) {
        this.emit('error', err, item);
      }
    }

    if (this.allowMoreChunks) {
      // The above `while` loop was exited exclusively bacause of this.items.length === 0
      this.push(null);
    }

    this.processing = false;
  }

  _destroy(err, done) {
    this.items = [];
    this.isDestroyed = true;
    this.emit('close');
    done();
  }
}
