const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseAuthors = require(`./format`);

/**
 * Callback for map authors.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function authors(target, context, params) {
  await api.tempusSearch(params[0], 'Map').catch((e) => {
    twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
  })
      .then(async (mapName) => {
        if (mapName) {
          api.fetchMap(mapName)
          .then(async function(response) {
            const authors = await parseAuthors(response, true);
            twitch.sendMessage(target, context, `@${context.username} ${mapName} | Created by: ${authors}`);
          })
          .catch(function(e) {
            twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
          });
        }
      });
  return;
}

module.exports = authors;
