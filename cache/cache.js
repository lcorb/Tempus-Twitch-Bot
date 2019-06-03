const utils = require(`../utils`);

/**
 * Cache class
 */
class APICache {
  /**
   * Build empty cache
   * Spawn timer for refreshing cache
   */
  constructor() {
    this.autoCache = [];
    this.autoCacheIntervalInMs = 60000;
    this.requests = [];
    this.capacity = 2;
    // setInterval(this.refreshAutoCache.bind(this), this.autoCacheIntervalInMs);
  }

  /**
   * Add item to cache
   * @param {string} request identifying name for request
   * @param {object} data result of query
   * @param {array} args arguments of request
   */
  add(request, data, ...args) {
    if (this.requests.length === this.capacity) {
      console.log(`Removing item from cache: ` + this.requests.shift());
      this.requests.shift();
    } else {
      console.log(`Caching: ${request}(${args.join(`, `)})`);
      this.requests.push({request: request, data: data, args: args});
    }
  }

  /**
   * Check cache for item
   * @param {string} request identifying name for request
   * @param {array} args arguments of request
   * @return {boolean/object} return data if matched, else return false
   */
  checkCache(request, ...args) {
    // return this.requests.find((v) => arraysAreEqual(args, v.args));
    this.requests.forEach((v) => {
      if (this.check(request, v)) {
        return v.data;
      }
    });
    return false;
  }

  /**
   * Add item to auto cache to be refreshed at an interval
   * @param {function} call function call for cache
   * @param {object} data data returned from call
   * @param {array} args arguments of request
   */
  addAutoCache(call, data, ...args) {
    this.autoCache.push({call: call, data: data, args: args});
  }

  /**
   * Check auto cache for item
   * @param {string} request identifying name for request
   * @param {array} args arguments of request
   * @return {boolean/object} return data if matched, else return false
   */
  checkAutoCache(request, ...args) {
    this.autoCache.forEach((v) => {
      if (this.check(request, v.call.name)) {
        return v.data;
      }
    });
    return false;
  }

  /**
   * Callback for auto cache refresh interval
   */
  refreshAutoCache() {
    if (this.autoCache) {
      this.autoCache.forEach((v, i) => {
        this.autoCache[i].data = v.call(true, v.args.join())
            .catch((e) => {
              console.log(`Failed to cache: ${v.call.name}(${v.args.join(`, `)}):\n${e}`);
            })
            .then(() =>{
              console.log(`Refreshed cache for: ${v.call.name}(${v.args.join(`, `)})`);
            });
      });
    }
  }

  /**
   * Check helper function
   * @param {string} request request to be checked
   * @param {array} v current request being checked
   * @return {boolean}
   */
  check(request, v) {
    if (request === v.request) {
      if (utils.arraysAreEqual(args, v.args)) {
        return true;
      }
    }
    return false;
  }
}

module.exports = APICache;
