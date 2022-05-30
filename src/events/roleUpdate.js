const { MessageEmbed } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");

module.exports = async (client,oldRole,newRole) => {

  if(oldRole.type === "DM") return;
  if(newRole.type === "DM") return;

  try {

    const guildid = newRole.guild.id

    let data = await Guild.findOne({
        guildID: guildid
    });

    if (!data) return;

    let langs = data.language

    const guild = client.guilds.cache.get(guildid)

    if (!guild.me.permissions.has(["VIEW_AUDIT_LOG","SEND_MESSAGES","EMBED_LINKS"])) return;

    const logchannel = await guild.channels.cache.find(c => c.name === data.channels.roleUpdate) || guild.channels.cache.find(c => c.id === data.channels.roleUpdate)

    if (!logchannel) return;

    if (!logchannel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

    const entry = await guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());

    let member = await guild.members.fetch(entry.executor.id);

    if(oldRole.name != newRole.name) {
        let changeRoleName = new MessageEmbed()
        .setColor(`ORANGE`)
        .setTitle(`${lang.role_update_name_title[langs]}`)
        .addField(`${lang.role_update_name_before[langs]}`, `${oldRole.name}`)
        .addField(`${lang.role_update_name_after[langs]}`, `${newRole.name}`)
        .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
        .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
        .setTimestamp()
        logchannel.send({ embeds: [changeRoleName] })
    }

    if(oldRole.color != newRole.color) {
        function intToHex(num) {
            num >>>= 0
            const b = num & 0xFF
            const g = (num & 0xFF00) >>> 8
            const r = (num & 0xFF0000) >>> 16
            return rgbToHex(r, g, b)
        }
        
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
        }
        
        function rgbToHex(r, g, b) {
            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        }

        let changeRoleColor = new MessageEmbed()
        .setColor(`ORANGE`)
        .setTitle(`${lang.role_update_color_title[langs]}`)
        .addField(`${lang.role_update_oldrole_color[langs]}`, `${intToHex(oldRole.color)} (${oldRole} / \`${oldRole.name}\`)`)
        .addField(`${lang.role_update_newrole_color[langs]}`, `${intToHex(newRole.color)} (${newRole} / \`${newRole.name}\`)`)
        .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.tag}\` / \`${member.id}\`)`)
        .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
        .setTimestamp()
        logchannel.send({ embeds: [changeRoleColor] })
    } 

    if(oldRole.mentionable != newRole.mentionable) {
        if(oldRole.mentionable === false) { 
            mentionable = `${lang.role_update_mentionable_false[langs]}`
        }else{
            mentionable = `${lang.role_update_mentionable_true[langs]}`
        }

        if(newRole.mentionable === true) {
            mentionables = `${lang.role_update_mentionable_true[langs]}`
        }else{
            mentionables = `${lang.role_update_mentionable_false[langs]}`
        }

        let changeRoleMention = new MessageEmbed()
        .setColor(`ORANGE`)
        .setTitle(`${lang.role_update_mentionable_title[langs]}`)
        .addField(`${lang.role_update_mentionable_before[langs]}`, `${mentionable} (${oldRole} / \`${oldRole.name}\` / \`${oldRole.id}\`)`)
        .addField(`${lang.role_update_mentionable_after[langs]}`, `${mentionables} (${newRole} / \`${newRole.name}\` / \`${newRole.id}\`)`)
        .addField(`${lang.role_update_name_who[langs]}`, `${member} (\`${member.user.username}\` / \`${member.id}\`)`)
        .setFooter({ text: `${lang.role_update_name_timestamp[langs]}` })
        .setTimestamp()
        logchannel.send({ embeds: [changeRoleMention] })
    }
    } catch(e) {
        console.log(e)
    }
}