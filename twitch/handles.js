const twitch = require("./message.js"),
      knownCommands = require("./commands.js"),
      commandPrefix = '!';

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  }
  //Not a command
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`);
    return;
  }
  msg = msg.toLowerCase();
  const parse = msg.slice(1).split(' '),
        commandName = parse[0],
        params = parse.splice(1);
  if (commandName in knownCommands) {
    const command = knownCommands[commandName];
    if (!params.length && knownCommands.commandList[commandName].usage){
      console.log(`We are here`)
      console.log(`* Failed ${commandName} command for ${context.username}`);
      twitch.sendMessage(target, context, `@${context.username} Usage: ${commandPrefix}${commandName} ${knownCommands.commandList[commandName].usage}`);
    }
    else{
      command(target, context, params);
      console.log(`* Executed ${commandName} command for ${context.username}`);
    }
  }
  else {
    console.log(`* Unknown command ${commandName} from ${context.username}`);
  }
}

function onConnectedHandler(addr, port) {
  console.log(`* *Connected to ${addr}:${port}* *`);
}

function onDisconnectedHandler(reason) {
  console.log(`Disconnected: ${reason}`);
  process.exit(1);
}

module.exports = {
    onMessageHandler,
    onConnectedHandler,
    onDisconnectedHandler    
  };