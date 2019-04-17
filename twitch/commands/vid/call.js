const request = require('request-promise');
const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseVids = require(`./format`);

/**
 * Callback for map videoes.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function vid(target, context, params) {
  const mapName = await api.tempusSearch(params[0], 'Map').catch((e) => {
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
  })
      .then(async () => {
        request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
            .then(async function(response) {
              vids = await parseVids(response);
              twitch.sendMessage(target, context, `@${context.username} ${vids}`);
            })
            .catch(function(response) {
              if (response.statusCode == 404) {
                twitch.sendMessage(target, context, `@${context.username} ${response.error.error}`);
              }
            });
      });
  return;
};

module.exports = vid;
