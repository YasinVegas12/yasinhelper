const { MessageEmbed } = require('discord.js');
const User = require("../../structures/UserSchema.js");
const Prime = require("../../structures/PrimeSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");

let cooldown = new Set();
let cdseconds = 30;

module.exports = {
    name: "inv-put",
    aliases: ["iput", "invput"],
    module: "economy",
    description: "Положить роль в инвентарь",
    description_en: "Put the role in the inventory",
    description_ua: "Покласти роль в інвантарь",
    usage: "inv-put [roleID]",
    example: "/inv-put 810470426064453702 - положить роль в инвентарь",
    example_en: "/inv-put 810470426064453702 - put the role in the inventory",
    example_ua: "/inv-put 810470426064453702 - покласти роль в інвентар",
    cooldown: 30,
  async run(client,message,args,langs,prefix) {

    try {

        const developer = [
            config.developer,
        ];

        let data = await User.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        });
    
        if(!data) return;
    
        let dataPRIME = await Prime.findOne({
            userID: message.author.id,
            status: "Активна"
        });

        if(!message.guild.me.permissions.has("MANAGE_ROLES")) {
            let noPermission = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.giverole_permissions[langs]} \`MANAGE_ROLES\``)
            .setTimestamp() 
            return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        if(cooldown.has(message.author.id)) {
            let cooldownEmbed = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.cooldown_inv[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        if(data.inventory === undefined || data.inventory.length === 0) {
            let invNull = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.inv_clear[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [invNull], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        let role = message.guild.roles.cache.find(r => r.name === args[0]) || message.guild.roles.cache.find(r => r.id == args[0]) || message.mentions.roles.first();
    
        if(!role) {
            let roleUndefined = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.inv_role_undefined[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [roleUndefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        if(!data.inventory.includes(role.id)) {
            let alreadyHasRole = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.inv_role_not_buyed[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [alreadyHasRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        if(message.member.roles.cache.some(r => [role.id].includes(r.id))) {
            let alreadyPutRole = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.inv_role_already[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [alreadyPutRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        if(role.position >= message.guild.me.roles.highest.position) {
            let myRoleIsBelow = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.giverole_bot_position[langs]}`)
            .setTimestamp() 
            return message.reply({ embeds: [myRoleIsBelow], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }
    
        message.member.roles.add(role.id).catch(err => {});
        
        let rolePutInv = new MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(`${lang.successfull[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.inv_take_role[langs]} ${role}`)
        .setTimestamp()
        message.reply({ embeds: [rolePutInv], allowedMentions: { repliedUser: false }, failIfNotExists: false })
    
        if(!dataPRIME) {
            if(!developer.some(dev => dev == message.author.id)) {
                cooldown.add(message.author.id);
            }
    
            setTimeout(() => {
                cooldown.delete(message.author.id)
            }, cdseconds * 1000)
        }
        } catch (e) {
            console.log(e)
        }
    }
}