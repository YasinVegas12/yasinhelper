const { MessageEmbed } = require("discord.js");
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");

module.exports = {
    name: "user",
    module: "user",
    description: "Показывает информацию о любом пользователе.",
    description_en: "Display an every user info.",
    description_ua: "Відображає інформацію про любого користувача",
    usage: "user [User/ID]",
    example: "/user - Посмотреть информацию о своем аккаунте\n/user @Jason Kings#9417 - Упомянуть пользователя и посмотреть информацию об его аккаунте\n/user 608684992335446064 - Посмотреть информацию о пользователе с помощью id",
    example_en: "/user - view information about your account\n/user @Jason Kings#9417 - Mention user and view his account information\n/user 608684992335446064 - View user information using id",
    example_ua: "/user 608684992335446064 - Переглянути інформацію про користувача за допомогою id",
  async run(client,message,args,langs) {

    let dataBD = await Guild.findOne({
        guildID: message.guild.id
    });

    if(!dataBD) return;

    const flags = {
        DISCORD_EMPLOYEE: '<:discordstuff:930164740779544606>',
        DISCORD_PARTNER: '<:partner:930164845905600552>',
        BUGHUNTER_LEVEL_1: '<:bughunter:843235427964158032>',
        BUGHUNTER_LEVEL_2: '<:bughunter:843235427964158032>',
        HYPESQUAD_EVENTS: '<:hypesquad:930165105591746622>',
        HOUSE_BRAVERY: '<:braverysquad:930165248277770350>',
        HOUSE_BRILLIANCE: '<:brilliancesquad:930165350182567986>',
        HOUSE_BALANCE: '<:balancesquad:930165450590019654>',
        EARLY_SUPPORTER: '<:earlyboost:930165553673433218>',
        TEAM_USER: '<:developer:843231789044596817>',
        SYSTEM: '<:developer:843231789044596817>',
        VERIFIED_BOT: '<:bot:930165792677457960>',
        VERIFIED_DEVELOPER: '<:developer:843231789044596817>'
    };

    try {

    if(!args[0]) {

        let user = message.member;

        if (user.roles.cache.size === 1) {
            userroles = `${lang.noroles[langs]}`
        }else{
            userroles = user.roles.cache 
                .sort((a, b) => b.position - a.position) 
                .map(role => role.toString()) 
                .slice(0, -1);
        }

        if(user.roles.highest.name === "@everyone") {
            highestRole = `${lang.noroles[langs]}`
        }else{
            highestRole = user.roles.highest.name
        }

        const userFlags = user.user.flags.toArray();   
        let registed = user.user.createdAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false});
        let joindate = user.joinedAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false});

        const embed = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.accinfo_basic[langs]}`)
        .setThumbnail(`${user.user.displayAvatarURL({ dynamic: true })}`)
        .setDescription(`${lang.accinfo_tag[langs]} \`${user.user.tag}\`\n${lang.accinfo_id[langs]} \`${user.id}\`\n${lang.accinfo_registered[langs]} \`${registed}\`\n${lang.accinfo_avatar[langs]} [${lang.accinfo_link_avatar[langs]}](${user.user.displayAvatarURL({ dynamic: true })})`)
        .addField(`${lang.accinfo_server[langs]}`, `${lang.joined[langs]} \`${joindate}\`\n${lang.accinfo_user_highest_role[langs]} \`${highestRole}\`\n${lang.accinfo_roles[langs]}[${user.roles.cache.size - 1}]: ${userroles}`)
        .setTimestamp()
        if(userFlags.length > 0) embed.description +=`\n${lang.accinfo_badge[langs]} ${userFlags.map(flag => flags[flag]).join('')}`
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    }else{

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if(user) {

            if (user.roles.cache.size === 1) {
                userroles = `${lang.noroles[langs]}`
            }else{
                userroles = user.roles.cache 
                    .sort((a, b) => b.position - a.position) 
                    .map(role => role.toString()) 
                    .slice(0, -1);
            }
    
            if(user.roles.highest.name === "@everyone") {
                highestRole = `${lang.noroles[langs]}`
            }else{
                highestRole = user.roles.highest.name
            }

            const userFlags = user.user.flags?.toArray() ?? 0
            let registed = user.user.createdAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false});
            let joindate = user.joinedAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false});

            let embed = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.accinfo_basic[langs]}`)
            .setThumbnail(`${user.user.displayAvatarURL({ dynamic: true })}`)
            .setDescription(`${lang.accinfo_tag[langs]} \`${user.user.tag}\`\n${lang.accinfo_id[langs]} \`${user.id}\`\n${lang.accinfo_registered[langs]} \`${registed}\`\n${lang.accinfo_avatar[langs]} [${lang.accinfo_link_avatar[langs]}](${user.user.displayAvatarURL({ dynamic: true })})`)
            .addField(`${lang.accinfo_server[langs]}`, `${lang.joined[langs]} \`${joindate}\`\n${lang.accinfo_user_highest_role[langs]} \`${highestRole}\`\n${lang.accinfo_roles[langs]}[${user.roles.cache.size - 1}]: ${userroles}`)
            .setTimestamp()
            if(userFlags.length > 0) embed.description +=`\n${lang.accinfo_badge[langs]} ${userFlags.map(flag => flags[flag]).join('')}`
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        } else if(!user) {
            let user = await client.users.fetch(args[0]).catch(() => {})

            let noFound = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.user_no_found[langs]}`)
            .setTimestamp()
            if(!user) return message.reply({ embeds: [noFound], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const userFlags = user.flags.toArray();
            let registed = user.createdAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false});

            let embedNoFound = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.accinfo_basic[langs]}`)
            .setDescription(`${lang.accinfo_tag[langs]} \`${user.tag}\`\n${lang.accinfo_id[langs]} \`${user.id}\`\n${lang.accinfo_registered[langs]} \`${registed}\`\n${lang.accinfo_avatar[langs]} [${lang.accinfo_link_avatar[langs]}](${user.displayAvatarURL({ dynamic: true })})`)
            .setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp()
            if(userFlags.length > 0) embedNoFound.description +=`\n${lang.accinfo_badge[langs]} ${userFlags.map(flag => flags[flag]).join('')}`
            message.reply({ embeds: [embedNoFound], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    }
    } catch(e) {
        console.log(e)
    }
  }
}