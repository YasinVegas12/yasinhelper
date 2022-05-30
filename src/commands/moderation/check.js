const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "check",
    module: "moderation",
    description: "Поиск двойников на сервере по нику/тегу",
    description_en: "Search for doubles on the server by nickname/tag",
    description_ua: "Пошук двійників на сервері по ніку/тегу",
    usage: "check [nickname/tag]",
    example: "/check #6666 - поиск двойников на сервере с тегом 6666\n/check jason - поиск двойников на сервере с ником jason",
    example_en: "/check #6666 - search for doubles on the server with the tag 6666\n/check jason - search for doubles on the server with the nickname jason",
    example_ua: "/check #6666 - пошук двійників на сервері з тегом 6666\n/check jason - пошук двійників на сервері з ніком jason",
  async run(client,message,args,langs,prefix,ownerTAG) {

    try {

        const developer = [
            config.developer,
        ];

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.chat_no_permission[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_CHANNELS")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let name = args.slice(0).join(" ");

        let provideName = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.check_provide[langs]}`)
        .setTimestamp()
        if(!name) return message.reply({ embeds: [provideName], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let userfinders = false;
        let foundedusers_nick;
        let numberff_nick = 0;
        let foundedusers_tag;
        let numberff_tag = 0;
        message.guild.members.cache.filter(userff => {
            if (userff.displayName.toLowerCase().includes(name.toLowerCase())){
                if (foundedusers_nick == null){
                    foundedusers_nick = `${numberff_nick + 1}) <@${userff.id}>`
                }else{
                    foundedusers_nick = foundedusers_nick + `\n${numberff_nick + 1}) <@${userff.id}>`
                }
                numberff_nick++
                if (numberff_nick == 15 || numberff_tag == 15){
                    if (foundedusers_tag == null) foundedusers_tag = `${lang.check_undefined[langs]}`;
                    if (foundedusers_nick == null) foundedusers_nick = `${lang.check_undefined[langs]}`;

                    const embed = new MessageEmbed()
                    .setColor("#1592ab")
                    .addField(`BY NICKNAME`, foundedusers_nick, true)
                    .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply({ content: `${message.author}, \`${lang.check_info[langs]}\``, embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }else if (userff.user.tag.toLowerCase().includes(name.toLowerCase())){
                if (foundedusers_tag == null){
                    foundedusers_tag = `${numberff_tag + 1}) <@${userff.id}>`
                }else{
                    foundedusers_tag = foundedusers_tag + `\n${numberff_tag + 1}) <@${userff.id}>`
                }
                numberff_tag++
                if (numberff_nick == 15 || numberff_tag == 15){
                    if (foundedusers_tag == null) foundedusers_tag = `${lang.check_undefined[langs]}`;
                    if (foundedusers_nick == null) foundedusers_nick = `${lang.check_undefined[langs]}`;

                    const embed = new MessageEmbed()
                    .setColor("#1592ab")
                    .addField(`BY NICKNAME`, foundedusers_nick, true)
                    .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply({ content: `${message.author}, \`${lang.check_info[langs]}\``, embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                    
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }
        })

        let noResult = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.check_not_found[langs]}`)
        .setTimestamp()
        if (!userfinders) return message.reply({ embeds: [noResult], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (numberff_nick != 0 || numberff_tag != 0){
            if (foundedusers_tag == null) foundedusers_tag = `${lang.check_undefined[langs]}`;
            if (foundedusers_nick == null) foundedusers_nick = `${lang.check_undefined[langs]}`;

            const embed = new MessageEmbed()
            .setColor("#1592ab")
            .addField(`BY NICKNAME`, foundedusers_nick, true)
            .addField("BY DISCORD TAG", foundedusers_tag, true)
            message.reply({ content: `${message.author}, \`${lang.check_info[langs]}\``, embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
        } catch (e) {
            console.log(e)
        }
    }
}