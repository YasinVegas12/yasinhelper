const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "upload",
    description: "Загрузить систему саппорт",
    description_en: "Upload the support system",
    description_ua: "Завантажити саппорт систему",
    usage: "upload",
    example: "/upload - загрузить стандартные каналы/роли",
    example_en: "/upload - upload standard channels/roles",
    example_ua: "/upload - завантажити стандартні канали/ролі",
  async run(client,message,args,langs) {

    try {
        
        const developer = [
            config.developer,
        ];

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.module_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningBotPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.support_permissions[langs]}`)
        .setTimestamp()
        if (!message.guild.me.permissions.has(["ADMINISTRATOR"])) return message.reply({ embeds: [warningBotPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let moderator_role = message.guild.roles.cache.find(r => r.name == "Support Team");

        if (moderator_role) {
            mRole = `${lang.upload_already[langs]}`
        }else{
            mRole = `${lang.upload_create[langs]}`
        }

        let support = message.guild.channels.cache.find(c => c.name == "support");

        if (support) {
            sChannel = `${lang.upload_already[langs]}`
        }else{
            sChannel = `${lang.upload_created[langs]}`
        }

        let reports = message.guild.channels.cache.find(c => c.name == "reports-log");

        if(reports) {
            repChannel = `${lang.upload_already[langs]}`
        }else{
            repChannel = `${lang.upload_created[langs]}`
        }

        let a_category = message.guild.channels.cache.find(c => c.name == "Active complaints");

        if (a_category) {
            a_categ = `${lang.upload_already[langs]}`
        }else{
            a_categ = `${lang.upload_create[langs]}`
        }

        let b_category = message.guild.channels.cache.find(c => c.name == "Pending complaints");

        if (b_category) {
            h_categ = `${lang.upload_already[langs]}`
        }else{
            h_categ = `${lang.upload_create[langs]}`
        }

        let с_category = message.guild.channels.cache.find(c => c.name == "Trash");

        if (с_category) {
          c_categ = `${lang.upload_already[langs]}`
        }else{
          c_categ = `${lang.upload_create[langs]}`
        }

        if (!moderator_role) {
            await message.guild.roles.create({ name: "Support Team", reason: "Upload support system" })
        }

        if (!support) {
            support = await message.guild.channels.create(`support`, {
            type: "GUILD_TEXT",
            permissionOverwrites: [
               { allow: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`], id: message.guild.id },
               { allow: [`VIEW_CHANNEL`,`SEND_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`USE_EXTERNAL_EMOJIS`], deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`], id: moderator_role.id }
            ]
           })
        }

        if (!reports) {
            reports = await message.guild.channels.create(`reports-log`, {
            type: "GUILD_TEXT",
            permissionOverwrites: [
              { deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`], id: message.guild.id },
              { allow: [`VIEW_CHANNEL`,`SEND_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`USE_EXTERNAL_EMOJIS`], deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`], id: moderator_role.id }
            ]
          })
        }

        if (!a_category) {
            a_category = await message.guild.channels.create(`Active complaints`, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
               { deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`], id: message.guild.id },
               { allow: [`VIEW_CHANNEL`,`SEND_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`USE_EXTERNAL_EMOJIS`], deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`], id: moderator_role.id }
            ]
            })
        }

        if (!b_category) {
            b_category = await message.guild.channels.create(`Pending complaints`, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
               { deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`], id: message.guild.id },
               { allow: [`VIEW_CHANNEL`,`SEND_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`USE_EXTERNAL_EMOJIS`], deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`], id: moderator_role.id }
            ]
           })
        }

        if (!с_category) {
            c_category = await message.guild.channels.create(`Trash`, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
               { deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`VIEW_CHANNEL`,`SEND_MESSAGES`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`MENTION_EVERYONE`,`USE_EXTERNAL_EMOJIS`,`ADD_REACTIONS`], id: message.guild.id },
               { allow: [`VIEW_CHANNEL`,`SEND_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`,`READ_MESSAGE_HISTORY`,`USE_EXTERNAL_EMOJIS`], deny: [`CREATE_INSTANT_INVITE`,`MANAGE_CHANNELS`,`MANAGE_ROLES`,`MANAGE_WEBHOOKS`,`SEND_TTS_MESSAGES`,`MANAGE_MESSAGES`,`MENTION_EVERYONE`,`ADD_REACTIONS`], id: moderator_role.id }
            ]
           })
        }

        let uploadEmbed = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.upload_title[langs]}`)
        .setDescription(`${lang.upload_role[langs]} \`${mRole}\`\n${lang.upload_channel[langs]} \`${sChannel}\`\n${lang.upload_reports[langs]} \`${repChannel}\`\n${lang.upload_active[langs]} \`${a_categ}\`\n${lang.upload_hold[langs]} \`${h_categ}\`\n${lang.upload_trash[langs]} \`${c_categ}\``)
        message.reply({ embeds: [uploadEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } catch(e) {
            console.log(e)
        }
    }
}