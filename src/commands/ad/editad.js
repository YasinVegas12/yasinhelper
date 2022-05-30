const { MessageEmbed } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const Ad = require("../../structures/AdSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "editad",
    module: "ad",
    description: "Отредактировать объявление",
    description_en: "Edit ad",
    description_ua: "Відредагувати оголошення",
    usage: "editad [number AD] [text]",
    example: "/editad 0 Новый текст - Отредактировать объявление с ид 0",
    example_en: "/editad 0 New text - Edit ad with id 0",
    example_ua: "/editad 0 Новий текст - Відредагувати оголошення з ід 0",
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
        .setDescription(`\`${message.author.username}\`, ${lang.big_length[langs]}`)
        .setTimestamp()
        if (textAD.length > 300) return message.reply({ embeds: [bigLength], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        var chellID = noAD.userID
    
        let chell = await client.users.fetch(chellID).catch(() => {})

        let editADEmbed = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.ad_edited_text[langs]} \`${args[0]}\` ${lang.edit_ad_from[langs]} \`${noAD.text}\` ${lang.on[langs]} \`${textAD}\``)
        .setTimestamp()
    
        await message.reply({ embeds: [editADEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false }).then(async() => {
    
            await Ad.updateMany(noAD, {
                text: textAD,
                editID: message.author.id,
                editTAG: message.author.tag
            });
        
            let editEmbed = new MessageEmbed()
            .setColor(`#038cfc`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${noAD.userTAG}\`, ${lang.edit_ad_send[langs]} \`${message.author.tag}\` ${lang.edit_ad_from[langs]} \`${noAD.text}\` ${lang.on[langs]} \`${textAD}\``)
            .setTimestamp()
            await chell.send({ embeds: [editEmbed] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}});
        });
        } catch (e) {
            console.log(e)
        }
    }
}