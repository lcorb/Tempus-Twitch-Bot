/**
 * Handle for sending messages.
 * @param {string} target User who sent message
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} message
 * @return {void}
 */
function sendMessage(target, context, message) {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message);
  } else {
    client.say(target, message);
  }
};

module.exports = {
  sendMessage,
};
