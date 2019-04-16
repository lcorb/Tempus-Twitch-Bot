const utils = require(`../../../utils`);
const rankThresholds = [100, 50, 10, 5, 2, 3, 1];
// completionThresholds = [20, 50, 70, 90];

/**
 * Generates sentence for a players stats.
 * @param {int} sRank Rank for Soldier
 * @param {int} dRank Rank for Demoman
 * @param {int} sPoints Points for Soldier
 * @param {int} dPoints Points for Demoman
 * @param {int} overallRank Overall rank
 * @param {object} tops Top time stats object
 * @param {object} wrs World record stats object
 * @param {object} pr Personal record stats object
 * @param {object} totalZones Object for all zones
 * @return {string} Return string of stats
 */
async function evaluateStats(sRank, dRank, sPoints, dPoints, overallRank, tops, wrs, pr, totalZones) {
  return new Promise(async function(resolve) {
    const rankSentence = await generateRankSentence(sRank, dRank, overallRank, sPoints, dPoints);
    const completionSentence = await generateCompletionSentence(pr.map.count, tops, wrs, totalZones.map.count);
    resolve(`${rankSentence} ${completionSentence}`);
  });
}

/**
 * Generates sentence for a players rank.
 * @access private
 * @param {int} sPoints Points for Soldier
 * @param {int} dPoints Points for Demoman
 * @param {int} sRank Rank for Soldier
 * @param {int} dRank Rank for Demoman
 * @param {int} overallRank Overall rank
 * @param {object} stats Stats object containing information for what information to retrieve
 * @return {string} Return string detailing stats
 */
function generateRankSentence(sPoints, dPoints, sRank, dRank, overallRank) {
  let firstFragment = ``;
  let secondFragment = false;
  if (sRank < dRank) {
    firstFragment = rankThresholdCheck(sRank, `Soldier`, sPoints, dPoints);
  } else if (dRank < sRank) {
    firstFragment = rankThresholdCheck(dRank, `Demoman`, sPoints, dPoints);
  } else if (sRank === dRank) {
    firstFragment = rankThresholdCheck(sRank, `Both`, sPoints, dPoints);
  }
  if (overallRank <= rankThresholds[0]) {
    secondFragment = `is rank ${overallRank} overall`;
  }
  return `${firstFragment}` + (Boolean(secondFragment) ? ` and ${secondFragment}.` : `.`);
}

/**
 * Generates sentence for rank and joins it with points sentence.
 * @access private
 * @param {int} number Rank (sRank, dRank or both if numbers are the same)
 * @param {string} tf2Class Class identifier
 * @param {int} sPoints Soldier points
 * @param {int} dPoints Demoman points
 * @return {string} Return string detaling rank and points
 */
function rankThresholdCheck(number, tf2Class = `Soldier`, sPoints = 0, dPoints= 0) {
  sPoints = utils.formatPoints(sPoints);
  dPoints = utils.formatPoints(dPoints);
  const pointFragment = (tf2Class === `Soldier` ? (tf2Class === `Demoman` ? `with ${sPoints} & ${dPoints} respectively` : `with ${sPoints} points`) : `with ${dPoints} points`);
  // Above rank 100
  if (number >= rankThresholds[0]) {
    return `is rank ` + (tf2Class === `Both` ? `for both classes`: `${number} as ${tf2Class}`) + ` ${pointFragment}`;
  // Below rank 100 and above 50
  } else if (number <= rankThresholds[0] && number > rankThresholds[1]) {
    return `holds a respectable rank ${number}` + (tf2Class === `Both` ? `for both classes`: ` as ${tf2Class}`) + ` ${pointFragment}`;
  // Below rank 50 and above 10
  } else if (number <= rankThresholds[1] && number > rankThresholds[2]) {
    return `tops out at an impressive rank ${number}` + (tf2Class === `Both` ? `for both classes`: ` as ${tf2Class}`) + ` ${pointFragment}`;
  // Below rank 10 and above 5
  } else if (number <= rankThresholds[2] && number > rankThresholds[3]) {
    return `is one of the best at rank ${number}` + (tf2Class === `Both` ? `for both classes`: ` as ${tf2Class}`) + ` ${pointFragment}`;
  // Below rank 5 and above 3
  } else if (number <= rankThresholds[3] && number > rankThresholds[4]) {
    return `is unmatched at rank ${number}` + (tf2Class === `Both` ? `for both classes`: ` as ${tf2Class}` ) + ` ${pointFragment}`;
  // Rank 3
  } else if (number === rankThresholds[4]) {
    return `is the third highest ranked player ` + (tf2Class === `Both` ? `for both classes`: `as ${tf2Class}`) + ` ${pointFragment}`;
  // Rank 2
  } else if (number === rankThresholds[5]) {
    return `is the second highest ranked player ` + (tf2Class === `Both` ? `for both classes`: `as ${tf2Class}`) + ` ${pointFragment}`;
  // Rank 1
  } else if (number === rankThresholds[6]) {
    return `is the highest ranked player ` + (tf2Class === `Both` ? `for both classes`: `as ${tf2Class}`) + ` ${pointFragment}`;
  }
}

/**
 * Generates sentence about player map completion and top times/world records.
 * @access private
 * @param {int} pr Total number of map completions
 * @param {object} tt Top time stats object
 * @param {object} wr World record stats object
 * @param {int} totalZones Total number of maps
 * @return {string} Return string detailing completion, top times and world records
 */
function generateCompletionSentence(pr, tt, wr, totalZones) {
  return new Promise(function(resolve) {
    const firstFragment = completionThresholdCheck(pr, totalZones);
    const secondFragment = generateTTSentence(tt, wr);
    resolve(`${firstFragment}` + (secondFragment === `` ? `.` : ` ${secondFragment}`));
  });
}

/**
 * Formats completion count and percentage into sentence.
 * @access private
 * @param {int} count Number of map completions
 * @param {int} total Number of total zones
 * @return {string} Return string detailing completion
 */
function completionThresholdCheck(count, total) {
  const percentage = utils.truncate((count / (total * 2)) * 100, 2);
  return `They have ${percentage}% [${count}] overall completions`;
}

/**
 * Generates sentence based on players top times and world records.
 * @access private
 * @param {object} tt Top time stats object
 * @param {object} wr World record stats object
 * @return {string} Return string detailing top times/world records
 */
function generateTTSentence(tt, wr) {
  let ttFragment = ``;
  let wrFragment = ``;
  // These are used to check if stats object is empty
  const ttmBool = Boolean(tt.map);
  const ttcBool = Boolean(tt.course);
  const ttbBool = Boolean(tt.bonus);
  const wrbBool = Boolean(wr.bonus);
  const wrcBool = Boolean(wr.course);
  const wrBool = Boolean(wr.map);

  if (!ttmBool && !ttcBool && !ttbBool && !wrbBool && !wrcBool && !wrBool) {
    return ``;
  }
  if (!ttmBool) {
    if (ttcBool) {
      ttFragment = `and ${tt.course.count} course TT` + (tt.course.count > 1 ? `s`: ``);
    } else if (ttbBool) {
      ttFragment = `and ${tt.bonus.count} bonus TT` + (tt.bonus.count > 1 ? `s`: ``);
    } else {
      ttFragment = ``;
    }
  } else if (tt.map.count > 0 && tt.map.count <= 10) {
    ttFragment = `and ${tt.map.count} map TT` + tt.map.count === 1 ? ``: `s`;
  } else if (tt.map.count > 10 && tt.map.count <= 50) {
    ttFragment = `and a hefty ${tt.map.count} map TTs`;
  } else if (tt.map.count > 50 && tt.map.count <= 100) {
    ttFragment = `and a beefy ${tt.map.count} map TTs`;
  } else if (tt.map.count > 100 && tt.map.count <= 250) {
    ttFragment = `and a staggering ${tt.map.count} map TTs`;
  } else if (tt.map.count > 250) {
    ttFragment = `and a monumental ${tt.map.count} map TTs`;
  }

  if (!wrBool && !wrcBool && !wrbBool) {
    wrFragment = ``;
  } else {
    // :(
    wrFragment = `along with ` + (wrBool ? `${wr.map.count} map` : ``) +
      (wrcBool && wrbBool ? `, ` : (wrBool && (wrcBool || wrbBool) ? ` & `: ``)) +
      (wrcBool ? `${wr.course.count} course` : ``) +
      (wrbBool && wrcBool ? ` & ` : ``) +
      (wrbBool ? `${wr.bonus.count} bonus` : ``) +
      ` WR` +
        ((wrBool) ? ((wr.map.count > 1) ? `s` : ``):
          (wrcBool) ? ((wr.course.count > 1) ? `s` : ``):
            (wrbBool) ? ((wr.bonus.count > 1) ? `s` : ``): ``) +
      `.`;
  }
  return `${ttFragment} ${wrFragment}`;
}

module.exports = evaluateStats;
