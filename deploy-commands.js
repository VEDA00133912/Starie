const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

async function deployCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  const commands = [];
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  const guildIds = [
    process.env.GUILD_ID_1,
    process.env.GUILD_ID_2,
  ];

  try {
    console.log('Registering commands to multiple guilds...');

    for (const guildId of guildIds) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: commands }
      );
      console.log(`Registered commands to guild: ${guildId}`);
    }

    console.log(`All done! (${commands.length} commands registered to ${guildIds.length} guilds)`);
  } catch (error) {
    console.error('Command registration error:', error);
  }
}

module.exports = { deployCommands };
