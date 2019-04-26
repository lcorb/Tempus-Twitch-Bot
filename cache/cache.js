const utils = require(`../utils`);

/**
 * Cache class
 */
class APICache {
  /**
   * Build empty cache
   */
  constructor() {
    this.autoCache = [];
    this.autoCacheIntervalInMs = 60000;
    this.requests = [];
    this.capacity = 2;
  }

  /**
   * Add item to cache
   * @param {string} request identifying name for request
   * @param {object} data result of query
   * @param {array} args arguments of request
   */
  add(request, data, ...args) {
    if (this.requests.length === this.capacity) {
      console.log(`Removing item from cache: ` + this.requests.shift);
    }
    console.log(`Adding item to cache: ` + {request: request, data: data, args: args});
    this.requests.push({request: request, data: data, args: args});
  }

  /**
   * Add item to cache at specificed interval
   * @param {string} call function call for cache
   * @param {array} args arguments of request
   */
  autoCache(call, ...args) {
    this.autoCache.push({call: call, args: args});
  }

  /**
   * Check cache for item
   * @param {string} request identifying name for request
   * @param {array} args arguments of request
   * @return {boolean}
   */
  check(request, ...args) {
    this.requests.forEach((v) => {
      if (request === v.request) {
        if (utils.arraysAreEqual(args, v.args)) {
          return true;
        }
      }
    });
    return false;
  }
}

module.exports = APICache;
