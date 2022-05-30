const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client, oldMember, newMember) => {
  try {

    if(newMember.user.bot) return;
    if(newMember.type === `DM`) return;

    let data = await Guild.findOne({
        guildID: newMember.guild.id
    });

    if (!data) return;

    const guild = client.guilds.cache.get(newMember.guild.id)

    if (!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

    let logchannel = data.logchannel
    let langs = data.language
    let channel = newMember.guild.channels.cache.find(c => c.name == logchannel) || newMember.guild.channels.cache.find(c => c.id == logchannel);

    if(channel) {
      if(!channel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

      if(oldMember.nickname != newMember.nickname) {
        const entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' }).then(audit => audit.entries.first());
        let changenickEmbed = new MessageEmbed()
        .setColor(`#03a1fc`)
        .setAuthor({ name: `${oldMember.user.tag}`, iconURL: oldMember.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
        .setTitle(`${lang.nickname_update_title[langs]}`)
        .setDescription(`${lang.nickname_update_description[langs]} \`${oldMember.user.tag}\` ${lang.nick_update_description[langs]}`)
        .addField(`**${lang.nick_update_field[langs]}**`, `${oldMember.displayName}`)
        .addField(`**${lang.nick_update_new[langs]}**`, `${newMember.displayName}`)
        .setFooter({ text: `Yasin Helper#4959`, iconURL: `${client.user.avatarURL()}` })
        .setTimestamp()
        if (entry.target.id === newMember.user.id
          && (newMember.user.id != entry.executor.id)
          && (entry.createdTimestamp > (Date.now() - 5000))) { 
          changenickEmbed.addField(`${lang.guild_member_update_changenick_who[langs]}`, `<@${entry.executor.id}> (\`${entry.executor.username}\` / \`${entry.executor.id}\`)`)
        }
        channel.send({ embeds: [changenickEmbed] }).catch(err => {})
  }

  if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    let oldRolesID = [];
    let newRoleID;
    oldMember.roles.cache.forEach(role => oldRolesID.push(role.id));
    newMember.roles.cache.forEach(role => { if (!oldRolesID.some(elemet => elemet == role.id)) newRoleID = role.id });
    let role = newMember.guild.roles.cache.get(newRoleID);
    const entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first());
    let member = await newMember.guild.members.fetch(entry.executor.id);
    let roleGivedEmbed = new MessageEmbed()
    .setColor(`GREEN`)
    .setAuthor({ name: `${oldMember.user.tag}`, iconURL: oldMember.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
    .setTitle(`${lang.guild_member_update_role_issued[langs]}`)
    .addField(`${lang.guild_member_update_issued_role[langs]}`, `${role} (\`${role.name}\` / \`${role.id}\`)`)
    .addField(`${lang.guild_member_update_to_give[langs]}`, `${oldMember} (\`${oldMember.displayName}\` / \`${oldMember.id}\`)`)
    .addField(`${lang.guild_member_update_issued[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
    .setFooter({ text: `Yasin Helper#4959`, iconURL: `${client.user.avatarURL()}` })
    .setTimestamp()
    channel.send({ embeds: [roleGivedEmbed] })
  }

  if (newMember.roles.cache.size < oldMember.roles.cache.size) {
    let newRolesID = [];
    let oldRoleID;
    newMember.roles.cache.forEach(role => newRolesID.push(role.id));
    oldMember.roles.cache.forEach(role => { if (!newRolesID.some(elemet => elemet == role.id)) oldRoleID = role.id; });
    let role = oldMember.guild.roles.cache.get(oldRoleID);
    const entry = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first());
    let member = await newMember.guild.members.fetch(entry.executor.id);
    let roleRemovedEmbed = new MessageEmbed()
    .setColor(`RED`)
    .setAuthor({ name: `${oldMember.user.tag}`, iconURL: oldMember.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) })
    .setTitle(`${lang.guild_member_update_role_remove[langs]}`)
    .addField(`${lang.guild_member_update_roles_remove[langs]}`, `${role} (\`${role.name}\` / \`${role.id}\`)`)
    .addField(`${lang.guild_member_update_whom_remove[langs]}`, `${oldMember} (\`${oldMember.displayName}\` / \`${oldMember.id}\`)`)
    .addField(`${lang.guild_member_update_who_removed[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
    .setFooter({ text: `Yasin Helper#4959`, iconURL: `${client.user.avatarURL()}` })
    .setTimestamp()
    channel.send({ embeds: [roleRemovedEmbed] })
  }
}
  } catch(e) {
    console.log(e)
  }
}