const request = require('request-promise');
      util = require('util');

const tempusBase = `https://tempus.xyz/api`,
      miEnd = `/maps/name/`,
      activityEnd = `/activity`,
      searchEnd = `/search/playersAndMaps/`,
      zoneEnd = `/zones/typeindex/`,
      playerIDEnd = `/players/id/`,
      rankEnd = `/rank`,
      statsEnd = `/stats`,
      demoEnd = `/demos/id/`;



function tempusGET(endPoint, queryString){
    return params = {
        baseUrl: tempusBase,
        headers: {
        'Accept': 'application/json'},
        uri: endPoint,
        qs: queryString,
        method: 'GET',
        json: true,
    };
};

//Search function
//Type should be Map or Player
function tempusSearch(query, type) {
  return new Promise(function (resolve, reject) {
    request(tempusGET(searchEnd + query))
      .then(function (response) {
        if (type === "Map") {
          //console.log(`Returning: ${response.maps[0].name}`);
          //console.log(util.inspect(response, false, null, true))
          response.maps.length > 15 ? reject(`Too many results`) : resolve(response.maps[0].name);
        }
        else if (type === "Player") {
          //console.log(util.inspect(response, false, null, true))
          //console.log(`Returning: ${response.players[0].id}`);
          response.players.length > 50 ? reject(`Too many results`) : resolve(response.players[0].id);
        }
      })
      .catch(function (e) {
        if (!e.type) {
          reject(`${type} not found.`);
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
  demoEnd
};