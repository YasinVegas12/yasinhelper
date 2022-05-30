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

        const logchannel = await sticker.guild.channels.cache.find(c => c.name === data.channels.stickerCreate) || sticker.guild.channels.cache.find(c => c.id === data.channels.stickerCreate)

        if (!logchannel) return;

        if (!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

        const entry = await sticker.guild.fetchAuditLogs({type: 'STICKER_CREATE'}).then(audit => audit.entries.first());

        let member = await sticker.guild.members.fetch(entry.executor.id);

        if(sticker.description === null) {
            description = `${lang.help_command_description_no[langs]}`
        }else{
            description = sticker.description
        }

        let newStickerEmbed = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.sticker_create[langs]}`)
        .setThumbnail(`${sticker.url}`)
        .addField(`${lang.channel_create_information[langs]}`, `${lang.sticker_name[langs]} \`${sticker.name}\`\n${lang.sticker_id[langs]} \`${sticker.id}\`\n${lang.sticker_format[langs]} \`${sticker.format}\`\n${lang.sticker_tags[langs]} :${sticker.tags}:\n${lang.sticker_description[langs]} \`${description}\``)
        .addField(`${lang.created[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
        .setFooter({ text: `${lang.channel_created_at[langs]}` })
        .setTimestamp()

        if (logchannel) logchannel.send({ embeds: [newStickerEmbed] }).catch(err => {})
    } catch (e) {
        console.log(e)
    }
}