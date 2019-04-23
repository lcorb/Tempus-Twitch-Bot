const request = require('request-promise');
const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseStats = require(`../stats/format`);

/**
 * Callback for player rank.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @param {string} tf2Class Class identifier (both, solly, demo)
 * @return {void}
 */
async function rank(target, context, params, tf2Class = `overall`) {
  if (typeof params[0] === `number`) {
    request(api.tempusGET(api.tempusGET(api.rankEnd, {limit: 1, start: pos})))
        .then(async function(response) {
          const results = await parseRank(response);
          twitch.sendMessage(target, context, `${results}`);
        })
        .catch(function(e) {
          twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
        });
  } else {
    await api.tempusSearch(params[0], 'Player')
    .then ((response) => {
      parseStats(target, context, params, {type: rank, tf2Class: tf2Class, playerID: response});
    })
    .catch((e) => {
      twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
      return;
    });
  }
}

module.exports = rank;
