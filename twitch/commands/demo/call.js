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
  var tf2Class = tf2Class = await utils.determineClass(
      (params[2] && !params[3] ? params[2] : (params[3] ? params[3] : ``))
  )
      .catch((e) => {
        twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
      });
  await determineParameters(params[0], params[1], params[2], tf2Class)
      .catch((e) =>{
        twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
      })
      .then(async (runInfo) =>{
        const mapName = await api.tempusSearch(params[runInfo[0]], 'Map')
            .catch((e) =>{
              twitch.sendMessage(target, context, `@${context.username} ${e}`);
            });
        const pos = (runInfo[0] === 1 ? parseInt(params[0]) : parseInt(params[1]));
        request(api.tempusGET(api.miEnd + `${mapName}${api.zoneEnd}${runInfo[1]}/${runInfo[2]}/records/list`, {limit: 1, start: pos}))
            .then(async function(response) {
              request(api.tempusGET(`records/id/${response.results[tf2Class][0].id}/overview`))
                  .then(async (response) => {
                    const results = await parseDemo(response);
                    twitch.sendMessage(target, context, `@${context.username} ${results}`);
                  });
            })
            .catch(function(e) {
              twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
            });
      });
  return;
}

module.exports = demo;
