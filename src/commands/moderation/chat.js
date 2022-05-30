const { MessageEmbed } = require('discord.js');
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "chat",
    module: "moderation",
    description: "Открыть/закрыть доступ к каналу",
    description_en: "Open/close channel access",
    description_ua: "Відкрити/закрити доступ до каналу",
    usage: "chat [id/mention channel] [on/off]",
    example: "/chat 773091330569273364 on - открыть доступ к каналу всем пользователям\n/chat 773091330569273364 off - забрать доступ к каналу у всех пользователей",
    example_en: "/chat 773091330569273364 on - open access to the channel to all users\n/chat 773091330569273364 off - take away access to the channel from all users",
    example_ua: "/chat 773091330569273364 on - відкрити доступ до каналу всім користувачам\n/chat 773091330569273364 off - забрати доступ до каналу у всіх користувачів",
    cooldown: 15,
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.chat_no_permission[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_CHANNELS")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (cooldown.has(message.author.id)) {
            let cooldownEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_has[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        let warningBotPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.support_permissions[langs]}`)
        .setTimestamp()
        if (!message.guild.me.permissions.has(["ADMINISTRATOR"])) return message.reply({ embeds: [warningBotPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let howToUse = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.chat_correct_use[langs]} \`${prefix}chat [on/off]\``)
        .setTimestamp()
        if (args[0] !== 'on' && args[0] !== 'off') return message.reply({ embeds: [howToUse], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (args[0] == 'on') {
            message.channel.permissionOverwrites.edit(message.guild.id, {
                SEND_MESSAGES: true,
                ADD_REACTIONS: true
            });

            let openEmbed = new MessageEmbed()
            .setDescription("**Сhat On | Yasin Helper**")
            .setColor(`#4287f5`)
            .addField(`${lang.chat_on[langs]}`, `**${lang.chat_on_moderator[langs]}** <@${message.author.id}>\n**${lang.chat_on_moderator_id[langs]}** \`${message.author.id}\`.`)
            .setFooter({ text: `${lang.reports_footer[langs]}` });
            message.reply({ embeds: [openEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            if(!dataPRIME) {
                if(!developer.some(dev => dev == message.author.id)) {
                    cooldown.add(message.author.id);
                }

                setTimeout(() => {
                    cooldown.delete(message.author.id)
                }, cdseconds * 1000)
            }

        } else if (args[0] == 'off') {

            message.channel.permissionOverwrites.edit(message.guild.id, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });

            let closeEmbed = new MessageEmbed()
            .setDescription("**Сhat Off | Yasin Helper**")
            .setColor(`#4287f5`)
            .addField(`${lang.chat_off[langs]}`, `**${lang.chat_on_moderator[langs]}** <@${message.author.id}>\n**${lang.chat_on_moderator_id[langs]}** \`${message.author.id}\`.`)
            .setFooter({ text: `${lang.reports_footer[langs]}` })
            message.reply({ embeds: [closeEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            if(!dataPRIME) {
                if(!developer.some(dev => dev == message.author.id)) {
                    cooldown.add(message.author.id);
                }

                setTimeout(() => {
                    cooldown.delete(message.author.id)
                }, cdseconds * 1000)
            }
        }
        } catch (e) {
            console.log(e)
        }
    }
}