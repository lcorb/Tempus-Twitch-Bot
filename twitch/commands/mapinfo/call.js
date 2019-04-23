const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseMap = require(`./format`);

/**
 * Callback for map information.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function mi(target, context, params) {
  await api.tempusSearch(params[0], 'Map')
      .catch((e) => {
        twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
        return;
      })
      .then(async (map) =>{
        api.fetchMap(map)
            .then(async function(response) {
              const results = await parseMap(response);
              twitch.sendMessage(target, context, `@${context.username} ${map} ${results}`);
            })
            .catch(function(e) {
              twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
            });
      });
  return;
};

module.exports = mi;
