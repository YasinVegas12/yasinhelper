const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "channel",
    description: "Добавить/удалить канал, в котором запрещено использовать команды",
    description_en: "Add/remove a channel in that is not allowed to use commands",
    description_ua: "Додати/видалити канал, в якому заборонено використовувати команди",
    usage: "channel [add/remove/list] [channel]",
    example: "/channel add 773091330569273364 - добавить игнорируемый ботом канал по айди\n/channel remove <#773091330569273364> - удалить игнорируемый ботом канал по упоминаню канала",
    example_en: "/channel add 773091330569273364 - add a channel ignored by the bot by ID\n/channel remove <#773091330569273364> - remove the channel ignored by the bot by mention channel",
    example_ua: "/channel add 773091330569273364 - додати в ігноруємий ботом канал по айді",
  async run(client,message,args,langs) {

    try {

        const developer = [
            config.developer,
        ];

        let dat = await Guild.findOne({
            guildID: message.guild.id
        });

        if (!dat) return;

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.module_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let type = args[0]

        let warningArgument = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.channel_provide_args[langs]}`)
        .setTimestamp()

        if (type != "add" && args[0] != "remove" && args[0] != "list") return message.reply({ embeds: [warningArgument], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
        if (type === "add") {
            let chan = args[1]

            let channel = message.guild.channels.cache.find(c => c.name === chan) || message.guild.channels.cache.find(c => c.id == chan) || message.mentions.channels.first();

            let channelNameIsNotDefined = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_correct_channel[langs]}`)
            .setTimestamp()
            if (!channel) return message.reply({ embeds: [channelNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let channelCategory = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
            .setTimestamp()
            if (channel.type != "GUILD_TEXT") return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            
            let data = await Guild.findOne({
                guildID: message.guild.id,
                ignoreChannels: channel.id
            });
    
            if (!data) {
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    $push: {
                        ignoreChannels: channel.id
                    }
                });

                let channelAdded = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.channel_added[langs]} ${channel}`)
                .setTimestamp()
                return message.reply({ embeds: [channelAdded], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            } else {
                let channelAlreadyAdd = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.channel_added_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelAlreadyAdd], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        } else if (type === "remove") {
            let chan = args[1]

            let channel = message.guild.channels.cache.find(c => c.name === chan) || message.guild.channels.cache.find(c => c.id == chan) || message.mentions.channels.first();

            let channelNameIsNotDefined = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_correct_channel[langs]}`)
            .setTimestamp()
            if (!channel) return message.reply({ embeds: [channelNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let channelCategory = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
            .setTimestamp()
            if (channel.type != "GUILD_TEXT") return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            
            let data = await Guild.findOne({
                guildID: message.guild.id,
                ignoreChannels: channel.id
            });
    
            if (!data) {
                let noChannelDeny = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.channel_deny_no[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [noChannelDeny], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            } else {
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    $pull: {
                        ignoreChannels: channel.id
                    }
                });
                
                let channelDenyAdd = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.channel_deny_remove[langs]} ${channel}`)
                .setTimestamp()
                return message.reply({ embeds: [channelDenyAdd], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        } else if (type === "list") {
            let channelsList = dat.ignoreChannels

            let ignore_channels = message.guild.channels.cache.filter(c => channelsList.includes(c.id))

            let channels = ignore_channels.sort((a, b) => b.position - a.position).map(channel => channel.toString()) 

            let embedInfo = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${lang.channel_list[langs]} [${channelsList.length}]`)
            .setDescription(`${channels}`)
            if (channelsList.length === 0) embedInfo.description = `${lang.channel_no[langs]}`
            message.reply({ embeds: [embedInfo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    } catch (e) {
        console.log(e)
    }
}
}