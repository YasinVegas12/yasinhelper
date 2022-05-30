const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const Guild = require("../../structures/GuildSchema.js");

module.exports = {
    name: "embclear",
    module: "embed",
    description: "Очистить эмбед",
    description_en: "Clear Embed",
    description_ua: "Очистити ембед",
    usage: "embclear",
    example: "/embclear",
    example_en: "/embclear",
    example_ua: "/embclear",
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

        let embed = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.embclear_title[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.embclear_description[langs]}.`)
        .setTimestamp()
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        data.embed.color = "не указано"
        data.embed.title = "не указано"
        data.embed.description = "не указано"
        data.embed.timestamp = "не указано"
        data.embed.image = "не указано"
        data.embed.footer = "не указано"
        data.embed.footerImage = "не указано"
        data.efield.setembed_fields_zero = "нет"
        data.efield.setembed_fields_one = "нет"
        data.efield.setembed_fields_two = "нет"
        data.efield.setembed_fields_three = "нет"
        data.efield.setembed_fields_four = "нет"
        data.efield.setembed_fields_five = "нет"
        data.efield.setembed_fields_six = "нет"
        data.efield.setembed_fields_seven = "нет"
        data.efield.setembed_fields_eigth = "нет"
        data.efield.setembed_fields_nine = "нет"
        data.efield.setembed_addline_zero = "нет"
        data.efield.setembed_addline_one = "нет"
        data.efield.setembed_addline_two = "нет"
        data.efield.setembed_addline_three = "нет"
        data.efield.setembed_addline_four = "нет"
        data.efield.setembed_addline_five = "нет"
        data.efield.setembed_addline_six = "нет"
        data.efield.setembed_addline_seven = "нет"
        data.efield.setembed_addline_eigth = "нет"
        data.efield.setembed_addline_nine = "нет"
        data.save()
        } catch (e) {
            console.log(e)
        }
    }
}