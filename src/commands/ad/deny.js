const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const Ad = require("../../structures/AdSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "deny",
    module: "ad",
    description: "Отклонить объявление",
    description_en: "Deny AD",
    description_ua: "Відхилити оголошення",
    usage: "deny [number AD] [reason]",
    example: "/deny 0 Оффтоп - Отклонить объявление",
    example_en: "/deny 0 Offtop - Deny AD",
    example_ua: "/deny 0 Оффтоп - Відхилити оголошення",
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
        if (!noAD) return message.reply({ embeds: [noADEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let textAD = args.slice(1).join(" ");

        let noTextADEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_edit_new_text[langs]}`)
        .setTimestamp()
        if (!textAD) return message.reply({ embeds: [noTextADEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let bigLength = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.reason_big_length[langs]}`)
        .setTimestamp()
        if (textAD.length > 100) return message.reply({ embeds: [bigLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        var chellID = noAD.userID
    
        let chell = await client.users.fetch(chellID).catch(() => {})

        let noPublicAD = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_deny_text[langs]} \`№${args[0]}\` . ${lang.reason_caps[langs]} \`${textAD}\``)
        .setTimestamp()

        await message.reply({ embeds: [noPublicAD], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then(async() => {
        
            let denyEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.ad_otkaz[langs]}`)
            .setDescription(`\`${noAD.userTAG}\`, ${lang.ad_otkaz_text[langs]} \`${message.author.tag}\`. ${lang.reason_caps[langs]} \`${textAD}\``)
            .setTimestamp()

            await Ad.updateMany(noAD, {
                status: "Deny",
                editID: message.author.id,
                editTAG: message.author.tag
            });

            await chell.send({ embeds: [denyEmbed] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
        });
        } catch (e) {
            console.log(e)
        }
    }
}