const request = require('request-promise');
const api = require(`../../../tempus/api`);
const utils = require(`../../../utils`);

/**
 * Formats recent records into string.
 * @param {string} type Type of run to retrieve (map_tops, course_wrs, map_wrs, bonus_wrs)
 * @param {boolean} all (Unused) Determines whether to include all types in response
 * @return {array} Return array of recent record strings
 */
function parseActivity(type, all = false) {
  return new Promise(function(resolve, reject) {
    request(api.tempusGET(api.activityEnd))
        .then(async function(activityObj) {
          const response = [];
          // up to 20 recent wrs
          // only want to grab 6
          for (let i = 0; i < activityObj[type].length - 15; i++) {
            const player = activityObj[type][i].player_info[`name`];
            const map = activityObj[type][i].map_info[`name`];
            const rank = activityObj[type][i].record_info.rank;
            let tf2Class = ``;
            activityObj[type][i].record_info[`class`] === 3 ? tf2Class = 'S' : tf2Class = 'D';
            if (type === `map_tops`) {
              response.push(`(${tf2Class}) [#${rank}] ${map} - ${player} (${utils.timePrettifier(activityObj[type][i].record_info.duration)})`);
            } else {
              response.push(`(${tf2Class}) ` +
              (type === `map_wrs` ? `` : ((type === (`course_wrs`) ? ` Course `: ` Bonus `)) + `${activityObj[type][i].zone_info[`zoneindex`]}`)
              + ` ${map} - ${player} (${utils.timePrettifier(activityObj[type][i].record_info.duration)})`);
            }
          }
          resolve(response);
        })
        .catch(function(e) {
          reject(e);
        });
  });
};

module.exports = parseActivity;
