const request = require('request-promise');

const tempusBase = `https://tempus.xyz/api`,
      miEnd = "/maps/name/",
      activity = "/activity",
      searchEnd = "/search/playersAndMaps/";



function tempusGET(endPoint){
    return params = {
        baseUrl: tempusBase,
        headers: {
        'Accept': 'application/json'},
        uri: endPoint,
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
}

module.exports = {
  tempusGET,
  tempusSearch,
  miEnd,
  activity
}
;
// module.exports.tempusGET = tempusGET
// module.exports.tempusSearch = tempusSearch
// module.exports.miEnd = miEnd
// module.exports.activity = activity