const request = require('request-promise');
const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseTiers = require(`./format`);

/**
 * Callback for map tiers.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function tier(target, context, params) {
  await api.tempusSearch(params[0], 'Map').catch((e) => {
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
  })
      .then(async (map) => {
        request(api.tempusGET(api.miEnd + `${map}/fullOverview`))
            .then(async function(response) {
              console.log(response);
              const tiers = await parseTiers(response);
              twitch.sendMessage(target, context, `@${context.username} ${map} ${tiers}`);
            })
            .catch(function(response) {
              twitch.sendMessage(target, context, `@${context.username} ${response}`);
            });
      });
  return;
};

module.exports = tier;
