const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const lang = require("../../language.json");

module.exports = {
    name: "vote",
    module: "info",
    description: "Получить ссылки на все мониторинги, на которых находится бот",
    description_en: "Get links to all the monitoring sites where the bot is located",
    description_ua: "Отримати посилання на всі мониторинги, на яких знаходиться бот",
    usage: "vote",
    example: "/vote",
    example_en: "/vote",
    example_ua: "/vote",
  async run(client,message,args,langs) {

        try {

        let embed = new MessageEmbed()
        .setColor(`#34a8eb`)
        .addField(`${lang.vote_for_bot[langs]}`, `**[BotiCord](https://boticord.top/bot/974235906275954738)**`,true)
        .addField(`${lang.vote_for_server[langs]}`, `**Временно нету**`,true)
        .setTimestamp()

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        } catch(e) {
            console.log(e)
        }
    }
}