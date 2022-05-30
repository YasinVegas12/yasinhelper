const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "setlog",
    description: "Установить канал для определенного вида логов",
    description_en: "Sets a channel for a certain type of logs",
    description_ua: "Встановить канал для певного типу логів",
    usage: "setlog [type] [channel]",
    example: "/setlog roleCreate 773091330569273364 - Установит канал логирования новых ролей на сервере",
    example_en: "/setlog roleCreate 773091330569273364 - Sets a channel for logging new roles on the server",
    example_ua: "/setlog roleCreate 773091330569273364 - Встановить канал для логування нових ролей на сервері",
  async run(client,message,args,langs,prefix) {

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

        let provideEvent = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setlog_provide_event[langs]} \`channelCreate,channelUpdate,channelDelete,roleCreate,roleUpdate,roleDelete,guildBanAdd,guildBanRemove,guildUpdate,stickerCreate,stickerUpdate,stickerDelete\`\n\`${prefix}setlog off\` - ${lang.setlog_off[langs]}`)
        .setTimestamp()
        if (args[0] != `channelCreate` && args[0] != `channelUpdate` && args[0] != `channelDelete` && args[0] != `roleCreate` && args[0] != `roleUpdate` && args[0] != `roleDelete` && args[0] != `guildBanAdd` && args[0] != `guildBanRemove` && args[0] != `guildUpdate` && args[0] != `stickerCreate` && args[0] != `stickerUpdate` && args[0] != `stickerDelete` && args[0] != `off`) return message.reply({ embeds: [provideEvent], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let channel = message.guild.channels.cache.find(c => c.name === args[1]) || message.guild.channels.cache.find(c => c.id === args[1]) || message.mentions.channels.first();

        let eventName = args[0];

        let channelUnknown = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setlog_channel_unknown[langs]}`)
        .setTimestamp()
        if (!channel) return message.reply({ embeds: [channelUnknown], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let channelCategory = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
        .setTimestamp()
        if (channel.type != "GUILD_TEXT") return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let logChannelAlready = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.channels_create_already[langs]} \`${eventName}\``)
        .setTimestamp()
        if(channel.id === data.channels[eventName]) return message.reply({ embeds: [logChannelAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let setEventEmbed = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.setlog_channelcreate_set[langs]} \`${eventName}\``)
        .setTimestamp()
        message.reply({ embeds: [setEventEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        data.channels[eventName] = channel.id
        data.save()
        } catch (e) {
            console.log(e)
        }
    }
}