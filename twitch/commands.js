const twitch = require("./message.js");
      api = require('../tempus/api.js'),
      tempus = require('../tempus/parse.js'),
      request = require('request-promise'),
      utils = require(`../utils.js`),
      util = require('util');

const commandList = {
    stime: {
      usage: `(map|place) (map|place)`
    },
    dtime:{
      usage: `(map|place) (map|place)`
    },
    mi:{
      usage: `map`,
      alias: [`m`, `map`, `mapinfo`]
    },
    vid:{
      usage: `map`,
      alias: [`vids`, `showcase`]
    },
    wr:{
      usage: `map`
    },
    swr:{
      usage: `map`
    },
    dwr:{
      usage: `map`
    },
    authors:{
      usage: `map`,
      alias: [`creator`, `mapper`]
    },
    stats:{
      usage: `player`,
      alias: [`p`, `profile`]
    },
    srank:{
      usage: `player`
    },
    drank:{
      usage: `player`
    },
    rank:{
      usage: `player`
    },
    rr:{
      mod: true
    },
    rrtt:{
      mod: true
    },
    rrm:{
      mod: true
    },
    rrc:{
      mod: true
    },
    rrb:{
      mod: true
    },
    demo:{
      usage: `map`,
      alias: [`stv`, `demos`, `sourcetv`]
    }
  };
  
  //GENERAL PARAMS//
  
  //target
  //User who sent message
  
  //context
  //userstate object, describes a user: moderator, follow status etc
  
  //params
  //parsed parameters (everything after the original command)
  
async function authors(target, context, params) {
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });
  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
    .then(async function (response) {
      var authors = await tempus.parseAuthors(response, true);
      twitch.sendMessage(target, context, `@${context.username} ${mapName} || Created by: ${authors}`);
      return;
    })
    .catch(function (response) {
      if (response.statusCode == 404) {
        console.log(`${response.error.error}`);
        //twitch.sendMessage(target, context, `@${context.username} ${response.error.error}`);
      };
      return;
    });
};
function stime(target, context, params) {
  runTime(target, context, params, `soldier`);
};
function dtime(target, context, params) {
  runTime(target, context, params, `demoman`);
};
async function runTime(target, context, params, tf2Class = `both`, type = `map`, zoneIndex = 1, exact = false) {
  var failed = false;
  console.log(!params[4])
  if (params[4] === `exact` || (params[3] === `exact` && !params[4]) || (params[2] === `exact` && !params[3])){
    console.log(`EXACT!`);
    exact = true;
  }
  var runInfo = await utils.determineParameters(params[0], params[1], params[2])
  .catch(e =>{
    console.log(e);
    failed = true;
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  })
  if (!failed){
    var mapName = await api.tempusSearch(params[runInfo[0]], "Map")
    .catch(e =>{
      //Syncronous woes
      if (!failed){
        twitch.sendMessage(target, context, `@${context.username} ${e}`);
      };
      console.log(e);
      return;
    });
    var pos = (runInfo[0] === 1 ? parseInt(params[0]) : parseInt(params[1]));
    request(api.tempusGET(api.miEnd + `${mapName}${api.zoneEnd}${runInfo[1]}/${runInfo[2]}/records/list`, {limit: 1, start: pos}))
    .then(async function (response) {
      //console.log(util.inspect(response, false, null, true));
      if (response.results.soldier.length === 0 && response.results.demoman.length === 0){
        twitch.sendMessage(target, context, `@${context.username} No runs found.`);  
      }
      else if (response.results[tf2Class].length === 0 && tf2Class !== `both`){
        twitch.sendMessage(target, context, `@${context.username} No run found.`);
      }
      else{
        var res = await tempus.parseTime(response, tf2Class, pos, runInfo[1], mapName, exact);
        twitch.sendMessage(target, context, `@${context.username} ${res}`);
      }    
      return;
    })
    .catch(function (response) {
      try{
        if (response.error.error === undefined){
          twitch.sendMessage(target, context, `@${context.username} ${response}`);
        }
        else{
          twitch.sendMessage(target, context, `@${context.username} ${response.error.error}`);
        }
      }
      catch (e){
        console.log(e);
        twitch.sendMessage(target, context, `@${context.username} Fatal error.`);
      }
      return;
    });
  }
}
async function rr(target, context, params, type=`map_wrs`) {
  //type should be map_tops, course_wrs, map_wrs, bonus_wrs
  var activity = await tempus.parseActivity(type);
  console.log(activity);
  //Split into multiple messages due to formatting issues - whiteSpace()
  //twitch.sendMessage(target, context, `@${context.username} Recent Records: ${activity}`);
  activity.forEach(e =>{
    twitch.sendMessage(target, context, `${e}`);
  })
};
function rrm(target, context, params){
  rr(target, context, params);
}
function rrtt(target, context, params){
  rr(target, context, params, `map_tops`);
}
function rrc(target, context, params){
  rr(target, context, params, `course_wrs`);
}
function rrb(target, context, params){
  rr(target, context, params, `bonus_wrs`);
}
async function vid(target, context, params) {
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });
  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
    .then(async function (response) {
      vids = await tempus.parseVids(response);
      twitch.sendMessage(target, context, `@${context.username} ${vids}`);
    })
    .catch(function (response) {
      if (response.statusCode == 404) {
        console.log(`${response.error.error}`);
        //twitch.sendMessage(target, context, `@${context.username} ${response.error.error}`);
      }
    });
};
function swr(target, context, params) {
  wr(target, context, params, "soldier");
};
function dwr(target, context, params) {
  wr(target, context, params, "demoman");
};
async function wr(target, context, params, tf2Class = "both") {
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });
  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
    .then(async function (response) {
      var wrs = await tempus.parseWR(response, tf2Class);
      twitch.sendMessage(target, context, `@${context.username} ${mapName} ${wrs}`);
      return;
    })
    .catch(function (response) {
      if (response.statusCode == 404) {
        console.log(`${response.error.error}`);
        //twitch.sendMessage(target, context, `@${context.username} ${response.error.error}`);
      }
      return;
    });
};
async function mi(target, context, params) {
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });
  console.log(`Looking for: ${mapName}`);
  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
    .then(async function (response) {
      var results = await tempus.parseMap(response);
      twitch.sendMessage(target, context, `@${context.username} ${mapName} ${results}`);
      return;
    })
    .catch(function (response) {
      if (response.statusCode == 404) {
        console.log(`${response.error.error}`);
        //twitch.sendMessage(target, context, `@${context.username} ${response.error.error}`);
      }
      return;
    });
};

async function stats(target, context, params){
  var playerID = await api.tempusSearch(params[0], "Player").catch(e => {
    console.log(`${e}`);
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });
  request(api.tempusGET(api.playerIDEnd + playerID + `/stats`))
  .then(async function(response){
    var results = await tempus.parseStats(response);
    twitch.sendMessage(target, context, `${results}`);
  })
  .catch(function (response){
    console.log(response);
    twitch.sendMessage(target, context, `@${context.username} Fatal error.`);
  })
}

async function demo(target, context, params){
  var map = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });

  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    var mapID = response
  })
  .catch (function (e){
    twitch.sendMessage(target, context, `@${context.username} Fatal error.`);
  })
}

module.exports = {
  commandList,
  stime,
  dtime,
  mi,
  vid,
  wr,
  swr,
  dwr,
  authors,
  rr,
  rrtt,
  rrm,
  rrb,
  rrc,
  stats
};