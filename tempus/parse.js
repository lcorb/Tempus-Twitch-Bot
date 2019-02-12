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
            console.log(`Player: ${player}\n${map}\n${rank}\n${tf2Class}`)
            response.push(`(${tf2Class}) ` + 
            (type === `map_wrs` ? `` : ((type === (`course_wrs`) ? ` Course `: ` Bonus `)) + `${activityObj[type][i].zone_info[`zoneindex`]}`)
            + ` ${map} - ${player}`);
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
  return tiers;
};
function parseVids(mapObj) {
  var vids = [];
  if (mapObj.videos["soldier"] || mapObj.videos["demoman"]){
    mapObj.videos["soldier"] ? vids.push(`Soldier: youtu.be/` + mapObj.videos["soldier"]): vids.push(``);
    mapObj.videos["demoman"] ? vids.push(`Demoman: youtu.be/` + mapObj.videos["demoman"]): vids.push(``);
    vids.join(` `);
  }
  else{
    return `No videos found.`
  }  
  return vids;
};
function parseWR(mapObj, tf2Class = "both") {
  //console.log(util.inspect(mapObj, false, null, true));
  var runs = [];
  if (tf2Class === `both`) {
    console.log(mapObj.demoman_runs[0])
    console.log(mapObj.soldier_runs[0])
    if (mapObj.demoman_runs[0] === undefined && mapObj.soldier_runs[0] === undefined){
      return `No records have been set.`;
    }
    else{
      mapObj.demoman_runs[0] === undefined ? runs.push(`(D) No record currently set.`) : 
      runs.push(`(D) ${mapObj.demoman_runs[0].name} - ${utils.timePrettifier(mapObj.demoman_runs[0].duration)}`);
    mapObj.soldier_runs[0] === undefined ? runs.push(`(S) No record currently set.`) : 
      runs.push(`(S) ${mapObj.soldier_runs[0].name} - ${utils.timePrettifier(mapObj.soldier_runs[0].duration)}`);
    }
    return runs.join(` | `);
  }
  else {
    return (mapObj[tf2Class + `_runs`][0] === undefined ?
      `(${utils.classSymbol(tf2Class)}) No record currently set.` :
      (`(${utils.classSymbol(tf2Class)}) ${mapObj[tf2Class + `_runs`][0].name} - ${utils.timePrettifier(mapObj[tf2Class + `_runs`][0].duration)}`));
  }
}
//zone can be map, bonus, course, trick
function parseTime(mapObj, tf2Class = "both", position = 1, zone = "map", map = null, exact = false){
  return new Promise(function(resolve, reject){
    position -= 1;
    if (tf2Class === "both"){
      var demoRun = mapObj.results.demoman.length === 0 ? `No demoman run found`: 
      `[# ${position}]` + (zone !== `map` ? `${utils.classSymbol(zone)}${mapObj.zone_info.zoneindex}` : ``) + `${map} -
       (D) ${mapObj.results.demoman[0].name} - ` +
       + (exact === true ? mapObj.results.demoman[0].duration + `s`: utils.timePrettifier(mapObj.results[tf2Class][0].duration)) 

       var soldierRun = mapObj.results.soldier.length === 0 ? `No soldier run found`:
       `(S) ${mapObj.results.soldier[0].name} - ` + 
       + (exact === true ? mapObj.results.soldier[0].duration + `s`: utils.timePrettifier(mapObj.results[tf2Class][0].duration));

       resolve(demoRun + ` | ` + soldierRun);
    }
    else{
      resolve(`(${utils.classSymbol(tf2Class)}) ` +
      `${mapObj.results[tf2Class][0].name} is rank ${position+1} with `
        + (exact === true ? mapObj.results[tf2Class][0].duration + `s` : utils.timePrettifier(mapObj.results[tf2Class][0].duration)) + ` on ${map}`
        + (zone !== `map` ? ` ${utils.classSymbol(zone)}${mapObj.zone_info.zoneindex} ` : ``));
    }
  });
}
async function parseStats(mapObj, stats = {type: `full`}){
  console.log(util.inspect(mapObj, false, null, true));
  return new Promise(async function (resolve, reject){

    var name = mapObj.player_info.name,
        sRank = mapObj.class_rank_info[`3`].rank,
        dRank = mapObj.class_rank_info[`4`].rank,
        sPoints = mapObj.class_rank_info[`3`].points,
        dPoints = mapObj.class_rank_info[`4`].points,
        overallRank = mapObj.rank_info.rank,
        countryCode = mapObj.player_info.country_code,
        tops = mapObj.top_stats,
        wrs = mapObj.wr_stats,
        pr = mapObj.pr_stats,
        totalZones = mapObj.zone_count;
    
    if (stats.type === `rank`) {
      if (stats.tf2Class === `overall`) {
        resolve (`${name} is rank ${sRank} as Soldier (${utils.formatPoints(sPoints)}) &` +
                                 `${dRank} as Demoman (${utils.formatPoints(dPoints)}).`);
      }
      resolve (`${name} is rank ${mapObj.class_rank_info[tf2Class].rank} as ` + tf2Class === 3 ? `Soldier.` : `Demoman.`);
    }

    var results = await utils.evaluateStats(sRank, dRank, sPoints, dPoints, overallRank, tops, wrs, pr, totalZones)
    .catch(e =>{
      console.log(`Error parsing stats!`);
      reject(e);
    })
    .then(r =>{
      resolve(`[${countryCode}] ${name} ` + r);
    });
  })
}

async function parseRank(rankObj, tf2Class){
  return new Promise(function(resolve, reject) {

  })
}

module.exports = {
  parseMap,
  parseActivity,
  parseAuthors,
  parseTiers,
  parseVids,
  parseWR,
  parseStats,
  parseTime,
  parseRank
};