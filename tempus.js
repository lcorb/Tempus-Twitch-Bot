const api = require('./api.js'),
      utils = require('./utils.js'),
      request = require('request-promise'),
      util = require('util');

function parseMap(mapObj) {
  return new Promise(function (resolve, reject) {
    try {
      let authors = parseAuthors(mapObj), tiers = parseTiers(mapObj);
      resolve(`${tiers[0]} ${tiers[1]} Created by: ${authors}`);
    }
    catch (e) {
      console.log(`Fatal error`);
      reject(e);
    }
  });
}
;
//type should be map_tops, course_wrs, map_wrs, bonus_wrs
function parseActivity(type, all = false) {
  return new Promise(function (resolve, reject) {
    request(tempusGET(api.activity))
      .then(async function (response) {
        //console.log(util.inspect(response, false, null, true));
        resolve(parseTT(response));
      })
      .catch(function (response) {
        if (response.statusCode == 404) {
          console.log(`${e}`);
          reject(e);
        }
      });
  });
}

//type should be map_tops, course_wrs, map_wrs, bonus_wrs
function parseActivityWR(activityObj, type) {
  var response = [];
  //up to 20 recent wrs
  for (i = 0; i < activityObj.type.length - 14; i++) {
    player = activityObj.type.record_info[i].player_info[`name`];
    map = activityObj.type.record_info[i].map_info[`name`];
    rank = activityObj.type.record_info[i].rank;
    tf2Class = "";
    activityObj.type.record_info[i].demo_id[`class`] === 3 ? tf2Class = "S" : tf2Class = "D";
    if (type === `map_tops`){
      response.push(`(${tf2Class}) ${map} - ${player} [#${rank}]`);
    }
    else{
      response.push(`(${tf2Class}) ${map} - ${player}` + type === (`course_wrs`) && type !== (`map_wrs`)  ? `- C`: `- B` + `${activityObj.type.zone_info[`zoneindex`]}`);
    }    
    response.push(utils.addWhitespace(response[i].length));
  }
  return (response.join()).replace(/,/g, "");
}

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
}
;
function parseTiers(mapObj) {
  var tiers = [];
  tiers.push(`S: Tier ` + mapObj.tier_info["demoman"]);
  tiers.push(`D: Tier ` + mapObj.tier_info["soldier"]);
  console.log(`Tiers: ${tiers}`);
  return tiers;
}
;
function parseVids(mapObj) {
  var vids = [];
  vids.push(`youtu.be/` + mapObj.videos["soldier"]);
  vids.push(`youtu.be/` + mapObj.videos["demoman"]);
  console.log(`Vids: ${vids}`);
  return vids;
}
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
    runs.push(`Soldier WR: ${mapObj.soldier_runs[0]["duration"]}`);
  }
  for (i = 0; i < runs.length; i++) {
    runs[i] = utils.timePrettifier(runs[i]);
  }
  ;
  return runs;
}

module.exports.tempus = {
  parseMap,
  parseTT,
  parseAuthors,
  parseTiers,
  parseWR}
;