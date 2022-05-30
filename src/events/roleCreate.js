const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client,role) => {

  if(role.type === "DM") return;

  try {

    const guildId = role.guild.id

    let data = await Guild.findOne({
        guildID: guildId
    });

    if(!data) return;

    let langs = data.language

    const guild = client.guilds.cache.get(guildId)

    if(!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

    const logchannel = await guild.channels.cache.find(c => c.name === data.channels.roleCreate) || guild.channels.cache.find(c => c.id === data.channels.roleCreate)

    if(!logchannel) return;

    if(!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

    const entry = await guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());

    let member = await guild.members.fetch(entry.executor.id);

    let createRoleEmbed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
    .setTitle(`${lang.role_create_title[langs]}`)
    .addField(`${lang.channel_create_information[langs]}`, `${lang.role_create_information[langs]} ${role} (\`${role.name}\` / \`${role.id})\``)
    .addField(`${lang.created[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
    .setFooter({ text: `${lang.role_created[langs]}` })
    .setTimestamp()

    if(logchannel) logchannel.send({ embeds: [createRoleEmbed] })
} catch(e) {
 console.log(e)
}
}