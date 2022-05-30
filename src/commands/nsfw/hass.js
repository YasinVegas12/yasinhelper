const { MessageEmbed } = require(`discord.js`);
const lang = require("../../language.json");
const fetch = require("node-fetch");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "hass",
    module: "nsfw",
    description: "Посмотреть NSFW картинку.",
    description_en: "NSFW image.",
    description_ua: "Переглянути NSFW картинку.",
    usage: "hass",
    example: "/hass",
    example_en: "/hass",
    example_ua: "/hass",
    cooldown: 15,
  async run(client,message,args,langs) {

    try {
        
        if(!message.channel.nsfw) { 
            let errorChannel = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.nsfw_channel[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorChannel], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let body = await fetch(`https://nekobot.xyz/api/image?type=hass`).then(url => url.json());

        cooldown.add(message.author.id);

        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, cdseconds * 1000);
        
        let hassEmbed = new MessageEmbed()
        .setColor(`#59ed09`)
        .setImage(body.message)
        .setTimestamp()
        message.reply({ embeds: [hassEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false }).catch(err => {
            let embedError = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.nsfw_error[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [embedError], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        });
    } catch (e) {
        console.log(e)
    }
  }
}