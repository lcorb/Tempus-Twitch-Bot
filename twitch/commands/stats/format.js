const utils = require(`../../../utils`);
const evaluateStats = require(`./helpers`);

/**
 * Formats stats into string.
 * @param {object} playerObj Tempus player stats response object
 * @param {object} stats Stats object containing information for what information to retrieve
 * @return {string} Return string of stats
 */
async function parseStats(playerObj, stats = {type: `full`}) {
  return new Promise(async function(resolve, reject) {
    if ((playerObj.class_rank_info[`4`].rank === 0 && playerObj.class_rank_info[`3`].rank === 0) || (!playerObj.pr_stats.map)) {
      reject(new Error(`${playerObj.player_info.name} doesn't appear to have any notable stats on Tempus.`));
    } else {
      const name = playerObj.player_info.name;
      const sRank = playerObj.class_rank_info[`3`].rank;
      const dRank = playerObj.class_rank_info[`4`].rank;
      const sPoints = playerObj.class_rank_info[`3`].points;
      const dPoints = playerObj.class_rank_info[`4`].points;
      const overallRank = playerObj.rank_info.rank;
      const countryCode = playerObj.player_info.country_code;
      const tops = playerObj.top_stats;
      const wrs = playerObj.wr_stats;
      const pr = playerObj.pr_stats;
      const totalZones = playerObj.zone_count;

      if (stats.type === `rank`) {
        if (stats.tf2Class === `overall`) {
          resolve(`${name} is rank ${sRank} as Soldier (${utils.formatPoints(sPoints)}) &` +
                                  `${dRank} as Demoman (${utils.formatPoints(dPoints)}).`);
        }
        resolve(`${name} is rank ${playerObj.class_rank_info[tf2Class].rank} as ` + tf2Class === 3 ? `Soldier.` : `Demoman.`);
      }

      await evaluateStats(sRank, dRank, sPoints, dPoints, overallRank, tops, wrs, pr, totalZones)
          .catch((e) =>{
            reject(e);
          })
          .then((r) =>{
            resolve((countryCode == null ? `` : `[${countryCode}] `) + `${name} ` + r);
          });
    }
  });
}

module.exports = parseStats;
