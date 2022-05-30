const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const User = require("../../structures/UserSchema.js");
const Historys = require("../../structures/HistorySchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "mute",
    module: "moderation",
    description: "Выдать мут пользователю",
    description_en: "Issue the mut to the user",
    description_ua: "Видати заглушку користувачу",
    usage: "mute [user ID/@mention] [time] [reason(optional)]",
    example: "/mute 608684992335446064 30m капс - выдать мут на 30 минут",
    example_en: "/mute 608684992335446064 30m caps - issue the mute for 30 minutes",
    example_ua: "/mute 608684992335446064 30m капс - видати заглушку на 30 хвилин",
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let noPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.mute_bot_permissions[langs]} \`MANAGE_ROLES\``)
        .setTimestamp() 
        if (!message.guild.me.permissions.has(["MANAGE_ROLES"])) return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.mute_permissions[langs]}`)
        .setTimestamp()
        if(!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let mutee = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        let warningUser = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.mute_member[langs]} \`${prefix}mute [@user] [${lang.mute_time[langs]}] [${lang.mute_reason[langs]}]\``)
        .setTimestamp() 
        if (!mutee) return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningYou = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.warn_you[langs]}`)
        .setTimestamp()
        if (mutee.user.id == message.author.id) return message.reply({ embeds: [warningYou], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let roleHighnEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kick_role[langs]}`)
        .setTimestamp()
        if (mutee.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [roleHighnEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let myRoleIsBelow = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_bot_position[langs]}`)
        .setTimestamp() 
        if(mutee.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [myRoleIsBelow], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let userMutedEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.member_mute[langs]}`)
        .setTimestamp()
        if (mutee.isCommunicationDisabled() === true) return message.reply({ embeds: [userMutedEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(!args[1]) {
            let provideTime = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.mute_args_one[langs]}`)
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

        let time = parseInt(args[1])

        let reason = args.slice(2).join(" ");
        if(!reason) reason =`${lang.reason_no_provide[langs]}`

        if(args[1].includes(`${seconds}s`)) {

        if(parseInt(args[1]) < 1 || parseInt(args[1]) > 2419200000) {
            let embedErrorTime = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_big[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [embedErrorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[1] === "Infinity") {
            let errorInf = new MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let duration = ms(args[1])

        await new Historys({
            userID: mutee.id,
            userTAG: mutee.user.tag,
            guildID: message.guild.id,
            text: `${lang.moderator[langs]} ${message.author.tag} ${lang.mute_history[langs]} ${mutee.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
            staffID: message.author.id,
            staffTAG: message.author.tag
        }).save()

        mutee.timeout(duration, reason).catch(err => {
        }).then(() => {
            let embedSend = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.mute_send_title[langs]}`)
            .setDescription(`${lang.mute_server_info[langs]} **${message.guild.name}**\n${lang.mute_time_send[langs]} \`${time} ${plural([`${lang.second[langs]}`, `${lang.seconds[langs]}`, `${lang.sec[langs]}`], seconds)}\`\n${lang.mute_who[langs]} \`${message.author.tag}\`\n${lang.mute_reasons[langs]} **${reason}**`)
            .setTimestamp()
            mutee.send({ embeds: [embedSend] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
        });

        const embed = new MessageEmbed()
        .setColor("#483D8B")
        .setTitle(`Mute | Yasin Helper`)
        .addField(`${lang.mute_embed_info[langs]}`, `**${lang.info_ban_moderator[langs]}** <@${message.author.id}>\n**${lang.mute_embed_muted[langs]}** <@${mutee.id}>\n**${lang.mute_embed_time[langs]}** \`${time} ${plural([`${lang.second[langs]}`, `${lang.seconds[langs]}`, `${lang.sec[langs]}`], seconds)}\`\n**${lang.mute_reasons[langs]}** \`${reason}\`\n**${lang.info_id_moderator[langs]}** \`${message.author.id}\`\n**${lang.info_id_user[langs]}** \`${mutee.id}\``)
        .setFooter({ text: `${lang.reports_footer[langs]}` });
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

    }else if(args[1].includes(`${minute}m`)) {

      if(parseInt(args[1]) < 1 || parseInt(args[1]) > 40320) {
          let embedErrorTime = new MessageEmbed()
          .setColor(`RED`)
          .setTitle(`${lang.title_error[langs]}`)
          .setDescription(`\`${message.author.username}\`, ${lang.provide_big[langs]}`)
          .setTimestamp()
          return message.reply({ embeds: [embedErrorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
      }

      if(args[1] === "Infinity") {
          let errorInf = new MessageEmbed()
          .setColor(`#FF0000`)
          .setTitle(`${lang.title_error[langs]}`)
          .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
          .setTimestamp()
          return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
      }

      let duration = ms(args[1])

      await new Historys({
          userID: mutee.id,
          userTAG: mutee.user.tag,
          guildID: message.guild.id,
          text: `${lang.moderator[langs]} ${message.author.tag} ${lang.mute_history[langs]} ${mutee.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
          staffID: message.author.id,
          staffTAG: message.author.tag
      }).save()

      mutee.timeout(duration, reason).catch(err => {
      }).then(() => {
            let embedSend = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.mute_send_title[langs]}`)
            .setDescription(`${lang.mute_server_info[langs]} **${message.guild.name}**\n${lang.mute_time_send[langs]} \`${time} ${plural([`${lang.minute[langs]}`, `${lang.minutes[langs]}`, `${lang.min[langs]}`], minute)}\`\n${lang.mute_who[langs]} \`${message.author.tag}\`\n${lang.mute_reasons[langs]} **${reason}**`)
            .setTimestamp()
            mutee.send({ embeds: [embedSend] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
        });

      const embed = new MessageEmbed()
      .setTitle(`Mute | Yasin Helper`)
      .setColor("#483D8B")
      .addField(`${lang.mute_embed_info[langs]}`, `**${lang.info_ban_moderator[langs]}** <@${message.author.id}>\n**${lang.mute_embed_muted[langs]}** <@${mutee.id}>\n**${lang.mute_embed_time[langs]}** \`${time} ${plural([`${lang.minute[langs]}`, `${lang.minutes[langs]}`, `${lang.min[langs]}`], minute)}\`\n**${lang.mute_reasons[langs]}** \`${reason}\`\n**${lang.info_id_moderator[langs]}** \`${message.author.id}\`\n**${lang.info_id_user[langs]}** \`${mutee.id}\``)
      .setFooter({ text: `${lang.reports_footer[langs]}` });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

    }else if(args[1].includes(`${hour}h`)) {

      if(parseInt(args[1]) < 1 || parseInt(args[1]) > 672) {
          let embedErrorTime = new MessageEmbed()
          .setColor(`RED`)
          .setTitle(`${lang.title_error[langs]}`)
          .setDescription(`\`${message.author.username}\`, ${lang.provide_big[langs]}`)
          .setTimestamp()
          return message.reply({ embeds: [embedErrorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
      }

      if(args[1] === "Infinity") {
          let errorInf = new MessageEmbed()
          .setColor(`#FF0000`)
          .setTitle(`Ошибка`)
          .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
          .setTimestamp()
          return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
      }

      let duration = ms(args[1])

      await new Historys({
          userID: mutee.id,
          userTAG: mutee.user.tag,
          guildID: message.guild.id,
          text: `${lang.moderator[langs]} ${message.author.tag} ${lang.mute_history[langs]} ${mutee.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
          staffID: message.author.id,
          staffTAG: message.author.tag
      }).save()

      mutee.timeout(duration, reason).catch(err => {
      }).then(() => {
        let embedSend = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.mute_send_title[langs]}`)
        .setDescription(`${lang.mute_server_info[langs]} **${message.guild.name}**\n${lang.mute_time_send[langs]} \`${time} ${plural([`${lang.hour[langs]}`, `${lang.hours[langs]}`, `${lang.hrs[langs]}`], hour)}\`\n${lang.mute_who[langs]} \`${message.author.tag}\`\n${lang.mute_reasons[langs]} **${reason}**`)
        .setTimestamp()
        mutee.send({ embeds: [embedSend] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
      })

      const embed = new MessageEmbed()
      .setTitle(`Mute | Yasin Helper`)
      .setColor("#483D8B")
      .addField(`${lang.mute_embed_info[langs]}`, `**${lang.info_ban_moderator[langs]}** <@${message.author.id}>\n**${lang.mute_embed_muted[langs]}** <@${mutee.id}>\n**${lang.mute_embed_time[langs]}** \`${time} ${plural([`${lang.hour[langs]}`, `${lang.hours[langs]}`, `${lang.hrs[langs]}`], hour)}\`\n**${lang.mute_reasons[langs]}** \`${reason}\`\n**${lang.info_id_moderator[langs]}** \`${message.author.id}\`\n**${lang.info_id_user[langs]}** \`${mutee.id}\``)
      .setFooter({ text: `${lang.reports_footer[langs]}` });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

    }else if(args[1].includes(`${days}d`)) {

      if(parseInt(args[1]) < 1 || parseInt(args[1]) > 28) {
        let embedErrorTime = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.provide_big[langs]}`)
        .setTimestamp()
        return message.reply({ embeds: [embedErrorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
      }

      if(args[1] === "Infinity") {
          let errorInf = new MessageEmbed()
          .setColor(`#FF0000`)
          .setTitle(`Ошибка`)
          .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
          .setTimestamp()
          return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    }

      let duration = ms(args[1])

      await new Historys({
          userID: mutee.id,
          userTAG: mutee.user.tag,
          guildID: message.guild.id,
          text: `${lang.moderator[langs]} ${message.author.tag} ${lang.mute_history[langs]} ${mutee.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
          staffID: message.author.id,
          staffTAG: message.author.tag
      }).save()

      mutee.timeout(duration, reason).catch(err => {
      }).then(() => {
          let embedSend = new MessageEmbed()
          .setColor(`RED`)
          .setTitle(`${lang.mute_send_title[langs]}`)
          .setDescription(`${lang.mute_server_info[langs]} **${message.guild.name}**\n${lang.mute_time_send[langs]} \`${time} ${plural([`${lang.day[langs]}`, `${lang.days[langs]}`, `${lang.dys[langs]}`], days)}\`\n${lang.mute_who[langs]} \`${message.author.tag}\`\n${lang.mute_reasons[langs]} **${reason}**`)
          .setTimestamp()
          mutee.send({ embeds: [embedSend] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
      })

      const embed = new MessageEmbed()
      .setTitle(`Mute | Yasin Helper`)
      .setColor("#483D8B")
      .addField(`${lang.mute_embed_info[langs]}`, `**${lang.info_ban_moderator[langs]}** <@${message.author.id}>\n **${lang.mute_embed_muted[langs]}** <@${mutee.id}>\n **${lang.mute_embed_time[langs]}** \`${time} ${plural([`${lang.day[langs]}`, `${lang.days[langs]}`, `${lang.dys[langs]}`], days)}\`\n **${lang.mute_reasons[langs]}** \`${reason}\`\n **${lang.info_id_moderator[langs]}** \`${message.author.id}\`\n **${lang.info_id_user[langs]}** \`${mutee.id}\``)
      .setFooter({ text: `${lang.reports_footer[langs]}` });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    }else{
        let formatDeny = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.mute_example[langs]} **${prefix}mute <@${mutee.id}> 1m test**`)
        .setTimestamp()
        return message.reply({ embeds: [formatDeny], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    }

      let data = await User.findOne({
          guildID: message.guild.id,
          userID: message.author.id
      });

      data.givemute +=1
      data.save()
        } catch (e) {
            console.log(e)
        }
    }
}
