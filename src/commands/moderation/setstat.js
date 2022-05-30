const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "setstat",
    module: "moderation",
    description: "Изменить статистику модератора",
    description_en: "Change moderator statistics",
    description_ua: "Змінити статистику модератора",
    usage: "setstat [user ID/@mention] [params] [number]",
    example: "/setstat 608684992335446064 5 100 - изменить количество оценок `5` на 100",
    example_en: "/setstat 608684992335446064 5 100 - change the number of `5` ratings to 100",
    example_ua: "/setstat 608684992335446064 5 100 - змінити кількість оцінок `5` на 100",
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

        if (!member) {
            let warningUser = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_use[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()    
            return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let howToUse = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if (args[1] !== 't' && args[1] !== '1' && args[1] !== `2` && args[1] !== `3` && args[1] !== `4` && args[1] !== `5` && args[1] !== `k` && args[1] !== `b` && args[1] !== `m` && args[1] !== `w` && args[1] !== `f`) return message.reply({ embeds: [howToUse], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let data = await User.findOne({
            userID: member.id,
            guildID: message.guild.id
        });

        if (!data) {
            let errorMess = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`${lang.setstat_member_db[langs]} **${member.user.tag}** ${lang.setstat_memb_db[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (args[1] == 't') {

            if (isNaN(args[2])) {
                let provideToChislo = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
                .setTimestamp()
                return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(args[2] === "Infinity") {
                let errorInf = new MessageEmbed()
                .setColor(`#FF0000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let provideToNumber = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_ticket[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            if(!args[2]) return message.reply({ embeds: [provideToNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let provideToNull = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNull], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const embed = new MessageEmbed()
            .setColor(`#4287f5`)
            .setTitle(`${lang.setstat_t_info[langs]}`)
            .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_t_text[langs]}** <@${member.id}>`)
            .addField(`**${lang.setstat_t_was[langs]}** \`${data.holdticket}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.holdticket = args[2]
            data.save()
    } else if (args[1] == '1') {

        if (isNaN(args[2])) {
            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[2] === "Infinity") {
            let errorInf = new MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let provideToNumberH = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_h[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(!args[2]) return message.reply({ embeds: [provideToNumberH], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideToNullH = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNullH], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const hembed = new MessageEmbed()
        .setColor(`#4287f5`)
        .setTitle(`${lang.setstat_h_s[langs]}`)
        .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_h_text[langs]}** <@${member.id}>`)
        .addField(`**${lang.setstat_t_was[langs]}** \`${data.one_rep}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
        message.reply({ embeds: [hembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        data.one_rep = args[2]
        data.save()

    } else if (args[1] == `2`) {

        if (isNaN(args[2])) {
            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[2] === "Infinity") {
            let errorInf = new MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let provideToNumberP = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_p[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(!args[2]) return message.reply({ embeds: [provideToNumberP], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideToNullP = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNullP], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const pembed = new MessageEmbed()
        .setColor(`#4287f5`)
        .setTitle(`${lang.setstat_p_title[langs]}`)
        .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_p_text[langs]}** <@${member.id}>`)
        .addField(`**${lang.setstat_t_was[langs]}** \`${data.two_rep}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
        message.reply({ embeds: [pembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        data.two_rep = args[2]
        data.save()
     } else if (args[1] == `3`) {

            if (isNaN(args[2])) {
                let provideToChislo = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
                .setTimestamp()
                return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(args[2] === "Infinity") {
                let errorInf = new MessageEmbed()
                .setColor(`#FF0000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let provideToNumberP = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_three[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            if(!args[2]) return message.reply({ embeds: [provideToNumberP], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            let provideToNullP = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNullP], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            const pembed = new MessageEmbed()
            .setColor(`#4287f5`)
            .setTitle(`${lang.setstat_three_title[langs]}`)
            .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_three_text[langs]}** <@${member.id}>`)
            .addField(`**${lang.setstat_t_was[langs]}** \`${data.three_rep}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
            message.reply({ embeds: [pembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.three_rep = args[2]
            data.save()
        } else if (args[1] == `4`) {

            if (isNaN(args[2])) {
                let provideToChislo = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
                .setTimestamp()
                return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(args[2] === "Infinity") {
                let errorInf = new MessageEmbed()
                .setColor(`#FF0000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let provideToNumberP = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_four[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            if(!args[2]) return message.reply({ embeds: [provideToNumberP], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            let provideToNullP = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNullP], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            const pembed = new MessageEmbed()
            .setColor(`#4287f5`)
            .setTitle(`${lang.setstat_four_title[langs]}`)
            .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_four_text[langs]}** <@${member.id}>`)
            .addField(`**${lang.setstat_t_was[langs]}** \`${data.four_rep}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
            message.reply({ embeds: [pembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.four_rep = args[2]
            data.save()
        } else if (args[1] == `5`) {

            if (isNaN(args[2])) {
                let provideToChislo = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
                .setTimestamp()
                return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(args[2] === "Infinity") {
                let errorInf = new MessageEmbed()
                .setColor(`#FF0000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let provideToNumberP = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_five[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            if(!args[2]) return message.reply({ embeds: [provideToNumberP], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            let provideToNullP = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNullP], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            const pembed = new MessageEmbed()
            .setColor(`#4287f5`)
            .setTitle(`${lang.setstat_five_title[langs]}`)
            .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_five_text[langs]}** <@${member.id}>`)
            .addField(`**${lang.setstat_t_was[langs]}** \`${data.five_rep}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
            message.reply({ embeds: [pembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.five_rep = args[2]
            data.save()
    } else if (args[1] == `k`) {

        if (isNaN(args[2])) {
            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[2] === "Infinity") {
            let errorInf = new MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let provideToNumberK = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_k[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(!args[2]) return message.reply({ embeds: [provideToNumberK], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideToNullK = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNullK], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const kembed = new MessageEmbed()
        .setColor(`#4287f5`)
        .setTitle(`${lang.setstat_k_info[langs]}`)
        .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_k_text[langs]}** <@${member.id}>`)
        .addField(`**${lang.setstat_t_was[langs]}** \`${data.givekick}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
        message.reply({ embeds: [kembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        data.givekick = args[2]
        data.save()
    } else if (args[1] == `b`) {

        if (isNaN(args[2])) {
            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[2] === "Infinity") {
            let errorInf = new MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let provideToNumberB = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_b[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(!args[2]) return message.reply({ embeds: [provideToNumberB], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideToNullB = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNullB], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const bembed = new MessageEmbed()
        .setColor(`#4287f5`)
        .setTitle(`${lang.setstat_b_info[langs]}`)
        .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_b_text[langs]}** <@${member.id}>`)
        .addField(`**${lang.setstat_t_was[langs]}** \`${data.giveban}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
        message.reply({ embeds: [bembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        data.giveban = args[2]
        data.save()
    } else if (args[1] == `m`) {

        if (isNaN(args[2])) {
            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[2] === "Infinity") {
            let errorInf = new MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let provideToNumberM = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_m[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(!args[2]) return message.reply({ embeds: [provideToNumberM], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideToNullM = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(args[2] > 9999999 || args[2] < 0) return message.reply({ embeds: [provideToNullM], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const mmembed = new MessageEmbed()
        .setColor(`#4287f5`)
        .setTitle(`${lang.setstat_m_info[langs]}`)
        .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_m_text[langs]}** <@${member.id}>`)
        .addField(`**${lang.setstat_t_was[langs]}** \`${data.givemute}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
        message.reply({ embeds: [mmembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        data.givemute = args[2]
        data.save()
    } else if (args[1] == `w`) {

        if (isNaN(args[2])) {
            let provideToChislo = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.setstat_provide_number[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [provideToChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[2] === "Infinity") {
            let errorInf = new MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let provideToNumberW = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_w[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(!args[2]) return message.reply({ embeds: [provideToNumberW], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideToNullW = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_tickets[langs]} \`${prefix}setstat [@user] [t/1/2/3/4/5/k/b/m/w/f] [${lang.setstat_f[langs]}]\``)
        .setTimestamp()
        if(args[2]>9999999 || args[2]<0) return message.reply({ embeds: [provideToNullW], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const wwembed = new MessageEmbed()
        .setColor(`#4287f5`)
        .setTitle(`${lang.setstat_w_info[langs]}`)
        .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_w_text[langs]}** <@${member.id}>`)
        .addField(`**${lang.setstat_t_was[langs]}** \`${data.givewarn}\``, `**${lang.setstat_t_became[langs]}** \`${args[2]}\``)
        message.reply({ embeds: [wwembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        data.givewarn = args[2]
        data.save()
    } else if (args[1] == `f`) {

        let setstatFSend = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`⚠️${lang.fullobnul_title[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setstat_f_text_send[langs]}`)
        .setTimestamp()

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
                    .setCustomId('acceptButton')
                    .setStyle('SUCCESS')
                    .setEmoji('✅'),
                new MessageButton()
                    .setCustomId('denyButton')
                    .setStyle('DANGER')
                    .setEmoji('❌')
            )

        const msg = await message.reply({ embeds: [setstatFSend], ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const filterAcceptButton = i => i.customId === 'acceptButton' && i.user.id === `${message.author.id}`;
        const filterExitButton = i => i.customId === 'denyButton' && i.user.id === `${message.author.id}`;

        const collectorAccept = message.channel.createMessageComponentCollector({ filterAcceptButton, time: 60000  });
        const collectorExit = message.channel.createMessageComponentCollector({ filterExitButton, time: 60000  });

            collectorAccept.on('collect', async i => {
                if (i.customId === 'acceptButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    const ffEmbed = new MessageEmbed()
                    .setColor(`#4287f5`)
                    .setTitle(`${lang.setstat_f_info[langs]}`)
                    .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.setstat_f_text[langs]}** <@${member.id}>`)
                    .addField(`**${lang.setstat_f_text_info[langs]}**`, `**${lang.setstat_was_ticket[langs]}** \`${data.holdticket}\`\n**${lang.setstat_one_balls[langs]}** \`${data.one_rep}\`\n**${lang.setstat_two_balls[langs]}** \`${data.two_rep}\`\n**${lang.setstat_three_balls[langs]}** \`${data.three_rep}\`\n**${lang.setstat_four_balls[langs]}** \`${data.four_rep}\`\n**${lang.setstat_five_balls[langs]}** \`${data.five_rep}\`\n**${lang.setstat_was_kick[langs]}** \`${data.givekick}\`\n**${lang.setstat_was_ban[langs]}** \`${data.giveban}\`\n**${lang.setstat_was_mute[langs]}** \`${data.givemute}\`\n**${lang.setstat_was_warn[langs]}** \`${data.givewarn}\``)
                    data.holdticket = 0
                    data.one_rep = 0
                    data.two_rep = 0
                    data.three_rep = 0
                    data.four_rep = 0
                    data.five_rep = 0
                    data.givekick = 0
                    data.giveban = 0
                    data.givemute = 0
                    data.givewarn = 0
                    data.save()
                    await i.update({ embeds: [ffEmbed], components: [] }).catch(() => { })
                }
            });

            collectorExit.on('collect', async i => {
                if (i.customId === 'denyButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    let denyObnul = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`⚠️${lang.fullobnul_title[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.setstat_f_deny[langs]}`)
                    .setTimestamp()
                    await i.update({ embeds: [denyObnul], components: [] }).catch(() => { })
                }
            });
        }
        } catch (e) {
            console.log(e)
        }
    }
}