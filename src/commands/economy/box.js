const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 3600;

module.exports = {
    name: "box",
    module: "economy",
    description: "Открыть бокс",
    description_en: "Open the box",
    description_ua: "Відкрити бокс",
    usage: "box",
    example: "/box",
    example_en: "/box",
    example_ua: "/box",
    cooldown: 3600,
  async run(client,message,args,langs,prefix,ownerTAG) {

    try {

        const developer = [
            config.developer,
        ];

        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });

        if (cooldown.has(message.author.id)) {
            let cooldownEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has_box[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let data = await User.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        });

        if (!data) {
            let errorMess = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.box_nodb[langs]} \`${ownerTAG}\``)
            .setTimestamp()
            return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let noMoney = new MessageEmbed()
        .setColor(`#f20000`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.box_nomoney_description[langs]}`)
        .setTimestamp()
        if(data.money < 50) return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let rmoney = Math.floor(Math.random() * 199) + 1;

        let boxEmbed = new MessageEmbed()
        .setColor(`#03fc07`)
        .setTitle(`${lang.box_play_title[langs]}`)
        .setDescription(`${lang.box_play_description[langs]} \`${rmoney}\` ${lang.box_play_description_too[langs]}`)
        .setFooter({ text: `${lang.reports_footer[langs]}` })
        .setTimestamp()
        message.reply({ embeds: [boxEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        data.money -=(parseInt(50))
        data.money +=(parseInt(rmoney))
        data.save()

        if(!dataPRIME) {
            if(!developer.some(dev => dev == message.author.id)) {
                cooldown.add(message.author.id);
            }

            setTimeout(() =>{
                cooldown.delete(message.author.id)
            }, cdseconds * 1000)
        }
        } catch (e) {
            console.log(e)
        }
    }
}