/**
 * Formats authors into string.
 * @param {object} mapObj User who initiated command.
 * @param {boolean} full Used to determine if command should return full list of authors
 * @return {string} Return string of authors
 */
function parseAuthors(mapObj, full = false) {
  const mapAuthors = [];
  if (mapObj.authors.length > 3 && !full) {
    return `${mapObj.authors.length} different authors (!authors)`;
  }
  for (i = 0; i < mapObj.authors.length; i++) {
    if (i > 0 && i < mapObj.authors.length - 1) {
      mapAuthors.push(`, `);
    } else if (i !== 0) {
      mapAuthors.push(` & `);
    }
    mapAuthors.push(mapObj.authors[i].name);
  }
  return mapAuthors.join(``);
};

module.exports = parseAuthors;
