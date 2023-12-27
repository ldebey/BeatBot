const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useHistory } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Rejoue la musique précédente.'),
    async execute(interaction) {
        const player = useMainPlayer();
        const history = useHistory(interaction.guild.id);

        const channel = interaction.member.voice.channel;
        if (!channel) {
            await interaction.reply({ content: 'Tu dois être dans un salon vocal pour utiliser cette commande.', ephemeral: true });
            return;
        }

        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor('#ff088c')
            .setTitle('Musique rejouée')
            .setTimestamp(new Date());

        await history.previous();

        return interaction.followUp({ embeds: [embed] });
    }
};