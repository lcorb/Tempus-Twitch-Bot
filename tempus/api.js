const request = require('request-promise');

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
  return request(tempusGET(`/maps/name/${map}/fullOverview`));
}

/**
 * Retrieves Tempus player stats object.
 * @param {string} playerid Query string
 * @return {object} Response stats object
 */
function fetchPlayerStats(playerid) {
  return request(tempusGET(`/players/id/${playerid}/stats`));
}

/**
 * Retrieves Tempus activity object.
 * @return {object} Response activity object
 */
function fetchActivity() {
  return request(tempusGET(`/activity`));
}

/**
 * Retrieves Tempus record info object.
 * @param {string} recordid Query string
 * @return {object} Response record info object
 */
function fetchRecord(recordid) {
  return request(tempusGET(`records/id/${recordid}/overview`));
}

/**
 * Retrieves Tempus rank info object.
 * @param {string} rank Query string
 * @param {string} type Type of rank to retrieve (`3` (soldier), `4` (demo), `overall`)
 * @return {object} Response rank info object
 */
function fetchRank(rank, type) {
  return request(tempusGET(tempusGET(`/rank/` + (type === `overall` ? `${type}` : `class/${type}`), {limit: 1, start: rank})));
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
  return request(tempusGET(`/maps/name/${map}/zones/typeindex/${zone}/${zoneindex}/records/list`, {limit: 1, start: position}));
}

module.exports = {
  tempusSearch,
  fetchMap,
  fetchPlayerStats,
  fetchActivity,
  fetchRecord,
  fetchRank,
  fetchTime,
};
