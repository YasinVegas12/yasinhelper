const { MessageEmbed } = require("discord.js");
const util = require("util");

module.exports = {
    name: "eval",
    aliases: ["e"],
    module: "owner",
  async run(client,message,args) {
    
    try {

        let code = args.join(' '); 
        let isAsync = false;
        
        const noArgs = new MessageEmbed() 
        .setTitle(`Ошибка`)
        .setColor(`RED`) 
        .setDescription(`\`${message.author.username}\`, я что ванга по твоему, чтобы выполнить код с головы?`)
        .setFooter({ text: `${message.member.user.tag}`,iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })
        if(!code) return message.reply({ embeds: [noArgs], allowedMentions: { repliedUser: false }, failIfNotExists: false }).catch(err => {})
        
        code = code.replace(/(```(.+)?)?/g, '');
        
        if (code.includes('await')) isAsync = true;
        if (isAsync) code = `(async () => {${code}})()`;
        
        const before = process.hrtime.bigint();
        let executed = eval(code);
        
        if (util.types.isPromise(executed)) executed = await executed;
        const after = process.hrtime.bigint();
        
        if (typeof executed !== "string") { executed = require("util").inspect(executed, { depth: 0 }); }
        
        let type = typeof executed;
        
        function clean(text) {
            return text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`);
        }
        
        if (executed.length >= 1500) {
            message.reply({ content: 'Слишком много текста, отправлено в личные сообщения.', allowedMentions: { repliedUser: false }, failIfNotExists: false }).catch(err => {})
            message.member.send({ content: `**Time:** \`${(parseInt(after - before) / 1000000).toFixed(3)}ms\`\n**Type:** \`${type}\``}).catch(err => {})
            return message.member.send(executed, { split: '\n', code: 'js' });
        }
        
        message.reply({ content: `**Time:** \`${(parseInt(after - before) / 1000000).toFixed(3)}ms\`\n**Type:** \`${type}\``, allowedMentions: { repliedUser: false }, failIfNotExists: false }).catch(err => {})
        message.reply({ content: `\`\`\`js\n${clean(executed)}\`\`\``, allowedMentions: { repliedUser: false }, failIfNotExists: false }).catch(err => {})
        
        } catch (error) {
            message.reply(`\`\`\`js\n${error}\`\`\``).catch(err => {})
        }
    }
}