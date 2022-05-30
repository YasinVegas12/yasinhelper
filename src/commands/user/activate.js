const { MessageEmbed } = require("discord.js");
const Guild = require("../../structures/GuildSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const Badge = require("../../structures/BadgeSchema.js");
const Primecodes = require("../../structures/PrimeCodesSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "activate",
    module: "user",
    description: "Активировать прайм-подписку по коду.",
    description_en: "Activate a prime subscription by code.",
    description_ua: "Активувати прайм-підписку по коду",
    usage: "activate [code]",
    example: "/activate 5974315 - Активировать код и получить прайм подписку.",
    example_en: "/activate 5974315 - Activate the code and get a prime subscription.",
    example_ua: "/activate 5974315 - Активувати код і отримати прайм підписку.",
  async run(client,message,args,langs,prefix) {

    let dataBD = await Guild.findOne({
        guildID: message.guild.id
    });

    if(!dataBD) return;

    let data = await Prime.findOne({
        userID: message.author.id,
        status: "Активна"
    });

    let res = await Badge.findOne({
        userID: message.author.id
    });

    try {

        if (!args[0]) {
            let provideToNumber = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.activate_text[langs]} \`${prefix}activate [${lang.code[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [provideToNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (isNaN(args[0])) {
            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.activate_code[langs]} \`${prefix}activate [${lang.code[langs]}]\``)                
            .setTimestamp()
            return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let uscode = await Primecodes.findOne({
            code: args[0],
            status: "Не активирован"
        });

        if (!uscode) {
            let noCodeEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.activate_now_code[langs]} \`${args[0]}\` ${lang.activate_undefined[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [noCodeEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let duration = `${uscode.time}` * 86400000

        if(uscode.type === "server") {

            let dat = await Prime.findOne({
                guildID: message.guild.id,
                status: "Активна",
                type: "server"
            });

            let havePrimeServer = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.activate_already_server_prime[langs]}`)
            .setTimestamp()
            if(dataBD.prime === true) return message.reply({ embeds: [havePrimeServer], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let embed = new  MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.activate_server_title[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.activate_server_description_one[langs]} \`${message.guild.name}\` ${lang.on[langs]} \`${uscode.time}\` ${lang.prime_days[langs]}.\n\n${lang.activate_server_description_two[langs]} \`${prefix}prime\`\n${lang.activate_server_description_three[langs]} \`${prefix}serverinfo\``)
            .setTimestamp()

            dataBD.prime = true
            dataBD.save()

            await Primecodes.updateMany(uscode, {
                status: "Активирован",
                userTAG: message.author.tag,
                userID: message.author.id,
                guildID: message.guild.id
            });

            const timeEnd = Date.now() + duration

            const pEnd = Date.now() + duration

            if(!dat){
                await new Prime({
                    guildID: message.guild.id,
                    primeEnd: timeEnd,
                    status: "Активна",
                    type: "server",
                    pEnd
                }).save()
            }else{
                await Prime.updateMany(dat, {
                    primeEnd: timeEnd,
                    status: "Активна",
                    type: "server",
                    pEnd
                });
            }
            
            return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let havePrime = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.activate_now[langs]}`)
        .setTimestamp()
        if(data) return message.reply({ embeds: [havePrime], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let msgEmbed = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.text_ac[langs]} \`${args[0]}\` ${lang.text_acc[langs]} \`${uscode.time}\` ${lang.text_accc[langs]}\n\n${lang.text_prime_ac[langs]} \`${prefix}prime\`\n${lang.text_prime_acc[langs]} \`${prefix}profile\``)
        .setFooter({ text: `${lang.activate_footer[langs]}`, iconURL: `${client.user.avatarURL()}` })
        .setTimestamp()
        message.reply({ embeds: [msgEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        await Primecodes.updateMany(uscode, {
            status: "Активирован",
            userTAG: message.author.tag,
            userID: message.author.id
        });

        const timeEnd = Date.now() + duration

        const pEnd = Date.now() + duration

        if(!data){
        await new Prime({
            userID: message.author.id,
            primeEnd: timeEnd,
            status: "Активна",
            type: "user",
            pEnd
        }).save()
    }else{
        await Prime.updateMany(data, {
            primeEnd: timeEnd,
            status: "Активна",
            type: "user",
            pEnd
        })
    }

    if(!res) {
        await new Badge({
            userID: message.author.id,
            badges: "<:boost:971617326669631538>"
        }).save()
    }else if(!res.badges.includes("<:boost:971617326669631538>")) {
        res.badges += " / <:boost:971617326669631538>"
        res.save()
    }

    if(message.guild.id === "971617079851638784") message.member.roles.add("971617092421955664").catch(err => {});
    } catch(e) {
        console.log(e)
    }
}
}