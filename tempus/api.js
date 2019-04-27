const request = require('request-promise');
const APICache = require(`../cache/cache`);

/**
 * Create empty global cache
 */
const cache = new APICache;
cache.addAutoCache(fetchActivity, fetchActivity());
cache.addAutoCache(fetchServerStatus, fetchServerStatus());

/**
 * Formats Tempus API queries.
 * @access private
 * @param {string} endPoint Endpoint string
 * @param {boolean} query Optional query string
 * @return {string} Return parameters string
 */
function tempusGET(endPoint, query) {
  return params = {
    baseUrl: `https://tempus.xyz/api`,
    headers: {
      'Accept': 'application/json'},
    uri: endPoint,
    qs: query,
    method: 'GET',
    json: true,
  };
};

/**
 * Searches Tempus for players and maps.
 * @param {string} query Query string
 * @param {string} type Type to return (Map, Player)
 * @return {string} map name or player id
 */
function tempusSearch(query, type) {
  return new Promise(function(resolve, reject) {
    request(tempusGET(`/search/playersAndMaps/${query}`))
        .then(function(response) {
          if (type === 'Map') {
          response.maps.length > 15 ? reject(new Error(`Too many results`)) : resolve(response.maps[0].name);
          } else if (type === 'Player') {
          response.players.length > 50 ? reject(new Error(`Too many results`)) : resolve(response.players[0].id);
          }
        })
        .catch(function(e) {
          reject((new Error(`${type} not found.`)));
        });
  });
};

/**
 * Retrieves Tempus map object.
 * @param {string} map Query string
 * @return {object} Response map object
 */
function fetchMap(map) {
  const cacheResult = cache.check(`fetchMap`, map);
  if (cacheResult) {
    return cacheResult;
  } else {
    const data = request(tempusGET(`/maps/name/${map}/fullOverview`));
    cache.add(`fetchMap`, data, map);
    return data;
  }
}

/**
 * Retrieves Tempus player stats object.
 * @param {string} playerid Query string
 * @return {object} Response stats object
 */
function fetchPlayerStats(playerid) {
  const cacheResult = cache.check(`fetchPlayerStats`, playerid);
  if (cacheResult) {
    return cacheResult;
  } else {
    const data = request(tempusGET(`/players/id/${playerid}/stats`));
    cache.add(`fetchMap`, data, map);
    return data;
  }
}

/**
 * Retrieves Tempus activity object.
 * @param {boolean} caching Whether we are currently refreshing cache or not
 * @return {object} Response activity object
 */
function fetchActivity(caching) {
  if (!caching) {
    const cacheResult = cache.checkAutoCache(`fetchActivity`);
    console.log(cacheResult);
    if (cacheResult) {
      return cacheResult;
    }
  }
  return request(tempusGET(`/activity`));
}

/**
 * Retrieves Tempus record info object.
 * @param {string} recordid Query string
 * @return {object} Response record info object
 */
function fetchRecord(recordid) {
  const cacheResult = cache.check(`fetchRecord`, recordid);
  if (cacheResult) {
    return cacheResult;
  } else {
    const data = request(tempusGET(`records/id/${recordid}/overview`));
    cache.add(`fetchMap`, data, map);
    return data;
  }
}

/**
 * Retrieves Tempus rank info object.
 * @param {string} rank Query string
 * @param {string} type Type of rank to retrieve (`3` (soldier), `4` (demo), `overall`)
 * @return {object} Response rank info object
 */
function fetchRank(rank, type) {
  const cacheResult = cache.check(`fetchRank`, rank, type);
  if (cacheResult) {
    return cacheResult;
  } else {
    const data = request(tempusGET(`/ranks/` + (type === `overall` ? `${type}` : `class/${type}`), {limit: 1, start: rank}));
    cache.add(`fetchMap`, data, map);
    return data;
  }
}

/**
 * Retrieves Tempus time info object.
 * @param {string} map Map name
 * @param {string} zone Type of zone (`map`, `course`, `bonus`)
 * @param {string} zoneindex Index of zone
 * @param {integer} position Position of time to retrieve
 * @return {object} Response time info object
 */
function fetchTime(map, zone, zoneindex, position) {
  const cacheResult = cache.check(`fetchTime`, map, zone, zoneindex, position);
  if (cacheResult) {
    return cacheResult;
  } else {
    const data = request(tempusGET(`/maps/name/${map}/zones/typeindex/${zone}/${zoneindex}/records/list`, {limit: 1, start: position}));
    cache.add(`fetchMap`, data, map);
    return data;
  }
}

/**
 * Retrieves Tempus server info.
 * @param {boolean} caching Whether we are currently refreshing cache or not
 * @return {object} Response time info object
 */
function fetchServerStatus(caching) {
  if (!caching) {
    const cacheResult = cache.checkAutoCache(`fetchServerStatus`);
    console.log(cacheResult);
    if (cacheResult) {
      return cacheResult;
    }
  }
  return request(tempusGET(`servers/statusList`));
}

module.exports = {
  tempusSearch,
  fetchMap,
  fetchPlayerStats,
  fetchActivity,
  fetchRecord,
  fetchRank,
  fetchTime,
  fetchServerStatus,
};
