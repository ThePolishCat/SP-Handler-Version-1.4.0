const { EmbedBuilder } = require("discord.js");
const ec = require("../../settings/embed")
const jbzdScraper = require("jbzd-scraper-lib");

module.exports = {
    name: "jbzdlatest",
    description : "Get latest images from jbzd",
    run: async (client, interaction) => {
        const data = await jbzdScraper.jbzdContent('', 1);
        const imageUrl = data[0].elements.find((element) => element.type === 'image')?.src;

        const embed = new EmbedBuilder()
            .setColor(ec.color)
            .setImage(imageUrl)
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              })

        await interaction.followUp({ embeds: [embed] });
    }
};