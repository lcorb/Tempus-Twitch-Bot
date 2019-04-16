const twitch = require(`../../message`);
const parseActivity = require(`./format`);

/**
 * Callback for recent records.
 * @param {string} target User who initiated command.
 * @param {object} context Userstate object, describes a user (moderator, follow status etc.)
 * @param {string} type Type of run to retrieve (map_tops, course_wrs, map_wrs, bonus_wrs)
 * @return {void}
 */
async function rr(target, context, type=`map_wrs`) {
  const activity = await parseActivity(type);
  // Split into multiple messages due to formatting issues
  activity.forEach((r) =>{
    twitch.sendMessage(target, context, `${r}`);
  });
};

module.export = rr;
