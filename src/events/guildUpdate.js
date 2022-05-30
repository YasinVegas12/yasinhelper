const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client,oldGuild,newGuild) => {
    try {
    
        let data = await Guild.findOne({
            guildID: newGuild.id
        });
    
        if (!data) return;
    
        let langs = data.language
    
        const guild = client.guilds.cache.get(newGuild.id);
    
        if (!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

        const logchannel = await guild.channels.cache.find(c => c.name === data.channels.guildUpdate) || guild.channels.cache.find(c => c.id === data.channels.guildUpdate)

        if (!logchannel) return;

        if (!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;
    
        const entry = await guild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());

        let member = await guild.members.fetch(entry.executor.id);

        if(oldGuild.systemChannel === null) {
            old_system_channel = `${lang.unknown_system_channel[langs]}`
        }else{
            old_system_channel = oldGuild.systemChannel
        }

        if(newGuild.systemChannel === null) {
            new_system_channel = `${lang.unknown_system_channel[langs]}`
        }else{
            new_system_channel = newGuild.systemChannel
        }

        if(oldGuild.afkChannel === null) {
            old_afk_channel = `${lang.afk_channel_unknown[langs]}`
        }else{
            old_afk_channel = oldGuild.afkChannel
        }

        if(newGuild.afkChannel === null) {
            new_afk_channel = `${lang.afk_channel_unknown[langs]}`
        }else{
            new_afk_channel = newGuild.afkChannel
        }

        if(oldGuild.name != newGuild.name) {
            let changeGuildName = new MessageEmbed()
            .setColor(`ORANGE`)
            .setTitle(`${lang.guild_name_changed[langs]}`)
            .addField(`${lang.oldguild_name[langs]}`, `${oldGuild.name}`)
            .addField(`${lang.newguild_name[langs]}`, `${newGuild.name}`)
            .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
            .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
            .setTimestamp()
            logchannel.send({ embeds: [changeGuildName] })
        }

        if(oldGuild.systemChannel != newGuild.systemChannel) {
            let changeSystemChannel = new MessageEmbed()
            .setColor(`ORANGE`)
            .setTitle(`${lang.guildupdate_system_channel[langs]}`)
            .addField(`${lang.oldsystemchannel[langs]}`, `${old_system_channel}`)
            .addField(`${lang.newsystemchannel[langs]}`, `${new_system_channel}`)
            .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
            .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
            .setTimestamp()
            logchannel.send({ embeds: [changeSystemChannel] })
        }

        if(oldGuild.afkChannel != newGuild.afkChannel) {
            let changeAfkChannel = new MessageEmbed()
            .setColor(`ORANGE`)
            .setTitle(`${lang.afk_channel_change[langs]}`)
            .addField(`${lang.old_afk_channel[langs]}`, `${old_afk_channel}`)
            .addField(`${lang.new_afk_channel[langs]}`, `${new_afk_channel}`)
            .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
            .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
            .setTimestamp()
            logchannel.send({ embeds: [changeAfkChannel] })
        }
    } catch(e) {
        console.log(e)
    }
}