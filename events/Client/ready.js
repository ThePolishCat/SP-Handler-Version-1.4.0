const client = require("../../index");
const set = require("../../settings/settings.js");
const ec = require("../../settings/embed")
const { ActivityType, EmbedBuilder } = require('discord.js');
const fs = require("fs");
const chalk = require('chalk');
const jbzdScraper = require("jbzd-scraper-lib");
const MAX_URLS = 30;
const sendphotourls = require("../../settings/photourls.json");
const jbzdConfig = require("../../settings/jbzd.json");
const { send } = require("process");
console.clear();

client.on("ready", () => {
    console.log(chalk.greenBright(`
╔═════════════════════════════════════════════╗
║                                             ║
║        YOUR BOT IS NOW ONLINE.......        ║
║                                             ║
╚═════════════════════════════════════════════╝`
    ))
});


client.on('ready', async () => {
  let membersCount = client.guilds.cache
    .map((guild) => guild.memberCount)
    .reduce((a, b) => a + b, 0);
  
    const activites = [
        {name: `${client.guilds.cache.size} Global Servers`, type: ActivityType.Watching },
        {name: ` ${membersCount} Global users!`, type: ActivityType.Watching },
        {name: `Handler Version: ${set.handlerVersion}`, type: ActivityType.Playing },
        {name: `Support Server`, type: ActivityType.Watching },
    ]
    let activity = 0
    client.user.setPresence({status: "DND", activity: activites[0]})
    setInterval(() => {
        if(activity === activity.length) return activity = 0;
        activity++
        client.user.setActivity(activites[Math.floor(Math.random() * activites.length)])
    }, 100 * 100);
});

client.once('ready', async () => {
    checkAndSendPhotos();
    setInterval(checkAndSendPhotos, 10 * 60 * 1000);
});

async function checkAndSendPhotos() {
    if (sendphotourls.size > MAX_URLS) {
      resetSentPhotoUrls();
    }
    for (const element of jbzdConfig){
        const latestPhotos = await jbzdScraper.jbzdContent(''||element.tag, 1);
        if (latestPhotos.length > 0) {
            const channel = client.channels.cache.get(element.channel);
            if (channel) {
                for (const photo of latestPhotos) {
                    const imageUrl = photo.elements.find((element) => element.type === 'image')?.src;
                    if (imageUrl && !sendphotourls.includes(imageUrl)) {
                        const embed = new EmbedBuilder()
                            .setColor(ec.color)
                            .setImage(imageUrl)
                            .setTimestamp()

                        channel.send({embeds:[embed]});
                        sendphotourls.push(imageUrl);
                    }
                }
            }
        }
    }
    if (sendphotourls == require("../../settings/jbzd.json")){return}
    fs.writeFileSync("settings/photourls.json", JSON.stringify(sendphotourls, null, 2));
}

function resetSentPhotoUrls() {
    fs.writeFileSync("settings/photourls.json", "[]");
}