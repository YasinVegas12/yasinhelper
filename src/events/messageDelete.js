const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client, message) => {

    try {

        if(message.channel.type == `DM`) return;
        if(message.author.bot) return;
        if(message.type === "CHANNEL_PINNED_MESSAGE") return;
        if(message.content.length === 0) return;

        let data = await Guild.findOne({
            guildID: message.guild.id
        });

        if(!data) return;

        const guild = client.guilds.cache.get(message.guild.id)

        if (!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

        const entry = await guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first());

        let logchannel = data.logchannel
        let langs = data.language

        let channel = message.guild.channels.cache.find(c => c.name == logchannel) || message.guild.channels.cache.find(c => c.id == logchannel);

        let content = message.content.length > 900 ? `${message.content.slice(0, 850)}...` : message.content;

        if(channel) {
            if(!channel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;
            let embed = new MessageEmbed()
            .setColor('#FF0000')
            .setAuthor({ name: `${message.author.tag} (${message.author.username})`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`${lang.message_delete_channel[langs]} ${message.channel}`)
            .setFooter({ text: `Yasin Helper#4959`, iconURL: `${client.user.avatarURL()}` })
            .setTimestamp()
            if(message.content.length > 0) embed.addField(`**${lang.message_delete_message[langs]}**`, content)
            if(message.attachments.first()) embed.setImage(`${message.attachments.first().proxyURL}`)
            if (entry.extra.channel.id === message.channel.id
                && (entry.target.id === message.author.id)
                && (entry.createdTimestamp > (Date.now() - 5000))
                && (entry.extra.count >= 1)) { 
                embed.addField(`${lang.message_delete_by[langs]}`, `<@${entry.executor.id}> (\`${entry.executor.username}\` / \`${entry.executor.id}\`)`)
            }
            channel.send({ embeds: [embed] }).catch(err => {})
        }
    } catch(e) {
        console.log(e)
    }
}