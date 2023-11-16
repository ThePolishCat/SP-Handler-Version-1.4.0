const { EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');
const ball = require("../../structures/Json/8ball.json")
const emojis = require("../../settings/emojis")
const em = require("../../settings/embed");
const openai = new OpenAI({
	apiKey: "pk-**********************************************",
	basePath: "https://api.pawan.krd/v1/chat/completions",
});

module.exports = {
  name: "askAI",
  description: 'ask AI | Ask any questions and the bot will answer for you in text.',
  type: 1,
  options: [
    {
      name: "question",
      description: "Your Question",
      type: 3,
      required: true
    },
  ],

  run: async(client, interaction, args) => {
    const { options } = interaction;
    const question = interaction.options.getString("question")
    const response = await openai.chat.completions.createCompletion({
      model: "text-davinci-003",
      max_tokens: 100,
      messages: [
        {"role": "system", "content": "You are an helpful assistant."},
        {"role": "user", "content": question}]
    });
    
    interaction.reply(response)
  }
}