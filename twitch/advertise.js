const api = require(`../tempus/api`);

/**
 * AdvertiseManager class
 */
class AdvertiseManager {
  /**
   * Spawn timer for advertising servers
   */
  constructor() {
    this.servers = [];
    this.regions = new Set;
    setInterval(this.refresh.bind(this), 60000);
    this.refresh();
  }

  /**
  * Formats server status resposne into array.
  */
  refresh() {
    api.fetchServerStatus()
        .then((response) => {
          this.parseServerStatus(response);
        });
  }

  /**
  * Formats server status resposne into array.
  * @param {string} serverObj Server status response object.
  * @param {object} params Chat parameters.
  */
  parseServerStatus(serverObj) {
    serverObj.forEach((v) => {
      if (v.game_info) {
        this.addServer(
            v.server_info.name,
            v.server_info.shortname,
            v.server_info.shortname.replace(/[0-9]/g, ''),
            v.server_info.shortname.replace(/[\D]/g, ''),
            `${v.server_info.addr}${v.server_info.port}`,
            v.game_info.currentMap,
            `${v.game_info.playerCount}/${v.game_info.maxPlayers}`
        );
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
    this.regions.forEach((v) => {
      const key = Object.keys(v)[0];
      if (key === region) {
        this.regions.delete(v);
        this.regions.add(v.add(this.regionNumber));
      }
    });

    this.servers.push({[region]: {name: name, shortName: shortName, region: region, regionNumber: regionNumber, connect: connect, map: map, players: players}});
  }

  /**
  * Formats string for a specific server.
  * @param {string} shortName
  * @return {string}
  */
  format(shortName) {
    return `[${this.servers[shortName].name}] ${this.servers[shortName].name} ${this.servers[shortName].map} (${this.servers.players}) - steam://connect/${this.servers[shortName].connect}`;
  }
}

module.exports = AdvertiseManager;
