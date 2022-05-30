const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Historys = require("../../structures/HistorySchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "warn",
    module: "moderation",
    description: "Выдать предупреждение",
    description_en: "Issue a warn",
    description_ua: "Видати попередження",
    usage: "warn [user ID/@mention] [reason(optional)]",
    example: "/warn 608684992335446064 оффтоп - выдать предупреждение",
    example_en: "/warn 608684992335446064 offtop - issue a warn",
    example_ua: "/warn 608684992335446064 оффтоп - видати попередження",
  async run(client,message,args,langs,prefix,ownerTAG,supportrole,warns,prime,warnPunish) {

    try {

        const developer = [
            config.developer,
        ];

        let dat = await User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        });

        if (!dat) return;

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.warn_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("BAN_MEMBERS")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        let warning = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.warn_how[langs]} \`${prefix}warn [@user] [${lang.mute_reason[langs]}]\``)
        .setTimestamp()
        if(!member) return message.reply({ embeds: [warning], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let reason = args.slice(1).join(" ");
        if(!reason) reason =`${lang.reason_no_provide[langs]}`

        let warningYou = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.warn_you[langs]}`)
        .setTimestamp()
        if(member.user.id == message.author.id) return message.reply({ embeds: [warningYou], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningBot = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.warn_bot[langs]}`)
        .setTimestamp()
        if(member.user.bot) return message.reply({ embeds: [warningBot], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let myRoleIsBelow = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_bot_position[langs]}`)
        .setTimestamp() 
        if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [myRoleIsBelow], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let roleHighnEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kick_role[langs]}`)
        .setTimestamp()
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [roleHighnEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let data = await User.findOne({
            guildID: message.guild.id,
            userID: member.id
        });

        if (!data) {
            let errorMess = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.unwarn_member_user[langs]} \`${member.user.tag}\` ${lang.warn_db_not_found[langs]}`)
            return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        data.warn += 1
        data.save()
        dat.givewarn +=1
        dat.save()
        let embed = new MessageEmbed()
        .setDescription("**Warn | Yasin Helper**")
        .setColor("#483D8B")
        .addField(`${lang.warn_embed_info[langs]}`, `**${lang.info_ban_moderator[langs]}** <@${message.author.id}>\n **${lang.warn_embed_who[langs]}** <@${member.id}>\n **${lang.reason_caps[langs]}** \`${reason}\`\n **${lang.warn_embed_warns[langs]}** \`${data.warn}/${warns}\`\n **${lang.info_id_moderator[langs]}** \`${message.author.id}\`\n **${lang.info_id_user[langs]}** \`${member.id}\``)
        .setFooter({ text: `${lang.reports_footer[langs]}` })
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then(() => {
            let embedSend = new MessageEmbed()
            .setColor(`YELLOW`)
            .setTitle(`${lang.warn_title[langs]}`)
            .setDescription(`${lang.warn_server_info[langs]} **${message.guild.name}**\n${lang.warn_list[langs]} \`${data.warn}/${warns}\`\n${lang.who_warned[langs]} \`${message.author.tag}\`\n${lang.mute_reasons[langs]} **${reason}**`)
            .setTimestamp()
            member.send({ embeds: [embedSend] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
        })

        await new Historys({
            userID: member.id,
            userTAG: member.user.tag,
            guildID: message.guild.id,
            text: `${lang.administrator[langs]} ${message.author.tag} ${lang.warn_history[langs]} ${member.user.tag}[${data.warn}/${warns}]. ${lang.reason_caps[langs]} ${reason}`,
            staffID: message.author.id,
            staffTAG: message.author.tag
        }).save()
            if (data.warn >= warns) {
                if (warnPunish === "ban") {
                    if (member) {
                        let banSend = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.ban_dm[langs]}`)
                        .setDescription(`${lang.description_ban[langs]} **${message.guild.name}**\n${lang.reason_caps[langs]} \`${data.warn}/${warns} ${lang.warns_text[langs]}\`\n${lang.warns_last[langs]} \`${reason}\`\n${lang.who_banned[langs]} \`${message.author.tag}\``)
                        .setTimestamp()
                        member.send({ embeds: [banSend] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
                        member.ban({
                        reason: `${reason} [${data.warn}/${warns} ${lang.warns_text[langs]}] by ${message.author.username}` 
                    }).then(() => { 
                        message.reply(`\`${member.user.tag}\` ${lang.warn_ban[langs]} [${data.warn}/${warns} ${lang.warns_text[langs]}]. ${lang.reason_caps[langs]} \`${reason}\``).catch(err => console.log(err))
                        data.warn = 0;
                        data.save()
                    }).catch(err => {
                        if(err.message == `Missing Permissions`) {
                            let noBan = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(`${lang.title_error[langs]}`)
                            .setDescription(`\`${message.author.username}\`, ${lang.warn_no_ban[langs]}`)
                            .setTimestamp()
                            data.warn = 0
                            data.save()
                            return message.reply({ embeds: [noBan], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                        }
                    })
                }
            } else if(warnPunish === "kick") {
                if(member) {
                    let kickSend = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.kick_title[langs]}`)
                    .setDescription(`${lang.kick_desciption_server[langs]} **${message.guild.name}**\n${lang.reason_caps[langs]} \`${data.warn}/${warns} ${lang.warns_text[langs]}\`\n${lang.warns_last[langs]} \`${reason}\`\n${lang.kick_description_user[langs]} \`${message.author.tag}\``)
                    .setTimestamp()
                    member.send({ embeds: [kickSend] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
                    member.kick([`${reason} [${data.warn}/${warns} ${lang.warns_text[langs]}] by ${message.author.username}`]).then(() => {
                    message.reply(`\`${member.user.tag}\` ${lang.warn_kick[langs]} [${data.warn}/${warns} ${lang.warns_text[langs]}]. ${lang.reason_caps[langs]} \`${reason}\``).catch(err => console.log(err))
                    data.warn = 0;
                    data.save()
                }).catch(err => {
                    if(err.message == `Missing Permissions`) {
                        let noKick = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`${lang.title_error[langs]}`)
                        .setDescription(`\`${message.author.username}\`, ${lang.warn_no_kick[langs]}`)
                        .setTimestamp()
                        data.warn = 0
                        data.save()
                        return message.reply({ embeds: [noKick], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    }
                })
            }
        }
    }
        } catch (e) {
            console.log(e)
        }
    }
}