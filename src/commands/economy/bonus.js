const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const ms = require("ms");
const lang = require("../../language.json");
const { timely, how } = require("../../config.json");

module.exports = {
    name: "bonus",
    module: "economy",
    description: "Получить ежедневный бонус",
    description_en: "Get a daily bonus",
    description_ua: "Отримати щоденний бонус",
    usage: "bonus",
    example: "/bonus",
    example_en: "/bonus",
    example_ua: "/bonus",
    cooldown: 86400000,
  async run(client,message,args,langs) {

    try {

        await User.findOne({guildID: message.guild.id, userID: message.author.id},(err,data) => {
            if(data._time !== null && timely - (Date.now() - data._time) > 0 ) {
                let bonusGived = new MessageEmbed()
                .setColor(`#f00000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.bonus_description[langs]} \`${ms(timely - (Date.now() - data._time))}\``)
                .setTimestamp()
                message.reply({ embeds: [bonusGived], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }else{
            data._time = Date.now()
            data.money += parseInt(how)
            data.save()

            let bonusEmbed = new MessageEmbed()
            .setColor(`#0394fc`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`${lang.bonus_gived_description[langs]} \`${how}\` ${lang.bonus_gived_description_too[langs]}`)
            message.reply({ embeds: [bonusEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
        });
        } catch (e) {
            console.log(e)
        }
    }
}