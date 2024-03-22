const { Client, GatewayIntentBits } = require("discord.js");

module.exports = {
    name: 'wiki',
    description: 'Wiki',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    run: async (client, interaction, args) => {
        await interaction.followUp(`hi`)
    },
};
