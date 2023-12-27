const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playdictator')
        .setDescription('Double tout le monde dans le queue pour jouer ta musique.')
        .addStringOption(option => option
            .setName('query')
            .setDescription('La musique à jouer.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);

        const channel = interaction.member.voice.channel;
        if (!channel) {
            await interaction.reply({ content: 'Tu dois être dans un salon vocal pour utiliser cette commande.', ephemeral: true });
            return;
        }

        const query = interaction.options.getString('query', true);

        await interaction.deferReply();

        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!searchResult || !searchResult.tracks.length) {
            return interaction.followUp({ content: 'Aucun résultat trouvé.', ephemeral: true });
        }

        queue.insertTrack(searchResult.tracks[0], 0);

        const embed = new EmbedBuilder()
            .setColor('#ff088c')
            .setTitle('Ajouté en queue (Enculé)')
            .setDescription(`[${searchResult.tracks[0].title}](${searchResult.tracks[0].url})`)
            .setAuthor({ name: searchResult.tracks[0].author })
            .setFooter({ text: `Durée: ${searchResult.tracks[0].duration}` })
            .setThumbnail(searchResult.tracks[0].thumbnail)
            .setTimestamp(new Date());

        return interaction.followUp({ embeds: [embed] });
    },
};