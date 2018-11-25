const tmi = require('tmi.js'),
      request = require('request-promise'),
      util = require('util');      
      fs = require("fs");
      auth = "";

const tempusBase = `https://tempus.xyz/api`;
      miEnd = "/maps/name/",
      activity = "/activity",
      searchEnd = "/search/playersAndMaps/";

var client;

function fauth(){
  return new Promise(function(resolve, reject){    
    fs.readFile("auth.txt", "utf8", function(error, data) {
    resolve(data);
    reject(error);
    });
  });
};

async function main(){
  auth = await fauth().catch(e => {
    console.log(e);
  });
  let opts = {
    identity: {
      username: `TempusStats`,
      password: 'oauth:' + `${auth}`
    },
    channels: [
      `scotchtoberfest`
    ]
  };

  client = new tmi.client(opts);
  
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);
  client.on('disconnected', onDisconnectedHandler);

  // Connect to Twitch:
  client.connect();
}

// Valid commands start with:
let commandPrefix = '!';

// Helper function to send the correct type of message:
function sendMessage (target, context, message){
  if (context['message-type'] === 'whisper'){
    client.whisper(target, message);
  } else {
    client.say(target, message);
  }
}

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self){
  if (self) {
      return;
    } // Ignore messages from the bot

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix){
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`);
    return;
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ');
  // The command name is the first (0th) one:
  const commandName = parse[0];
  // The rest (if any) are the parameters:
  const params = parse.splice(1);

  // If the command is known, let's execute it:
  if (commandName in knownCommands){
    // Retrieve the function by its name:
    const command = knownCommands[commandName];
    // Then call the command with parameters:
    command(target, context, params);
    console.log(`* Executed ${commandName} command for ${context.username}`);
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`);
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
  console.log(`* *Connected to ${addr}:${port}* *`);
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Disconnected: ${reason}`);
  process.exit(1);
}

main();

////////////////////
//Tempus Functions//
//////////////////// 


//Commands List
let knownCommands = {
  echo,
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

//API GIT

function tempusGET(endPoint){
  return params = {
    baseUrl: tempusBase,
    headers: {
      'Accept': 'application/json'},
    uri: endPoint,
    method: 'GET',
    json: true,
  };
}

//Search function
//Type should be map or player
function tempusSearch(query, type){
  return new Promise(function (resolve, reject) {
    request (tempusGET(searchEnd + query))
    .then(function (response){
      if (type == "map"){
        console.log(`Returning: ${response.maps[0].name}`);
        resolve(response.maps[0].name);
      }
      else if (type == "player"){
        console.log(`Returning: ${response.players[0].name}`);
        resolve(response.players[0].name);
      }
    })
    .catch(function (e){
      if (!e.type){
        reject(`${type} not found.`);
      }
    })
  })
}

//GENERAL PARAMS//

//target
//User who sent message

//context
//userstate object, describes a user: moderator, follow status etc

//params
//parsed parameters (everything after the original command)

//////////////////

// Debug command
function echo (target, context, params) {
  console.log('Target: ', target);
  console.log('Context', context);
  console.log('Params', params);
  if (params.length){
    const msg = params.join(' ');
    sendMessage(target, context, msg);
  } else {
    console.log(`* Nothing to echo`);
  }
}

async function authors(target, context, params){
  if (!params.length){
    sendMessage(target, context, `@${context.username} Usage: !authors map`);
    return;
  }
  var mapName = await tempusSearch(params[0], "map").catch(e => {
    sendMessage(target, context, `@${context.username} ${e}`);
    return;
  })

  request(tempusGET(miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    authors = await parseAuthors(response, true);
    sendMessage(target, context, `@${context.username} ${mapName} Created by: ${authors}`);
  })
  .catch(function(response) {
    if (response.statusCode == 404){
      console.log(`${response.error.error}`);
      sendMessage(target, context, `@${context.username} ${response.error.error}`);
    }
  })  
}

function stime(target, context, params){

  
}

function dtime(target, context, params){
  
  
}

async function rr(target, context, params){
  activity = await parseActivity(f);
  sendMessage(target, context, `@${context.username} `);
}

async function vid(target, context, params){
  if (!params.length){
    sendMessage(target, context, `@${context.username} Usage: !vid map`);
    return;
  }
  var mapName = await tempusSearch(params[0], "map").catch(e => {
    console.log(`${e}`);
    sendMessage(target, context, `@${context.username} ${e}`);
    return;
  })

  request(tempusGET(miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    vids = await parseVids(response);
    sendMessage(target, context, `@${context.username} Soldier: ${vids[0]} Demoman: ${vids[1]}`);
  })
  .catch(function(response) {
    if (response.statusCode == 404){
      console.log(`${response.error.error}`);
      sendMessage(target, context, `@${context.username} ${response.error.error}`);
    }
  })
};

function swr(target, context, params){
  wr(target, context, params, "soldier");
};

function dwr(target, context, params){
  wr(target, context, params, "demoman");
};

async function wr(target, context, params, tf2Class = "both"){
  if (!params.length){
    sendMessage(target, context, `@${context.username} Usage: !wr map`);
    return;
  }
  var mapName = await tempusSearch(params[0], "map").catch(e => {
    console.log(`${e}`);
    sendMessage(target, context, `@${context.username} ${e}`);
    return;
  })

  request(tempusGET(miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    wrs = await parseWR(response, tf2Class);
    sendMessage(target, context, `@${context.username} ${wrs}`);
  })
  .catch(function(response) {
    if (response.statusCode == 404){
      console.log(`${response.error.error}`);
      sendMessage(target, context, `@${context.username} ${response.error.error}`);
    }
  })
};

async function mi(target, context, params){
  if (!params.length){
    sendMessage(target, context, `@${context.username} Usage: !mi map`);
    return;
  }
  var mapName = await tempusSearch(params[0], "map").catch(e => {
    console.log(`${e}`);
    sendMessage(target, context, `@${context.username} ${e}`);
    return;
  })
  console.log(`Looking for: ${mapName}`);

  request(tempusGET(miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    results = await parseMap(response);
    sendMessage(target, context, `@${context.username} ${mapName}\n${results}`);
  })
  .catch(function(response) {
    if (response.statusCode == 404){
      console.log(`${response.error.error}`);
      sendMessage(target, context, `@${context.username} ${response.error.error}`);
    }
  })
};

function parseMap(mapObj){
  return new Promise (function (resolve, reject){
    try{
      let authors = parseAuthors(mapObj),
      tiers = parseTiers(mapObj)
      resolve(`${tiers[0]} ${tiers[1]} Created by: ${authors}`);
    }
    catch (e){
      console.log(`Fatal error`);
      reject(e);
    }    
  })
};

//type should be map_tops, course_wrs, map_wrs, bonus_wrs
function parseActivity(type, all = false){
  return new Promise(function (resolve, reject){
    request(tempusGET(activity))
    .then(async function(response){
      //console.log(util.inspect(response, false, null, true));
      resolve(parseTT(response));      
    })
    .catch(function(response) {
      if (response.statusCode == 404){
        console.log(`${e}`);
        reject(e);
      }
    })
  })
}

function parseTT(activityObj){
  var response = [];
  //up to 20 recent map_tops
  for (i = 0; i < activityObj.length - 14; i++){
    player = activityObj.record_info[i].player_info[`name`];
    map = activityObj.record_info[i].map_info[`name`];
    rank = activityObj.record_info[i].rank;
    tf2Class = "";
    activityObj.record_info[i].demo_id[`class`] === 3 ? tf2Class = "S" : tf2Class = "D";

    response.push(`${map} - ${player} (${tf2Class} #${rank}`);
  }
  return (response.join()).replace(/,/g, " | ");
}

function parseCourseWR(activityObj){

}

function parseMapWR(activityObj){
  
}

function parseBonusWR(activityObj){
  
}

function parseAuthors(mapObj, full = false){
  var mapAuthors = [];
  if (mapObj.authors.length > 3 && !full){
    return `multiple authors (!authors)`;
  }
  for (i = 0; i < mapObj.authors.length; i++){
    if (i > 0 & i < mapObj.authors.length - 1){
      mapAuthors.push(`, `);
    }
    mapAuthors.push(mapObj.authors[i].name);
  }
  console.log(`Created by: ${mapAuthors}`);
  return mapAuthors;
};

function parseTiers(mapObj){
  var tiers = [];
  tiers.push(`S: Tier ` + mapObj.tier_info["demoman"]);
  tiers.push(`D: Tier ` + mapObj.tier_info["soldier"]);
  console.log(`Tiers: ${tiers}`);
  return tiers;
};
function parseVids(mapObj){
  var vids = [];
  vids.push(`youtu.be/` + mapObj.videos["soldier"]);
  vids.push(`youtu.be/` + mapObj.videos["demoman"]);
  console.log(`Vids: ${vids}`);
  return vids;
}
function parseWR(mapObj, tf2Class = "both"){
  var runs = [];
  
  if (tf2Class == "soldier"){
    runs.push(`Soldier WR: ${mapObj.soldier_runs[0]["duration"]}`);
  }
  else if (tf2Class == "demoman"){
    runs.push(`Demoman WR: ${mapObj.demoman_runs[0]["duration"]}`);
  }
  else{
    runs.push(`Demoman WR: ${mapObj.demoman_runs[0]["duration"]}`);
    runs.push(`Soldier WR: ${mapObj.soldier_runs[0]["duration"]}`);
  }
  for (i = 0; i < runs.length; i++){
    runs[i] = timePrettifier(runs[i]);
  };
  return runs;
};
function timePrettifier(time){
  var hours = Math.floor(time / 3600);
  var minutes = Math.floor(time % 3600 / 60);
  var seconds = time % 3600 % 60;

  seconds = truncate(seconds, 2);
  seconds = (seconds < 10) ? `0` + seconds : seconds;
  minutes = (minutes < 10) ? `0` + minutes : minutes;

  return timeReturn(seconds, minutes, hours);
}
function timeReturn(seconds, minutes, hours){
  return ((hours == 0 ? `` : `${hours}:`) +
          (minutes == 0 && hours == 0 ? `` : `${minutes}:`) +
          (minutes == 0 && hours == 0 ? `${seconds}s` : `${seconds}`)
  );
}
function truncate(t, d){
  return Math.trunc(t * Math.pow(10, d)) / Math.pow(10, d);
}