const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client, sticker) => {
    
    try {

        let data = await Guild.findOne({
            guildID: sticker.guild.id
        });
      
        if (!data) return;

        let langs = data.language

        if (!sticker.guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

        const logchannel = await sticker.guild.channels.cache.find(c => c.name === data.channels.stickerDelete) || sticker.guild.channels.cache.find(c => c.id === data.channels.stickerDelete)

        if (!logchannel) return;

        if (!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

        const entry = await sticker.guild.fetchAuditLogs({type: 'STICKER_DELETE'}).then(audit => audit.entries.first());

        let member = await sticker.guild.members.fetch(entry.executor.id);

        if(sticker.description === null) {
            description = `${lang.help_command_description_no[langs]}`
        }else{
            description = sticker.description
        }

        let deleteStickerEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.sticker_delete[langs]}`)
        .setThumbnail(`${sticker.url}`)
        .addField(`${lang.channel_create_information[langs]}`, `${lang.sticker_name[langs]} \`${sticker.name}\`\n${lang.sticker_id[langs]} \`${sticker.id}\`\n${lang.sticker_format[langs]} \`${sticker.format}\`\n${lang.sticker_tags[langs]} :${sticker.tags}:\n${lang.sticker_description[langs]} \`${description}\``)
        .addField(`${lang.message_delete_by[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
        .setFooter({ text: `${lang.sticker_deleted_timestamp[langs]}` })
        .setTimestamp()

        if (logchannel) logchannel.send({ embeds: [deleteStickerEmbed] }).catch(err => {})
    } catch (e) {
        console.log(e)
    }
}