const { GoogleGenerativeAI } = require("@google/generative-ai");
const settings = require("../../settings/config.json");

const genAI = new GoogleGenerativeAI(settings.gemini);

module.exports = {
  name: "gemini",
  description: "gemini",
  type: 1,
  ownerOnly: true,
  options: [
    {
      name: "entry",
      description: "gemini",
      type: 3,
      required: true
    },
  ],
  run: async (client, interaction) => {
    const { options } = interaction;
    const prompt = interaction.options.getString("entry")
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt).catch(err => console.log(err));
    console.log(result)
    if (!result.response.promptFeedback.blockReason) {
      const response = await result.response;
      const text = response.text();
      await interaction.followUp(text)
    }else{
      await interaction.followUp("block reason:" + result.response.promptFeedback.blockReason)
    }

    
  }
};