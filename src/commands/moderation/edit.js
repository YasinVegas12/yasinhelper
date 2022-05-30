const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const config = require("../../config.json");

module.exports = {
    name: "edit",
    module: "moderation",
    description: "Отредактировать сообщение бота",
    description_en: "Edit a bot message",
    description_ua: "Відредагувати повідомлення бота",
    usage: "edit [message ID] [new text]",
    example: "/edit 867149165162790932 тест - отредактировать сообщение",
    example_en: "/edit 867149165162790932 test - edit message",
    example_ua: "/edit 867149165162790932 тест - відредагувати повідомлення",
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.edit_permissions[langs]}`)
        .setTimestamp()
        if(!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningBotPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.clear_permissions[langs]}`)
        .setTimestamp() 
        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) return message.reply({ embeds: [warningBotPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let msgid = args[0]
        let content = args.slice(1).join(" ");

        let idIsNotDefined = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.edit_id[langs]} \`${prefix}edit [${lang.id_message[langs]}] [${lang.id_text[langs]}]\``)
        .setTimestamp()
        if (!msgid) return message.reply({ embeds: [idIsNotDefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let noText = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.text_id[langs]} \`${prefix}edit [${lang.id_message[langs]}] [${lang.id_text[langs]}]\``)
        .setTimestamp()
        if (!content) return message.reply({ embeds: [noText], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        await message.channel.messages.fetch(msgid).catch(() => {})
        .then(async msg => {
            let warningNotId = new MessageEmbed()
            .setColor(`#fc0303`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.id_undefined[langs]}`)
            .setTimestamp()

            if (!msg) return message.reply({ embeds: [warningNotId], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            await msg.edit({ content: content }).catch(err => {});

            let embed = new MessageEmbed()
            .setColor(`#4287f5`)
            .setDescription(`**Edit | Yasin Helper**`)
            .addField(`${lang.message_edit_info[langs]}`, `**${lang.message_edit_moderator[langs]}** <@${message.author.id}>\n**${lang.message_edit_id[langs]} **\`${message.author.id}\`\n**${lang.edit_message_id[langs]}: **\`${msgid}\``)
            .setFooter({ text: `${lang.reports_footer[langs]}` });
            let editmsg = await message.reply({ embeds: [embed] }).catch(err => {})

            setTimeout(() => {
                editmsg.delete().catch(err => {})
            }, 10000);
            }).catch(err => {
                let errorMsg = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.edit_error[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorMsg] }).catch(err => {})
            });
        } catch (e) {
            console.log(e)
        }
    }
}