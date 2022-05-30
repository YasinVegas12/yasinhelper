const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "settings",
    description: "Посмотреть настройки бота",
    description_en: "View the bot settings",
    description_ua: "Перегляд налаштувань бота",
    usage: "settings",
    example: "/settings - Посмотреть настройки бота",
    example_en: "/settings - View the bot settings",
    example_ua: "/settings - Перегляд налаштувань бота",
  async run(client,message,args,langs) {

    try {
        
        const developer = [
            config.developer,
        ];

        let data = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if(!data) return;

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.module_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(data.antilink === true) {
            ant = `${lang.antilink_on[langs]}`
        }else{
            ant = `${lang.antilink_off[langs]}`
        }

        let autorole = message.guild.roles.cache.find(r => r.name === data.autorole) || message.guild.roles.cache.find(r => r.id === data.autorole)

        if(autorole) {
            at = `\`${autorole.name}\``
        }else{
            at = `\`${lang.not_provided[langs]}\``
        }

        let joinleft = message.guild.channels.cache.find(c => c.name === data.vxodchannel) || message.guild.channels.cache.find(c => c.id === data.vxodchannel)

        if(joinleft) {
            vxodchannel = `\`${joinleft.name}\``
        }else{
            vxodchannel = `\`${lang.vxodchannel_no[langs]}\``
        }

        let logchannels = message.guild.channels.cache.find(c => c.name === data.logchannel) || message.guild.channels.cache.find(c => c.id === data.logchannel)

        if(logchannels) {
            logchannel = `\`${logchannels.name}\``
        }else{
            logchannel = `\`${lang.vxodchannel_no[langs]}\``
        }

        if(data.delpin === true) {
            delpin = `${lang.delpin_on[langs]}`
        }else{
            delpin = `${lang.delpin_off[langs]}`
        }

        if(data.randomemoji === true) {
            randomemoji = `${lang.randomemoji_on[langs]}`
        }else{
            randomemoji = `${lang.randomemoji_off[langs]}`
        }

        let incoming = message.guild.channels.cache.find(c => c.name === data.ad_incoming) || message.guild.channels.cache.find(c => c.id === data.ad_incoming)

        if(incoming) {
            ad_incoming = `\`${incoming.name}\``
        }else{
            ad_incoming = `\`${lang.ad_incoming_no[langs]}\``
        }

        let outgoing = message.guild.channels.cache.find(c => c.name === data.ad_outgoing) || message.guild.channels.cache.find(c => c.id === data.ad_outgoing)

        if(outgoing) {
            ad_outgoing = `\`${outgoing.name}\``
        }else{
            ad_outgoing = `\`${lang.ad_outgoins_no[langs]}\``
        }

        let rolead = message.guild.roles.cache.find(r => r.name === data.r_ad) || message.guild.roles.cache.find(r => r.id === data.r_ad)

        if(rolead) {
            r_ad = `${rolead.name}`
        }else{
            r_ad = `${lang.r_ad_no[langs]}`
        }

        let active = message.guild.channels.cache.find(c => c.name === data.activeCategory) || message.guild.channels.cache.find(c => c.id === data.activeCategory)

        if(active) {
            aCategory = `\`${active.name}\``
        }else{
            aCategory = `\`${lang.ad_outgoins_no[langs]}\``
        }

        let hold = message.guild.channels.cache.find(c => c.name === data.holdCategory) || message.guild.channels.cache.find(c => c.id === data.holdCategory)

        if(hold) {
            hCategory = `\`${hold.name}\``
        }else{
            hCategory = `\`${lang.ad_outgoins_no[langs]}\``
        }

        let close = message.guild.channels.cache.find(c => c.name === data.closeCategory) || message.guild.channels.cache.find(c => c.id === data.closeCategory)

        if(close) {
            cCategory = `\`${close.name}\``
        }else{
            cCategory = `\`${lang.ad_outgoins_no[langs]}\``
        }

        let support = message.guild.channels.cache.find(c => c.name === data.supportchannel) || message.guild.channels.cache.find(c => c.id === data.supportchannel)

        if(support) {
            sChannel = `${support.name}`
        }else{
            sChannel = `${lang.ad_outgoins_no[langs]}`
        }

        let reports = message.guild.channels.cache.find(c => c.name === data.reportschannel) || message.guild.channels.cache.find(c => c.id === data.reportschannel)

        if(reports) {
            rChannel = `${reports.name}`
        }else{
            rChannel = `${lang.ad_outgoins_no[langs]}`
        }

        if(data.deleteMessage === true) {
            delMsg = `${lang.del_msg_on[langs]}`
        }else{
            delMsg = `${lang.del_msg_off[langs]}`
        }

        let settingsServerEmbed = new MessageEmbed()
        .setColor(`#0eb7eb`)
        .setAuthor({ name: `${lang.settings_title[langs]} ${message.guild.name}`, iconURL: message.guild.iconURL() })
        .setThumbnail(message.guild.iconURL())
        .setDescription(`**[✏️] ${lang.settings_prefix[langs]}** \`${data.prefix}\` **[✏️]**\n**[👤] ${lang.settings_autorole[langs]}** ${at} **[👤]**\n**[💬] ${lang.settings_antilink[langs]}** \`${ant}\` **[💬]**\n**[📲] ${lang.settings_joinleft[langs]}** ${vxodchannel} **[📲]**\n**[👀] ${lang.settings_logs_channel[langs]}** ${logchannel} **[👀]**\n**[🔧] ${lang.settings_support[langs]}** \`${sChannel}\` **[🔧]**\n**[🛡️] ${lang.settings_support_log[langs]}** \`${rChannel}\` **[🛡️]**\n**[🛰️] ${lang.settings_delete_pinned[langs]}** \`${delpin}\` **[🛰️]**\n**[🔥] ${lang.settings_random_message[langs]}** \`${randomemoji}\` **[🔥]**\n**[⌚] ${lang.settings_active[langs]}** ${aCategory} **[⌚]**\n**[📝] ${lang.settings_pending[langs]}** ${hCategory} **[📝]**\n**[🔒] ${lang.settings_closed[langs]}** ${cCategory} **[🔒]**\n**[🔎] ${lang.settings_language[langs]}** \`${data.language}\` **[🔎]**\n**[🖍️] ${lang.settings_channel_out[langs]}** ${ad_incoming}** [🖍️]**\n**[🪧] ${lang.settings_channel_go[langs]}** ${ad_outgoing} **[🪧]**\n**[📷] ${lang.settings_role_ads[langs]}** \`${r_ad}\` **[📷]**\n**[⛔] ${lang.delete_message_settings[langs]}:** \`${delMsg}\``)
        .setTimestamp()
        message.reply({ embeds: [settingsServerEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        } catch (e) {
            console.log(e)
        }
    }
}