const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseStats = require(`./format`);

/**
 * Callback for player stats.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @param {object} stats Stats object containing information for what information to retrieve
 * @return {void}
 */
async function stats(target, context, params, stats = {type: `full`}) {
  await api.tempusSearch(params[0], 'Player').catch((e) => {
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
  })
      .then(async (playerID) =>{
        api.fetchPlayerStats(playerID)
            .then(async function(response) {
              const results = await parseStats(response, stats);
              twitch.sendMessage(target, context, `${results}`);
            })
            .catch(function(e) {
              twitch.sendMessage(target, context, `@${context.username} ${e}`);
            });
      });
  return;
}

module.exports = stats;
