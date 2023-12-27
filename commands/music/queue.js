const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Affiche la queue (10 prochains sons max).'),
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

        const embed = new EmbedBuilder()
            .setColor('#ff088c')
            .setTimestamp(new Date());

        let tracksList = [];

        if (queue.tracks.toArray().length > 10) {
            tracksList = queue.tracks.toArray().slice(0, 10);
            embed.setTitle(`File d'attente (10 prochains sons)`)
        }
        else {
            tracksList = queue.tracks.toArray();
            embed.setTitle(`File d'attente (${queue.tracks.toArray().length} sons)`)
        }

        const tracks = tracksList.map((track, index) => {
            return `${index + 1}. [${track.title}](${track.url})`;
        });

        embed.setDescription(tracks.join('\n'));

        return interaction.followUp({ embeds: [embed] });
    }
};