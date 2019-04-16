const request = require('request-promise');
const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseWR = require(`./format`);

/**
 * Callback for world records.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @param {string} tf2Class Class identifier (both, solly, demo)
 * @return {void}
 */
async function wr(target, context, params, tf2Class = 'both') {
  const mapName = await api.tempusSearch(params[0], 'Map').catch((e) => {
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
  })
      .then(async () => {
        request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
            .then(async function(response) {
              const wrs = await parseWR(response, tf2Class);
              twitch.sendMessage(target, context, `@${context.username} ${mapName} ${wrs}`);
            })
            .catch(function(response) {
              twitch.sendMessage(target, context, `@${context.username} ${response.error.error}`);
            });
      });
  return;
};

module.exports = wr;
