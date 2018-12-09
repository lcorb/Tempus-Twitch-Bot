const api = require('../tempus/api.js'),
      utils = require('../utils.js'),
      request = require('request-promise'),
      util = require('util');

function parseMap(mapObj) {
  return new Promise(function (resolve, reject) {
    try {
      let authors = parseAuthors(mapObj), tiers = parseTiers(mapObj);
      resolve(`${tiers[0]} ${tiers[1]} Created by: ${authors}`);
    }
    catch(e) {
      console.log(`Fatal error`);
      reject(e);
    };
  });
};
//type should be map_tops, course_wrs, map_wrs, bonus_wrs
function parseActivity(type, all = false) {
  return new Promise(function (resolve, reject) {
    request(api.tempusGET(api.activityEnd))
      .then(async function (activityObj) {
        var response = [];
        //up to 20 recent wrs
        for (var i = 0; i < activityObj[type].length - 15; i++) {
          var player = activityObj[type][i].player_info[`name`],
              map = activityObj[type][i].map_info[`name`],
              rank = activityObj[type][i].record_info.rank,
              tf2Class = "";
          activityObj[type][i].record_info[`class`] === 3 ? tf2Class = "S" : tf2Class = "D";
          console.log(`${player} + ${map} + ${rank} + ${tf2Class} + ${type}`);
          if (type === `map_tops`){
            response.push(`(${tf2Class}) ${map} - ${player} [#${rank}]`);
          }
          else{
            response.push(`(${tf2Class}) ${map} - ${player}` + type === (`course_wrs`) && type !== (`map_wrs`)  ? `- C`: `- B` + `${activityObj[type][i].zone_info[`zoneindex`]}`);
          }
          var whiteSpace = utils.addWhitespace(response[i].length);
          response.push(whiteSpace);
        }
        
        console.log(`Response: ${response}`);
        resolve(response.join(``));
      })
      .catch(function (response) {
        if (response.statusCode == 404) {
          console.log(`${e}`);
          reject(e);
        };
      });
  });
};

function parseAuthors(mapObj, full = false) {
  var mapAuthors = [];
  if (mapObj.authors.length > 3 && !full) {
    return `multiple authors (!authors)`;
  }
  for (i = 0; i < mapObj.authors.length; i++) {
    if (i > 0 & i < mapObj.authors.length - 1) {
      mapAuthors.push(`, `);
    }
    mapAuthors.push(mapObj.authors[i].name);
  }
  console.log(`Created by: ${mapAuthors}`);
  return mapAuthors;
};
function parseTiers(mapObj) {
  var tiers = [];
  tiers.push(`S: Tier ` + mapObj.tier_info["demoman"]);
  tiers.push(addWhitespace(tiers[0].length));
  tiers.push(`D: Tier ` + mapObj.tier_info["soldier"]);
  console.log(`Tiers: ${tiers}`);
  return tiers;
};
function parseVids(mapObj) {
  var vids = [];
  vids.push(`youtu.be/` + mapObj.videos["soldier"]);
  vids.push(utils.addWhitespace(vids[0].length));
  vids.push(`youtu.be/` + mapObj.videos["demoman"]);
  console.log(`Vids: ${vids}`);
  return vids;
};
function parseWR(mapObj, tf2Class = "both") {
  var runs = [];
  if (tf2Class == "soldier") {
    runs.push(`Soldier WR: ${mapObj.soldier_runs[0]["duration"]}`);
  }
  else if (tf2Class == "demoman") {
    runs.push(`Demoman WR: ${mapObj.demoman_runs[0]["duration"]}`);
  }
  else {
    runs.push(`Demoman WR: ${mapObj.demoman_runs[0]["duration"]}`);
    runs.push(addWhitespace(runs[0].length));
    runs.push(`Soldier WR: ${mapObj.soldier_runs[0]["duration"]}`);
  }
  for (i = 0; i < runs.length; i++) {
    runs[i] = utils.timePrettifier(runs[i]);
  };
  return runs;
}

module.exports = {
  parseMap,
  parseActivity,
  parseAuthors,
  parseTiers,
  parseVids,
  parseWR
};