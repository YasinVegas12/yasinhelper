const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "try",
    module: "economy",
    description: "Испытать удачу в мини-казино",
    description_en: "Try your luck at a mini-casino",
    description_ua: "Випробувати вдачу в міні-казино",
    usage: "try [1,5/2/all-in] [coins]",
    example: "/try 2 1000 - поставить ставку на коэффициент 2",
    example_en: "/try 2 1000 - place a bet on the coefficient 2",
    example_ua: "/try 2 1000 - зробити ставку на коефіцієнт 2",
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });

        let data = await User.findOne({
            guildID: message.guild.id, 
            userID: message.author.id
        });

        if (!data) return;

        if (cooldown.has(message.author.id)) {
            let cooldownEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let howToUse = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.try_how[langs]} \`${prefix}try [1,5/2/all-in] [${lang.number[langs]}]\``)
        .setTimestamp()
        if (args[0] !== '1,5' && args[0] !== '2' && args[0] !== `all-in`) return message.reply({ embeds: [howToUse], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(args[0] == `1,5`) {

            let provideToSumma = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_coefficient[langs]}** \`${prefix}try [1,5] [${lang.number[langs]}]\``)
            .setTimestamp()
            if(!args[1]) return message.reply({ embeds: [provideToSumma], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_number_try[langs]}** \`${prefix}try [1,5] [${lang.number[langs]}]\``)
            .setTimestamp()
            if(isNaN(args[1])) return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let correctSumma = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.max_summa[langs]}** \`${prefix}try [1,5] [${lang.number[langs]}]\``)
            .setTimestamp()
            if(args[1] > 10000000 || args[1] < 1) return message.reply({ embeds: [correctSumma], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let noMoney = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.no_summa[langs]}`)
            .setTimestamp()
            if(data.money < args[1]) return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let chances = ["won","lose"];

            let total = chances[Math.floor(Math.random() * chances.length)];

            if(total === 'won') {
                let wonEmbed = new MessageEmbed()
                .setColor(`#0ffc03`)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setDescription(`**${lang.won[langs]}** \`${args[1] * 1.5}\` **${lang.kings_coin[langs]}**`)
                .setTimestamp()
                message.reply({ embeds: [wonEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                data.money += args[1] * 1.5
                data.save()

                if(!dataPRIME) {
                    if(!developer.some(dev => dev == message.author.id)) {
                        cooldown.add(message.author.id);
                    }

                    setTimeout(() =>{
                        cooldown.delete(message.author.id)
                    }, cdseconds * 1000)
                }
            } else if (total === `lose`) {
                let loseEmbed = new MessageEmbed()
                .setColor(`#fc0303`)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setDescription(`**${lang.lose_text[langs]}** \`${args[1]}\` **${lang.kings_coin[langs]}**`)
                .setTimestamp()
                message.reply({ embeds: [loseEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.money -=args[1]
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
        } else if (args[0] == `2`) {

            let provideToSumma = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_coefficient[langs]} \`${prefix}try [2] [${lang.number[langs]}]\``)
            .setTimestamp()
            if(!args[1]) return message.reply({ embeds: [provideToSumma], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\, ${lang.provide_number_try[langs]} \`${prefix}try [2] [${lang.number[langs]}]\``)
            .setTimestamp()
            if(isNaN(args[1])) return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let correctSumma = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.max_summa_two[langs]} \`${prefix}try [2] [${lang.number[langs]}]\``)
            .setTimestamp()
            if(args[1] > 5000000 || args[1] < 1) return message.reply({ embeds: [correctSumma], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let noMoney = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.no_summa[langs]}`)
            .setTimestamp()
            if(data.money < args[1]) return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let chances = ["won","lose"];

            let total = chances[Math.floor(Math.random() * chances.length)];

            if(total === 'won') {
                let wonEmbed = new MessageEmbed()
                .setColor(`#0ffc03`)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setDescription(`**${lang.won[langs]}** \`${args[1] * 2}\` **${lang.kings_coin[langs]}**`)
                .setTimestamp()
                message.reply({ embeds: [wonEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.money += args[1] * 2
                data.save()

                if(!dataPRIME) {
                    if(!developer.some(dev => dev == message.author.id)) {
                        cooldown.add(message.author.id);
                    }
        
                    setTimeout(() =>{
                        cooldown.delete(message.author.id)
                    }, cdseconds * 1000)
                }
            } else if (total=== `lose`) {
                let loseEmbed = new MessageEmbed()
                .setColor(`#fc0303`)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setDescription(`**${lang.lose_text[langs]}** \`${args[1]}\` **${lang.kings_coin[langs]}**`)
                .setTimestamp()
                message.reply({ embeds: [loseEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.money -= args[1]
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
        } else if (args[0] == `all-in`) {

            let embed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.no_prime[langs]} \`${prefix}prime\``)
            .setTimestamp()
            if(!dataPRIME) return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let noMoney = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.no_money[langs]}`)
            .setTimestamp()
            if(data.money < 1) return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let chances = ["won","lose"];

            let total = chances[Math.floor(Math.random() * chances.length)];

            if(total=== 'won') {
                let wonEmbed = new MessageEmbed()
                .setColor(`#0ffc03`)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setDescription(`**${lang.won[langs]}** \`${data.money * 3}\` **${lang.kings_coin[langs]}**`)
                .setTimestamp()
                message.reply({ embeds: [wonEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.money += data.money * 3
                data.save()

                if(!dataPRIME) {
                    if(!developer.some(dev => dev == message.author.id)) {
                        cooldown.add(message.author.id);
                    }
        
                    setTimeout(() =>{
                        cooldown.delete(message.author.id)
                    }, cdseconds * 1000)
                }
            } else if (total=== `lose`) {
                let loseEmbed = new MessageEmbed()
                .setColor(`#fc0303`)
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setDescription(`**${lang.lose_text[langs]}** \`${data.money}\` **${lang.kings_coin[langs]}**`)
                .setTimestamp()
                message.reply({ embeds: [loseEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.money -= data.money
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
        }
        } catch (e){
            console.log(e)
        }
    }
}