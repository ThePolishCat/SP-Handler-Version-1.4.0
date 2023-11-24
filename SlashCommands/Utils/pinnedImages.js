const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const archiver = require("archiver");
const axios = require("axios");

module.exports = {
    name: 'downloadpinned',
    description: 'Download pinned images, create a zip, and send it to the channel.',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const channel = interaction.channel;

        // Fetch pinned messages
        const pinnedMessages = await channel.messages.fetchPinned();

        // Create a directory to store downloaded images
        const downloadDir = `./downloads/${interaction.guild.id}_${interaction.channel.id}`;
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Download and save images using Axios
        const downloadPromises = [];
        pinnedMessages.forEach(message => {
            message.attachments.forEach(attachment => {
                if (attachment.contentType.startsWith('image')) {
                    console.log(attachment.url);
                    const filePath = `${downloadDir}/${message.id+"_"+attachment.name}`;
                    downloadPromises.push(axios({
                        method: 'get',
                        url: attachment.url,
                        responseType: 'stream',
                    }).then(response => {
                        response.data.pipe(fs.createWriteStream(filePath));
                    }));
                }
            });
        });

        await Promise.all(downloadPromises);

        // Create a zip file with higher compression
        const zipFilePath = `./downloads/images.zip`;
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Set compression level to 9 (maximum)
        });

        output.on('close', async () => {
            // Send the zip file to the channel
            await interaction.followUp({ files: [zipFilePath] });

            // Remove downloaded images and the zip file
            fs.rmSync(downloadDir, { recursive: true });
        });

        archive.pipe(output);
        archive.directory(downloadDir, false);
        archive.finalize();
    },
};
