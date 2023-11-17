const { Client } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: 'spotifychannel',
    description: 'setup spotify moving channel',
    /** 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        const jbzdConfigPath = 'settings/jbzd.json';
        const jbzdConfig = require("../../settings/jbzd.json");

        const guildID = interaction.guild.id;
        const channelID = interaction.channel.id;

        const guildConfigIndex = jbzdConfig.findIndex(config => config.guild === guildID);

        if (guildConfigIndex !== -1) {
            jbzdConfig.splice(guildConfigIndex, 1);
            fs.writeFileSync(jbzdConfigPath, JSON.stringify(jbzdConfig, null, 2));
            await interaction.followUp("Removed channel from spotify move");
        } else {
            jbzdConfig.push({ guild: guildID, channel: channelID });
            fs.writeFileSync(jbzdConfigPath, JSON.stringify(jbzdConfig, null, 2));
            await interaction.followUp("Added channel to spotify move");
        }
    }
};
