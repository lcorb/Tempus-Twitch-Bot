const twitch = require("./message.js");
const api = require('../tempus/api.js');
const tempus = require('../tempus/parse.js');
const request = require('request-promise');

let knownCommands = {
    stime,
    dtime,
    mi,
    vid,
    wr,
    swr,
    dwr,
    authors,
    rr
  };
  
  //GENERAL PARAMS//
  
  //target
  //User who sent message
  
  //context
  //userstate object, describes a user: moderator, follow status etc
  
  //params
  //parsed parameters (everything after the original command)
  
  //////////////////

async function authors(target, context, params) {
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !authors map`);
    return;
  }
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });
  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
    .then(async function (response) {
      var authors = await tempus.parseAuthors(response, true);
      twitch.sendMessage(target, context, `@${context.username} ${mapName} Created by: ${authors}`);
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
};
function dtime(target, context, params) {
};
async function rr(target, context, params) {
  //type should be map_tops, course_wrs, map_wrs, bonus_wrs
  var activity = await tempus.parseActivity("map_tops");
  console.log(activity);
  twitch.sendMessage(target, context, `@${context.username} ${activity}`);
};
async function vid(target, context, params) {
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !vid map`);
    return;
  }
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
  tempus.wr(target, context, params, "soldier");
};
function dwr(target, context, params) {
  tempus.wr(target, context, params, "demoman");
};
async function wr(target, context, params, tf2Class = "both") {
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !wr map`);
    return;
  }
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    //twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });
  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
    .then(async function (response) {
      var wrs = await tempus.parseWR(response, tf2Class);
      twitch.sendMessage(target, context, `@${context.username} ${wrs}`);
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
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !mi map`);
    return;
  }
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
    knownCommands,
    stime,
    dtime,
    mi,
    vid,
    wr,
    authors,
    rr
  };