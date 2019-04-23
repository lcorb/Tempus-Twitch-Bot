const authorsCall = require(`./commands/authors/call`);
const mapInfoCall = require(`./commands/mapinfo/call`);
const rankCall = require(`./commands/rank/call`);
const recentrecordsCall = require(`./commands/recentrecords/call`);
const statsCall = require(`./commands/stats/call`);
const tierCall = require(`./commands/tier/call`);
const timeCall = require(`./commands/time/call`);
const vidCall = require(`./commands/vid/call`);
const worldrecordCall = require(`./commands/worldrecord/call`);
const demoCall = require(`./commands/demo/call`);

const commandList = {
  stime: {
    usage: `<map> <#place>`,
  },
  dtime: {
    usage: `<map> <#place>`,
  },
  time: {
    usage: `<map> <#place>`,
  },
  mi: {
    usage: `<map>`,
    alias: [`m`, `map`, `mapinfo`],
  },
  tier: {
    usage: `<map>`,
    alias: [`tiers`, `difficulty`],
  },
  vid: {
    usage: `<map>`,
    alias: [`vids`, `showcase`],
  },
  wr: {
    usage: `<map>`,
    alias: [`record`, `records`],
  },
  swr: {
    usage: `<map>`,
  },
  dwr: {
    usage: `<map>`,
  },
  authors: {
    usage: `<map>`,
    alias: [`creator`, `mapper`, `author`, `creators`],
  },
  stats: {
    usage: `<player>`,
    alias: [`p`, `profile`, `stat`],
  },
  srank: {
    usage: `<player>`,
  },
  drank: {
    usage: `<player>`,
  },
  rank: {
    usage: `<player>`,
  },
  rr: {
    alias: [`recentrecords`, `recent`],
    mod: true,
  },
  rrtt: {
    mod: true,
  },
  rrm: {
    mod: true,
  },
  rrc: {
    mod: true,
  },
  rrb: {
    mod: true,
  },
  demo: {
    usage: `<map> <position> <zone|blank>`,
    alias: [`stv`, `demos`, `sourcetv`],
  },
};

/**
 * Command handle for map authors.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function authors(target, context, params) {
  authorsCall(target, context, params);
}

/**
 * Command handle for soldier times.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function stime(target, context, params) {
  timeCall(target, context, params, `soldier`);
}

/**
 * Command handle for demoman times.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function dtime(target, context, params) {
  timeCall(target, context, params, `demoman`);
}

/**
 * Command handle for both time classes.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function time(target, context, params) {
  timeCall(target, context, params, `both`);
}

/**
 * Command handle for map information.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function mi(target, context, params) {
  mapInfoCall(target, context, params);
}

/**
 * Command handle for tiers.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function tier(target, context, params) {
  tierCall(target, context, params);
}

/**
 * Command handle for recent records.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function rr(target, context, params) {
  recentrecordsCall(target, context, `map_wrs`);
}

/**
 * Command handle for recent records (maps).
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function rrm(target, context, params) {
  recentrecordsCall(target, context, `map_wrs`);
}

/**
 * Command handle for recent records (top times).
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function rrtt(target, context, params) {
  recentrecordsCall(target, context, `map_tops`);
}

/**
 * Command handle for recent records (courses).
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function rrc(target, context, params) {
  recentrecordsCall(target, context, `course_wrs`);
}

/**
 * Command handle for recent records (bonuses).
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function rrb(target, context, params) {
  recentrecordsCall(target, context, `bonus_wrs`);
}

/**
 * Command handle for map videoes.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function vid(target, context, params) {
  vidCall(target, context, params);
}

/**
 * Command handle for soldier world records.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function swr(target, context, params) {
  worldrecordCall(target, context, params, 'soldier');
}

/**
 * Command handle for demoman world records.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function dwr(target, context, params) {
  worldrecordCall(target, context, params, 'demoman');
}

/**
 * Command handle for both classes world records.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function wr(target, context, params) {
  worldrecordCall(target, context, params, 'both');
}

/**
 * Command handle for player stats.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function stats(target, context, params) {
  statsCall(target, context, params, {type: `full`});
}

/**
 * Command handle for demo retrieval.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
async function demo(target, context, params) {
  demoCall(target, context, params);
}

/**
 * Command handle for soldier rank.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function rank(target, context, params) {
  rankCall(target, context, params, `overall`);
};

/**
 * Command handle for soldier rank.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function srank(target, context, params) {
  rankCall(target, context, params, 3);
}

/**
 * Command handle for demoman rank.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {array} params Parsed parameters of command.
 * @return {void}
 */
function drank(target, context, params) {
  rankCall(target, context, params, 4);
}


module.exports = {
  commandList,
  stime,
  dtime,
  time,
  mi,
  tier,
  vid,
  wr,
  swr,
  dwr,
  authors,
  rr,
  rrtt,
  rrm,
  rrb,
  rrc,
  stats,
  demo,
  rank,
  srank,
  drank,
};
