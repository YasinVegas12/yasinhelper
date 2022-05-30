const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client,channel) => {

  if(channel.type === "DM") return;

  try {

    let data = await Guild.findOne({
        guildID: channel.guild.id
    });

    if (!data) return;

    let langs = data.language

    const guild = client.guilds.cache.get(channel.guild.id)

    if(!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

    const logchannel = await guild.channels.cache.find(c => c.name === data.channels.channelCreate) || guild.channels.cache.find(c => c.id === data.channels.channelCreate)

    if(!logchannel) return;

    if(!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

    const entry = await guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());

    let member = await guild.members.fetch(entry.executor.id);

    if(channel.nsfw === true) {
        nsfw = `${lang.channel_nsfw[langs]}`
    }else{
        nsfw = `${lang.channel_nsfw_no[langs]}`
    }

    if(channel.type === "GUILD_TEXT") {
        type = `${lang.channel_create_type_text[langs]}`
    }else if(channel.type === "GUILD_VOICE") {
        type = `${lang.channel_create_type_voice[langs]}`
    }else if(channel.type === "GUILD_NEWS") {
        type = `${lang.channel_create_type_news[langs]}`
    }else if(channel.type === "GUILD_CATEGORY") {
        type = `${lang.channel_create_type_category[langs]}`
    }else if(channel.type === "GUILD_STAGE_VOICE") {
        type = `${lang.channel_type_stage[langs]}`
    }else{
        type = `${lang.channel_create_type_unknown[langs]}`
    }

    let createChannelEmbed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
    .setTitle(`${lang.channel_create_title[langs]}`)
    .addField(`${lang.channel_create_information[langs]}`, `${lang.channel_create_channel_name[langs]} ${channel} (\`${channel.name}\` / \`${channel.id})\`\n${lang.channel_create_type[langs]} \`${type}\`\n${lang.channel_create_position[langs]} \`${channel.rawPosition}\`\nNSFW: \`${nsfw}\``)
    .addField(`${lang.created[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
    .setFooter({ text: `${lang.channel_created_at[langs]}` })
    .setTimestamp()

    if(logchannel) logchannel.send({ embeds: [createChannelEmbed] })
    } catch(e) {
        console.log(e)
    }
}