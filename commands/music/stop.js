const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Arrête la queue.'),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);

        const channel = interaction.member.voice.channel;
        if (!channel) {
            await interaction.reply({ content: 'Tu dois être dans un salon vocal pour utiliser cette commande.', ephemeral: true });
            return;
        }

        if (!queue.isPlaying()) {
            await interaction.reply({ content: 'Il n\'y a aucune musique en cours.', ephemeral: true });
            return;
        }

        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor('#ff088c')
            .setTitle('Musique arrêtée')
            .setTimestamp(new Date());

        queue.node.stop();
        queue.delete();

        return interaction.followUp({ embeds: [embed] });
    }
};