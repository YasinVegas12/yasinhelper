const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "msg",
    module: "moderation",
    description: "Отправить сообщение от имени бота",
    description_en: "Send a message by the bot",
    description_ua: "Відправити повідомлення від імена бота",
    usage: "msg [text]",
    example: "/msg Привет! - отправить сообщение от имени бота",
    example_en: "/msg Hello! - send a message by the bot",
    example_ua: "/msg Привіт! - відправити повідомлення від імені бота",
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.msg_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let botMessage = args.slice(0).join(" ");

        let noText = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.msg_text[langs]}`)
        .setTimestamp()
        if (!botMessage) return message.reply({ embeds: [noText], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        message.channel.send({ content: botMessage })
        } catch (e) {
            console.log(e)
        }
    }
}