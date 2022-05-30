const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "pay",
    module: "economy",
    description: "Передать коины другому пользователю",
    description_en: "Transfer coins to another user",
    description_ua: "Передати коіни другому користувачу",
    usage: "pay [user ID/@mention] [coins]",
    example: "/pay 608684992335446064 100 - передать пользователю 100 коинов",
    example_en: "/pay 608684992335446064 100 - transfer 100 coins to the user",
    example_ua: "/pay 608684992335446064 100 - передати користувачу 100 коінів",
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

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!member) {
            let warningUser = new MessageEmbed()
            .setColor(`#f20000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.pay_time_nomember_description[langs]} \`${prefix}pay [@user] [Coins]\``)
            .setTimestamp()
            return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (isNaN(args[1])) {
            let noNumber = new MessageEmbed()
            .setColor(`#fc0303`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.pay_nosumma_description[langs]} \`${prefix}pay [@user] [Coins]\``)
            .setTimestamp()
            return message.reply({ embeds: [noNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let userBot = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.pay_user_bot_description[langs]}`)
        .setTimestamp()
        if(member.user.bot) return message.reply({ embeds: [userBot], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let noMoneyOne = new MessageEmbed()
        .setColor(`#f20000`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.pay_nomoney_description[langs]} \`${prefix}pay [@user] [Coins]\``)
        .setTimestamp()
        if(args[1] < 2) return message.reply({ embeds: [noMoneyOne], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        User.findOne({guildID: message.guild.id, userID: message.author.id},(err,loc) => {
        User.findOne({guildID: message.guild.id, userID: member.id},(err,data) => {
            if(!data){
                let errorMess = new MessageEmbed()
                .setColor('RED')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, **${member.user.tag}** ${lang.pay_user_nodb_description[langs]}`)
                return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }else{
                
                let noYouSumma = new MessageEmbed()
                .setColor(`#f20000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.pay_user_nosumma_description[langs]}`)
                .setTimestamp()
                if(loc.money < args[1]) return message.reply({ embeds: [noYouSumma], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                if(args[1] <= 10) {
                    commission = 1
                }else if(args[1] <= 100) {
                    commission = 2
                }else if(args[1] <= 1000) {
                    commission = 50
                }else if(args[1] <= 5000) {
                    commission = 250
                }else if(args[1] <= 10000) {
                    commission = 750
                }else if(args[1] <= 50000) {
                    commission = 1500
                }else if(args[1] <= 100000) {
                    commission = 3000
                }else if(args[1] >= 1000000) {
                    commission = 30000
                }

                function plural(array, n, insertNumber = false) {
                    n = +n;
                    const word = array[n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
                    return insertNumber ? `${n} ${word}` : word;
                }

                let coin = parseInt(args[1])

                let coins = `${plural([`${lang.coin[langs]}`, `${lang.coins[langs]}`, `${lang.coinss[langs]}`], coin)}`

                let noYouPay = new MessageEmbed()
                .setColor(`#f20000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.pay_user_me_description[langs]}`)
                .setTimestamp()
                if(loc.userID == member.id) return message.reply({ embeds: [noYouPay], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let embed = new MessageEmbed()
                .setColor(`#349eeb`)
                .setTitle(`${lang.pay_user_title[langs]}`)
                .setTimestamp()

                if(!dataPRIME) { 
                    embed.description = `\`${message.author.username}\`, ${lang.pay_user[langs]} <@${member.id}> ${parseInt(args[1])} ${coins}, ${lang.pay_commission[langs]}: ${commission}, ${lang.pay_total[langs]}: ${parseInt(args[1] - commission)}`
                }else{
                    embed.description = `\`${message.author.username}\`, ${lang.pay_user[langs]} <@${member.id}> ${parseInt(args[1])} ${coins}`
                }

                loc.money -=Math.floor(parseInt(args[1]));

                if(!dataPRIME) {
                    data.money += Math.floor(parseInt(args[1] - commission));
                }else{
                    data.money += Math.floor(parseInt(args[1]));
                }

                loc.save(); data.save()
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

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
    });
        } catch (e) {
            console.log(e)
        }
    }
}