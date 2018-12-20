const api = require('../tempus/api.js'),
      utils = require('../utils.js'),
      request = require('request-promise'),
      util = require('util');
      //console.log(util.inspect(THING, false, null, true))
  
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
          if (type === `map_tops`){
            response.push(`(${tf2Class}) [#${rank}] ${map} - ${player}`);
          }
          else{
            response.push(`(${tf2Class}) ${map} - ${player}` + type === (`course_wrs`) && type !== (`map_wrs`)  ? `- C`: `- B` + `${activityObj[type][i].zone_info[`zoneindex`]}`);
          }
          //FIXME
          //whiteSpace not formatting response correctly
          //var whiteSpace = utils.addWhitespace(response[i].length);
          //response.push(whiteSpace);
        }
        //Dont split due to lack of whitespace
        //resolve(response.join(``));
        resolve(response);
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
    if (i > 0 && i < mapObj.authors.length - 1) {
      mapAuthors.push(`, `);
    }
    else if (i !== 0) {
      mapAuthors.push(` & `)
    }
    mapAuthors.push(mapObj.authors[i].name);
  }
  return mapAuthors.join(``);
};
function parseTiers(mapObj) {
  var tiers = [];
  tiers.push(`(S) Tier ` + mapObj.tier_info["demoman"]);
  tiers.push(`(D) Tier ` + mapObj.tier_info["soldier"]);
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
    runs.push(`(S) ${mapObj.demoman_runs[0].name} - ${utils.timePrettifier(mapObj.soldier_runs[0].duration)}`);
  }
  else if (tf2Class == "demoman") {
    runs.push(`(D) ${mapObj.demoman_runs[0].name} - ${utils.timePrettifier(mapObj.demoman_runs[0].duration)}`);
  }
  else {
    runs.push(`(D) ${mapObj.demoman_runs[0].name} - ${utils.timePrettifier(mapObj.demoman_runs[0].duration)}`);
    runs.push(`(S) ${mapObj.soldier_runs[0].name} - ${utils.timePrettifier(mapObj.soldier_runs[0].duration)}`);
  }
  console.log(runs);
  return runs.join(` | `);
}
//zone can be map, bonus, course, trick
function parseTime(mapObj, tf2Class = "both", position = 1, zone = "map"){
  position -= 1;
  //Workaround to dynamically retrieve class specific info in mapObj
  tf2ClassEnd = tf2Class + `_runs`
  tf2ClassSymbol = tf2Class.charAt(0);
  console.log(`Pos: ${position}\nClass: ${tf2ClassEnd}`);
  if (tf2Class === "both_runs"){
    return(`[Rank ${position}] on ${mapObj.map_info.name} -
     (D) ${mapObj.demoman_runs[position].name} - ${mapObj.soldier_runs[position].duration} | 
     (S) ${mapObj.soldier_runs[position].name} - ${mapObj.soldier_runs[position].duration}`);
  }
  else{
    return(`(${utils.classSymbol(tf2Class)}) ${mapObj[tf2ClassEnd][position].name} is ranked ${position+1} of ${mapObj[tf2ClassEnd].length} with
     ${utils.timePrettifier(mapObj[tf2ClassEnd][position].duration)} on ${mapObj.map_info.name}`);
  }
}

module.exports = {
  parseMap,
  parseActivity,
  parseAuthors,
  parseTiers,
  parseVids,
  parseWR,
  parseTime
};