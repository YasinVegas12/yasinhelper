const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client, message) => {

    if(message.author.bot) return;
    if(message.channel.type === `DM`) return;

    let data = await Guild.findOne({
        guildID: message.guild.id
    });

    if (!data) return;

    let langs = data.language

    try {
        if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(message.content)) {
            let embed = new MessageEmbed()
            .setColor(`#0c8fed`)
            .setTitle(`${lang.information[langs]}`)
            .setDescription(`${lang.ping_prefix[langs]} \`${data.prefix}\`\n${lang.ping_change_prefix[langs]} \`${data.prefix}set prefix [${lang.ping_new_prefix[langs]}]\`\n${lang.ping_help[langs]}\n**https://discord.gg/pcjm28pGsa**`)
            return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    } catch (e) {
        console.log(e)
    }
}