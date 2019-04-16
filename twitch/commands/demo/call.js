const request = require('request-promise');
const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseDemo = require(`./format`);

/**
 * Callback for demo retrieval.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function demo(target, context, params) {
  const mapName = await api.tempusSearch(params[0], 'Map').catch((e) => {
    twitch.sendMessage(target, context, `@${context.username} ${e}`);
  })
      .then(async () => {
        request(api.tempusGET(api.miEnd + `${mapName}/fullOverview`))
            .then(async function(response) {
              parseDemo();
            })
            .catch(function(e) {
              twitch.sendMessage(target, context, `@${context.username} Fatal error.`);
            });
      });
  return;
}

module.export = demo;
