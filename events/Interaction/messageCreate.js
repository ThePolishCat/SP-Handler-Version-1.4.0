const client = require("../../index");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { prefix } = require("../../settings/config.json");
const ec = require("../../settings/embed");

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) {
        return;
    }

    const jbzdConfig = require("../../settings/spotify.json");
    if (message.content.includes("https://open.spotify.com") && jbzdConfig.some(config => config.guild === message.guild.id)) {
        const channel = jbzdConfig.find((config) => config.guild === message.guild.id)?.channel;
        const spotifyUrl = message.content.match(/https:\/\/open\.spotify\.com[^\s]*/g);
        client.channels.cache.get(channel).send(spotifyUrl[0]);
    }
});