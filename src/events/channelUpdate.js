const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client,oldChannel,newChannel) => {

  if(newChannel.type === "DM") return;
  if(oldChannel.type === "DM") return;

  try {

    const guildid = newChannel.guild.id

    let data = await Guild.findOne({
        guildID: guildid
    });

    if(!data) return;

    let langs = data.language

    const guild = client.guilds.cache.get(guildid)

    if (!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

    const logchannel = await guild.channels.cache.find(c => c.name === data.channels.channelUpdate) || guild.channels.cache.find(c => c.id === data.channels.channelUpdate)

    if (!logchannel) return;

    if (!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

    const entry = await guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());

    let member = await guild.members.fetch(entry.executor.id);

    if(oldChannel.nsfw === true) {
        nsfw = `${lang.channel_nsfw[langs]}`
    }else{
        nsfw = `${lang.channel_nsfw_no[langs]}`
    }

    if(newChannel.nsfw === true) {
        nsfwN = `${lang.channel_nsfw[langs]}`
    }else{
        nsfwN = `${lang.channel_nsfw_no[langs]}`
    }

    if(oldChannel.type != "GUILD_TEXT") {
        slowmode = `${lang.channel_deleted_topic_null[langs]}`
    }else{
        slowmode = oldChannel.rateLimitPerUser
    }

    if(newChannel.type != "GUILD_TEXT") {
        slowmodeN = `${lang.channel_deleted_topic_null[langs]}`
    }else{
        slowmodeN = newChannel.rateLimitPerUser
    }

    if(oldChannel.topic === null || oldChannel.type != "GUILD_TEXT") { 
        topic = `${lang.channel_deleted_topic_null[langs]}`
    }else{
        topic = oldChannel.topic.length > 800 ? `${oldChannel.topic.slice(0, 800)}...` : oldChannel.topic;
    }

    if(newChannel.topic === null || newChannel.type != "GUILD_TEXT") { 
        topicN = `${lang.channel_deleted_topic_null[langs]}`
    }else{
        topicN = newChannel.topic.length > 800 ? `${newChannel.topic.slice(0, 800)}...` : newChannel.topic;
    }

    if(oldChannel.name != newChannel.name) {
        let changeChannelName = new MessageEmbed()
        .setColor(`ORANGE`)
        .setTitle(`${lang.channel_update_name_title[langs]}`)
        .addField(`${lang.oldchannel_name[langs]}`, `${oldChannel.name} (${oldChannel} / \`${oldChannel.name}\` / \`${oldChannel.id}\`)`)
        .addField(`${lang.newchannel_name[langs]}`, `${newChannel.name} (${newChannel} / \`${newChannel.name}\` / \`${newChannel.id}\`)`)
        .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.username}\` / \`${member.id}\`)`)
        .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
        .setTimestamp()
        logchannel.send({ embeds: [changeChannelName] })
    }

    if(oldChannel.nsfw != newChannel.nsfw) {
        let changeChannelNSFW = new MessageEmbed()
        .setColor(`ORANGE`)
        .setTitle(`${lang.channel_nsfw_changed[langs]}`)
        .addField(`${lang.oldchannel_nsfw[langs]}`, `${nsfw} (${oldChannel} / \`${oldChannel.name}\` / \`${oldChannel.id}\`)`)
        .addField(`${lang.newchannel_nsfw[langs]}`, `${nsfwN} (${newChannel} / \`${newChannel.name}\` / \`${newChannel.id}\`)`)
        .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.username}\` / \`${member.id}\`)`)
        .setFooter(`${lang.role_update_name_timestamp[langs]}`)
        .setTimestamp()
        logchannel.send({ embeds: [changeChannelNSFW] })
    }

    if(oldChannel.topic != newChannel.topic) {
        let changeChannelTopic = new MessageEmbed()
        .setColor(`ORANGE`)
        .setTitle(`${lang.channel_topic_changes[langs]}`)
        .addField(`${lang.newchannel_channel[langs]}`, `${newChannel} (\`${newChannel.name}\` / \`${newChannel.id}\`)`)
        .addField(`${lang.oldchannel_topic[langs]}`, `${topic}`)
        .addField(`${lang.newchannel_topic[langs]}`, `${topicN}`)
        .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.username}\` / \`${member.id}\`)`)
        .setFooter(`${lang.role_update_name_timestamp[langs]}`)
        .setTimestamp()
        logchannel.send({ embeds: [changeChannelTopic] })
    }

    if(oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
        let changeChannelSlowmode = new MessageEmbed()
        .setColor(`ORANGE`)
        .setTitle(`${lang.change_channel_slowmode[langs]}`)
        .addField(`${lang.oldchannel_slowmode[langs]}`, `${slowmode} (${oldChannel} / \`${oldChannel.name}\` / \`${oldChannel.id}\`)`)
        .addField(`${lang.newchannel_slowmode[langs]}`, `${slowmodeN} (${newChannel} / \`${newChannel.name}\` / \`${newChannel.id}\`)`)
        .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.username}\` / \`${member.id}\`)`)
        .setFooter(`${lang.role_update_name_timestamp[langs]}`)
        .setTimestamp()
        logchannel.send({ embeds: [changeChannelSlowmode] })
    }
    } catch (e) {
        console.log(e)
    }
}