const { EmbedBuilder } = require("discord.js");
const ec = require("../../settings/embed")
const jbzdScraper = require("jbzd-scraper-lib");
let kategorie

module.exports = {
  name: "jbzdlatest",
  description: "Get latest images from jbzd",
  type: 1,
  options: [
    {
      name: "tag",
      description: "Tag/oczekujące jbzd",
      type: 3,
      required: false
    },
  ],
  run: async (client, interaction) => {
    if (!kategorie) {
      kategorie = await jbzdScraper.jbzdCategories();
    }
    const { options } = interaction;
    const tag = interaction.options.getString("tag") || ""
    if (kategorie.some(kat => kat.tag === tag) || tag == 'oczekujace' || tag == '' || tag == 'losowe') {
      const data = await jbzdScraper.jbzdContent(tag, 1);
      const imageUrl = data[0].elements.find((element) => element.type === 'image')?.src;
      const embed = new EmbedBuilder()
        .setTitle(data[0].title)
        .setColor(ec.color)
        .setImage(imageUrl)
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })

      await interaction.followUp({ embeds: [embed] });
      return
    }
    await interaction.followUp("Wrong tag provided")
  }
};