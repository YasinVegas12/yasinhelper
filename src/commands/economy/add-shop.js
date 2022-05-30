const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const Shop = require("../../structures/ShopSchema.js");
const config = require("../../config.json");

module.exports = {
    name: "add-shop",
    aliases: ["ashop", "addshop"],
    module: "economy",
    description: "Добавить роль в магазин",
    description_en: "Add role to the shop",
    description_ua: "Додати роль у магазин",
    usage: "add-shop [role] [price] [description]",
    example: "/add-shop 843141603300081684 1000000 роль для богатых - Добавить роль в магазин",
    example_en: "/add-shop 843141603300081684 1000000 a role for the rich - Add role to the shop",
    example_ua: "/add-shop 843141603300081684 1000000 роль для крутих - Додати роль у магазин",
  async run(client,message,args,langs,prefix,ownerTAG,supportrole,warns,prime) {

    try {

        const developer = [
            config.developer,
        ];

        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) {
            let warningPermission = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.module_permissions[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let totalRoles = await Shop.find({
            guildID: message.guild.id
        });

        if(prime === false) {
            if(totalRoles.length > 15) {
                let errorRoles = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.shop_server_prime[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorRoles], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        }

        let role = message.guild.roles.cache.find(r => r.name === args[0]) || message.guild.roles.cache.find(r => r.id == args[0]) || message.mentions.roles.first();

        if(!role) {
            let noRole = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.add_shop_role[langs]} \`${prefix}add-shop [${lang.add_shop_args_zero[langs]}] [${lang.add_shop_args_one[langs]}] [${lang.add_shop_args_two[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [noRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(role.name === "@everyone") {
            let roleEveryone = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.set_role_everyone[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [roleEveryone], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(role.managed) {
            let roleManaged = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.role_managed[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [roleManaged], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(role.position >= message.guild.me.roles.highest.position) {
            let errorPosition = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.add_shop_bot_role[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorPosition], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(isNaN(args[1])) { 
            let errorPrice = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.add_shop_price[langs]} \`${prefix}add-shop [${lang.add_shop_args_zero[langs]}] [${lang.add_shop_args_one[langs]}] [${lang.add_shop_args_two[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [errorPrice], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[1].includes(`+`,`-`)) {
            let wrongSymbol = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.wrong_symbol[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [wrongSymbol], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[1] === "Infinity") {
            let errorInf = new MessageEmbed()
            .setColor(`#FF0000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_args[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorInf], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[1] > 99999999999 || args[1] < 1) {
            let smallOrBig = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.smallorbig[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [smallOrBig], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let descriptionRole = args.slice(2).join(" ");

        if(!descriptionRole) {
            let noDescription = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.add_shop_description[langs]} \`${prefix}add-shop [${lang.add_shop_args_zero[langs]}] [${lang.add_shop_args_one[langs]}] [${lang.add_shop_args_two[langs]}]\``)
            .setTimestamp()
            return message.reply({ embeds: [noDescription], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(descriptionRole.length > 100) {
            let errorLength = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.add_shop_description_length[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let roles = await Shop.findOne({
            roleID: role.id
        });

        if(roles) {
            let rolesError = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.add_shop_role_has[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [rolesError], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(prime === false) {
            if(totalRoles.length >= 15) {
                let errorPrime = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.add_shop_no_prime[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorPrime], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        }else{
            if(totalRoles.length >= 25) {
                let errorPrimeLength = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.add_shop_prime_length[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorPrimeLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        }

        await new Shop({
            roleName: role.name,
            roleID: role.id,
            price: parseInt(args[1]),
            description: descriptionRole,
            guildID: message.guild.id
        }).save()

        let createRoleShop = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.add_shop_create_role[langs]}: \n${lang.add_shop_role_name[langs]} \`${role.name}\`\n${lang.add_shop_role_id[langs]} <@&${role.id}>\n${lang.add_shop_prices[langs]} \`${parseInt(args[1])}\`\n${lang.add_shop_descriptions[langs]} \`${descriptionRole}\``)
        .setTimestamp()
        message.reply({ embeds: [createRoleShop], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } catch (e) {
            console.log(e)
        }
    }
}