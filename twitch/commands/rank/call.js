const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseStats = require(`../stats/format`);
const parseRank = require(`./format`);

/**
 * Callback for player rank.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @param {string} tf2Class Class identifier (both, solly, demo)
 * @return {void}
 */
async function rank(target, context, params, tf2Class = `overall`) {
  if (Number[params[0]] !== undefined) {
    api.fetchRank(params[0], tf2Class)
        .then(async (response) => {
          const results = await parseRank(response, tf2Class);
          twitch.sendMessage(target, context, `${results}`);
        })
        .catch((e) => {
          console.log(e);
          twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
        });
  } else {
    await api.tempusSearch(params[0], 'Player')
        .then((id) => {
          api.fetchPlayerStats(id)
              .then(async (statsObj) => {
                const response = await parseStats(statsObj, {type: `rank`, tf2Class: tf2Class, playerID: id});
                twitch.sendMessage(target, context, `@${context.username} ${response}`);
              });
        })
        .catch((e) => {
          twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
        });
  }
  return;
}

module.exports = rank;
