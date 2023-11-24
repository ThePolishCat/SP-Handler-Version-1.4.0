const { Client } = require("discord.js");
const fs = require("fs");
const jbzdScraper = require("jbzd-scraper-lib");
const jbzdConfigPath = 'settings/jbzd.json';
const jbzdConfig = require("../../settings/jbzd.json");
let kategorie

module.exports = {
    name: 'jbzdchannel',
    description: 'setup auto jbzd poster',
    type: 1,
    options: [
        {
        name: "tag",
        description: "Tag/oczekujące jbzd",
        type: 3,
        required: false
        },
    ],
    /** 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        if (!kategorie){
            kategorie = await jbzdScraper.jbzdCategories();
        }
        const { options } = interaction;
        const tag = interaction.options.getString("tag")
        

        const guildID = interaction.guild.id;
        const channelID = interaction.channel.id;

        const guildConfigIndex = jbzdConfig.findIndex(config => config.guild === guildID);
        if (guildConfigIndex !== -1) {
            jbzdConfig.splice(guildConfigIndex, 1);
            fs.writeFileSync(jbzdConfigPath, JSON.stringify(jbzdConfig, null, 2));
            await interaction.followUp("Removed channel from autojbzd");
        } else {
            if(!kategorie.some(kat =>kat.tag===tag)&&tag !=='oczekujace'){
                await interaction.followUp("Wrong tag provided");
                return
            }
            jbzdConfig.push({ guild: guildID, channel: channelID, tag: tag });
            fs.writeFileSync(jbzdConfigPath, JSON.stringify(jbzdConfig, null, 2));
            await interaction.followUp("Added channel to autojbzd");
        }
    }
};
