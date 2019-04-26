const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseServerStatus = require(`./format`);

/**
 * Callback for server status.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.).
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function serverStatus(target, context, params) {
  await api.fetchServerStatus()
      .then(async (response) => {
        const results = await parseServerStatus(response);
        twitch.sendMessage(target, context, `@${context.username} ${results}`);
      })
      .catch((error) =>{
        twitch.sendMessage(target, context, `@${context.username} ${error.message}`);
      });
  return;
}

module.exports = serverStatus;
