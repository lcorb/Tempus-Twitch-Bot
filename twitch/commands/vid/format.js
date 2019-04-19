/**
 * Formats map vids into string.
 * @param {object} mapObj Map response object
 * @return {string} Return string of videos if any
 */
function parseVids(mapObj) {
  let vids = [];
  if (mapObj.videos['soldier'] || mapObj.videos['demoman']) {
      mapObj.videos['soldier'] ? vids.push(`Soldier: youtu.be/` + mapObj.videos['soldier']): {};
      mapObj.videos['demoman'] ? vids.push(`Demoman: youtu.be/` + mapObj.videos['demoman']): {};
      vids = vids.join(` | `);
  } else {
    return new Error(`No videos found.`);
  }
  return vids;
};

module.exports = parseVids;

