const Guild = require("../../src/structures/GuildSchema.js");

module.exports = async (client, message) => {

    if(message.channel.type === "DM") return;
    if(message.author.bot) return;

    try {

        let data = await Guild.findOne({
            guildID: message.guild.id
        });

        if (!data) return;

        if(data.antilink === false) return;

        if(message.member.permissions.has("MANAGE_MESSAGES")) return;

        if(!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) return;

        function isUrl(s) { 
            var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ 
            return regexp.test(s);
        }
        
        if(isUrl(message.content)) return message.delete().catch(err => {})
    } catch (e) {
        console.log(e)
    }
}