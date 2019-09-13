const api = require(`../tempus/api`);

/**
 * AdvertiseManager class
 */
class AdvertiseManager {
  /**
   * Spawn timer for advertising servers
   */
  constructor() {
    this.servers = {};
    this.regions = [];
    setInterval(this.refresh.bind(this), 60000);
    this.refresh(true);
  }

  /**
  * GET server API.
  * @param {boolean} region Determines whether to update regions or not. Regions should only be stored once.
  */
  refresh(region = false) {
    api.fetchServerStatus()
        .then((response) => {
          this.parseServerStatus(response, region);
        });
  }

  /**
  * Extracts information from response and calls store function.
  * @param {string} serverObj Server status response object.
  * @param {boolean} region Determines whether to update regions or not. Regions should only be stored once.
  */
  parseServerStatus(serverObj, region = false) {
    serverObj.forEach((v) => {
      if (v.game_info) {
        if (v.server_info.shortname !== 'DEV1') {
          this.addServer(
            v.server_info.name,
            v.server_info.shortname,
            v.server_info.shortname.replace(/[0-9]/g, ''),
            v.server_info.shortname.replace(/[\D]/g, ''),
            `${v.server_info.addr}:${v.server_info.port}`,
            v.game_info.currentMap,
            `${v.game_info.playerCount}/${v.game_info.maxPlayers}`
          );
        }
        if (region) {
          if (v.server_info.shortname !== 'DEV1') {
            this.regions.push(v.server_info.shortname);
          }
        }
      }
    });
  }

  /**
  * Adds server to storage.
  * @param {string} name
  * @param {string} shortName
  * @param {string} region
  * @param {string} regionNumber
  * @param {string} connect
  * @param {string} map
  * @param {string} players
  */
  addServer(name, shortName, region, regionNumber, connect, map, players) {
    this.servers[shortName] = {name: name, region: region, regionNumber: regionNumber, connect: connect, map: map, players: players};
  }

  /**
  * Formats string for a specific server.
  * @param {string} shortName
  * @return {string}
  */
  format(shortName) {
    return `[${shortName}] ${this.servers[shortName].name} ${this.servers[shortName].map} (${this.servers[shortName].players}) - steam://connect/${this.servers[shortName].connect} - Go to this link to join.`;
  }
}

module.exports = AdvertiseManager;
