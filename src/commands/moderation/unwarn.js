const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Historys = require("../../structures/HistorySchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "unwarn",
    module: "moderation",
    description: "Снять предупреждение",
    description_en: "Remove the warn",
    description_ua: "Зняти попередження",
    usage: "unwarn [user ID]",
    example: "/unwarn 608684992335446064 - снять предупреждение",
    example_en: "/unwarn 608684992335446064 - remove the warn",
    example_ua: "/unwarn 608684992335446064 - зняти попередження",
  async run(client,message,args,langs,prefix,ownerTAG,supportrole,warns) {

    try {

        const developer = [
            config.developer,
        ];

        let warningPermission = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.unwarn_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("BAN_MEMBERS")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        let warning = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.unwarn_how[langs]} \`${prefix}unwarn [@user]!\``)
        .setTimestamp()
        if (!member) return message.reply({ embeds: [warning], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningBot = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.unwarn_bot[langs]}`)
        .setTimestamp()
        if (member.user.bot) return message.reply({ embeds: [warningBot], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let myRoleIsBelow = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_bot_position[langs]}`)
        .setTimestamp() 
        if(member.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [myRoleIsBelow], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let roleHighnEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.kick_role[langs]}`)
        .setTimestamp()
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [roleHighnEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let data = await User.findOne({
            userID: member.id,
            guildID: message.guild.id
        });

        if(!data){
            let errorMess = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.unwarn_member_user[langs]} **${member.user.tag}** ${lang.unwarn_db_text[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(data.warn <= 0){
            let noWarn = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}>`)
            .setDescription(`\`${message.author.username}\`, ${lang.unwarn_no[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [noWarn], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        data.warn -= 1
        data.save()

        let embed = new MessageEmbed()
        .setDescription("**Unwarn | Yasin Helper**")
        .setColor("#483D8B")
        .addField(`${lang.unwarn_embed_info[langs]}`, `**${lang.info_ban_moderator[langs]}** <@${message.author.id}>\n **${lang.unwarn_who[langs]}** <@${member.id}>\n **${lang.unwarn_number[langs]}** \`${data.warn}/${warns}\`\n **${lang.info_id_moderator[langs]}** \`${message.author.id}\`\n **${lang.info_id_user[langs]}** \`${member.id}\``)
        .setFooter({ text: `${lang.reports_footer[langs]}` })
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        await new Historys({
            userID: member.id,
            userTAG: member.user.tag,
            guildID: message.guild.id,
            text: `${lang.administrator[langs]} ${message.author.tag} ${lang.unwarn_history[langs]} ${member.user.tag}[${data.warn}/${warns}]`,
            staffID: message.author.id,
            staffTAG: message.author.tag
        }).save()
        } catch (e) {
            console.log(e)
        }
    }
}