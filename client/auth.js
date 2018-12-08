const fs = require("fs");

function readAuth(){
  return new Promise(function(resolve, reject){
    fs.readFile("./client/auth.txt", "utf8", function(error, data) {
    resolve(data);
    reject(error);
    });
  });
};

async function auth(){
  auth = await readAuth().catch(e => {
    console.log(`Fatal error : ${e}`);
  });
  return {
    identity: {
      username: `TempusStats`,
      password: 'oauth:' + `${auth}`
    },
    channels: [
      `scotchtoberfest`
    ]
  };
}

module.exports = {
  auth
};