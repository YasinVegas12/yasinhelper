const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Promo = require("../../structures/PromocodeSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "createpromocode",
    aliases: ["cp", "createpromo"],
    module: "economy",
    description: "Создать свой промокод",
    description_en: "Create your promo code",
    description_ua: "Створити свій промокод",
    usage: "createpromocode [#name]",
    example: "/createpromocode #jk - создать промокод #jk",
    example_en: "/createpromocode #jk - create promocode #jk",
    example_ua: "/createpromocode #jk - створити промокод #jk",
  async run(client,message,args,langs,prefix) {

    try {

        let dat = await Promo.findOne({
            guildID: message.guild.id,
            ownerpromoID: message.author.id
        });

        let data = await User.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        });

        if (!data) return;

        if(dat) {
            let promoCreate = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.create_promocode_created_description[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [promoCreate], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let noMoney = new MessageEmbed()
        .setColor(`#f20000`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.create_promocode_nomoney_description[langs]}`)
        .setTimestamp()
        if(data.money < 5000) return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(!args[0]) {
            let giveNamePromo = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.create_promocode_args_zero_description[langs]} \`${prefix}createpromocode #jk\``)
            .setTimestamp()
            return message.reply({ embeds: [giveNamePromo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (!args[0].startsWith("#")) {
            let giveNamePromoTag = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.create_promocode_args_tag_description[langs]} \`${prefix}createpromocode #jk\``)
            .setTimestamp()
            return message.reply({ embeds: [giveNamePromoTag], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[0].length >= 30) {
            let errorLength = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.createpromocode_length[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let promocode = await Promo.findOne({ 
            guildID: message.guild.id, 
            promocode: args[0] 
        });

        if(promocode) {
            let promoFind = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.create_promocode_exists_description[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [promoFind], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let newPromoCreate = new MessageEmbed()
        .setColor(`#34d2eb`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.create_promocode_successfully_description[langs]} \`${args[0]}\``)
        .setTimestamp()
        message.reply({ embeds: [newPromoCreate], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        await new Promo({
            guildID: message.guild.id,
            ownerpromoID: message.author.id,
            promocode: args[0],
            lvlpromo: 1
        }).save()
        data.money -=5000
        data.save()
        } catch (e) {
            console.log(e)
        }
    }
}