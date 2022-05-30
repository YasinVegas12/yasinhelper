const { MessageEmbed } = require('discord.js');
const Shop = require("../../structures/ShopSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "shop-list",
    aliases: ["slist", "shoplist"],
    module: "economy",
    description: "Посмотреть список ролей в магазине сервера",
    description_en: "View the list of roles in the server store",
    description_ua: "Переглянути список ролей в магазині сервера",
    usage: "shop-list",
    example: "/shop-list",
    example_en: "/shop-list",
    example_ua: "/shop-list",
  async run(client,message,args,langs,prefix) {

    try {

        let tovar = await Shop.find({
            guildID: message.guild.id
        });

        if(args[0] !== `global` && args[0] !== `server`) {
            let errorMessage = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.shop_list_help[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorMessage], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[0] == `global`) {
            let globalEmbed = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${message.author.username}, ${lang.shop_list_title_global[langs]}`)
            .setDescription(`\`1)\` ${lang.shop_list_global_one[langs]} \`1.000.000\`\n\`2)\` 1 ${lang.shop_list_global_two[langs]} \`250.000\`\n\`3)\` 1 ${lang.shop_list_global_three[langs]} \`30.000\`\n\`4)\` 1 ${lang.shoplist_worms[langs]} \`10.000\``)
            .setTimestamp()
            message.reply({ embeds: [globalEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }else if(args[0] == `server`) {
            let shopEmbed = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${lang.shop_list_server_title[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.shop_list_server_description[langs]} \`${prefix}buy\``)
            .setTimestamp()
            if(tovar.length === 0) shopEmbed.description += `\n\n${lang.buy_server_clear[langs]}`
            tovar.forEach(u => shopEmbed.addField(`${u.roleName} (${u.roleID}) — ${u.price}`, `${u.description}`))
            message.reply({ embeds: [shopEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
        } catch (e) {
            console.log(e)
        }
    }
}