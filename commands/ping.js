const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botの応答速度を確認します'),

  async execute(interaction) {
    const start = Date.now();
    await interaction.reply({ content: '🏓 Ping! 計測中...' });

    const botLatency = Date.now() - start;

    await interaction.editReply(`🏓 Pong! ${botLatency}ms`);
  },
};
