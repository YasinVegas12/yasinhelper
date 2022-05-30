const { MessageEmbed } = require('discord.js');
const Ticket = require("../../structures/TicketSchema.js");
const Guild = require("../../structures/GuildSchema.js");
const User = require("../../structures/UserSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "hold",
    module: "ticket",
    description: "Установить тикету статус 'На рассмотрении'.",
    description_en: "Set the status of the ticket to 'Pending'.",
    description_ua: "Встановити тікету статус 'На розгляді'.",
    usage: "hold",
    example: "/hold - Установить тикету статус 'На рассмотрении'",
    example_en: "/hold - Set ticket status 'Pending'",
    example_ua: "/hold - Встановити тікету статус 'На розгляді'",
  async run(client,message,args,langs,prefix,ownerTAG,supportrole) {

    try {
        
        const developer = [
            config.developer,
        ];

        let dataTicket = await Ticket.findOne({
            guildID: message.guild.id,
            channelID: message.channel.id
        });

        let dat = await Guild.findOne({
            guildID: message.guild.id
        });

        let data = await User.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        });

        if (!dat) return;

        let warningBotPermission = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.support_permissions[langs]}`)
        .setTimestamp()
        if (!message.guild.me.permissions.has(["ADMINISTRATOR"])) return message.reply({ embeds: [warningBotPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let moderator_role = message.guild.roles.cache.filter(r => supportrole.includes(r.id));
        let roles = moderator_role.sort((a, b) => b.position - a.position).map(role => role.toString()) 
        let r_categ = dat.holdCategory

        let warningPermission = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ticket_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_ROLES") && !message.member.roles.cache.some(r => moderator_role.some(role => role.id == r.id))) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningNoTicket = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.use_ticket[langs]}`)
        .setTimestamp()
        if (!message.channel.name.startsWith('ticket-')) return message.reply({ embeds: [warningNoTicket], allowedMentions: { repliedUser: false }, failIfNotExists: false })
         
        let warningTicket = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ticket_nodb[langs]}`)
        .setTimestamp()
        if (!dataTicket) return message.reply({ embeds: [warningTicket], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
        let r_category = message.guild.channels.cache.find(c => c.name == r_categ) || message.guild.channels.cache.find(c => c.id == r_categ);

        let warningToHold = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.pending_set_already[langs]}`)
        .setTimestamp()
        if (dataTicket.status === "Pending") return message.reply({ embeds: [warningToHold], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let holdIsNotDefined = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ticket_category[langs]} \`${dat.holdCategory}\` ${lang.ticket_category_undefined[langs]}`)
        .setTimestamp()
        if (!r_category) return message.reply({ embeds: [holdIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let activeChildren = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.children_size[langs]}`)
        .setTimestamp()
        if (r_category.children.size >= 45) return message.reply({ embeds: [activeChildren], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let memberid = dataTicket.userID

        let chel = await message.guild.members.fetch(memberid).catch(() => {})

        if(!chel) {
            let ticketError = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.ticket_no_user[langs]} \`${prefix}close\``)
            .setTimestamp()
            return message.reply({ embeds: [ticketError], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if (roles.length === 0) {
            let undefined_moder_role = new MessageEmbed()
            .setColor(`#f00000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.supportrole_undefined[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [undefined_moder_role], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        message.channel.setParent(r_category.id).catch(err => {})

        const users_to_support = [{
            id: message.guild.id,
            deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`]
        }]

        users_to_support.push({
            id: chel.id,
            allow: [`VIEW_CHANNEL`,`SEND_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`USE_EXTERNAL_EMOJIS`],
            deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`]
        });

        moderator_role.forEach(moderator => {
            users_to_support.push({
                id: moderator.id,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'],
                deny: ['CREATE_INSTANT_INVITE', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'REQUEST_TO_SPEAK', 'USE_APPLICATION_COMMANDS', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS']
            })
        })

        await message.channel.permissionOverwrites.set(users_to_support).catch(err => {});
    
        let holdEmbed = new MessageEmbed()
        .setColor(`#0a5ef0`)
        .setTitle(`${lang.hold_message_title[langs]} ${message.guild.name}`)
        .setDescription(`**${lang.hold_hi[langs]}**\n**${lang.hold_moder[langs]} **\`${message.author.username}\``)
        .setFooter({ text: `© Support Team by Yasin Helper`, iconURL: `${client.user.avatarURL()}` })
        .setTimestamp()
        message.reply({ content: `<@${memberid}>, \`${lang.hold_message[langs]}\`<@${message.author.id}>`, embeds: [holdEmbed], failIfNotExists: false }).catch(err => {})

        dataTicket.status = "Pending"
        dataTicket.save()
        data.holdticket +=1
        data.save()

        let reportschannel = dat.reportschannel
        let channels = message.guild.channels.cache.find(c => c.name == reportschannel) || message.guild.channels.cache.find(c => c.id == reportschannel);

        if(channels) {
            let logTicket = new MessageEmbed()
            .setColor(`#03fc03`)
            .setTitle(`${lang.status_ticket_update[langs]}`)
            .setDescription(`**${lang.moderator[langs]}** \`${message.author.username}\` **${lang.moderator_status[langs]}** <#${message.channel.id}> **${lang.hold_status[langs]}**`)
            .setFooter({ text: `${lang.reports_footer[langs]}` })
            .setTimestamp()
            channels.send({ embeds: [logTicket] }).catch(err => {})
        }
    } catch (e) {
        console.log(e)
    }
  }
}