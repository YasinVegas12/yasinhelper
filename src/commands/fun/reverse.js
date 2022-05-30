const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");

module.exports = {
    name: "reverse",
    module: "fun",
    description: "Обратный текст",
    description_en: "Reverse text",
    description_ua: "Зворотний текст",
    usage: "reverse [text]",
    example: "/reverse ку - перевернуть текст и получить `ук`",
    example_en: "/reverse ball - reverse the text and get `llab`",
    example_ua: "/reverse test - отримати зворотний текст",
  async run(client,message,args,langs) {

    try {

        function reverseStr(str) {
            return str.split("").reverse().join("");
        }
        
        let errorText = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.reverse_description[langs]}`)
        .setTimestamp()
        if (!args[0]) return message.reply({ embeds: [errorText], allowedMentions: { repliedUser: false }, failIfNotExists: false }) 
        
        let embedMsg = new MessageEmbed()
        .setDescription(reverseStr(`${args.slice(0).join(" ")}`))
        .setFooter({ text: `${lang.footer_text[langs]} ${message.author.username}`, iconURL: message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
        message.reply({ embeds: [embedMsg], allowedMentions: { repliedUser: false }, failIfNotExists: false }) 

        } catch (e) {
            console.log(e)
        }
    }
}