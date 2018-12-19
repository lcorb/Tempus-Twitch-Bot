const twitch = require("./message.js");
const api = require('../tempus/api.js');
const tempus = require('../tempus/parse.js');
const request = require('request-promise');
const utils = require(`../utils.js`);
const util = require('util');

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
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !stime (map|place) (map|place)`);
    return;
  }
  runTime(target, context, params, `soldier`);
};
function dtime(target, context, params) {
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !dtime (map|place) (map|place)`);
    return;
  }
  runTime(target, context, params, `demoman`);
};
async function runTime(target, context, params, tf2Class = `both`, type = `map`) {
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !time (map|place) (map|place)`);
    return;
  }
  var order = await utils.determineParameters(params[0], params[1])
    .catch(e =>{
      twitch.sendMessage(target, context, `@${context.username} These arguments don't look right`);
      return;
    })
  var mapName = await api.tempusSearch(params[order], "Map")
  .catch(e => {
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });
  var pos = (order === 1 ? parseInt(params[0]) : parseInt(params[1]));
  request(api.tempusGET(api.miEnd + `${mapName}${api.zoneEnd}map/1/records/list?limit=150`))
  .then(async function (response) {
    console.log(util.inspect(response, false, null, true));
    return;
  })
  .catch(function (response) {
    console.log(util.inspect(response, false, null, true));
    return;
  });
  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
  .then(async function (response) {
    var times = await tempus.parseTime(response, tf2Class, pos);
    twitch.sendMessage(target, context, `@${context.username} ${times}`);
    return;
  })
  .catch(function (response) {
    if (response.statusCode == 404) {
      console.log(`${response.error.error}`);
    };
    return;
  });
}
async function rr(target, context, params) {
  //type should be map_tops, course_wrs, map_wrs, bonus_wrs
  var activity = await tempus.parseActivity("map_tops");
  console.log(activity);
  //Split into multiple messages due to formatting issues - whiteSpace()
  //twitch.sendMessage(target, context, `@${context.username} Recent Records: ${activity}`);
  activity.forEach(e =>{
    twitch.sendMessage(target, context, `${e}`);
  })  
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
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !swr map`);
    return;
  }

  wr(target, context, params, "soldier");
};
function dwr(target, context, params) {
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !dwr map`);
    return;
  }

  wr(target, context, params, "demoman");
};
async function wr(target, context, params, tf2Class = "both") {
  if (!params.length) {
    twitch.sendMessage(target, context, `@${context.username} Usage: !wr map`);
    return;
  }
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
  swr,
  dwr,
  authors,
  rr
};