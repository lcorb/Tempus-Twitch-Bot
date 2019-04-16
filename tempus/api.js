const request = require('request-promise');
const tempusBase = `https://tempus.xyz/api`;
const miEnd = `/maps/name/`;
const activityEnd = `/activity`;
const searchEnd = `/search/playersAndMaps/`;
const zoneEnd = `/zones/typeindex/`;
const playerIDEnd = `/players/id/`;
const rankEnd = `/rank`;
const statsEnd = `/stats`;
const demoEnd = `/demos/id/`;

/**
 * Formats Tempus API queries.
 * @param {boolean} query Query string
 * @param {string} endPoint Endpoint string
 * @return {object} Return parameters object
 */
function tempusGET(query, endPoint) {
  return params = {
    baseUrl: tempusBase,
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
 * @return {string} player name or map id
 */
function tempusSearch(query, type) {
  return new Promise(function(resolve, reject) {
    request(tempusGET(searchEnd + query))
        .then(function(response) {
          if (type === 'Map') {
          response.maps.length > 15 ? reject(new Error(`Too many results`)) : resolve(response.maps[0].name);
          } else if (type === 'Player') {
          response.players.length > 50 ? reject(new Error(`Too many results`)) : resolve(response.players[0].id);
          }
        })
        .catch(function(e) {
          if (!e.type) {
            reject((new Error(`${type} not found.`)));
          }
        });
  });
};

module.exports = {
  tempusGET,
  tempusSearch,
  miEnd,
  activityEnd,
  zoneEnd,
  playerIDEnd,
  rankEnd,
  statsEnd,
  demoEnd,
};
