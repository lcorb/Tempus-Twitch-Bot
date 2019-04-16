const request = require('request-promise');
const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseRank = require(`./format`);

/**
 * Callback for map authors.
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
          twitch.sendMessage(target, context, `@${context.username} ${e}`);
        });
  } else {
    const playerID = await api.tempusSearch(params[0], 'Player').catch((e) => {
      console.log(`${e}`);
      twitch.sendMessage(target, context, `@${context.username} ${e}`);
      return;
    });
    stats(target, context, params, {type: rank, tf2Class: tf2Class, playerID: playerID});
  }
}

module.exports = rank;
