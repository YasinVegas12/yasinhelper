const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "set",
    description: "Изминение настроек бота",
    description_en: "Changing the bot settings",
    description_ua: "Зміна налаштувань бота",
    usage: "set [parameter] [argument]",
    example: "/set warnPunish ban - установит наказанием за достижение максимального количества варнов `бан`\n/set warns 5 - Установит максимальным количеством предупреждений до получения наказания `5`",
    example_en: "/set warnPunish ban - sets the punishment for reaching the maximum number of warns `ban`\n/set warns 5 - Sets the maximum number of warnings before receiving a punishment to `5`",
    example_ua: "/set warnPunish ban - встановить покаранням за досягнення максимальної кількості попереджень бан",
  async run(client,message,args,langs,prefix) {

    try {
        
        const developer = [
            config.developer,
        ];

        let data = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if (!data) return;

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.module_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let howToUse = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.set_use[langs]} \`\`\`q\n${prefix}set [autorole] [${lang.set_role[langs]}], ${lang.set_autorole_disable[langs]} ${prefix}set autoroleoff \n${prefix}set [antilink] [on - ${lang.enable[langs]}/off - ${lang.disable[langs]}] \n${prefix}set [prefix] [${lang.prefix[langs]}] \n${prefix}set [logchannel] [${lang.channel[langs]}], ${lang.set_disable[langs]} ${prefix}set logchanneloff \n${prefix}set [join-exit] [${lang.channel[langs]}], ${lang.set_disable[langs]} ${prefix}set join-exit-off \n${prefix}set [supportchannel] [${lang.channel[langs]}], ${lang.set_disable[langs]} ${prefix}set supportoff \n${prefix}set [reportschannel] [${lang.channel[langs]}] \n${prefix}set [delpin] [on/off] \n${prefix}set [randomemoji] [on/off] \n${prefix}set active [${lang.category[langs]}] \n${prefix}set hold [${lang.category[langs]}] \n${prefix}set close [${lang.category[langs]}] \n${prefix}set language [ru/en/ua]\n${prefix}set adprocessing [${lang.channel[langs]}], ${lang.set_disable[langs]} ${prefix}set adoff\n${prefix}set adexit [${lang.channel[langs]}]\n${prefix}set adrole [${lang.set_role[langs]}]\n${prefix}set timeTicketDelete [${lang.set_time_delete[langs]}]\n${prefix}set warns [${lang.set_warns[langs]}]\n${prefix}set warnPunish [kick/ban]\n${prefix}set messageDelete [on/off]\`\`\``)
        .setTimestamp()
        if (args[0] !== 'autorole' && args[0] !==`autoroleoff` && args[0] !== 'antilink' && args[0] !== `prefix` && args[0] !== `logchannel` && args[0] !== `logchanneloff` && args[0] !== `join-exit` && args[0] !== `supportchannel` && args[0] !== `reportschannel` && args[0] != `delpin` && args[0] !== `randomemoji` && args[0] !==`active` && args[0] !==`hold` && args[0] !==`close` && args[0] !==`language` && args[0] !==`adprocessing` && args[0] !==`adexit` && args[0] !==`adrole` && args[0] !== `join-exit-off` && args[0] !== `supportoff` && args[0] !== `adoff` && args[0] !== `timeTicketDelete` && args[0] !== `warns` && args[0] !== `warnPunish` && args[0]  !== `messageDelete`) return message.reply({ embeds: [howToUse], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (args[0] == 'autorole') {

            let provideToRole = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.set_autorole_info[langs]} \`${prefix}set autorole off\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let role = message.guild.roles.cache.find(r => r.name === args.slice(1).join(" ")) || message.guild.roles.cache.find(r => r.id == args.slice(1).join(" ")) || message.mentions.roles.first();

            if (!role) {
                let roleIsNotDefined = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (role.name === "@everyone" || role.name === "@here") {
                let roleEveryone = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_role_everyone[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleEveryone], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (role.managed) {
                let roleManaged = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_managed[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleManaged], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (role.id === data.autorole) {
                let roleAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let autoroleEmbed = new MessageEmbed()
            .setColor(`#5afc03`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.autorole_set[langs]}** \`${role.name}\``)
            message.reply({ embeds: [autoroleEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.autorole = role.id
            data.save()
        } else if (args[0] == `autoroleoff`) {

            if(data.autorole === "не установлена") {
                let autoroleDisabledAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.autorole_disabled_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [autoroleDisabledAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let autoroleOff = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.autorole_disabled[langs]}`)
            .setTimestamp()
            message.reply({ embeds: [autoroleOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.autorole = "не установлена"
            data.save()
        } else if (args[0] == 'antilink') {

            let provideToParametr = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_on_off[langs]} \`${prefix}set antilink on - ${lang.enable[langs]}/off - ${lang.disable[langs]}\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToParametr], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            let provideToOnAndOff = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_on_off[langs]} \`${prefix}set antilink on - ${lang.enable[langs]}/off - ${lang.disable[langs]}\``)
            .setTimestamp()
            if (args[1] !== `on` && args[1] !==`off`) return message.reply({ embeds: [provideToOnAndOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            if(args[1] == `on`) {
    
                if (data.antilink === true) {
                    let antilinkAlreadyEnabled = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.antilink_already_enabled[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [antilinkAlreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
    
                let onEmbed = new MessageEmbed()
                .setColor(`#5beb34`)
                .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.enabled_antilink[langs]}**`)
                message.reply({ embeds: [onEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.antilink = true
                data.save()
            } else if (args[1] == `off`) {
    
                if (data.antilink === false) {
                    let antilinkAlreadyEnabled = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.antilink_already_disabled[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [antilinkAlreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
    
                let offEmbed = new MessageEmbed()
                .setColor(`#5beb34`)
                .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.disabled_antilink[langs]}**`)
                message.reply({ embeds: [offEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.antilink = false
                data.save()
            }
        } else if (args[0] === "prefix") {

                let provideToPrefix = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.correct_use[langs]} \`${prefix}set prefix [${lang.prefix[langs]}]\``)
                .setTimestamp()
                if (!args[1]) return message.reply({ embeds: [provideToPrefix], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let provideToPrefixLenght = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.prefix_length[langs]}`)
                .setTimestamp()
                if (args[1].length > 5) return message.reply({ embeds: [provideToPrefixLenght], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                if (args[1].content === "@here") {
                    let roleEveryone = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.prefix_wrong_symbol[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [roleEveryone], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let prefixAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.prefix_already[langs]}`)
                .setTimestamp()
                if (args[1] === data.prefix) return message.reply({ embeds: [prefixAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let prembed = new MessageEmbed()
                .setColor(`#db0917`)
                .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.prefix_text[langs]}** \`${args[1]}\``)
                message.reply({ embeds: [prembed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.prefix = args[1]
                data.save()
            } else if (args[0] === "logchannel") {

                let provideToChannelName = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_channel[langs]} \`${prefix}set logchannel [${lang.channel[langs]}]\``)
                .setTimestamp()
                if (!args[1]) return message.reply({ embeds: [provideToChannelName], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" ")) || message.mentions.channels.first();

                if (!channel) {
                    let channelNameIsNotDefined = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.provide_correct_channel[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [channelNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if (channel.type != "GUILD_TEXT") {
                    let channelCategory = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if (channel.id === data.logchannel) {
                    let logChannelAlready = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.logchannel_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [logChannelAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let logsEmbed = new MessageEmbed()
                .setColor(`#db0917`)
                .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.change_channel[langs]} \`${channel.name}\``)
                message.reply({ embeds: [logsEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.logchannel = channel.id
                data.save()
            } else if (args[0] === "logchanneloff") {

                if (data.logchannel === "Не указано") {
                    let alreadyDisabledLogchannel = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.logchannel_disabled_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [alreadyDisabledLogchannel], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
        
                let logsEmbedDisabled = new MessageEmbed()
                .setColor(`#db0917`)
                .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.logchannel_disabled[langs]}**`)
                message.reply({ embeds: [logsEmbedDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.logchannel = "Не указано"
                data.save()
            } else if (args[0] === "join-exit") {

                let provideToJoinExitChannel = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_channel[langs]} \`${prefix}set join-exit [${lang.channel[langs]}]\``)
                .setTimestamp()
                if (!args[1]) return message.reply({ embeds: [provideToJoinExitChannel], allowedMentions: { repliedUser: false }, failIfNotExists: false })
          
                let channel = message.guild.channels.cache.find(c => c.name == args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" ")) || message.mentions.channels.first();
          
                if (!channel) {
                    let channelNameIsNotDefined = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.provide_correct_channel[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [channelNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
          
                if (channel.type != "GUILD_TEXT") {
                    let channelCategory = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
          
                if (channel.id === data.vxodchannel) {
                    let logChannelAlready = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.logchannel_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [logChannelAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
          
                let vxodEmbed = new MessageEmbed()
                .setColor(`#db0917`)
                .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.vxodchannel_edit[langs]} \`${channel.name}\``)
                message.reply({ embeds: [vxodEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.vxodchannel = channel.id
                data.save()
            } else if (args[0] === "supportchannel") {

                let provideToSupportChannelName = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_channel[langs]} \`${prefix}set supportchannel [${lang.channel[langs]}\``)
                .setTimestamp()
                if (!args[1]) return message.reply({ embeds: [provideToSupportChannelName], allowedMentions: { repliedUser: false }, failIfNotExists: false })
         
                let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" ")) || message.mentions.channels.first();
         
                if (!channel) {
                    let channelNameIsNotDefined = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.provide_correct_channel[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [channelNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
          
                if (channel.type != "GUILD_TEXT") {
                    let channelCategory = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
         
                 if (channel.id === data.supportchannel) {
                    let supportAlready = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.support_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [supportAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                 }
         
                let supportEmbed = new MessageEmbed()
                .setColor(`#db0917`)
                .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.support_edit[langs]} \`${channel.name}\``)
                message.reply({ embeds: [supportEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.supportchannel = channel.id
                data.save()
            } else if (args[0] === "reportschannel") {

                let provideToReportsChannelName = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_channel[langs]} \`${prefix}set reportschannel [${lang.channel[langs]}]\``)
                .setTimestamp()
                if (!args[1]) return message.reply({ embeds: [provideToReportsChannelName], allowedMentions: { repliedUser: false }, failIfNotExists: false })
      
                let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" ")) || message.mentions.channels.first();
      
                if (!channel) {
                    let channelNameIsNotDefined = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.provide_correct_channel[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [channelNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
          
                if (channel.type != "GUILD_TEXT") {
                    let channelCategory = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
      
                if (channel.id === data.reportschannel) {
                    let alreadyReports = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.reportschannel_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [alreadyReports], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
      
                let reportsEmbed = new MessageEmbed()
                .setColor(`#db0917`)
                .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.reports_edit[langs]} \`${channel.name}\``)
                message.reply({ embeds: [reportsEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.reportschannel = channel.id
                data.save()
            } else if (args[0] == `delpin`) {

                let provideToParametrs = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_on_off[langs]} \`${prefix}set delpin on/off\``)
                .setTimestamp()
                if (!args[1]) return message.reply({ embeds: [provideToParametrs], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
                let provideToOnOff = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_on_off[langs]} \`${prefix}set delpin on/off\``)
                .setTimestamp()
                if (args[1] !== "on" && args[1] !== "off") return message.reply({ embeds: [provideToOnOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
                if (args[1] === "on") {
    
                    if (data.delpin === true) {
                        let alreadyEnabledDelpin = new MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`${lang.title_error[langs]}`)
                        .setDescription(`\`${message.author.username}\`, ${lang.delpin_already_on[langs]}`)
                        .setTimestamp()
                        return message.reply({ embeds: [alreadyEnabledDelpin], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    }
    
                    let delpinOnEmbed = new MessageEmbed()
                    .setColor(`#5beb34`)
                    .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.delpin_on_text[langs]}**`)
                    message.reply({ embeds: [delpinOnEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    data.delpin = true
                    data.save()
    
                } else if (args[1] === "off") {
    
                if(data.delpin === false) {
                    let alreadyDisabledDelpin = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.delpin_already_off[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [alreadyDisabledDelpin], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
    
                let delpinEmbed = new MessageEmbed()
                .setColor(`#5beb34`)
                .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.delpin_off_text[langs]}**`)
                message.reply({ embeds: [delpinEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.delpin = false
                data.save()
            }
        } else if (args[0] === "randomemoji") {

            let provideToOnOff = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_on_off[langs]} \`${prefix}set randomemoji on/off\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToOnOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let providesOnAndOff = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_on_off[langs]} \`${prefix}set randomemoji on/off\``)
            .setTimestamp()
            if (args[1] !== "on" && args[1] !== "off") return message.reply({ embeds: [providesOnAndOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            if (args[1] === "on") {

                if (data.randomemoji === true) {
                    let randomemojiAlreadyEnabled = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.randomemoji_enabled[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [randomemojiAlreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let randomonEmbed = new MessageEmbed()
                .setColor(`#5beb34`)
                .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.random_emoji_on[langs]}**`)
                message.reply({ embeds: [randomonEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.randomemoji = true
                data.save()
            } else if (args[1] === "off") {

                if (data.randomemoji === false) {
                    let randomemojiAlreadyDisabled = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.randomemoji_disabled[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [randomemojiAlreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let randomoffEmbed = new MessageEmbed()
                .setColor(`#5beb34`)
                .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **${lang.random_emoji_off[langs]}**`)
                message.reply({ embeds: [randomoffEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.randomemoji = false
                data.save()
            }
        } else if (args[0] === "active") {

            let provideToActiveChannelName = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_category[langs]} \`${prefix}set active [${lang.category[langs]}]\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToActiveChannelName], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" "));

            if (!channel) {
                let channelActiveIsNotDefined = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.category_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelActiveIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (channel.type != "GUILD_CATEGORY") {
                let channelCategory = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_category[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (channel.id === data.activeCategory) {
                let activeAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.active_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [activeAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            } 

            let activeEmbed = new MessageEmbed()
            .setColor(`#db0917`)
            .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.active_change[langs]} \`${channel.name}\``)
            message.reply({ embeds: [activeEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.activeCategory = channel.id
            data.save()
        } else if (args[0] === "hold") {

            let provideToHoldChannelName = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_category[langs]} \`${prefix}set hold [${lang.category[langs]}]\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToHoldChannelName], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" "));

            if (!channel) {
                let channelActiveIsNotDefined = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.category_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelActiveIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (channel.type != "GUILD_CATEGORY") {
                let channelCategory = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_category[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (channel.id === data.holdCategory) {
                let holdAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.hold_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [holdAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let holdEmbed = new MessageEmbed()
            .setColor(`#db0917`)
            .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.hold_change[langs]} \`${channel.name}\``)
            message.reply({ embeds: [holdEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.holdCategory = channel.id
            data.save()
        } else if (args[0] === "close") {

            let provideToCloseChannelName = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_category[langs]} \`${prefix}set close [${lang.category[langs]}\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToCloseChannelName], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" "));

            if (!channel) {
                let channelActiveIsNotDefined = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.category_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelActiveIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (channel.type != "GUILD_CATEGORY") {
                let channelCategory = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_category[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (channel.id === data.closeCategory) {
                let closeAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.close_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [closeAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let closeEmbed = new MessageEmbed()
            .setColor(`#db0917`)
            .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.close_change[langs]} \`${channel.name}\``)
            message.reply({ embeds: [closeEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.closeCategory = channel.id
            data.save()
        } else if (args[0] === "language") {

            let languageOnOff = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_language[langs]} \`${prefix}set language [ru/en/ua]\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [languageOnOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let providesOnAndOff = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_language[langs]} \`${prefix}set language [ru/en/ua]\``)
            .setTimestamp()
            if(args[1] !== `ru` && args[1] !== `en` && args[1] != `ua`) return message.reply({ embeds: [providesOnAndOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            if(args[1] === "ru") {

                if (data.language === "Русский") {
                    let russianAlready = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.russian_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [russianAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let RussianEmbed = new MessageEmbed()
                .setColor(`#5beb34`)
                .setDescription(`**${lang.administrator[langs]}** <@${message.author.id}> **изменил язык бота на "Русский"**`)
                message.reply({ embeds: [RussianEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.language = "Русский"
                data.save()
            } else if (args[1] === "en") {

                if(data.language === "English") {
                    let englishAlready = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.english_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [englishAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let EnglishEmbed = new MessageEmbed()
                .setColor(`#5beb34`)
                .setDescription(`**Administrator** <@${message.author.id}> **has been changed language to "English"**`)
                message.reply({ embeds: [EnglishEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.language = "English"
                data.save()
            }
            else if (args[1] === "ua") {

                if(data.language === "Українська") {
                    let englishAlready = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.ukraine_already[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [englishAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let EnglishEmbed = new MessageEmbed()
                .setColor(`#5beb34`)
                .setDescription(`**Адміністратор** <@${message.author.id}> **змінив мову бота на "Українська"**`)
                message.reply({ embeds: [EnglishEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.language = "Українська"
                data.save()
            }
        } else if (args[0] === "adprocessing") {

            let provideToAdChannelName = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_channel[langs]} \`${prefix}set adprocessing [${lang.channel[langs]}]\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToAdChannelName], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" ")) || message.mentions.channels.first();

            if (!channel) {
                let channelNameIsNotDefined = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_correct_channel[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
      
            if (channel.type != "GUILD_TEXT") {
                let channelCategory = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (channel.id === data.ad_incoming) {
                let alreadyIncoming = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.ad_incoming_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [alreadyIncoming], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let adProcessingEmbed = new MessageEmbed()
            .setColor(`#db0917`)
            .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.adproc_change[langs]} \`${channel.name}\``)
            message.reply({ embeds: [adProcessingEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.ad_incoming = channel.id
            data.save()
        } else if (args[0] === "adexit") {

            let provideToAdExitName = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_channel[langs]} \`${prefix}set adexit [${lang.channel[langs]}\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToAdExitName], allowedMentions: { repliedUser: false }, failIfNotExists: false })
  
            let channel = message.guild.channels.cache.find(c => c.name === args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.id == args.slice(1).join(" ")) || message.mentions.channels.first();
  
            if (!channel) {
                let channelNameIsNotDefined = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_correct_channel[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
      
            if (channel.type != "GUILD_TEXT") {
                let channelCategory = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_channel[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelCategory], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
  
            if (channel.id === data.ad_outgoing) {
                let outgoingAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.ad_outgoing_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [outgoingAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
  
            let adOutGoingEmbed = new MessageEmbed()
            .setColor(`#db0917`)
            .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.adexit_change[langs]} \`${channel.name}\``)
            message.reply({ embeds: [adOutGoingEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.ad_outgoing = channel.id
            data.save()
        } else if (args[0] === "adrole") {

            let provideToAdRoleName = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_ad_role[langs]} \`${prefix}set adrole [${lang.role[langs]}]\``)
            .setTimestamp()
            if (!args[1]) return message.reply({ embeds: [provideToAdRoleName], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let role = message.guild.roles.cache.find(r => r.name === args.slice(1).join(" ")) || message.guild.roles.cache.find(r => r.id == args.slice(1).join(" ")) || message.mentions.roles.first();

            if (!role) {
                let roleIsNotDefined = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (role.name === "@everyone" || role.name === "@here") {
                let roleEveryone = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_role_everyone[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleEveryone], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (role.managed) {
                let roleManaged = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_managed[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleManaged], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if (role.id === data.r_ad) {
                let alreadyRoleEditor = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.editor_role_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [alreadyRoleEditor], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let adRoleEmbed = new MessageEmbed()
            .setColor(`#5afc03`)
            .setDescription(`${lang.administrator[langs]} <@${message.author.id}> ${lang.change_ad_role[langs]} \`${role.name}\``)
            message.reply({ embeds: [adRoleEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.r_ad = role.id
            data.save()
        } else if (args[0] === "join-exit-off") {

            if (data.vxodchannel === "Не указано") {
                let joinleftDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.joinleft_disabled[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [joinleftDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let joinleftEmbed = new MessageEmbed()
            .setColor(`BLUE`)
            .setDescription(`\`${message.author.username}\`, ${lang.joinleftoff[langs]}`)
            .setTimestamp()
            message.reply({ embeds: [joinleftEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.vxodchannel = "Не указано"
            data.save()
        } else if (args[0] === "supportoff") {

            if (data.supportchannel === "Disabled" || data.reportschannel === "Disabled" || data.supportrole === "Disabled" || data.activeCategory === "Disabled" || data.holdCategory === "Disabled" || data.closeCategory === "Disabled") {
                let supportAlreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.support_system_already_disabled[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [supportAlreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let supportOffEmbed = new MessageEmbed()
            .setColor(`BLUE`)
            .setDescription(`\`${message.author.username}\`, ${lang.support_off[langs]}`)
            .setTimestamp()
            message.reply({ embeds: [supportOffEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.supportchannel = "Disabled"
            data.reportschannel = "Disabled"
            data.supportrole = "Disabled"
            data.activeCategory = "Disabled"
            data.holdCategory = "Disabled"
            data.closeCategory = "Disabled"
            data.save()
        } else if (args[0] === "adoff") {

            if(data.r_ad === "Disabled" || data.ad_incoming === "Disabled" || data.ad_outgoing === "Disabled") {
                let adAlreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.ad_system_already_disabled[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [adAlreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let adOffEmbed = new MessageEmbed()
            .setColor(`BLUE`)
            .setDescription(`\`${message.author.username}\`, ${lang.adoff[langs]}`)
            .setTimestamp()
            message.reply({ embeds: [adOffEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.r_ad = "Disabled"
            data.ad_incoming = "Disabled"
            data.ad_outgoing = "Disabled"
            data.save()
        } else if (args[0] === "timeTicketDelete") {

            if (isNaN(args[1])) {
                let provideNumber = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_time_number[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [provideNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            if (args[1] < 1800000 || args[1] > 86400000) {
                let errorTime = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.provide_min_max[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorTime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            if (args[1] === "Infinity") {
                let errorInf = new MessageEmbed()
                .setColor(`#FF0000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
          }
    
            if (args[1] === data.timeTicketDelete) {
                let timeDeleteAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.timeticketdelete_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [timeDeleteAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let setTimeTicket = new MessageEmbed()
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.set_time_deleteTicket[langs]} \`${parseInt(args[1])}\``)
            message.reply({ embeds: [setTimeTicket], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.timeTicketDelete = parseInt(args[1])
            data.save()
        } else if(args[0] === "warns") {

            let provideWarns = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_warns[langs]}`)
            .setTimestamp()
            if (isNaN(args[1]) || args[1] < 1 || args[1] > 40) return message.reply({ embeds: [provideWarns], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            if (args[1] === "Infinity") {
                let errorInf = new MessageEmbed()
                .setColor(`#FF0000`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            let alreadyWarns = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.already_warns[langs]}`)
            .setTimestamp()
            if (data.warns === parseInt(args[1])) return message.reply({ embeds: [alreadyWarns], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            let setWarns = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.set_warns_now[langs]} \`${parseInt(args[1])}\``)
            message.reply({ embeds: [setWarns], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.warns = parseInt(args[1])
            data.save()
        } else if(args[0] === "warnPunish") {

            let noPunish = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.set_warnPunish[langs]}`)
            .setTimestamp()
            if(args[1] != "kick" && args[1] != "ban") return message.reply({ embeds: [noPunish], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
            if(args[1] === "kick") {

                let kickAlready = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.kick_already[langs]}`)
                .setTimestamp()
                if (data.warnPunish === "kick") return message.reply({ embeds: [kickAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
                let kickSet = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.kick_set[langs]}`)
                message.reply({ embeds: [kickSet], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.warnPunish = "kick"
                data.save()
            } else if(args[1] === "ban") {
    
              let banAlready = new MessageEmbed()
              .setColor(`RED`)
              .setTitle(`${lang.title_error[langs]}`)
              .setDescription(`\`${message.author.username}\`, ${lang.ban_already[langs]}`)
              .setTimestamp()
              if (data.warnPunish === "ban") return message.reply({ embeds: [banAlready], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
              let banSet = new MessageEmbed()
              .setColor(`GREEN`)
              .setTitle(`${lang.successfull[langs]}`)
              .setDescription(`\`${message.author.username}\`, ${lang.ban_set[langs]}`)
              message.reply({ embeds: [banSet], allowedMentions: { repliedUser: false }, failIfNotExists: false })
              data.warnPunish = "ban"
              data.save()
            }
        } else if(args[0] === "messageDelete") {

            let provideOnOrOff = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.provide_on_off[langs]}`)
            .setTimestamp()
            if(args[1] !== `on` && args[1] !== `off`) return message.reply({ embeds: [provideOnOrOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })
  
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_message_delete_already[langs]}`)
                .setTimestamp()
                if (data.deleteMessage === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
                let enabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_message_delete_on[langs]}`)
                .setTimestamp()
                message.reply({ embeds: [enabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.deleteMessage = true
                data.save()
             } else if(args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_message_delete_off[langs]}`)
                .setTimestamp()
                if (data.deleteMessage === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
                let disabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.set_message_delete_off_already[langs]}`)
                .setTimestamp()
                message.reply({ embeds: [disabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.deleteMessage = false
                data.save()
            }
        }
        } catch (e) {
            console.log(e)
        }
    }
}
