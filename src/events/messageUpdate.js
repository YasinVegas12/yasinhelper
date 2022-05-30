const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client, oldMessage, newMessage) => {
    try {

    if(oldMessage.channel.type == `DM`) return;
    if(oldMessage.author.bot) return;
    if(oldMessage.content.length === 0) return;

    if (newMessage.channel.type == 'GUILD_TEXT' && newMessage.cleanContent != oldMessage.cleanContent) {

    let data = await Guild.findOne({
        guildID: oldMessage.guild.id
    });

    if(!data) return;

    function isUrl(s) { 
        var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ 
        return regexp.test(s);
    }

    if(isUrl(newMessage.content)) return newMessage.delete().catch(err => {});

    let logchannel = data.logchannel
    let langs = data.language
    let channel = oldMessage.guild.channels.cache.find(c => c.name == logchannel) || oldMessage.guild.channels.cache.find(c => c.id == logchannel);

    let pOldMsg = oldMessage.cleanContent.length > 1024 ? `${oldMessage.cleanContent.slice(0, 1000)}...` : oldMessage.content;
    let PNewMsg = newMessage.cleanContent.length > 1024 ? `${newMessage.cleanContent.slice(0, 1000)}...` : newMessage.content;

    if(channel) {
        if(!channel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;
        let embed = new MessageEmbed()
        .setColor('#FF0000')
        .setAuthor({ name: `${oldMessage.author.tag} (${oldMessage.author.username})`, iconURL: oldMessage.member.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`**${oldMessage.author.tag} (${oldMessage.author.username}) ${lang.message_update_message[langs]}**`)
        .addField(`**${lang.message_update_channel[langs]}**`, `${oldMessage.channel} (${oldMessage.channel.name})\n**[${lang.message_update_link[langs]}](https://discordapp.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})**`)
        .addField(`**${lang.message_update_old[langs]}**`, `${pOldMsg}`)
        .addField(`**${lang.message_update_now[langs]}**`, `${PNewMsg}`)
        .setFooter({ text: `Yasin Helper#4959`, iconURL: `${client.user.avatarURL()}` })
        .setTimestamp()
        channel.send({ embeds: [embed] }).catch(err => {})
    }
}
    } catch(e) {
        console.log(e)
    }
}