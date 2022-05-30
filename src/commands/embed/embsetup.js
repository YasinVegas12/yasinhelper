const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const Guild = require("../../structures/GuildSchema.js");

module.exports = {
    name: "embsetup",
    module: "embed",
    description: "Установить параметры для эмбеда",
    description_en: "Sets parameters for embed",
    description_ua: "Встановити параметр для ембеда",
    usage: "embsetup [1-9] [text]",
    example: "/embsetup 3 #FFFFFF - Установит белый цвет для эмбеда",
    example_en: "/embsetup 3 #FFFFFF - Sets the white color for embed",
    example_ua: "/embsetup 3 #FFFFFF - Встановить білий колір для ембеда",
  async run(client,message,args,langs,prefix) {

    try {

        let data = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if(!data) return;

        let warningPermission = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.embed_permissions[langs]}`)
        .setTimestamp()
        if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(!args[0]) {
            let howEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embsetup_args_zero[langs]}\n\n${lang.embsetup_args_zero_example[langs]} \`${prefix}embsetup 1 Test embed\` - ${lang.embsetup_args_zero_continue[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [howEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
        
        if(isNaN(args[0])) {
            let argsIsNumber = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embsetup_is_nan[langs]}\n\n${lang.embsetup_args_zero_example[langs]} \`${prefix}embsetup 1 Test embed\` - ${lang.embsetup_args_zero_continue[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [argsIsNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(!args[1]) {
            let isValue = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embsetup_value[langs]}\n\n${lang.embsetup_args_zero_example[langs]} \`${prefix}embsetup 1 Test embed\` - ${lang.embsetup_args_zero_continue[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [isValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let cmd_value = args.slice(1).join(" ");

        if (+args[0] == 1) {

            let errorTitle = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embsetup_title[langs]}`)
            .setTimestamp()
            if(cmd_value.length > 200) return message.reply({ embeds: [errorTitle], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let title = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_title_change[langs]} ${lang.on[langs]} '${cmd_value}'!\``)
            .setTimestamp()
            message.reply({ embeds: [title], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.embed.title = cmd_value
            data.save()
        } else if (+args[0] == 2) {

            let errorDescription = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embsetup_description[langs]}`)
            .setTimestamp()
            if(cmd_value.length > 1700) return message.reply({ embeds: [errorDescription], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let description = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_description_change[langs]} ${lang.on[langs]} '${cmd_value}'!\``)
            .setTimestamp()
            message.reply({ embeds: [description], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.embed.description = cmd_value
            data.save()
        } else if (+args[0] == 3) {

            if (!cmd_value.startsWith("#")) {
                let colorInTag = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.embsetup_color_tag[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [colorInTag], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let errorColor = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.embsetup_color[langs]}`)
            .setTimestamp()
            if(cmd_value.length > 15) return message.reply({ embeds: [errorColor], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let color = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_color_change[langs]} '${data.embed.color}' ${lang.on[langs]} '${cmd_value}'!\``)
            .setTimestamp()
            message.reply({ embeds: [color], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.embed.color = cmd_value
            data.save()
        } else if (+args[0] == 4) {

            if (cmd_value != "включено" && cmd_value != "не указано" && cmd_value != "enabled" && cmd_value != "not provided") {
                let timeIsWrong = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.embsetup_time_wrong[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [timeIsWrong], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(cmd_value == "включено" || cmd_value == "enabled") {

                let timeEnabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_time[langs]} '${data.embed.timestamp}' ${lang.on[langs]} '${lang.enabled[langs]}'!\``)
                .setTimestamp()
                data.embed.timestamp = "включено"
                data.save()
                return message.reply({ embeds: [timeEnabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }else if(cmd_value == "не указано" || cmd_value == "not provided") {

                let timeDisabled = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_time[langs]} '${data.embed.timestamp}' ${lang.on[langs]} '${lang.disabled[langs]}'!\``)
                .setTimestamp()
                data.embed.timestamp = "не указано"
                data.save()
                return message.reply({ embeds: [timeDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        } else if (+args[0] == 5) {

            let errorValue = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_value[langs]}`)
            .setTimestamp()
            if(cmd_value.length > 250) return message.reply({ embeds: [errorValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let image = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_image[langs]} '${data.embed.image}' ${lang.on[langs]} '${cmd_value}'!\``)
            .setTimestamp()
            message.reply({ embeds: [image], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.embed.image = cmd_value
            data.save()
        } else if (+args[0] == 6) {

            let errorValue = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_value_footer[langs]}`)
            .setTimestamp()
            if(cmd_value.length > 80) return message.reply({ embeds: [errorValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let footer = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_footer[langs]} '${data.embed.footer}' ${lang.on[langs]} '${cmd_value}'!\``)
            .setTimestamp()
            message.reply({ embeds: [footer], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.embed.footer = cmd_value
            data.save()
        } else if (+args[0] == 7) {

            let errorValue = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_value[langs]}`)
            .setTimestamp()
            if(cmd_value.length > 250) return message.reply({ embeds: [errorValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let footerImage = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_footerImage[langs]} '${data.embed.footerImage}' ${lang.on[langs]} '${cmd_value}'!\``)
            .setTimestamp()
            message.reply({ embeds: [footerImage], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.embed.footerImage = cmd_value
            data.save()
        }
        else if (+args[0] == 8) {

            let errorValue = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.author_set[langs]}`)
            .setTimestamp()
            if(cmd_value.length > 1000) return message.reply({ embeds: [errorValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let footerImage = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.author_edit[langs]} '${data.embed.avatar}' ${lang.on[langs]} '${cmd_value}'!\``)
            .setTimestamp()
            message.reply({ embeds: [footerImage], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.embed.avatar = cmd_value
            data.save()
        }
        else if (+args[0] == 9) {

            let errorValue = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_value_footer[langs]}`)
            .setTimestamp()
            if(cmd_value.length > 80) return message.reply({ embeds: [errorValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let footerImage = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, \`${lang.embsetup_footerImage[langs]} '${data.embed.authorImage}' ${lang.on[langs]} '${cmd_value}'!\``)
            .setTimestamp()
            message.reply({ embeds: [footerImage], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            data.embed.authorImage = cmd_value
            data.save()
        }
        } catch (e) {
            console.log(e)
        }
    }
}