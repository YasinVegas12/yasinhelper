const { MessageEmbed } = require('discord.js');
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "unpin",
    module: "moderation",
    description: "Открепить сообщение",
    description_en: "Unpin a message",
    description_ua: "Відкріпити повідомлення",
    usage: "unpin [message ID]",
    example: "/unpin 868555549187399741 - открепить сообщение",
    example_en: "/unpin 868555549187399741 - unpin a message",
    example_ua: "/unpin 868555549187399741 - відкріпити повідомлення",
    cooldown: 15,
  async run(client,message,args,langs,prefix,ownerTAG) {

    try {

        const developer = [
            config.developer,
        ];

        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });

        if (cooldown.has(message.author.id)) {
            let cooldownEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let noPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.pin_bot_permissions[langs]}`)
        .setTimestamp() 
        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.pin_permissions[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has(["MANAGE_MESSAGES"])) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let msgid = args[0]

        let warningMsgID = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.unpin_use[langs]} \`${prefix}unpin [MSG ID]\``)
        .setTimestamp()
        if (!msgid) return message.reply({ embeds: [warningMsgID], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(isNaN(msgid)) {
            let errorId = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.error_id[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorId], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        await message.channel.messages.fetch(msgid).catch(() => {})
            .then(async msg => {
                let warningNotId = new MessageEmbed()
                .setColor(`#fc0303`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.unpin_message_not_found[langs]}`)
                .setTimestamp()
                if (!msg) return message.reply({ embeds: [warningNotId], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                await msg.unpin().catch(err => {});
                
                let embed = new MessageEmbed()
                .setColor(`#4287f5`)
                .setDescription(`**${lang.unpin_embed_info[langs]}**`)
                .addField(`${lang.unpin_embed_description[langs]}`, `**${lang.info_ban_moderator[langs]}** <@${message.author.id}>\n**${lang.info_id_moderator[langs]}** \`${message.author.id}\`\n**${lang.pin_message_id[langs]}** \`${msgid}\``)
                .setFooter({ text: `${lang.reports_footer[langs]}` })
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                if(!dataPRIME) {
                    if(!developer.some(dev => dev == message.author.id)) {
                        cooldown.add(message.author.id);
                    }

                    setTimeout(() =>{
                        cooldown.delete(message.author.id)
                    }, cdseconds * 1000)
                }
            }).catch(err => {
                let errorMsg = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.pin_permissions_channel[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorMsg], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }).catch(err => {
                if(err.message == "Unknown Message") {
                    let errorMessage = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.error_message[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorMessage], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
            })
        } catch (e) {
            console.log(e)
        }
    }
}