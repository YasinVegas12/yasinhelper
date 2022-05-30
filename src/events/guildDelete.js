const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client,guild) => {

    try {

    const webhookClient = new WebhookClient({ id: '974240363353088000', token: '7d1VqWw5OcfSJNAuNeKCIfG8OK4d8aJoZ8F_Pu_Dn4e-i65JpLNAhhwyH_ljihKbUQZx' });

    const promises = [
        client.shard.fetchClientValues('guilds.cache.size')
    ];

    let owner = undefined;

    let ownerid = await client.users.fetch(guild.ownerId).then(user => owner = user.id)

    if (typeof ownerid !== "string") {
        ownerid = require("util").inspect(ownerid, { depth: 0 });
    }

    let ownertag = await client.users.fetch(ownerid).then(user => owner = user.tag)

    if (typeof ownertag !== "string") {
        ownertag = require("util").inspect(ownerid, { depth: 0 });
    }
    
    return Promise.all(promises)
        .then(results => {
        const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);

    function checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " день" : " дней") + " назад";
    };

    let guildid = guild.id ?? "Неизвестно"
    let guildname = guild.name ?? "Неизвестно"
    let emojis = guild.emojis?.cache.size ?? "Неизвестно"
    let roles = guild.roles?.cache.size ?? "Неизвестно"
    
    let guildleftEmbed = new MessageEmbed()
    .setColor(`#42f55a`)
    .addField(`[❌] Yasin Helper удален с сервера [❌]`, `\n**💬 Название сервера:** \`${guildname}\` 💬\n**💬 Количество участников:** \`${guild.memberCount}\` 💬\n**💬 ID сервера:** \`${guildid}\` 💬\n**💬 Ролей:** \`${roles}\` 💬\n**💬 Эмодзи:** \`${emojis}\` 💬\n**💬 Дата создания:** \`${guild.createdAt.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false })} (${checkDays(guild.createdAt)})\` 💬\n**👤 Владелец сервера:** \`${ownertag}\` 👤\n**👤 ID Владельца сервера:** \`${ownerid}\` 👤`)
    .setThumbnail(guild.iconURL())
    .setFooter({ text: `Количество серверов на данный момент: ${totalGuilds}`, iconURL: `${client.user.avatarURL()}` })

    webhookClient.send({
        username: 'Yasin Helper',
        avatarURL: 'https://cdn.discordapp.com/avatars/696430799012102155/e104c1f11769851a1c58f949d2790af0.png?size=4096',
        embeds: [guildleftEmbed],
    });
        });
    } catch(e) {
        console.log(e)
    }
}