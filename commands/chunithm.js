const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { getRandomMusic, encodeWikiUrl } = require('../lib/random/index');

const difficulties = ['basic', 'advanced', 'expert', 'master', 'ultima'];

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('chunithm')
    .setDescription('CHUNITHMのランダム選曲')
    .addStringOption(opt =>
      opt.setName('difficulty')
        .setDescription('難易度')
        .addChoices(...difficulties.map(d => ({ name: d, value: d })))
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName('level')
        .setDescription('レベル(13, 15+等)')
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
    const difficulty = interaction.options.getString('difficulty') || 'master';
    const level = interaction.options.getString('level') || undefined;
    const count = interaction.options.getInteger('count') || 1;
	
    await interaction.deferReply();
    const songs = await getRandomMusic('chunithm', { difficulty, level }, count);

    if (!songs || songs.length === 0) {
      await interaction.reply('条件に合う曲が見つかりませんでした\n曲数かレベルを見直してください');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`CHUNITHM ランダム選曲 (${songs.length}曲)`)
      .setColor(Colors.Yellow);

    for (const song of songs) {
      const levField = song[`lev_${difficulty.substring(0, 3)}`] ?? '不明';
      embed.addFields({
        name: song.title,
        value: `${difficulty.toUpperCase()} ${level ?? levField} [Wikiリンク](${encodeWikiUrl(song.wikiwiki_url || song.wiki_url)})`,
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};