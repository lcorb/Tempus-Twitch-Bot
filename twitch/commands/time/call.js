const request = require('request-promise');
const twitch = require(`../../message`);
const api = require(`../../../tempus/api`);
const parseTime = require(`./format`);
const determineParameters = require(`./helpers`);

/**
 * Callback for specific zone and class times.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @param {string} tf2Class Class identifier used to determine which class to return time for (both, solly, demo)
 * @param {string} zone String to determine which zone type to return time for (map, bonus, course, trick)
 * @param {int} zoneIndex Index of zone to retrieve from
 * @param {boolean} exact Determines whether to format/truncate time or print the exact time
 * @return {void}
 */
async function runTime(target, context, params, tf2Class = `both`, zone = `map`, zoneIndex = 1, exact = false) {
  if ((params[3] === `exact`) || (params[2] === `exact` && !params[3])) {
    exact = true;
  }
  await determineParameters(params[0], params[1], params[2])
      .then(async (runInfo) =>{
        const mapName = await api.tempusSearch(params[runInfo[0]], 'Map')
            .catch((e) =>{
              twitch.sendMessage(target, context, `@${context.username} ${e}`);
            });
        const pos = (runInfo[0] === 1 ? parseInt(params[0]) : parseInt(params[1]));
        request(api.tempusGET(api.miEnd + `${mapName}${api.zoneEnd}${runInfo[1]}/${runInfo[2]}/records/list`, {limit: 1, start: pos}))
            .then(async function(response) {
              if (response.results.soldier.length === 0 && response.results.demoman.length === 0) {
                twitch.sendMessage(target, context, `@${context.username} No runs found.`);
              } else if (response.results[tf2Class].length === 0 && tf2Class !== `both`) {
                twitch.sendMessage(target, context, `@${context.username} No run found.`);
              } else {
                const res = await parseTime(response, tf2Class, pos, runInfo[1], mapName, exact);
                twitch.sendMessage(target, context, `@${context.username} ${res}`);
              }
            })
            .catch(function(e) {
              twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
            });
      })
      .catch((e) =>{
        twitch.sendMessage(target, context, `@${context.username} ${e.message}`);
      });
  return;
}

module.exports = runTime;
