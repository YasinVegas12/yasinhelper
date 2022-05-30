const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const Ad = require("../../structures/AdSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "accept",
    module: "ad",
    description: "Одобрить объявление",
    description_en: "Accept AD",
    description_ua: "Схвалити оголошення",
    usage: "accept [number AD]",
    example: "/accept 0 - Одобрить объявление с айди 0",
    example_en: "/accept 0 - Approve ad with ID 0",
    example_ua: "/accept 0 - Схвалити оголошення з номером 0",
  async run(client,message,args,langs) {

    try {

        const developer = [
            config.developer,
        ];
        
        let dataBD = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if (!dataBD) return;

        let supportrole = dataBD.r_ad
        let moderator_role = message.guild.roles.cache.find(r => r.name == supportrole) || message.guild.roles.cache.find(r => r.id == supportrole)

        let mroleEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.moderator_role_undefined_description[langs]} \`${supportrole}\` ${lang.mdr_role_und_desc[langs]}`)
        .setTimestamp()
        if (!moderator_role) return message.reply({ embeds: [mroleEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningPermission = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_ROLES") && !message.member.roles.cache.some(r => [moderator_role].includes(r))) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        
        let ad_categ = dataBD.ad_outgoing
        let adchannel = message.guild.channels.cache.find(c => c.name == ad_categ) || message.guild.channels.cache.find(c => c.id == ad_categ);
    
        let adChannelEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.reports_und[langs]} \`${ad_categ}\` ${lang.reports_text[langs]}`)
        .setTimestamp()
        if (!adchannel) return message.reply({ embeds: [adChannelEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideNumber = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.provide_number[langs]}`)
        .setTimestamp()
        if(!args[0]) return message.reply({ embeds: [provideNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let provideChislo = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.provide_true_number[langs]}`)
        .setTimestamp()
        if (isNaN(args[0])) return message.reply({ embeds: [provideChislo], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let number = args[0]

        let noAD = await Ad.findOne({
            guildID: message.guild.id,
            numberAD: number,
            status: "Active"
        });

        let noADEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_number[langs]} \`${args[0]}\` ${lang.ad_number_und[langs]}`)
        .setTimestamp()
        if(!noAD) return message.reply({ embeds: [noADEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
        var chellID = noAD.userID
    
        let chell = await client.users.fetch(chellID).catch(() => {})

        let adAccepted = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_accepted[langs]}`)
        .setTimestamp()
        await message.reply({ embeds: [adAccepted], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then(async() => {

            let adEmbed = new MessageEmbed()
            .setColor(`#00ff00`)
            .setTitle(`${lang.ad_new[langs]}`)
            .setDescription(`${noAD.text} | ${lang.ad_send[langs]} ${noAD.userTAG}\n\n${lang.ad_edit[langs]} ${message.author.tag}`)
            .setTimestamp()
            await adchannel.send({ embeds: [adEmbed] }).catch(err => {})

            await Ad.updateMany(noAD, {
                status: "Accepted",
                editID: message.author.id,
                editTAG: message.author.tag
            });

            let sendEmbed = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${noAD.userTAG}\`, ${lang.ad_send_user[langs]} \`${message.author.tag}\``)
            .setTimestamp()
            await chell.send({ embeds: [sendEmbed] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
        });
    } catch (e) {
        console.log(e)
    }
  }
}