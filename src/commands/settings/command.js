const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "command",
    description: "Включить или выключить определенную команду",
    description_en: "Enable or disable a specific command",
    description_ua: "Ввімкнути або вимкнути певну команду",
    usage: "command [name]",
    example: "/command ban on - включить команду `ban`\n/command ban off - выключить команду `ban`",
    example_en: "/command  ban on - enabled command `ban`\n/command ban off - disabled command `ban`",
    example_ua: "/command ban on - ввімкнути команду `ban`\n/command ban off - вимкнути команду `ban`",
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

        let cmd = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

        function bad_commands(s) { 
            var regexp = /eval|bug|help|shards|addbadge|blacklist|createcode|message|command|module|set|setlog|settings|upload|activate/g
            return regexp.test(s);
        }

        let badCmdEmbed = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.command_system[langs]}`)
        .setTimestamp()
        if (bad_commands(args[0])) return message.reply({ embeds: [badCmdEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let cmdUndefined = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.command_not_found[langs]}`)
        .setTimestamp()
        if (!cmd) return message.reply({ embeds: [cmdUndefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideOnOrOff = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.provide_on_off_command[langs]}`)
        .setTimestamp()
        if (args[1] != `on` && args[1] != `off`) return message.reply({ embeds: [provideOnOrOff], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(args[1] === `on`) {

            if(cmd.name == "add-shop") {

                let alreadyEnabledAddShop = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.addshop === true) return message.reply({ embeds: [alreadyEnabledAddShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledAddShop = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabledAddShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.addshop = true
                data.save()
            }else if(cmd.name == "coin-leaders") {

                let alreadyEnabledCoinLeaders = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.coinleaders === true) return message.reply({ embeds: [alreadyEnabledCoinLeaders], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledCoinLeaders = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabledCoinLeaders], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.coinleaders = true
                data.save()
            }else if(cmd.name == "dell-shop") {

                let alreadyEnabledDellShop = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.dellshop === true) return message.reply({ embeds: [alreadyEnabledDellShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledDellShop = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabledDellShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.dellshop = true
                data.save()
            }else if(cmd.name == "edit-shop") {

                let alreadyEnabledEditShop = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.editshop === true) return message.reply({ embeds: [alreadyEnabledEditShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledEditShop = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [alreadyEnabledEditShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.editshop = true
                data.save()
            }else if(cmd.name == "inv-put") {

                let alreadyEnabledInvPut = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.invput === true) return message.reply({ embeds: [alreadyEnabledInvPut], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledInvPut = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabledInvPut], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.invput = true
                data.save()
            }else if(cmd.name == "inv-take") {

                let alreadyEnabledInvTake = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.invtake === true) return message.reply({ embeds: [alreadyEnabledInvTake], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledInvTake = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabledInvTake], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.invtake = true
                data.save()
            }else if(cmd.name == "promo-leaders") {

                let alreadyEnabledPromoLeaders = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.promoleaders === true) return message.reply({ embeds: [alreadyEnabledPromoLeaders], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledPromoLeaders = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabledPromoLeaders], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.promoleaders = true
                data.save()
            }else if(cmd.name == "shop-list") {

                let alreadyEnabledShopList = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.shoplist === true) return message.reply({ embeds: [alreadyEnabledShopList], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledShopList = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabledShopList], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.shoplist = true
                data.save()
            }else if(cmd.name == "4k") {

                let alreadyEnabledFourK = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands.fourk === true) return message.reply({ embeds: [alreadyEnabledFourK], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabledFourK = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabledFourK], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.fourk = true
                data.save()
            }else{

                let alreadyEnabled = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_enabled[langs]}`)
                .setTimestamp()
                if(data.commands[cmd.name] === true) return message.reply({ embeds: [alreadyEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_enabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands[cmd.name] = true
                data.save()
            }
        }else if(args[1] === "off") {

            if(cmd.name == "add-shop") {

                let alreadyDisabledAddShop = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.addshop === false) return message.reply({ embeds: [alreadyDisabledAddShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledAddShop = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledAddShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.addshop = false
                data.save()
            }else if(cmd.name == "coin-leaders") {
                
                let alreadyDisabledCoinLeaders = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.coinleaders === false) return message.reply({ embeds: [alreadyDisabledCoinLeaders], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledCoinLeaders = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledCoinLeaders], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.coinleaders = false
                data.save()
            }else if(cmd.name == "dell-shop") {

                let alreadyDisabledDellShop = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.dellshop === false) return message.reply({ embeds: [alreadyDisabledDellShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledDellShop = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledDellShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.dellshop = false
                data.save()
            }else if(cmd.name == "edit-shop") {

                let alreadyDisabledEditShop = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.editshop === false) return message.reply({ embeds: [alreadyDisabledEditShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledEditShop = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledEditShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.editshop = false
                data.save()
            }else if(cmd.name == "inv-put") {

                let alreadyDisabledInvPut = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.invput === false) return message.reply({ embeds: [alreadyDisabledInvPut], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledInvPut = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledInvPut], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.invput = false
                data.save()
            }else if(cmd.name == "inv-take") {

                let alreadyDisabledInvTake = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.invtake === false) return message.reply({ embeds: [alreadyDisabledInvTake], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledInvTake = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledInvTake], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.invtake = false
                data.save()
            }else if(cmd.name == "promo-leaders") {

                let alreadyDisabledPromoLeaders = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.promoleaders === false) return message.reply({ embeds: [alreadyDisabledPromoLeaders], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledPromoLeaders = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledPromoLeaders], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.promoleaders = false
                data.save()
            }else if(cmd.name == "shop-list") {

                let alreadyDisabledShopList = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.shoplist === false) return message.reply({ embeds: [alreadyDisabledShopList], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledShopList = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledShopList], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.shoplist = false
                data.save()
            }else if(cmd.name == "4k") {

                let alreadyDisabledFourK = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands.fourk === false) return message.reply({ embeds: [alreadyDisabledFourK], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabledFourK = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabledFourK], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands.fourk = false
                data.save()
            }else{

                let alreadyDisabled = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_already_disabled[langs]}`)
                .setTimestamp()
                if(data.commands[cmd.name] === false) return message.reply({ embeds: [alreadyDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                let commandDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.command_succesfully_disabled[langs]} \`${cmd.name}\``)
                .setTimestamp()
                message.reply({ embeds: [commandDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                data.commands[cmd.name] = false
                data.save()
            }
        }
        } catch (e) {
            console.log(e)
        }
    }
}