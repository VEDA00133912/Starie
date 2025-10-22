const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRandomMusic, encodeWikiUrl } = require('../lib/random/phigros');

const difficulties = ['EZ', 'HD', 'IN', 'AT'];

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('phigros')
    .setDescription('Phigrosのランダム選曲')
    .addStringOption(opt =>
      opt.setName('difficulty')
        .setDescription('難易度')
        .addChoices(...difficulties.map(d => ({ name: d, value: d })))
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName('level')
        .setDescription('レベル')
        .setMinLength(1)
        .setMaxLength(3)
        .setRequired(false)
    )
    .addIntegerOption(opt =>
      opt.setName('count')
        .setDescription('曲数')
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false)
    ),

  async execute(interaction) {
    const difficulty = interaction.options.getString('difficulty') || 'IN';
    const level = interaction.options.getString('level') || undefined;
    const count = interaction.options.getInteger('count') || 1;

    await interaction.deferReply();
    const songs = await getRandomMusic('phigros', { difficulty, level }, count);
    if (!songs || songs.length === 0) {
      await interaction.editReply('条件に合う曲が見つかりませんでした\n曲数かレベルを見直してください');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Phigros ランダム選曲 (${songs.length}曲)`)
      .setColor('#d2d1ff');

    for (const song of songs) {
      embed.addFields({
        name: song.title,
        value: `${difficulty.toUpperCase()} ${song.level} [Wikiリンク](${song.wiki_url})`,
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};