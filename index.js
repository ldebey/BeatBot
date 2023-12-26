require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');
const token = process.env.DISCORD_TOKEN;

const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageReactions,
        ]
    }
);

const player = new Player(client);

(async () => {
    await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor')
})();

player.events.on('playerStart', (queue, track) => {
    const embed = new EmbedBuilder()
        .setColor('#ff088c')
        .setTitle('Lecture en cours')
        .setDescription(`[${track.title}](${track.url})`)
        .setAuthor({ name: track.author })
        .setFooter({ text: `Durée: ${track.duration}` })
        .setThumbnail(track.thumbnail)
        .setTimestamp(new Date());

    queue.metadata.channel.send({ embeds: [embed] });
});

client.commands = new Collection();

const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}


client.login(token);