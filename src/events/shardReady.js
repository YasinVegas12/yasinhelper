const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, shard) => {
  try {

    const webhookClient = new WebhookClient({ id: '974263069888872498', token: 'KVu55x_9X9NUgTDXUcMVMF3U8GcJnGxnQy1fo8iHy92oyd75RqZ5RpvVIZFal9pjsCc4' });
    client.user.setActivity(`/help | shard: ${shard}`, { type: 3, browser: "DISCORD IOS" });

    let shardReadyEmbed = new MessageEmbed()
    .setColor(`ff6600`)
    .setDescription(`📝 Шард ${shard} запущен и готов к работе.`)

    webhookClient.send({
      username: 'Yasin Helper',
      avatarURL: 'https://images-ext-2.discordapp.net/external/6tVaUxectogf8lZc5X8fWTGd2tbzlG6I5AtVbWYYLNI/https/cdn.discordapp.com/embed/avatars/4.png',
      embeds: [shardReadyEmbed],
    });

    console.log(`[+] Shard ${shard} start and ready to working.`);
  } catch (err) {
    console.log(err)
  }
};