require('dotenv').config();
const { Events } = require('discord.js');

const welcomeChannelId = process.env.DISCORD_WELCOME_CHANNEL_ID;

module.exports = {
    name: Events.GuildMemberAdd,
    on: true,
    async execute(member) {
        const channel = member.guild.channels.cache.find(ch => ch.id === welcomeChannelId);
        if (!channel) return;

        const embed = {
            color: 0xff088c,
            title: `Bienvenue sur le serveur, ${member.user.username}!`,
            description: 'C\'est le message de bienvenue.',
            fields: [
                {
                    name: 'Règles',
                    value: 'Règle 1: Soit gentil.\nRègle 2: La règle 1 ne s\'applique pas sur Virgile.\nRègle 3: La règle 3.',
                    inline: false,
                },
            ],
            timestamp: new Date(),
        };

        await channel.send({ embeds: [embed] });
    },
}