const utils = require(`../../../utils`);

/**
 * Formats demos into string.
 * @param {object} record Record info response object
 * @return {string} Return response chat string detailing a demo
 */
function parseDemos(record) {
  return new Promise((resolve, reject) => {
    if (!record) {
      reject(new Error(`Fatal error`));
    }
    let expirationStatusFragment;
    const descriptionFragment = `The demo for (${utils.numberToClassSymbol(record.record_info.class)} #${record.record_info.rank})
     ${record.player_info.name} on ${record.map_info.name}`
    + (record.zone_info.type === `map` ? `` : ` (${record.zone_info.type} ${record.zone_info.zoneindex})`);
    if (record.demo_info.recording) {
      expirationStatusFragment = `is in the process of recording: tempus.xyz/demos/${record.demo_info.id}`;
    } else if (record.demo_info.url) {
      expirationStatusFragment = `has been uploaded, and can be accessed here: (${record.record_info.demo_start_tick}) ${record.demo_info.url}`;
    } else if (record.demo_info.deleted || record.demo_info.expired) {
      expirationStatusFragment = `has been deleted.`;
    } else if (!record.demo_info.deleted && !record.demo_info.expired) {
      expirationStatusFragment = `is available, and can be requested for upload by providing this link in the Tempus Discord: tempus.xyz/demos/${record.demo_info.id}`;
    }
    resolve(`${descriptionFragment} ${expirationStatusFragment}`);
  });
};

module.exports = parseDemos;

