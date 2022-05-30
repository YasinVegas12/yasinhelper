const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Promo = require("../../structures/PromocodeSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "promocode",
    aliases: ["promo"],
    module: "economy",
    description: "Активировать промокод",
    description_en: "Activate promo code",
    description_ua: "Активувати промокод",
    usage: "promocode [#name]",
    example: "/promocode #jk - активировать промокод #jk",
    example_en: "/promocode #jk - activate promo code #jk",
    example_ua: "/promocode #jk - активувати промокод",
  async run(client,message,args,langs,prefix) {

    try {

        let data = await User.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        });

        if (!data) return;

        if (!args[0]) {
            let namePromo = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.promocode_name_description[langs]} \`${prefix}promocode #jk\``)
            .setTimestamp()
            return message.reply({ embeds: [namePromo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (!args[0].startsWith("#")) {
            let namePromoTag = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.promocode_tag_description[langs]} \`${prefix}promocode #jk\``)
            .setTimestamp()
            return message.reply({ embeds: [namePromoTag], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        Promo.findOne({ guildID: message.guild.id, promocode: args[0] }, (err, promocode) => {
            if(!promocode) {
                let promoUndefined = new MessageEmbed()
                .setColor('RED')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.promocode_undefined_description[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [promoUndefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(data.promo != "не использовал") {
                let promoUse = new MessageEmbed()
                .setColor('RED')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.promocode_activated_description[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [promoUse], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (promocode.lvlpromo === 1) money = 2500;
            else if (promocode.lvlpromo === 2) money = 5000;
            else if (promocode.lvlpromo === 3) money = 7500;
            else if (promocode.lvlpromo === 4) money = 15000;

            let usePromocodeEmbed = new MessageEmbed()
            .setColor(`#34d2eb`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.promocode_successfully_description_one[langs]} \`${args[0]}\` ${lang.edit_ad_from[langs]} \`${promocode.lvlpromo}\` ${lang.mypromocode_activate_level_too[langs]} \`${money}\` 💰`)
            .setTimestamp()
            message.reply({ embeds: [usePromocodeEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            data.promo = args[0]
            data.money += parseInt(money)
            data.save()
            promocode.usepromo += 1
            promocode.save()
        });
        } catch (e) {
            console.log(e)
        }
    }
}