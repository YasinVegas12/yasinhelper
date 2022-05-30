const { MessageEmbed } = require('discord.js');
const Shop = require("../../structures/ShopSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "dell-shop",
    aliases: ["dshop", "dellshop"],
    module: "economy",
    description: "Удалить роль с магазина",
    description_en: "Delete a role from the store",
    description_ua: "Видалити роль з магазина",
    usage: "delete-shop [role ID]",
    example: "/delete-shop 843141603300081684 - Удалить роль с магазина",
    example_en: "/delete-shop 843141603300081684 - Delete a role from the store",
    example_ua: "/delete-shop 843141603300081684 - Видалити роль з магазина",
  async run(client,message,args,langs,prefix) {

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

        let role = args[0]

        if(!role) {
            let errorMsg = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.dell_shop_role[langs]}`)
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

        let roleDelete = await Shop.findOne({
            roleID: role,
            guildID: message.guild.id
        });

        if (!roleDelete) {
            let roleUndefined = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.dell_shop_role_undefined[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [roleUndefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let deleteRole = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.dell_shop_successfully[langs]}\n${lang.information_about_deleted_role[langs]}\n${lang.information_about_deleted_role_name[langs]} \`${roleDelete.roleName}\`\n${lang.add_shop_role_id[langs]} <@&${roleDelete.roleID}>\n${lang.add_shop_prices[langs]} \`${roleDelete.price}\`\n${lang.add_shop_descriptions[langs]} \`${roleDelete.description}\``)
        .setTimestamp()
        message.reply({ embeds: [deleteRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        await Shop.deleteOne({
            roleID: role,
            guildID: message.guild.id
        });
        } catch (e) {
            console.log(e)
        }
    }
}