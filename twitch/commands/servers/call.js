const twitch = require(`../../message`);
const parseServerStatus = require(`./format`);

/**
 * Callback for server status.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.).
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function serverStatus(target, context, params) {
  const response = await parseServerStatus(params);
  twitch.sendMessage(target, context, `@${context.username} ${response}`);
}

module.exports = serverStatus;
