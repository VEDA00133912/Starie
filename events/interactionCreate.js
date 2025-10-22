const { Events, MessageFlags, Collection } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction, client, commands) {
    if (!interaction.isChatInputCommand?.()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    const cooldowns = client.cooldowns;
    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name) ?? new Collection();
    const cooldownAmount = (command.cooldown ?? 0) * 1000;

    if (cooldownAmount > 0) {
      const userLastUsed = timestamps.get(interaction.user.id);

      if (userLastUsed && now < userLastUsed + cooldownAmount) {
        const remaining = (
          (userLastUsed + cooldownAmount - now) /
          1000
        ).toFixed(1);

        return interaction.reply({
          content: `このコマンドはクールダウン中です。${remaining}秒後に再試行してください`,
          flags: MessageFlags.Ephemeral,
        });
      }

      timestamps.set(interaction.user.id, now);
      cooldowns.set(command.data.name, timestamps);
      setTimeout(
        () => timestamps.delete(interaction.user.id),
        cooldownAmount,
      );
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      const replyData = {
        content: 'コマンドの実行中にエラーが発生しました。',
        flags: MessageFlags.Ephemeral,
      };

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(replyData);
        } else {
          await interaction.reply(replyData);
        }
      } catch {}
    }
  },
};
