const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const BanSupport = require("../../structures/BanSupportSchema.js");
const Historys = require("../../structures/HistorySchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "removeblocksupport",
    aliases: ["rsupport", "unbansupport"],
    module: "ticket",
    description: "Снять блокировку саппорт пользователю.",
    description_en: "Remove the support block to the user.",
    description_ua: "Зняти блокування саппорт користувачу",
    usage: "removeblocksupport [user/ID]",
    example: "/removeblocksupport 608684992335446064 - Разблокировать доступ к support пользователю по id\n/removeblocksupport @Jason Kings#9417 - Разблокировать доступ к support пользователю с помощью упоминания",
    example_en: "/removeblocksupport 608684992335446064 - Unblock support for the user by id\n/removeblocksupport @Jason Kings#9417 - Unblock support for a user by mentioning",
    example_ua: "/removeblocksupport 608684992335446064 - Розблокувати доступ до support користувачу по id",
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

        let ban = await BanSupport.findOne({
            userID: blockMember.id,
            guildID: message.guild.id,
            current: true
        });
      
        let banAlready = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.removeblocksupport_undefined[langs]}`)
        .setTimestamp()
        if (!ban) return message.reply({ embeds: [banAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let reason = args.slice(1).join(" ");
        if(!reason) reason = `${lang.reason_no_provide[langs]}`

        await BanSupport.updateMany(ban, {
            current: false
        });

        await new Historys({
            userID: blockMember.id,
            userTAG: blockMember.user.tag,
            guildID: message.guild.id,
            text: `${lang.moderator[langs]} ${message.author.tag} ${lang.blocksupport_history[langs]} ${blockMember.user.tag}. ${lang.reason_caps[langs]} ${reason}`,
            staffID: message.author.id,
            staffTAG: message.author.tag
        }).save()

        let banSupport = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.removeblocksupport_description[langs]} ${blockMember}. ${lang.reason_caps[langs]} ${reason}`)
        .setTimestamp()
        message.reply({ embeds: [banSupport], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then(async() => {
            let blockEmbed = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.removeblocksupport_title[langs]}`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`${lang.removeblocksupport_description_one[langs]} \`${message.guild.name}\`\n${lang.removeblocksupport_moderator[langs]} \`${message.author.tag}\`\n${lang.reason_caps[langs]} \`${reason}\``)
            .setTimestamp()
            await blockMember.send({ embeds: [blockEmbed] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
        })
    } catch (e) {
        console.log(e)
    }
  }
}