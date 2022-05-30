const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, message) => {
    try {
        
    if(message.author.bot) return;
    if(message.content.length === 0) return;
    if (message.channel.type === "DM") {

    const webhookClient = new WebhookClient({ id: '974261390665711656', token: 'wYrm7HO1opvns6RCnWd5dGjx_4JOqnIlyuPUc9x6_k25cNLUxwWwSghNskwiWDSa1vXg' });

    let content = message.content.length > 2048 ? `${message.content.slice(0, 2000)}...` : message.content;
    
    let embedDM = new MessageEmbed()
    .setColor('ff6600')
    .setTitle(`${message.author.tag} [${message.author.id}]`)
    .setDescription(content)
    .setTimestamp()
    if(message.attachments.first()) {
        let type = message.attachments.first().contentType
        if (type.includes("image/")) embedDM.setImage(`${message.attachments.first().proxyURL}`)
    }

    webhookClient.send({
        username: 'Yasin Helper',
        avatarURL: 'https://cdn.discordapp.com/avatars/696430799012102155/e104c1f11769851a1c58f949d2790af0.png?size=4096',
        embeds: [embedDM],
    });
}
    } catch(e) {
        console.log(e)
    }
}