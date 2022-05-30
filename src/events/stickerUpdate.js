const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client, oldSticker, newSticker) => {

    try {

        const guildId = newSticker.guild.id
        
        let data = await Guild.findOne({
            guildID: newSticker.guild.id
        });

        if (!data) return;

        let langs = data.language

        const guild = client.guilds.cache.get(guildId)

        if (!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

        const logchannel = await guild.channels.cache.find(c => c.name === data.channels.stickerUpdate) || guild.channels.cache.find(c => c.id === data.channels.stickerUpdate)

        if (!logchannel) return;

        if (!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

        const entry = await guild.fetchAuditLogs({type: 'STICKER_UPDATE'}).then(audit => audit.entries.first());

        let member = await guild.members.fetch(entry.executor.id);

        if(oldSticker.name != newSticker.name) {
            let changeStickerName = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${lang.change_sticker_name[langs]}`)
            .setThumbnail(`${newSticker.url}`)
            .addField(`${lang.old_sticker_name[langs]}`, oldSticker.name)
            .addField(`${lang.new_sticker_name[langs]}`, newSticker.name)
            .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.username}\` / \`${member.id}\`)`)
            .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
            .setTimestamp()

            if(logchannel) logchannel.send({ embeds: [changeStickerName] }).catch(err => {})
        }

        if(oldSticker.description === null) { 
            description = `${lang.channel_deleted_topic_null[langs]}`
        }else{
            description = oldSticker.description
        }
    
        if(newSticker.description === null) { 
            new_description = `${lang.channel_deleted_topic_null[langs]}`
        }else{
            new_description = newSticker.description
        }

        if(oldSticker.description != newSticker.description) {
            let changeStickerDescription = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${lang.change_sticker_description[langs]}`)
            .setThumbnail(`${newSticker.url}`)
            .addField(`${lang.old_sticker_description[langs]}`, description)
            .addField(`${lang.new_sticker_description[langs]}`, new_description)
            .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.username}\` / \`${member.id}\`)`)
            .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
            .setTimestamp()

            if(logchannel) logchannel.send({ embeds: [changeStickerDescription] }).catch(err => {})
        }

        if(oldSticker.tags != newSticker.tags) {
            let changeStickerTags = new MessageEmbed()
            .setColor(`BLUE`)
            .setTitle(`${lang.change_sticker_tags[langs]}`)
            .setThumbnail(`${newSticker.url}`)
            .addField(`${lang.old_sticker_tags[langs]}`, `:${oldSticker.tags}:`)
            .addField(`${lang.new_sticker_tags[langs]}`, `:${newSticker.tags}:`)
            .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.username}\` / \`${member.id}\`)`)
            .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
            .setTimestamp()

            if(logchannel) logchannel.send({ embeds: [changeStickerTags] }).catch(err => {})
        }
    } catch (e) {
        console.log(e)
    }
}