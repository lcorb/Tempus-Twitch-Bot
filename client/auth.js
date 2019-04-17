const fs = require('fs');

/**
 * Reads auth token from file.
 * @access private
 * @return {string} auth token
 */
function readAuth() {
  return new Promise(function(resolve, reject) {
    fs.readFile('./client/auth.txt', 'utf8', function(error, data) {
      resolve(data);
      reject(error);
    });
  });
};

/**
 * Generates client object.
 * @return {object} Returns client information object used for creating a new client through TMI
 */
async function auth() {
  auth = await readAuth().catch((e) => {
    console.log(`Fatal error : ${e}`);
  });
  return {
    identity: {
      username: `TempusStats`,
      password: 'oauth:' + `${auth}`,
    },
    channels: [
      `scotchtoberfest`,
      `tempusstats`,
    ],
  };
}

module.exports = {
  auth,
};
