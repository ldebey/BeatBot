const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joue une musique.')
        .addStringOption(option => option
            .setName('query')
            .setDescription('La musique à jouer.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) {
            await interaction.reply({ content: 'Tu dois être dans un salon vocal pour utiliser cette commande.', ephemeral: true });
            return;
        }

        const query = interaction.options.getString('query', true);

        await interaction.deferReply();

        try {
            const result = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                }
            });


            if (!result) {
                return interaction.followUp({ content: 'Aucun résultat trouvé.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#ff088c')
                .setTitle('Ajouté en queue')
                .setDescription(`[${result.track.title}](${result.track.url})`)
                .setAuthor({ name: result.track.author })
                .setFooter({ text: `Durée: ${result.track.duration}` })
                .setThumbnail(result.track.thumbnail)
                .setTimestamp(new Date());

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.followUp({ content: 'Une erreur est survenue lors de la lecture de la musique.', ephemeral: true });
        }
    }
}