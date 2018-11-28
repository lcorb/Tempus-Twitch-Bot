const api = require('./api.js'),
      tempus = require('./tempus.js');

const tmi = require('tmi.js'),
      request = require('request-promise'),
      util = require('util'),
      fs = require("fs");
var auth = "";

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
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    sendMessage(target, context, `@${context.username} ${e}`);
    return;
  });

  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    authors = await tempus.parseAuthors(response, true);
    sendMessage(target, context, `@${context.username} ${mapName} Created by: ${authors}`);
    return;
  })
  .catch(function(response) {
    if (response.statusCode == 404){
      console.log(`${response.error.error}`);
      sendMessage(target, context, `@${context.username} ${response.error.error}`);
    };
    return;
  });
};

function stime(target, context, params){

  
}

function dtime(target, context, params){
  
  
}

async function rr(target, context, params){
  activity = await tempus.parseActivity(f);
  sendMessage(target, context, `@${context.username} ${activity}`);
}

async function vid(target, context, params){
  if (!params.length){
    sendMessage(target, context, `@${context.username} Usage: !vid map`);
    return;
  }
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    sendMessage(target, context, `@${context.username} ${e}`);
    return;
  })

  request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    vids = await tempus.parseVids(response);
    sendMessage(target, context, `@${context.username} Soldier: ${vids[0]} Demoman: ${vids[1]}`);
  })
  .catch(function(response) {
    if (response.statusCode == 404){
      console.log(`${response.error.error}`);
      //sendMessage(target, context, `@${context.username} ${response.error.error}`);
    }
  })
};

function swr(target, context, params){
  tempus.wr(target, context, params, "soldier");
};

function dwr(target, context, params){
  tempus.wr(target, context, params, "demoman");
};

async function wr(target, context, params, tf2Class = "both"){
  if (!params.length){
    sendMessage(target, context, `@${context.username} Usage: !wr map`);
    return;
  }
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    //sendMessage(target, context, `@${context.username} ${e}`);
    return;
  })

  request(tempusGET(api.miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    wrs = await tempus.parseWR(response, tf2Class);
    sendMessage(target, context, `@${context.username} ${wrs}`);
    return;
  })
  .catch(function(response) {
    if (response.statusCode == 404){
      console.log(`${response.error.error}`);
      //sendMessage(target, context, `@${context.username} ${response.error.error}`);
    }
    return;
  })
};

async function mi(target, context, params){
  if (!params.length){
    sendMessage(target, context, `@${context.username} Usage: !mi map`);
    return;
  }
  var mapName = await api.tempusSearch(params[0], "Map").catch(e => {
    console.log(`${e}`);
    sendMessage(target, context, `@${context.username} ${e}`);
    return;
  })
  console.log(`Looking for: ${mapName}`);

  request(tempusGET(miEnd + `${mapName}/fullOverview`))
  .then(async function(response){
    results = await parseMap(response);
    sendMessage(target, context, `@${context.username} ${mapName}\n${results}`);
    return;
  })
  .catch(function(response) {
    if (response.statusCode == 404){
      console.log(`${response.error.error}`);
      //sendMessage(target, context, `@${context.username} ${response.error.error}`);
    }
    return;
  })
};