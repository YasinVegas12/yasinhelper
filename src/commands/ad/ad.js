const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const Ad = require("../../structures/AdSchema.js");
const AdSchema = require("../../structures/AdGuildSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "ad",
    module: "ad",
    description: "Отправить объявление в редакцию",
    description_en: "Send an announcement to the editor",
    description_ua: "Відправити оголошення в редакцію",
    usage: "ad [text]",
    example: "/ad куплю машину - Отправить объявление в редакцию",
    example_en: "/ad buy a car - Send an announcement to the editor",
    example_ua: "/ad придбаю машину - Відправити оголошення в редакцію",
  async run(client,message,args,langs) {

    try {

        let dataBD = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if(!dataBD) return;
        
        let textAD = args.slice(0).join(" ");

        let noTextADEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_text[langs]} \`${dataBD.prefix}ad [${lang.ad_t[langs]}]\``)
        .setTimestamp()
        if (!textAD) return message.reply({ embeds: [noTextADEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let nolenghtEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_text_minimal[langs]}`)
        .setTimestamp()
        if (textAD.length > 100 || textAD.length < 1) return message.reply({ embeds: [nolenghtEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let ad_categ = dataBD.ad_incoming
        let adchannel = message.guild.channels.cache.find(c => c.name == ad_categ) || message.guild.channels.cache.find(c => c.id == ad_categ);

        let adchannelEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.reports_und[langs]} \`${ad_categ}\` ${lang.reports_undefined[langs]}`)
        .setTimestamp()
        if (!adchannel) return message.reply({ embeds: [adchannelEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let supportrole = dataBD.r_ad
        let moderator_role = message.guild.roles.cache.find(r => r.name == supportrole) || message.guild.roles.cache.find(r => r.id == supportrole);

        let mroleEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.moderator_role_undefined_description[langs]} \`${supportrole}\` ${lang.mdr_role_und_desc[langs]}`)
        .setTimestamp()
        if (!moderator_role) return message.reply({ embeds: [mroleEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let noAD = await Ad.find({
            userID: message.author.id,
            guildID: message.guild.id,
            status: "Active"
        });
    
        let noADEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_sended[langs]}`)
        .setTimestamp()
        if (noAD.length >= 5) return message.reply({ embeds: [noADEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let numberAD = await AdSchema.findOne({
            guildID: message.guild.id
        });
    
        if(!numberAD) {
            await new AdSchema({
                guildID: message.guild.id,
                numberAD: 0
            }).save()
            return message.reply({ content: `${lang.ad_nodb[langs]}`, allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        numberAD.numberAD++
        numberAD.save()
    
        const nums = numberAD.numberAD
    
        await new Ad({
            userID: message.author.id,
            guildID: message.guild.id,
            userTAG: message.author.tag,
            text: textAD,
            numberAD: nums,
            status: "Active",
            editID: "no",
            editTAG: "no"
        }).save()

        let adSendEmbed = new MessageEmbed()
        .setColor(`#17a1d4`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_ok[langs]}`)
        .setTimestamp() 
        await message.reply({ embeds: [adSendEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then(async() => {
        
        let newAD = new MessageEmbed()
        .setColor(`BLUE`)
        .setTitle(`${lang.ad_new[langs]}`)
        .setDescription(`${textAD}`)
        .addField(`${lang.ad_opublic[langs]}`, `**${lang.ad_opublic_text[langs]}** \`${dataBD.prefix}accept ${nums}\``, true)
        .addField(`${lang.ad_edit_[langs]}`, `**${lang.ad_editen[langs]}** \`${dataBD.prefix}editad ${nums} ${lang.ad_t[langs]}\``, true)
        .addField(`${lang.ad_deny[langs]}`, `**${lang.ad_deny_[langs]}** \`${dataBD.prefix}deny ${nums} ${lang.reason[langs]}\``, true)
        .setFooter({ text: `${lang.ad_sender[langs]} ${message.author.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
        await adchannel.send({ content: `<@&${moderator_role.id}>`, embeds: [newAD] }).catch(err => {})
    });
    } catch (e) {
        console.log(e)
    }
  }
}