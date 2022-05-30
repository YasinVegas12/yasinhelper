const Guild = require("../structures/GuildSchema.js");

module.exports = async (client, message) => {

    if(message.channel.type === "DM") return;

    try {
        
        let data = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if(!data) return;
    
        if(data.delpin === false) return;
        if(!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) return;
    
        if(message.type === "CHANNEL_PINNED_MESSAGE") {
          message.delete().catch(err => {})
        }
    } catch (e) {
        console.log(e)
    }
}