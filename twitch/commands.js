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
      usage: `map`
    },
    vid:{
      usage: `map`
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
      usage: `map`
    },
    rr,
    rrtt,
    rrm,
    rrc,
    rrb
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
async function runTime(target, context, params, tf2Class = `both`, type = `map`, zoneIndex = 1) {
  console.log(`Trying these params: ` + params);
  var order = await utils.determineParameters(params[0], params[1], params[2], params[3])
  .catch(e =>{
    twitch.sendMessage(target, context, `@${context.username} These arguments don't look right`);
    return;
  });
  console.log(order);
  try{
    var mapName = await api.tempusSearch(params[order], "Map");
  }
  catch (e){
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  }
  var pos = (order === 1 ? parseInt(params[0]) : parseInt(params[1]));
  request(api.tempusGET(api.miEnd + `${mapName}${api.zoneEnd}bonus/1/records/list`, {limit: 100, start: pos}))
  .then(async function (response) {
    //console.log(util.inspect(response, false, null, true));
    return;
  })
  .catch(function (response) {
    return;
  });
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
      twitch.sendMessage(target, context, `@${context.username} Soldier: ${vids[0]} Demoman: ${vids[1]}`);
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
      var results = await parseMap(response);
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
  rrc
};