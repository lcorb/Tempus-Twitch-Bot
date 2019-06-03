/**
 * Advertiser class
 */
class Advertiser {
  /**
   * Build empty cache
   * Spawn timer for refreshing cache
   */
  constructor() {
    self.servers = [];
    setInterval(this.advertise.bind(this), 60000);
  }

  /**
  * Formats server status into chat response.
  * @param {string} serverObj Server status response object.
  * @param {object} params Chat parameters.
  */
  parseServerStatus(serverObj) {
    serverObj.forEach((v) => {
      console.log(v);
      if (v.game_info) {
        self.serverInfo.push(
            {
              name: v.server_info.name,
              region: v.server_info.shortname.replace(/[\D]/g, ''),
              connect: `${v.server_info.addr}${v.server_info.port}`,
              map: v.game_info.currentMap,
              maxPlayers: v.game_info.maxPlayers,
            }
        );
      }
    });
  }
}

module.exports = Advertiser;
