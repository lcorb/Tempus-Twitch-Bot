const request = require('request-promise');

const tempusBase = `https://tempus.xyz/api`,
      miEnd = `/maps/name/`,
      activityEnd = `/activity`,
      searchEnd = `/search/playersAndMaps/`;
      zoneEnd = `/zones/typeindex/`



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
        if (type == "Map") {
          console.log(`Returning: ${response.maps[0].name}`);
          response.maps > 6 ? resolve(`Too many results`) : resolve(response.maps[0].name);
        }
        else if (type == "Player") {
          console.log(`Returning: ${response.players[0].name}`);
          response.maps > 50 ? resolve(`Too many results`) : resolve(response.players[0].name);
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
  zoneEnd
};