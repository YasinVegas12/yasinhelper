const { MessageEmbed } = require('discord.js');
const Promo = require("../../structures/PromocodeSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "mypromocode",
    aliases: ["mypromo"],
    module: "economy",
    description: "Посмотреть статистику своего промокода, либо же чужого",
    description_en: "View the statistics of your promo code, or someone else's",
    description_ua: "Переглянути статистику свого промокода, або чужого",
    usage: "mypromocode",
    example: "/mypromocode - посмотреть статистику своего промокода\n/mypromocode #jk - посмотреть статистику промокода #jk",
    example_en: "/mypromocode - view the statistics of your promo code\n/mypromocode #jk - view the statistics promo code #jk",
    example_ua: "/mypromocode - переглянути статистику свого промокода\n/mypromocode #jk - переглянути статистику промокода #jk",
  async run(client,message,args,langs,prefix) {

    try {

        let dat = await Promo.findOne({
            guildID: message.guild.id,
            ownerpromoID: message.author.id
        });

        if (!dat) {
            let errorMess = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`${lang.mypromocode_nocreate[langs]} \`${prefix}createpromocode\``)
            .setTimestamp()
            return message.reply({ embeds: [errorMess], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(!args[0]) {
            let embed = new MessageEmbed()
            .setColor(`#03fc2c`)
            .setTitle(`${lang.mypromocode_title[langs]} \`${message.author.username}\``)
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
            .addField(`${lang.mypromocode_field_one[langs]}`, `${lang.mypromocode_field_two[langs]} \`${dat.promocode}\`\n${lang.mypromocode_field_tree[langs]} \`${dat.lvlpromo}\`\n${lang.mypromocode_field_four[langs]} \`${dat.usepromo}\``)
            .setThumbnail(message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } else {
             await Promo.findOne({ guildID: message.guild.id, promocode: args[0] }, async (err,promocode) => {
                  if(!promocode) {
                      let promoUndefinedEmbed = new MessageEmbed()
                      .setColor(`RED`)
                      .setTitle(`${lang.title_error[langs]}`)
                      .setDescription(`\`${message.author.username}\`, ${lang.mypromocode_undefined[langs]} \`${args[0]}\` **${lang.mypromocode_undefined_title[langs]}**`)
                      .setTimestamp()
                      return message.reply({ embeds: [promoUndefinedEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                  }

                  let name = await client.users.fetch(promocode.ownerpromoID).tag || "Unknown"

                  let promoEmbed = new MessageEmbed()
                  .setColor(`#03fc2c`)
                  .setTitle(`${lang.mypromocode_title[langs]} \`${name}\``)
                  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                  .addField(`${lang.mypromocode_field_one[langs]}`, `${lang.mypromocode_field_two[langs]} \`${promocode.promocode}\`\n${lang.mypromocode_field_tree[langs]} \`${promocode.lvlpromo}\`\n${lang.mypromocode_field_four[langs]} \`${promocode.usepromo}\``)
                  .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))
                  .setFooter({ text: `${lang.footer_text[langs]} ${message.member.displayName}`, iconURL: message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
                  message.reply({ embeds: [promoEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
              })
            }
        } catch (e) {
            console.log(e)
        }
    }
}