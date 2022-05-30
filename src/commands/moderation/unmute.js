const { MessageEmbed } = require('discord.js');
const Historys = require("../../structures/HistorySchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "unmute",
    module: "moderation",
    description: "Снять мут пользователю",
    description_en: "Remove the mut to the user",
    description_ua: "Зняти мут користувачу",
    usage: "unmute [user ID] [reason(optional)]",
    example: "/unmute 608684992335446064 test - снять мут пользователю",
    example_en: "/unmute 608684992335446064 test - remove the mut to the user",
    example_ua: "/unmute 608684992335446064 test - зняти мут користувачу",
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
        .setDescription(`\`${message.author.username}\`, ${lang.unmute_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let unmutee = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

        let warningUser = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.unmute_how[langs]} \`${prefix}unmute [@user] [${lang.mute_reason[langs]}]\``)
        .setTimestamp() 
        if (!unmutee) return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let reason = args.slice(1).join(" ");
        if(!reason) reason =`${lang.reason_no_provide[langs]}`

        let userMutedEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.unmute_no[langs]}`)
        .setTimestamp()
        if (unmutee.isCommunicationDisabled() === false) return message.reply({ embeds: [userMutedEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        unmutee.timeout(null, reason).catch(err => {
        }).then(() => {
            const unmuteEmbed = new MessageEmbed()
            .setColor(`#FFFF00`)
            .setDescription(`**${lang.unmute_admin[langs]}** <@${message.author.id}> **${lang.unmute_remove[langs]}** <@${unmutee.id}>\n\n**${lang.unmute_reason[langs]}** \`${reason}\``)
            .setFooter({ text: `${lang.reports_footer[langs]}` })
            message.reply({ embeds: [unmuteEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        });

        await new Historys({
            userID: unmutee.id,
            userTAG: unmutee.user.tag,
            guildID: message.guild.id,
            text: `${lang.moderator[langs]} ${message.author.tag} ${lang.unmute_history[langs]} ${unmutee.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
            staffID: message.author.id,
            staffTAG: message.author.tag
        }).save()
        } catch (e) {
            console.log(e)
        }
    }
}