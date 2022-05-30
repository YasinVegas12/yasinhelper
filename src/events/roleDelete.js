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

    if(!guild) return;

    if(!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

    const logchannel = await guild.channels.cache.find(c => c.name === data.channels.roleDelete) || guild.channels.cache.find(c => c.id === data.channels.roleDelete)

    if(!logchannel) return;

    if(!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

    const entry = await guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());

    let member = await guild.members.fetch(entry.executor.id);

    let deleteRoleEmbed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
    .setTitle(`${lang.role_delete_title[langs]}`)
    .addField(`${lang.channel_create_information[langs]}`, `${lang.role_create_information[langs]} ${role} (\`${role.name}\` / \`${role.id})\`\n${lang.channel_create_position[langs]} \`${role.rawPosition}\`\n${lang.role_delete_color[langs]} \`${role.color}\`\n${lang.channel_deleted_created_at[langs]} \`${role.createdAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false})}\``)
    .addField(`${lang.deleted[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
    .setFooter({ text: `${lang.role_deleted[langs]}` })
    .setTimestamp()

    if(logchannel) logchannel.send({ embeds: [deleteRoleEmbed] })
    } catch(e) {
        console.log(e)
    }
}