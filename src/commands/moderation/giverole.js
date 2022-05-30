const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "giverole",
    module: "moderation",
    description: "Выдать роль пользователю",
    description_en: "Give a role to a user",
    description_ua: "Видати роль користувачу",
    usage: "giverole [user ID/@mention] [name/id/@mention role]",
    example: "/giverole 608684992335446064 Support Team - выдать пользователю роль Support Team",
    example_en: "/giverole 608684992335446064 Support Team - give the user the Support Team role",
    example_ua: "/giverole 608684992335446064 Support Team - видати користувачу роль Support Team",
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_persmission[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_ROLES")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let noPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_permissions[langs]} \`MANAGE_ROLES\``)
        .setTimestamp() 
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let rMember = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[0]) || message.guild.members.cache.get(args[0]);

        let warningUser = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_how[langs]} \`${prefix}giverole [@user] [${lang.role[langs]}]\``)
        .setTimestamp()
        if (!rMember) return message.reply({ embeds: [warningUser], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let role = message.guild.roles.cache.find(r => r.name === args.slice(1).join(" ")) || message.guild.roles.cache.find(r => r.id == args.slice(1).join(" ")) || message.mentions.roles.first();

        let noRole = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_provide_role[langs]} \`${prefix}giverole [@user] [${lang.role[langs]}]\``)
        .setTimestamp()
        if (!role) return message.reply({ embeds: [noRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let noGivenRole = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_position[langs]}`)
        .setTimestamp() 
        if (role.position >= message.member.roles.highest.position) return message.reply({ embeds: [noGivenRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let myRoleIsBelow = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.giverole_bot_position[langs]}`)
        .setTimestamp() 
        if (role.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [myRoleIsBelow], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(rMember.roles.cache.has(role.id)) {
            let roleIsGiven = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.giverole_yes[langs]}`)
            .setTimestamp() 
            return message.reply({ embeds: [roleIsGiven], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } else {
           rMember.roles.add(role.id).catch(err => {});
           const embed = new MessageEmbed()
           .setColor("#483D8B")
           .setDescription(`:white_check_mark: **${lang.moderator[langs]}** <@${message.author.id}> **${lang.mod_give_role[langs]}** \`${role.name}\` **${lang.mod_give_user[langs]}** <@${rMember.id}>`)
           message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
        } catch (e) {
            console.log(e)
        }
    }
}