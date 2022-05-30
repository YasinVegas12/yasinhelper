const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "supportrole",
    description: "Добавить/посмотреть/удалить роли агентов поддержки",
    description_en: "Add/view/delete support roles",
    description_ua: "Додати/переглянути/видалити ролі агентів підтримки",
    usage: "supportrole [add/remove/list] [role]",
    example: "/supportrole add 817527112620965898 - добавить роль агента поддержки по айди\n/supportrole remove <@&817527112620965898> - удалить роль агента поддержки, упомянув роль",
    example_en: "/supportrole add 817527112620965898 - add a support role by ID\n/supportrole remove <@&817527112620965898> - remove the support role by mentioning the role",
    example_ua: "/supportrole add 817527112620965898 - додати роль агента підтримки по айді\n/supportrole remove <@&817527112620965898> - видалити роль агента підтримки, вказав роль",
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
        .setDescription(`\`${message.author.username}\`, ${lang.supportrole_provide_args[langs]}`)
        .setTimestamp()

        if (type != "add" && args[0] != "remove" && args[0] != "list" && args[0] != "clear") return message.reply({ embeds: [warningArgument], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (type === "add") {
            let rrole = args[1]

            let role = message.guild.roles.cache.find(r => r.name === rrole) || message.guild.roles.cache.find(r => r.id === rrole) || message.mentions.roles.first();

            let roleNameIsNotDefined = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.buy_role_notcreate[langs]}`)
            .setTimestamp()
            if (!role) return message.reply({ embeds: [roleNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            if (role.name === "@everyone") {
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
            
            let data = await Guild.findOne({
                guildID: message.guild.id,
                supportrole: role.id
            });

            if (dat.prime === false && dat.supportrole.length >= 5) {
                let noPrimeLength = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.no_prime_length[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [noPrimeLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            } else if (dat.prime === true && dat.supportrole.length === 10) {
                let primeLength = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.prime_length[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [primeLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
    
            if (!data) {
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    $push: {
                        supportrole: role.id
                    }
                });

                let roleAdded = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_added[langs]} ${role}`)
                .setTimestamp()
                return message.reply({ embeds: [roleAdded], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            } else {
                let channelAlreadyAdd = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_added_already[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [channelAlreadyAdd], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        } else if (type === "remove") {
            let rrole = args[1]

            let role = message.guild.roles.cache.find(r => r.name === rrole) || message.guild.roles.cache.find(r => r.id === rrole) || message.mentions.roles.first();

            let roleNameIsNotDefined = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.buy_role_notcreate[langs]}`)
            .setTimestamp()
            if (!role) return message.reply({ embeds: [roleNameIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let data = await Guild.findOne({
                guildID: message.guild.id,
                supportrole: role.id
            });

            if (!data) {
                let roleUndefined = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_remove_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleUndefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            } else {
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    $pull: {
                        supportrole: role.id
                    }
                });

                let roleRemoved = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.role_removed[langs]} ${role}`)
                .setTimestamp()
                return message.reply({ embeds: [roleRemoved], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        } else if (type === "list") {
            let rolesList = dat.supportrole

            let support_roles = message.guild.roles.cache.filter(r => rolesList.includes(r.id))

            let roles = support_roles.sort((a, b) => b.position - a.position).map(role => role.toString()) 

            let embedInfo = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${lang.supportrole_title[langs]} [${roles.length}]`)
            .setDescription(`${roles}`)
            if (roles.length === 0) embedInfo.description = `${lang.supportroles_no[langs]}`
            message.reply({ embeds: [embedInfo], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } else if (type === "clear") {
            let rolesList = dat.supportrole

            let rolesLength = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.supportrole_zero[langs]}`)
            .setTimestamp()
            if (rolesList.length === 0) return message.reply({ embeds: [rolesLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            let embedInfo = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.supportrole_obnul[langs]}`)
            .setTimestamp()
            message.reply({ embeds: [embedInfo], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            rolesList.length = 0

            await Guild.findOneAndUpdate({
                guildID: message.guild.id
            }, {
                $set: {
                  supportrole: rolesList
                } 
            });
        }
    } catch (e) {
        console.log(e)
    }
}
}