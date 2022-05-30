const { MessageEmbed } = require('discord.js');
const Shop = require("../../structures/ShopSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "edit-shop",
    aliases: ["eshop", "editshop"],
    module: "economy",
    description: "Отредактировать роль в магазине",
    description_en: "Edit a role in the store",
    description_ua: "Відредагувати роль в магазині",
    usage: "edit-shop [role ID] [1-3] [new parametr]",
    example: "/edit-shop 843141603300081684 1 843148413300081684 - Изменить айди роли в магазине",
    example_en: "/edit-shop 843141603300081684 1 843148413300081684 - Change the ID role in the store",
    example_ua: "/edit-shop 843141603300081684 1 843148413300081684 - Змінити айді ролі в магазині",
  async run(client,message,args,langs,prefix,ownerTAG,supportrole,warns,prime) {

    try {

        const developer = [
            config.developer,
        ];

        if(!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) {
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

        let role = args[0]

        if(!role) {
            let errorMsg = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_role[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorMsg], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(isNaN(role)) {
            let errorID = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.dell_shop_role_isNan[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorID], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let tRole = await Shop.findOne({
            roleID: role,
            guildID: message.guild.id
        });

        if(!tRole) {
            let noRole = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.edit_role_shop_nodb[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [noRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[1] != `1` && args[1] != `2` && args[1] != `3`) {
            let errorMsg = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_args_one[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorMsg], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[1] == `1`) {
            if(!args[2]) {
                let errorRole = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_role_args_two[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let role = message.guild.roles.cache.find(r => r.name === args[2]) || message.guild.roles.cache.find(r => r.id == args[2]) || message.mentions.roles.first();

            if(!role) {
                let noRole = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_role_undefined[langs]}`)
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

            let hasrole = await Shop.findOne({
                roleID: role.id,
                guildID: message.guild.id
            })

            if(hasrole) {
                let hasRoleEmbed = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_role_has[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [hasRoleEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let roleChange = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.edit_role_successfully[langs]}\n${lang.edit_role_args_one[langs]} \`${role.name}\`\n${lang.edit_role_args_two[langs]} <@&${role.id}>`)
            .setTimestamp()
            message.reply({ embeds: [roleChange], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            await Shop.updateMany(tRole, {
                roleName: role.name,
                roleID: role.id
            });
        }else if(args[1] == `2`) {
            if(!args[2]) {
                let errorPrice = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_price_none[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorPrice], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(isNaN(args[2])) { 
                let errorPrice = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_price_isNan[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorPrice], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        
            if(args[2].includes(`+`,`-`)) {
                let wrongSymbol = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.wrong_symbol[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [wrongSymbol], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
        
            if(args[2]> 99999999999 || args[2] < 1) {
                let smallOrBig = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.smallorbig[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [smallOrBig], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(args[2] == tRole.price) {
                let hasPrice = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_price_has[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [hasPrice], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let newPrice = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_change_price[langs]}\n${lang.edit_shop_new_role[langs]} \`${parseInt(args[2])}\``)
            .setTimestamp()
            message.reply({ embeds: [newPrice], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            await Shop.updateMany(tRole, {
                price: parseInt(args[2])
            });
        }else if(args[1] == `3`) {
            let descriptionRole = args.slice(2).join(" ");

            if(!descriptionRole) {
                let noDescription = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_args_two[langs]}`)
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

            if(descriptionRole == tRole.description) {
                let hasDescription = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_description_has[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [hasDescription], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let changeDescription = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.edit_shop_description_change[langs]}\n${lang.edit_shop_description_new[langs]} \`${descriptionRole}\``)
            .setTimestamp()
            message.reply({ embeds: [changeDescription], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            await Shop.updateMany(tRole, {
                description: descriptionRole
            });
        }
        } catch (e) {
            console.log(e)
        }
    }
}