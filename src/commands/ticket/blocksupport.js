const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const Guild = require("../../structures/GuildSchema.js");
const BanSupport = require("../../structures/BanSupportSchema.js");
const Historys = require("../../structures/HistorySchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "blocksupport",
    aliases: ["bsupport", "bansupport"],
    module: "ticket",
    description: "Выдать блокировку саппорт пользователю.",
    description_en: "Issue a support block to the user.",
    description_ua: "Видати блокування саппорт користувачу",
    usage: "blocksupport [user/ID] [time] [reason]",
    example: "/blocksupport 608684992335446064 4d Оффтоп - Заблокировать доступ к каналу support пользователю на 4 дня с помощью id\n/blocksupport @Jason Kings#9417 1h Дублирование вопроса - заблокировать доступ пользователю к каналу support на 1 час с помощью упоминания",
    example_en: "/blocksupport 608684992335446064 4h Offtop - Block access to the support channel for a user for 4 days using id\n/blocksupport @Jason Kings#9417 1h Duplicate question - block user access to the support channel for 1 hour by mentioning",
    example_ua: "/blocksupport 608684992335446064 4d Оффтоп - Заблокувати доступ до каналу support користувачу на 4 дня за допомогою id",
  async run(client,message,args,langs,prefix,ownerTAG,supportrole) {

    try {

        const developer = [
            config.developer,
        ];

        let dat = await Guild.findOne({
            guildID: message.guild.id
        });
      
        if(!dat) return;
        
        let moderator_role = message.guild.roles.cache.filter(r => supportrole.includes(r.id));

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.mute_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_ROLES") && !message.member.roles.cache.some(r => moderator_role.some(role => role.id == r.id))) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let blockMember = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[0]) || message.guild.members.cache.get(args[0]);

        let noMember = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.bansupport_member_no_found[langs]}`)
        .setTimestamp()
        if (!blockMember) return message.reply({ embeds: [noMember], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningYou = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.warn_you[langs]}`)
        .setTimestamp()
        if (blockMember.user.id == message.author.id) return message.reply({ embeds: [warningYou], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let roleHighnEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kick_role[langs]}`)
        .setTimestamp()
        if (blockMember.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [roleHighnEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let ban = await BanSupport.findOne({
            userID: blockMember.id,
            guildID: message.guild.id,
            current: true
        });
      
        let banAlready = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.bansupport_already[langs]}`)
        .setTimestamp()
        if (ban) return message.reply({ embeds: [banAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
        if(!args[1]) {
            let provideTime = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.bansupport_args_one[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [provideTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
        
        let seconds = parseInt(args[1]);
        let minute = parseInt(args[1]);
        let hour = parseInt(args[1]);
        let days = parseInt(args[1]);
        
        function plural(array, n, insertNumber = false) {
            n = +n;
            const word = array[n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
            return insertNumber ? `${n} ${word}` : word;
        }

        if (args[1].includes(`${seconds}s`)) {

            let embedErrorTime = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_big[langs]}`)
            .setTimestamp()
            if(seconds < 1 || seconds > 2592000) return message.reply({ embeds: [embedErrorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            blocktime = `${args[1].split(`s`).join(` ${plural([`${lang.bansupport_seconds[langs]}`, `${lang.seconds[langs]}`, `${lang.sec[langs]}`], seconds)}`)}`
        }else if (args[1].includes(`${minute}m`)) {
    
            let embedErrorTime = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_big[langs]}`)
            .setTimestamp()
            if(minute < 1 || minute > 43200) return message.reply({ embeds: [embedErrorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
             blocktime = `${args[1].split(`m`).join(` ${plural([`${lang.bansupport_minute[langs]}`, `${lang.minutes[langs]}`, `${lang.min[langs]}`], minute)}`)}`
        }else if (args[1].includes(`${hour}h`)) {
    
            let embedErrorTime = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_big[langs]}`)
            .setTimestamp()
    
            if(hour < 1 || hour > 720) return message.reply({ embeds: [embedErrorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
             blocktime = `${args[1].split(`h`).join(` ${plural([`${lang.hour[langs]}`, `${lang.hours[langs]}`, `${lang.hrs[langs]}`], hour)}`)}`
        } else if (args[1].includes(`${days}d`)) {
    
            let embedErrorTime = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_big[langs]}`)
            .setTimestamp()
            if(days < 1 || days > 30) return message.reply({ embeds: [embedErrorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
             blocktime = `${args[1].split(`d`).join(` ${plural([`${lang.day[langs]}`, `${lang.days[langs]}`, `${lang.dys[langs]}`], days)}`)}`
        } else {
             let formatDeny = new MessageEmbed()
             .setColor(`RED`)
             .setTitle(`${lang.title_error[langs]}`)
             .setDescription(`\`${message.author.username}\`, ${lang.bansupport_example[langs]} **${dat.prefix}blocksupport <@${mutee.id}> 1m test**`)
             .setTimestamp()
             return message.reply({ embeds: [formatDeny], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let reason = args.slice(2).join(" ");
        if(!reason) reason = `${lang.reason_no_provide[langs]}`

        let duration = ms(args[1])

        const expires = Date.now() + duration

        await new BanSupport({
            userID: blockMember.id,
            guildID: message.guild.id,
            reason: reason,
            staffID: message.author.id,
            expires,
            current: true
        }).save()

        await new Historys({
            userID: blockMember.id,
            userTAG: blockMember.user.tag,
            guildID: message.guild.id,
            text: `${lang.moderator[langs]} ${message.author.tag} ${lang.removeblocksupport_history[langs]} ${blockMember.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
            staffID: message.author.id,
            staffTAG: message.author.tag
        }).save()
    
        let banSupport = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.bansupport_message[langs]} ${blockMember} ${lang.on[langs]} \`${blocktime}\`. ${lang.reason_caps[langs]} \`${reason}\``)
        .setTimestamp()
        message.reply({ embeds: [banSupport], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then(async() => {
            let blockEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.bansupport_title[langs]}`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`${lang.bansupport_description_one[langs]} \`${message.guild.name}\`\n${lang.bansupport_description_two[langs]} \`${blocktime}\`\n${lang.reason_caps[langs]} \`${reason}\``)
            .setTimestamp()
            await blockMember.send({ embeds: [blockEmbed] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}});
        });
    } catch (e) {
        console.log(e)
    }
  }
}