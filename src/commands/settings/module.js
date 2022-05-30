const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "module",
    description: "Включить или выключить определенный модуль",
    description_en: "Enable or disable a specific module",
    description_en: "Ввімкнути або вимкнути певний модуль",
    usage: "module [module] [on/off]",
    example: "/module economy off - Выключить модуль экономики",
    example_en: "/module economy off - Disable the economy module",
    example_ua: "/module economy off - Вимкнути модуль економіки",
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

        let howEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.module_how[langs]} \`${prefix}help\``)
        .setTimestamp()
        if (args[0] !== 'ad' && args[0] !== `economy` && args[0] !== 'fun' && args[0] !== `info` && args[0] !== `moderation` && args[0] !== `nsfw` && args[0] !== `ticket` && args[0] !== `user` && args[0] !== `embed`) return message.reply({ embeds: [howEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let onAndOff = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.module_on_off[langs]}`)
        .setTimestamp()
        if(args[1] !== `on` && args[1] !== `off`) return message.reply({ embeds: [onAndOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(args[0] == `ad`) {
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.ad === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let adEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`ad\``)
                .setTimestamp()
                message.reply({ embeds: [adEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.ad = true
                data.commands.accept = true
                data.commands.ad = true
                data.commands.deny = true
                data.commands.editad = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.ad === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let adDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`ad\``)
                .setTimestamp()
                message.reply({ embeds: [adDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.ad = false
                data.commands.accept = false
                data.commands.ad = false
                data.commands.deny = false
                data.commands.editad = false
                data.save()
            }
        } else if (args[0] === "economy") {
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.economy === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let economyEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`economy\``)
                .setTimestamp()
                message.reply({ embeds: [economyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.economy = true
                data.commands.addshop = true
                data.commands.bonus = true
                data.commands.box = true
                data.commands.buy = true
                data.commands.coinleaders = true
                data.commands.createpromocode = true
                data.commands.dellshop = true
                data.commands.editshop = true
                data.commands.fullobnul = true
                data.commands.game = true
                data.commands.jobs = true
                data.commands.mypromocode = true
                data.commands.pay = true
                data.commands.promoleaders = true
                data.commands.promocode = true
                data.commands.setmoney = true
                data.commands.shoplist = true
                data.commands.try = true
                data.commands.work = true
                data.commands.works = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.economy === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let economyDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`economy\``)
                .setTimestamp()
                message.reply({ embeds: [economyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.economy = false
                data.commands.addshop = false
                data.commands.bonus = false
                data.commands.box = false
                data.commands.buy = false
                data.commands.coinleaders = false
                data.commands.createpromocode = false
                data.commands.dellshop = false
                data.commands.editshop = false
                data.commands.fullobnul = false
                data.commands.game = false
                data.commands.jobs = false
                data.commands.mypromocode = false
                data.commands.pay = false
                data.commands.promoleaders = false
                data.commands.promocode = false
                data.commands.setmoney = false
                data.commands.shoplist = false
                data.commands.try = false
                data.commands.work = false
                data.commands.works = false
                data.save()
            }
        } else if (args[0] === "fun") {
            if(args[0] === "on") {
                
                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.fun === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let funEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`fun\``)
                .setTimestamp()
                message.reply({ embeds: [funEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.fun = true
                data.commands.ball = true
                data.commands.kn = true
                data.commands.reverse = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.fun === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let funDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`fun\``)
                .setTimestamp()
                message.reply({ embeds: [funDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.fun = false
                data.commands.ball = false
                data.commands.kn = false
                data.commands.reverse = false
                data.save()
            }
        } else if (args[0] === "info") {
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.info === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let infoEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`info\``)
                .setTimestamp()
                message.reply({ embeds: [infoEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.info = true
                data.commands.link = true
                data.commands.ping = true
                data.commands.prime = true
                data.commands.profile = true
                data.commands.stats = true
                data.commands.vote = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.info === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let infoDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`info\``)
                .setTimestamp()
                message.reply({ embeds: [infoDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.info = false
                data.commands.link = false
                data.commands.ping = false
                data.commands.prime = false
                data.commands.profile = false
                data.commands.stats = false
                data.commands.vote = false
                data.save()
            }
        } else if (args[0] === "moderation") {
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.moderation === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let moderationEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`moderation\``)
                .setTimestamp()
                message.reply({ embeds: [moderationEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.moderation = true
                data.commands.ban = true
                data.commands.chat = true
                data.commands.check = true
                data.commands.clear = true
                data.commands.edit = true
                data.commands.giverole = true
                data.commands.history = true
                data.commands.kick = true
                data.commands.msg = true
                data.commands.mutelist = true
                data.commands.mute = true
                data.commands.myinfo = true
                data.commands.pin = true
                data.commands.removerole = true
                data.commands.setstat = true
                data.commands.unban = true
                data.commands.unmute = true
                data.commands.unpin = true
                data.commands.unwarn = true
                data.commands.warn = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.moderation === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let moderationDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`moderation\``)
                .setTimestamp()
                message.reply({ embeds: [moderationDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.moderation = false
                data.commands.ban = false
                data.commands.chat = false
                data.commands.check = false
                data.commands.clear = false
                data.commands.edit = false
                data.commands.giverole = false
                data.commands.history = false
                data.commands.kick = false
                data.commands.msg = false
                data.commands.mutelist = false
                data.commands.mute = false
                data.commands.myinfo = false
                data.commands.pin = false
                data.commands.removerole = false
                data.commands.setstat = false
                data.commands.unban = false
                data.commands.unmute = false
                data.commands.unpin = false
                data.commands.unwarn = false
                data.commands.warn = false
                data.save()
            }
        } else if (args[0] === "nsfw") {
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.nsfw === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let NSFWEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`NSFW\``)
                .setTimestamp()
                message.reply({ embeds: [NSFWEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.nsfw = true
                data.commands.fourk = true
                data.commands.anal = true
                data.commands.ass = true
                data.commands.gif = true
                data.commands.gonewild = true
                data.commands.hanal = true
                data.commands.hass = true
                data.commands.hentai = true
                data.commands.hmidriff = true
                data.commands.holo = true
                data.commands.pussy = true
                data.commands.solo = true
                data.commands.thigh = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.nsfw === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let NSFWDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`NSFW\``)
                .setTimestamp()
                message.reply({ embeds: [NSFWDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.nsfw = false
                data.commands.fourk = false
                data.commands.anal = false
                data.commands.ass = false
                data.commands.gif = false
                data.commands.gonewild = false
                data.commands.hanal = false
                data.commands.hass = false
                data.commands.hentai = false
                data.commands.hmidriff = false
                data.commands.holo = false
                data.commands.porn = false
                data.commands.pussy = false
                data.commands.solo = false
                data.commands.thigh = false
                data.save()
            }
        } else if (args[0] === "ticket") {
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.ticket === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let ticketEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`ticket\``)
                .setTimestamp()
                message.reply({ embeds: [ticketEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.ticket = true
                data.commands.active = true
                data.commands.blocksupport = true
                data.commands.close = true
                data.commands.hold = true
                data.commands.removeblocksupport = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.ticket === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let ticketDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`ticket\``)
                .setTimestamp()
                message.reply({ embeds: [ticketDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.ticket = false
                data.commands.active = false
                data.commands.blocksupport = false
                data.commands.close = false
                data.commands.hold = false
                data.commands.removeblocksupport = false
                data.save()
            }
        } else if (args[0] === "user") {
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.user === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let userEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`user\``)
                .setTimestamp()
                message.reply({ embeds: [userEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.user = true
                data.commands.avatar = true
                data.commands.user = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.user === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let userDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`user\``)
                .setTimestamp()
                message.reply({ embeds: [userDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.user = false
                data.commands.avatar = false
                data.commands.user = false
                data.save()
            }
        } else if (args[0] === "embed") {
            if(args[1] === "on") {

                let alreadyEnabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_enabled[langs]}`)
                .setTimestamp()
                if(data.modules.embed === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let embedEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_enabled[langs]} \`embed\``)
                .setTimestamp()
                message.reply({ embeds: [embedEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.embed = true
                data.commands.embclear = true
                data.commands.embfield = true
                data.commands.embsend = true
                data.commands.embsetup = true
                data.save()
            } else if (args[1] === "off") {

                let alreadyDisabled = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_already_disabled[langs]}`)
                .setTimestamp()
                if(data.modules.embed === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let embedDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.module_disable[langs]} \`embed\``)
                .setTimestamp()
                message.reply({ embeds: [embedDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.modules.embed = false
                data.commands.embclear = false
                data.commands.embfield = false
                data.commands.embsend = false
                data.commands.embsetup = false
                data.save()
            }
        }
        } catch (e) {
            console.log(e)
        }
    }
}