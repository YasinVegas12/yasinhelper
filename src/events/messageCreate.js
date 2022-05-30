const { MessageEmbed, WebhookClient } = require("discord.js");
const Bans = require("../structures/BotBlackListSchema.js");
const User = require("../structures/UserSchema.js");
const Guild = require("../structures/GuildSchema.js");
const lang = require("../language.json");
const settings = require("../config.json");

module.exports = async (client, message) => {

  if(message.author.bot || message.channel.type === "DM") return;

    const ownerTAG = await client.users.fetch("849924885055537153").then(u => u.tag).catch(() => {}) ?? "Yasin_Vegas#6666";

    let dataBAN = await Bans.findOne({
        userID: message.author.id,
        fullBAN: true
    });

    let data = await Guild.findOne({
        guildID: message.guild.id,
        ignoreChannels: message.channel.id
    });

    await User.findOne({guildID: message.guild.id, userID: message.author.id}, (err,res) => {
      try {
      const webhookClient = new WebhookClient({ id: '974260648877899806', token: 'dWWCMU6BcOBk_1WZLvmjPOY6ntFDQeFQ766FJDjJlgVCt4Ot4eLizU3iMevXfo2Xae3J' });
      if(err) return webhookClient.send(`\`[❌DataBase]\` **Произошла ошибка при добавлении пользователя в базу данных**`)

      if(!res){
        let user = new User({guildID: message.guild.id, userID: message.author.id})
        let userBDnew = new MessageEmbed()
        .setColor(`#32a8a4`)
        .setTitle(`✅ Пользователь добавлен в базу данных`)
        .setDescription(`**Пользователь** \`${message.author.username}\` **был добавлен в базу данных**`)
        .addField(`🆔 Пользователя`, `**${message.author.id}**`)
        .addField(`🆔 Сервера`, `**${message.guild.id}**`)
        .setFooter({ text: `Yasin Helper#4959`, iconURL: `${client.user.avatarURL()}` })
        .setTimestamp()

        webhookClient.send({
          username: 'Yasin Helper',
          avatarURL: 'https://images-ext-2.discordapp.net/external/6tVaUxectogf8lZc5X8fWTGd2tbzlG6I5AtVbWYYLNI/https/cdn.discordapp.com/embed/avatars/4.png',
          embeds: [userBDnew],
        });

        user.save().catch(err => webhookClient.send(`\`[❌DataBase]\` **Произошла ошибка при сохранении данных в базу данных. Ошибка:** \`\`\`${err}\`\`\``));
      }else{
        res.messages++
        res.save()
      }
    } catch(e) {
      console.log(e)
    }
    })

    await Guild.findOne({guildID: message.guild.id}, (err,res) => {
      try {
      const webhookClient = new WebhookClient({ id: '974260648877899806', token: 'dWWCMU6BcOBk_1WZLvmjPOY6ntFDQeFQ766FJDjJlgVCt4Ot4eLizU3iMevXfo2Xae3J' });
      if(err) return webhookClient.send(`[❌DataBase] Произошла ошибка при добавлении сервера в базу-данных`)

      if(!res){
        let guild = new Guild({guildID: message.guild.id})
        let guildBDnew = new MessageEmbed()
        .setColor(`#32a8a4`)
        .setTitle(`✅ Сервер добавлен в базу данных`)
        .setDescription(`**Сервер** \`${message.guild.name}\` **был добавлен в базу данных**`)
        .addField(`🆔 Сервера`, `**${message.guild.id}**`)
        .setFooter({ text: `Yasin Helper#8880`, iconURL: `${client.user.avatarURL()}` })
        .setTimestamp()

        webhookClient.send({
          username: 'Yasin Helper',
          avatarURL: 'https://images-ext-2.discordapp.net/external/6tVaUxectogf8lZc5X8fWTGd2tbzlG6I5AtVbWYYLNI/https/cdn.discordapp.com/embed/avatars/4.png',
          embeds: [guildBDnew],
        });

        guild.save().catch(err => webhookClient.send(`\`[❌DataBase]\` Произошла ошибка при сохранении сервера в базу данных. Ошибка: \`\`\`${err}\`\`\``));
    } else {
    if(message.author.bot || message.channel === null || message.channel.type === "DM") return;

    let prefix = res.prefix
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();
    const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    let supchannel = res.supportchannel
    let channel = message.guild.channels.cache.find(c => c.name == supchannel) || message.guild.channels.cache.find(c => c.id == supchannel);
    let langs = res.language
    let supportrole = res.supportrole
    let warns = res.warns
    let prime = res.prime
    let warnPunish = res.warnPunish

    const cmdDisabled = new MessageEmbed()
    .setColor(`RED`)
    .setTitle(`${lang.title_error[langs]}`)
    .setDescription(`\`${message.author.username}\`, ${lang.cmd_disabled[langs]}`)
    .setTimestamp()

    const moduleDisabled = new MessageEmbed()
    .setColor(`RED`)
    .setTitle(`${lang.title_error[langs]}`)
    .setDescription(`\`${message.author.username}\`, ${lang.module_disabled[langs]}`)
    .setTimestamp()
    
    if(!message.guild.me.permissions.has(["SEND_MESSAGES","EMBED_LINKS"])) return;
    if(!message.channel.permissionsFor(client.user.id).has(["SEND_MESSAGES","EMBED_LINKS"])) return;

    if(dataBAN) {
        let blockEmbed = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.blacklist_description[langs]} \`${dataBAN.reason}\`\n\n${lang.blacklist_two_description[langs]} \`Yasin Vegas#6666\``)
        .setThumbnail(client.user.avatarURL())
        .setTimestamp()
        return message.reply({ embeds: [blockEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    }

    if (data) {
        let blockChannel = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.channel_no_message[langs]}`)
        .setTimestamp()
        return message.reply({ embeds: [blockChannel], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    }

    if(command) {
      if (channel && message.channel.id === channel.id) return;
        if(command.module === "owner") {
            const developer = [ settings.developer ]; 
            if(!developer.some(dev => dev == message.author.id)) return;
        } else if (command.name === "message") {
          const developer = [ settings.developer ]; 
            if(!developer.some(dev => dev == message.author.id) && message.author.id != "819123244791365633") return;
        }
        if(command.module == "ad" && res.modules.ad != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.module == "economy" && res.modules.economy != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.module == "fun" && res.modules.fun != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.module == "info" && res.modules.info != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.module == "moderation" && res.modules.moderation != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.module == "nsfw" && res.modules.nsfw != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.module == "ticket" && res.modules.ticket != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.module == "user" && res.modules.user != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.module == "embed" && res.modules.embed != true) return message.reply({ embeds: [moduleDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "accept" && res.commands.accept != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "ad" && res.commands.ad != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "deny" && res.commands.deny != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "editad" && res.commands.editad != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "fish" && res.commands.fish != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "add-shop" && res.commands.addshop != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "edit-shop" && res.commands.editshop != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "shop-list" && res.commands.shoplist != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "dell-shop" && res.commands.dellshop != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "inv" && res.commands.inv != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "inv-put" && res.commands.invput != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "inv-take" && res.commands.invtake != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "buy" && res.commands.buy != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "coin-leaders" && res.commands.coinleaders != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "promo-leaders" && res.commands.promoleaders != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "deletepromocode" && res.commands.deletepromocode != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "bonus" && res.commands.bonus != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "box" && res.commands.box != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "createpromocode" && res.commands.createpromocode != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "game" && res.commands.game != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "jobs" && res.commands.jobs != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "mypromocode" && res.commands.mypromocode != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "pay" && res.commands.pay != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "promocode" && res.commands.promocode != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "setmoney" && res.commands.setmoney != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "try" && res.commands.try != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "work" && res.commands.work != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "works" && res.commands.works != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "ball" && res.commands.ball != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "kn" && res.commands.kn != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "serverinfo" && res.commands.serverinfo != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "newgame" && res.commands.newgame != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "reverse" && res.commands.reverse != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "accinfo" && res.commands.accinfo != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "covid" && res.commands.covid != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "discord" && res.commands.discord != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "ping" && res.commands.ping != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "prime" && res.commands.prime != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "profile" && res.commands.profile != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "stats" && res.commands.stats != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "vote" && res.commands.vote != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "ban" && res.commands.ban != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "chat" && res.commands.chat != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "check" && res.commands.check != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "clear" && res.commands.clear != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "edit" && res.commands.edit != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "giverole" && res.commands.giverole != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "kick" && res.commands.kick != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "msg" && res.commands.msg != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "mute" && res.commands.mute != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "myinfo" && res.commands.myinfo != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "pin" && res.commands.pin != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "removerole" && res.commands.removerole != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "blocksupport" && res.commands.blocksupport != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "removeblocksupport" && res.commands.removeblocksupport != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "setstat" && res.commands.setstat != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "unban" && res.commands.unban != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "unmute" && res.commands.unmute != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "unpin" && res.commands.unpin != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "unwarn" && res.commands.unwarn != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "warn" && res.commands.warn != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "history" && res.commands.history != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "4k" && res.commands.fourk != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "anal" && res.commands.anal != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "ass" && res.commands.ass != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "gif" && res.commands.gif != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "gonewild" && res.commands.gonewild != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "hanal" && res.commands.hanal != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "hass" && res.commands.hass != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "hentai" && res.commands.hentai != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "hmidriff" && res.commands.hmidriff != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "holo" && res.commands.holo != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "pussy" && res.commands.pussy != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "solo" && res.commands.solo != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "thigh" && res.commands.thigh != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "active" && res.commands.active != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "close" && res.commands.close != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "hold" && res.commands.hold != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "avatar" && res.commands.avatar != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "setnick" && res.commands.setnick != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "embsetup" && res.commands.embsetup != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "embfield" && res.commands.embfield != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "embsend" && res.commands.embsend != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        if(command.name == "embclear" && res.commands.embclear != true) return message.reply({ embeds: [cmdDisabled], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        command.run(client,message,args,langs,prefix,ownerTAG,supportrole,warns,prime,warnPunish);

        const webhookClient = new WebhookClient({ id: '974264401618141204', token: 'NF7rBZ_mbfUkyWvYDg0yor_-eUYNTrJ9Wa8mUp6DVeUtpA3qZVQn-Py_YUl_cAUuuA0i' });

        let content = message.content.length > 1900 ? `${message.content.slice(0, 1800)}...` : message;

        let cmdEmbed = new MessageEmbed()
        .setTitle(`Использована команда`)
        .setDescription(`Сервер - [**${message.guild.name}** - \`${message.guild.id}\`]\nПользователь - [**${message.author.tag}** - \`${message.author.id}\`]\nКоманда - **${cmdName}**\nИспользование: ${content}`)
        .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.avatarURL()}` })
        .setTimestamp()

        webhookClient.send({
            username: 'Yasin Helper',
            avatarURL: 'https://images-ext-2.discordapp.net/external/6tVaUxectogf8lZc5X8fWTGd2tbzlG6I5AtVbWYYLNI/https/cdn.discordapp.com/embed/avatars/4.png',
            embeds: [cmdEmbed],
        });

        if(res.deleteMessage === true) { 
          if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])) return message.delete().catch(err => {})
        }
      }
    }
  } catch(e) {
    console.log(e)
  }
})
}