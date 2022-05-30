const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const Guild = require("../../structures/GuildSchema.js");

module.exports = {
    name: "embsend",
    module: "embed",
    description: "Отправить эмбед",
    description_en: "Send Embed",
    description_ua: "Відправити ембед",
    usage: "embsend",
    example: "/embsend",
    example_en: "/embsend",
    example_ua: "/embsend",
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
        if (data.embed.author != "не указано" && data.embed.authorImage == "не указано") embed.setAuthor({ name: data.embed.author });
        if (data.embed.authorImage != "не указано" && data.embed.author != "не указано") embed.setAuthor({ name: data.embed.author, iconURL: data.embed.authorImage });
        if (data.embed.title != "не указано") embed.setTitle(data.embed.title);
        if (data.embed.description != "не указано") embed.setDescription(data.embed.description);
        if (data.embed.color != "не указано") embed.setColor(data.embed.color);
        if(data.efield.setembed_fields_zero != "нет") {
            embed.addField(data.efield.setembed_fields_zero.split(`<=+=>`)[0], data.efield.setembed_fields_zero.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_one != "нет") {
            embed.addField(data.efield.setembed_fields_one.split(`<=+=>`)[0], data.efield.setembed_fields_one.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_two != "нет") {
            embed.addField(data.efield.setembed_fields_two.split(`<=+=>`)[0], data.efield.setembed_fields_two.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_three != "нет") {
            embed.addField(data.efield.setembed_fields_three.split(`<=+=>`)[0], data.efield.setembed_fields_three.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_four != "нет") {
            embed.addField(data.efield.setembed_fields_four.split(`<=+=>`)[0], data.efield.setembed_fields_four.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_five != "нет") {
            embed.addField(data.efield.setembed_fields_five.split(`<=+=>`)[0], data.efield.setembed_fields_five.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_six != "нет") {
            embed.addField(data.efield.setembed_fields_six.split(`<=+=>`)[0], data.efield.setembed_fields_six.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_seven != "нет") {
            embed.addField(data.efield.setembed_fields_seven.split(`<=+=>`)[0], data.efield.setembed_fields_seven.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_eigth != "нет") {
            embed.addField(data.efield.setembed_fields_eigth.split(`<=+=>`)[0], data.efield.setembed_fields_eigth.split(`<=+=>`)[1]);
        }
        if(data.efield.setembed_fields_nine != "нет") {
            embed.addField(data.efield.setembed_fields_nine.split(`<=+=>`)[0], data.efield.setembed_fields_nine.split(`<=+=>`)[1]);
        }
        if (data.embed.image != "не указано") embed.setImage(data.embed.image);
        if (data.embed.footer != "не указано" && data.embed.footerImage == "не указано") embed.setFooter({ text: data.embed.footer });
        if (data.embed.footerImage != "не указано" && data.embed.footer != "не указано") embed.setFooter({ text: data.embed.footer, iconURL: data.embed.footerImage });
        if (data.embed.timestamp != "не указано") embed.setTimestamp();
        message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false }).catch(err => {
            return message.channel.send({ content: `Error. Use \`${prefix}embclear\``, allowedMentions: { repliedUser: false }, failIfNotExists: false })
        });
        } catch (e) {
            console.log(e)
        }
    }
}