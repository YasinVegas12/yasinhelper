const { MessageEmbed } = require("discord.js");
const lang = require("../../language.json");

module.exports = {
    name: "ping",
    module: "info",
    description: "Узнать пинг бота",
    description_en: "Get the ping of the bot/shards",
    description_ua: "Дізнатися пінг бота",
    usage: "ping",
    example: "/ping",
    example_en: "/ping",
    example_ua: "/ping",
  async run(client,message,args,langs) {

    try {

        const mainEmbed = new MessageEmbed()
        .setColor(`#f58b0a`)
        .setDescription('**Calculate ping...**')
        .setFooter({ text: `${lang.requested_by[langs]} ${message.author.username}`,iconURL: `${message.member.user.displayAvatarURL({ dynamic: true})}` })

        const msg = await message.reply({ embeds: [mainEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp;

        let shard = await client.shard.broadcastEval(client => client.ws.ping)
        shard.reduce((shard1, shard2) => 

        setTimeout(async function(){ 
            const embed = new MessageEmbed()
                .setColor(`BLUE`)
                .setTitle(`Pong🏓`)
                .setDescription(`${lang.ping_current_shard[langs]} **(${message.guild.shard.id})**: \`${shard1} ms\`\n\n${lang.ping_all_shards[langs]}\n${lang.ping_shard_zero[langs]} \`${shard1} ms\`\n${lang.ping_shard_one[langs]} \`${shard2} ms\`\n\n${lang.ping_commands_reply[langs]} \`${Math.floor(msg.createdTimestamp - timestamp)} ms\``)
                .setFooter({ text: `${lang.requested_by[langs]} ${message.author.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true})}`})
                .setThumbnail(message.guild.iconURL())
            msg.edit({embeds: [embed]})
        },1500))
    } catch (e) {
        console.log(e)
    }
  }
}