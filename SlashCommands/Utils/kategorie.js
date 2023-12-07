const { Client, GatewayIntentBits } = require("discord.js");
const jbzdScraper = require("jbzd-scraper-lib");

module.exports = {
    name: 'jbzdkategorie',
    description: 'Show kategories from jbzd',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.followUp(`humor, humor-memy, dowcipy, pasty, czarny-humor, humor-video, humor-komiksy, humor-screeny, template, \nmotoryzacja, motoryzacja-memy, motoryzacja-dyskusje, motoryzacja-ciekawostki, wiedza, wiedza-historia, wiedza-astronomia, \nwiedza-wojsko, swiat, swiat-ciekawostki, swiat-wiadomosci, swiat-podroze, \nsport, sport-pilka-nozna, sport-formula-1, sport-siatkowka, sport-skoki, \npolityka, polityka-humor, polityka-informacje, polityka-dyskusje, technologa, technologa-pc, \ntechnologa-konsole, technologa-elektronika, technologa-kryptowaluty, rozrywka, gry, filmy, music, metal, \nrozrywka-planszowki, rozrywka-literatura, hobby, hobby-rysowanie, hobby-fotografia, hobby-diy, \nkitchen, cosplay, wtf, pytanie, wojna, war, war2, sugestie-jbzd, pytanie-jbzd`)
    },
};
