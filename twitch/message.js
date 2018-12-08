function sendMessage(target, context, message) {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message);
  }
  else {
    client.say(target, message);
  }
};

module.exports = {
  sendMessage,
};