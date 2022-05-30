const { MessageEmbed, WebhookClient } = require("discord.js");
const Guild = require("../structures/GuildSchema.js");
const BlackList = require("../structures/BotBlackListSchema.js");

module.exports = async (client,guild) => {

  try {

    const webhookClient = new WebhookClient({ id: '974240363353088000', token: '7d1VqWw5OcfSJNAuNeKCIfG8OK4d8aJoZ8F_Pu_Dn4e-i65JpLNAhhwyH_ljihKbUQZx' });

    const promises = [
        client.shard.fetchClientValues('guilds.cache.size')
    ];

    let owner = undefined;

    let ownerid = await client.users.fetch(guild.ownerId).then(user => owner = user.id);
    
    if (typeof ownerid !== "string") {
        ownerid = require("util").inspect(ownerid, { depth: 0 });
    }

    let ownertag = await client.users.fetch(ownerid).then(user => owner = user.tag)

    if (typeof ownertag !== "string") {
        ownertag = require("util").inspect(ownerid, { depth: 0 });
    }

    let own = await client.users.fetch(ownerid).catch(() => {});

    let ownBlacklist = await BlackList.findOne({
        userID: ownerid,
        fullBAN: true
    });

    if (ownBlacklist) {
        let blackListDM = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`Error`)
        .setDescription(`You are blacklisted the bot for the reason: \`${ownBlacklist.reason}\`\nDon't agree with the decision? We are waiting on our support server [Yasin Helper Community](https://discord.gg/pcjm28pGsa)`)
        .setThumbnail(client.user.avatarURL())
        .setTimestamp()
        own.send({ embeds: [blackListDM] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})
        return guild.leave()
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

    let kanal = guild.channels.cache.find((c) => c.type === `GUILD_TEXT`);

    let embedMsg = new MessageEmbed()
    .setColor(`#42f55a`)
    .setDescription(`**🇷🇺 Здравствуйте! Спасибо за то, что добавили бота на ваш сервер под названием** \`${guild.name}\`\n**⚡ Мой префикс:** \`/\`\n**⚡ Для загрузки саппорт системы используйте команду** \`/upload\`\n**⚡ Основной список команд находится в команде** \`/help\`**.**\n**⚡ Нашли баг? Сообщите о нем с помощью команды** \`/bug\`\n**⚡ В случае возникновения каких-либо проблем, либо же Вам нужна помощь по настройке бота, советуем обратиться на наш [сервер тех поддержки.](https://discord.gg/pcjm28pGsa)**\n\n**🇺🇸 Hello! Thanks for adding bot to your server** \`${guild.name}\`\n**⚡ My prefix:** \`/\`\n**⚡ For loading support system use command** \`/upload\`\n**⚡ You have need to change language? Use command** \`/set language en\`\n**⚡ The main command list is in command** \`/help\`\n**⚡ You have need to help? Join to [support server](https://discord.gg/pcjm28pGsa)**\n\n**:flag_ua: Вітаю! Дякую, що додали бота на ваш сервер** \`${guild.name}\`\n**⚡ Мій префікс:** \`/\`\n**⚡ Для завантаження саппорт системи використовуйте команду** \`/upload\`\n**⚡ Хочете змінити мову бота на українську? Використайте команду** \`/set language ua\`\n**⚡ Основний список команд знаходиться у команді** \`/help\`\n**⚡ Потрібна допомога? Приєднуйтесь до [серверу підтримки](https://discord.gg/pcjm28pGsa)**`)
    .setFooter({ text: `Yasin Helper`, iconURL: `${client.user.avatarURL()}` })
    if (kanal) kanal.send({ embeds: [embedMsg] }).catch(err => {});

    let guildid = guild.id ?? "Неизвестно"
    let guildname = guild.name ?? "Неизвестно"
    let emojis = guild.emojis?.cache.size ?? "Неизвестно"
    let roles = guild.roles?.cache.size ?? "Неизвестно"

    let xxxembed = new MessageEmbed()
    .setColor(`#42f55a`)
    .addField(`[🔥] Yasin Helper добавлен на новый сервер [🔥]`, `\n**💬 Название сервера:** \`${guildname}\` 💬\n**💬 Количество участников:** \`${guild.memberCount}\`💬\n**💬 ID сервера:** \`${guildid}\` 💬\n**💬 Количество текстовых каналов:** \`${guild.channels.cache.filter(c => c.type == 'text').size}\` 💬\n**💬 Количество голосовых каналов:** \`${guild.channels.cache.filter(c => c.type == 'voice').size}\` 💬\n**💬 Ролей:** \`${roles}\` 💬\n**💬 Эмодзи:** \`${emojis}\` 💬\n**💬 Дата создания:** \`${guild.createdAt.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false })} (${checkDays(guild.createdAt)})\`💬\n**👤 Владелец сервера:** \`${ownertag}\` 👤\n**👤 ID Владельца сервера:** \`${ownerid}\` 👤`)
    .setThumbnail(guild.iconURL())
    .setFooter({ text: `Количество серверов на данный момент: ${totalGuilds}`, iconURL: `${client.user.avatarURL()}` })
    
    webhookClient.send({
        username: 'Yasin Helper',
        avatarURL: 'https://cdn.discordapp.com/avatars/696430799012102155/e104c1f11769851a1c58f949d2790af0.png?size=4096',
        embeds: [xxxembed],
    });

    Guild.findOne({guildID: guildid}, (err,res) => {
        const webhookDB = new WebhookClient({ id: '974240363353088000', token: '7d1VqWw5OcfSJNAuNeKCIfG8OK4d8aJoZ8F_Pu_Dn4e-i65JpLNAhhwyH_ljihKbUQZx' });
        if(err) return webhookDB.send(`[❌DataBase] Произошла ошибка при добавлении сервера в базу-данных`)
        if(!res) {
            let guild = new Guild({guildID: guildid})

            let newGuild = new MessageEmbed()
            .setColor(`#32a8a4`)
            .setTitle(`✅ Сервер добавлен в базу данных`)
            .setDescription(`**Сервер** \`${guildname}\` **был добавлен в базу данных**`)
            .addField(`🆔 Сервера`, `**${guildid}**`)
            .setFooter({ text: `Yasin Helper#4959`, iconURL: `${client.user.avatarURL()}` })
            .setTimestamp()

            webhookDB.send({
                username: 'Yasin Helper',
                avatarURL: 'https://cdn.discordapp.com/avatars/696430799012102155/e104c1f11769851a1c58f949d2790af0.png?size=4096',
                embeds: [newGuild],
            });
            
            guild.save().catch(err => webhookDB.send(`\`[❌DataBase]\` Произошла ошибка при сохранении сервера в базу данных. Ошибка: \`\`\`${err}\`\`\``));
            }
        });
    });
    } catch(e) {
        console.log(e)
    }
}