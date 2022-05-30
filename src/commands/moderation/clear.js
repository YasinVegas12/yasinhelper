const { MessageEmbed } = require('discord.js');
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 15;

module.exports = {
    name: "clear",
    module: "moderation",
    description: "Очистить чат",
    description_en: "Clear the chat",
    description_ua: "Очистити чат",
    usage: "clear [1-100]",
    example: "/clear 50 - очистить 50 сообщений в канале",
    example_en: "/clear 50 - clear 50 messages in the channel",
    example_ua: "/clear 50 - видалити 50 повідомлень в чаті",
  async run(client,message,args,langs,prefix) {

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
        .setDescription(`\`${message.author.username}\`, ${lang.clear_permissions[langs]}`)
        .setTimestamp() 
        if (!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        let warningPermission = new MessageEmbed()
        .setColor(`#fc0303`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.clear_member[langs]}`)
        .setTimestamp()
        if (!developer.some(dev => dev == message.author.id) && !message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({ embeds: [warningPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if (!args[0]) {
            let howToUseEmbed = new MessageEmbed()
            .setColor(`#f00000`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.clear_how[langs]} \`/clear [1-100]\``)
            .setTimestamp()
            return message.reply({ embeds: [howToUseEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        let minAndMaxEmbed = new MessageEmbed()
        .setColor(`#f00000`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.clear_limit[langs]} \`/clear [1-100]\``)
        .setTimestamp()
        if(args[0] > 100 || args[0] < 1) return message.reply({ embeds: [minAndMaxEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
        message.channel.bulkDelete(args[0]).then(async() => {
            let embed = new MessageEmbed()
            .setColor(`#329da8`)
            .setDescription(`**Clear | Yasin Helper**`)
            .addField(`${lang.clear_info[langs]}`, `**${lang.clear_moderator[langs]}** <@${message.author.id}>\n**${lang.clear_moderator_id[langs]}** \`${message.author.id}\`\n**${lang.clear_messages[langs]}** \`${args[0]}\``)
            .setFooter({ text: `${lang.reports_footer[langs]}` });
            let msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            setTimeout(() => {
                msg.delete().catch(err => {})
            }, 10000);
        }).catch(err => {
            let embed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.clear_error[langs]} \`${lang.clear_message[langs]}\``)
            .setTimestamp()
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        });
    
        if(!dataPRIME) {
            if(!developer.some(dev => dev == message.author.id)) {
                cooldown.add(message.author.id);
            }
    
            setTimeout(() =>{
                cooldown.delete(message.author.id)
            }, cdseconds * 1000)
        }
        } catch (e) {
            console.log(e)
        }
    }
}