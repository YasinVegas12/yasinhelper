const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "setmoney",
    module: "economy",
    description: "Выдать коины",
    description_en: "Issue coins",
    description_ua: "Видати коіни",
    usage: "setmoney [user ID/@mention] [+/-] [coins]",
    example: "/setmoney 608684992335446064 + 1000 - выдать пользователю 1000 коинов",
    example_en: "/setmoney 608684992335446064 + 1000 - issue user 1000 coins",
    example_ua: "/setmoney 608684992335446064 + 1000 - видати користувачу 1000 коінів",
    cooldown: 15,
  async run(client,message,args,langs,prefix) {

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
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) {
            let warningPermission = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setmoney_permission[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0])

        if(!member) {
            let warningUser = new MessageEmbed()
            .setColor(`#f20000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.warning_user_description[langs]} \`${prefix}setmoney [@user/id/tag] [+/-] [coins]\``)
            .setTimestamp()
            return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let howToUse = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setmoney_how_description[langs]} \`${prefix}setmoney [@user/id/tag] [+/-] [coins]\``)
        .setTimestamp()
        if (args[1] !== '+' && args[1] !== '-') return message.reply({ embeds: [howToUse], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        User.findOne({guildID: message.guild.id, userID: member.user.id},(err,data) => {
            if(!data){
                let errorMess = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, **${member.user.tag}** ${lang.setmoney_nodb_description[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (args[1] == '+') {
                if (isNaN(args[2])) {
                    let noNumber = new MessageEmbed()
                    .setColor(`#fc0303`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.setmoney_isnan_description[langs]} \`${prefix}setmoney [@user/id/tag] [+/-] [coins]\``)
                    .setTimestamp()
                    return message.reply({ embeds: [noNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(args[2].includes(`+`,`-`)) {
                    let wrongSymbol = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.wrong_symbol[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [wrongSymbol], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(args[2] === "Infinity") {
                    let errorInf = new MessageEmbed()
                    .setColor(`#FF0000`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(args[2]> 99999999 || args[2] < 1) {
                    let smallOrBig = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.smallorbig[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [smallOrBig], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(data.money >= 9999999999) {
                    let errorMsgMoney = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.balance_big[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorMsgMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let userBot = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.setmoney_user_bot_description[langs]}`)
                .setTimestamp()
                if(member.user.bot) return message.reply({ embeds: [userBot], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let giveMoney = new MessageEmbed()
                .setColor(`#349eeb`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`${lang.setmoney_money_given_description[langs]} <@${message.author.id}> ${lang.setmoney_money_given_description_too[langs]} <@${member.id}> \`${args[2]}\` **coins.**`)
                message.reply({ embeds: [giveMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                data.money += Math.floor(parseInt(args[2]));
                data.save()

                if(!dataPRIME) {
                    if(!developer.some(dev => dev == message.author.id)) {
                        cooldown.add(message.author.id);
                    }
        
                    setTimeout(() =>{
                        cooldown.delete(message.author.id)
                    }, cdseconds * 1000)
                }
            } else if (args[1] == '-') {
                if (isNaN(args[2])) {
                    let noNumber = new MessageEmbed()
                    .setColor(`#fc0303`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.setmoney_isnans_description[langs]} \`${prefix}setmoney [@user/id/tag] [+/-] [Yasin Coins]\``)
                    .setTimestamp()
                    return message.reply({ embeds: [noNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(args[2].includes(`+`,`-`)) {
                    let wrongSymbol = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.wrong_symbol[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [wrongSymbol], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(args[2] === "Infinity") {
                    let errorInf = new MessageEmbed()
                    .setColor(`#FF0000`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(args[2] < 1) {
                    let smallOrBig = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.smallorbig[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [smallOrBig], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let noMoney = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.setmoney_summa[langs]}`)
                .setTimestamp()
                if(data.money < args[2]) return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let userBot = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.setmoney_notake_bot_description[langs]}`)
                .setTimestamp()
                if(member.user.bot) return message.reply({ embeds: [userBot], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let giveMoney = new MessageEmbed()
                .setColor(`#349eeb`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`${lang.setmoney_take_description[langs]} <@${message.author.id}> ${lang.setmoney_take_description_too[langs]} <@${member.id}> \`${args[2]}\` **Yasin Coins.**`)
                message.reply({ embeds: [giveMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                data.money -= Math.floor(parseInt(args[2]));
                data.save()

                if(!dataPRIME) {
                    if(!developer.some(dev => dev == message.author.id)) {
                        cooldown.add(message.author.id);
                    }
        
                    setTimeout(() =>{
                        cooldown.delete(message.author.id)
                    }, cdseconds * 1000)
                }
            }
        });
        } catch (e) {
            console.log(e)
        }
    }
}