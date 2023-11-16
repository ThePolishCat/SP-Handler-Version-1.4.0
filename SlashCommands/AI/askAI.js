const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const config = require('../../settings/config.json')


module.exports = {
  name: "ask",
  description: 'ask AI',
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
    const response = await fetch('https://api.pawan.krd/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.tokenAI}`,
          'Content-Type': 'application/json'
        },
        // body: '{\n    "model": "pai-001-light-beta",\n    "max_tokens": 100,\n    "messages": [\n        {\n            "role": "system",\n            "content": "You are an helpful assistant."\n        },\n        {\n            "role": "user",\n            "content": "Who are you?"\n        }\n    ]\n}',
        body: JSON.stringify({
          'model': 'pai-001-beta',
          'max_tokens': 400,
          'messages': [
            {
              'role': 'system',
              'content': 'Jesteś przyjaznym asystentem, który używa maksymalnie 120 słów na raz. Mówisz po polsku. Piszesz jak najmniej tekstu.'
            },
            {
              'role': 'user',
              'content': question + '.Użyj 120 maksymalnie słów.'
            }
          ]
        })
    });
    const data = await response.json();

    console.log(data.choices[0].message.content);
    
    interaction.followUp(data.choices[0].message.content)
  }
}