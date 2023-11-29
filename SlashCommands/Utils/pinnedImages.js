const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const tar = require("tar");

module.exports = {
    name: 'downloadpinned',
    description: 'Download pinned images, create a tar archive, and send it to the channel.',
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
                    const filePath = `${downloadDir}/${message.id + "_" + attachment.name}`;
                    const downloadPromise = axios({
                        method: 'get',
                        url: attachment.url,
                        responseType: 'stream',
                    })
                    .then(response => {
                        return new Promise((resolve, reject) => {
                            const fileStream = fs.createWriteStream(filePath);
                            response.data.pipe(fileStream);
                            fileStream.on('finish', resolve);
                            fileStream.on('error', error => {
                                fs.unlink(filePath, () => reject(error)); // Delete the file if there is an error
                            });
                        });
                    })
                    .catch(error => {
                        console.error(`Error downloading image ${attachment.url}: ${error.message}`);
                        // You can choose to handle the error in a way that suits your needs
                    });

                    downloadPromises.push(downloadPromise);
                }
            });
        });

        await Promise.allSettled(downloadPromises);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Create a tar archive without compression
        const tarFilePath = `./downloads/images.tar`;
        await tar.create(
            {
                file: tarFilePath,
                cwd: downloadDir,
                sync: true,
            },
            fs.readdirSync(downloadDir)
        );

        // Create FormData and append the tar file
        const formData = new FormData();
        formData.append('file', fs.createReadStream(tarFilePath));

        // Upload the tar file to file.io using FormData
        const fileIoResponse = await axios.post('https://file.io?expires=1h', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Get the file.io link
        const fileIoLink = fileIoResponse.data.link;

        // Send the file.io link to the Discord channel
        await interaction.followUp(`Here is the link to download the tar archive: ${fileIoLink}`);

        // Remove downloaded images and the tar file
        fs.rmSync(downloadDir, { recursive: true });
        fs.unlinkSync(tarFilePath);
    },
};
