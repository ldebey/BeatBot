const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Met en pause la musique en cours.'),
    async execute(interaction) {
        const player = useMainPlayer();
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

        queue.node.setPaused(!queue.node.isPaused());

        const embed = new EmbedBuilder()
            .setColor('#ff088c')
            .setTitle(queue.node.isPaused() ? 'Musique mise en pause' : 'Musique reprise')
            .setTimestamp(new Date());



        return interaction.followUp({ embeds: [embed] });
    },
};