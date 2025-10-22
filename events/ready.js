const { Events, ActivityType } = require('discord.js');
const { deployCommands } = require('../deploy-commands');
// const { deleteGlobalCommands } = require('../delete-commands');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`${client.user?.tag} is ready!`);
//    await deleteGlobalCommands();
    await deployCommands(client);

    client.user?.setActivity({
      name: 'Star of Down',
      type: ActivityType.Watching,
    });

    console.log('Activity settings have been completed!');
  },
};