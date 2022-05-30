const { MessageEmbed } = require("discord.js");
const Primecodes = require("../../structures/PrimeCodesSchema.js");

module.exports = {
    name: "createcode",
    module: "owner",
  async run(client,message,args,langs,prefix) {

      try {

        let days = args[0]

        let errorDays = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, Необходимо указать срок действия подписки! Правильное использование: \`${prefix}createcode [дни] [тип(0 - пользовательская, 1 - серверная)]\``)
        .setTimestamp()
        if(!days) return message.reply({ embeds: [errorDays], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let errorType = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`Ошибка`)
        .setDescription(`\`${message.author.username}\`, Необходимо указать тип подписки! Правильное использование: \`${prefix}createcode [дни] [тип(0 - пользовательская, 1 - серверная)]\``)
        .setTimestamp()
        if(!args[1] || args[1] != "0" && args[1] != "1") return message.reply({ embeds: [errorType], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(args[1] === "0") {
            type = "user"
        }else if(args[1] === "1") {
            type = "server"
        }

        let coded = Math.floor(Math.random() * 8888888) + 1000000;

        await new Primecodes({
            code: coded,
            time: days,
            status: "Не активирован",
            type: type
        }).save()

        let codeEmbed = new MessageEmbed()
        .setColor(`#18a5d9`)
        .setTitle(`Код успешно создан`)
        .setDescription(`\`${message.author.username}\`, код \`${coded}\`, тип \`${type}\` с активацией на \`${days}\` дней успешно создан!`)
        .setTimestamp()
        message.reply({ embeds: [codeEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
      } catch (e) {
          console.log(e)
      }
  }
}