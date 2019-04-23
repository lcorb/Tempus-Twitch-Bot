/* eslint-disable no-var */
const request = require('request-promise');
const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const determineParameters = require(`../time/helpers`);
const parseDemo = require(`./format`);
const utils = require(`../../../utils`);


/**
 * Callback for demo retrieval.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function demo(target, context, params) {
  await utils.determineClass(
      (params[2] && !params[3] ? params[2] : (params[3] ? params[3] : ``)))
      .then(async (tf2Class) => {
        var tf2ClassParameterPosition = (params[2] && !params[3] ? 3 : (params[3] ? 4 : ``));
        await determineParameters(params[0], params[1], params[2], tf2ClassParameterPosition)
            .then(async (runInfo) => {
              const mapName = await api.tempusSearch(params[runInfo[0]], 'Map')
                  .catch((e) => {
                    twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
                  });
              const pos = (runInfo[0] === 1 ? parseInt(params[0]) : parseInt(params[1]));
              // request(api.tempusGET(api.miEnd + `${mapName}${api.zoneEnd}${runInfo[1]}/${runInfo[2]}/records/list`, {limit: 1, start: pos}))
              api.fetchTime(mapName, runInfo[1], runInfo[2], pos)
                  .then(async function(response) {
                    // API does not return error for no results in search.
                    if (!response.results[tf2Class].length) {
                      twitch.sendMessage(target, context, `@${context.username} This run doesn't appear to exist.`);
                    } else {
                      api.fetchRecord(response.results[tf2Class][0].id)
                          .then(async (response) => {
                            const results = await parseDemo(response);
                            twitch.sendMessage(target, context, `@${context.username} ${results}`);
                          });
                    }
                  });
            });
      })
      .catch((e) => {
        twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
      });
  return;
}

module.exports = demo;
