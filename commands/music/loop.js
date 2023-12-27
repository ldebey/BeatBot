const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Permet de changer le loop mode.')
        .addNumberOption(option =>
            option.setName('mode')
                .setDescription('Le mode de loop.')
                .setRequired(true)
                .addChoices(
                    { name: 'Désactivé', value: 0 },
                            { name: 'Musique', value: 1 },
                            { name: 'Queue', value: 2 },
                            { name: 'Autoplay', value: 3 },
                )),
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

        const mode = interaction.options.getNumber('mode');
        const embed = new EmbedBuilder()
            .setColor('#ff088c')
            .setTitle('Mode de loop changé')
            .setTimestamp(new Date());

        queue.setRepeatMode(mode);

        switch (mode) {
            case 0:
                embed.setDescription('Le mode de loop est désormais désactivé.');
                break;
            case 1:
                embed.setDescription('Le mode de loop est désormais activé pour la musique en cours.');
                break;
            case 2:
                embed.setDescription('Le mode de loop est désormais activé pour la file d\'attente.');
                break;
            case 3:
                embed.setDescription('Le mode de loop est désormais activé pour l\'autoplay.');
                break;
        }

        return interaction.followUp({ embeds: [embed] });
    },

};