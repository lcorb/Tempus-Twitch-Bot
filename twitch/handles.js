const knownCommands = require("./commands"),
      commandPrefix = '!';

//Called every time a message comes in:
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  }
  //Not a command
  if (msg.substr(0, 1) !== commandPrefix) {
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
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName];
    // Then call the command with parameters:
    command(target, context, params);
    console.log(`* Executed ${commandName} command for ${context.username}`);
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