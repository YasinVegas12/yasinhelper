const { MessageEmbed } = require('discord.js');
const lang = require("../../language.json");
const Shop = require("../../structures/ShopSchema.js");
const User = require("../../structures/UserSchema.js");
const Promo = require("../../structures/PromocodeSchema.js");

module.exports = {
    name: "buy",
    module: "economy",
    description: "Купить роль/прочие услуги в магазине",
    description_en: "Buy a role/other in the store",
    description_ua: "Придбати роль/інші послуги в магазині",
    usage: "buy [global/server] [number/role ID]",
    example: "/buy global 1 - Купить +1 лвл к промокоду\n/buy server 843141603300081684 - Купить роль",
    example_en: "/buy global 1 - Buy +1 level to the promo code\n/buy server 843141603300081684 - Buy a role",
    example_ua: "/buy global 1 - Придбати +1 рівень до промокоду\n/buy server 843141603300081684 - Придбати роль",
  async run(client,message,args,langs,prefix,ownerTAG,supportrole,warns,prime) {

    try {

        let promo = await Promo.findOne({
            ownerpromoID: message.author.id,
            guildID: message.guild.id
        });
    
        let data = await User.findOne({
            userID: message.author.id,
            guildID: message.guild.id
        });
    
        if(!data) return;
    
        let shop = await Shop.find({
            guildID: message.guild.id
        });

        let noPermission = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.removerole_permissions[langs]} \`MANAGE_ROLES\``)
        .setTimestamp() 
        if(!message.guild.me.permissions.has("MANAGE_ROLES")) return message.reply({ embeds: [noPermission], allowedMentions: { repliedUser: false }, failIfNotExists: false })

        if(args[0] !== `global` && args[0] !== `server`) {
            let errorMessage = new MessageEmbed()
            .setColor(`RED`)
            .setTitle(`${lang.title_error[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.buy_description[langs]}`)
            .setTimestamp()
            return message.reply({ embeds: [errorMessage], allowedMentions: { repliedUser: false }, failIfNotExists: false })
        }

        if(args[0] == `global`) {
            if(args[1] !== `1` && args[1] !== `2` && args[1] !== `3` && args[1] != `4`) {
                let errorNumber = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_wrong_number[langs]} \`${prefix}shop-list global\``)
                .setTimestamp()
                return message.reply({ embeds: [errorNumber], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }
            if(args[1] == `1`) {
                if(!promo) {
                    let promoUndefined = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_promocode_undefined[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [promoUndefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(promo.lvlpromo >= 4) {
                    let errorLvl = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_promocode_lvlmax[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorLvl], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(data.money < 1000000) {
                    let errorMoney = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_promocode_nomoney[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let lvlpromoUpdate = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_promocode_lvl[langs]} \`${promo.lvlpromo + 1}\``)
                .setTimestamp()
                message.reply({ embeds: [lvlpromoUpdate], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                promo.lvlpromo += 1
                promo.save()
                data.money -= 1000000
                data.save()
            }else if(args[1] == `2`) {
                if(isNaN(args[2])) {
                    let errorNanEmbed = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_rubles[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorNanEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(parseInt(args[2]) > 999999999) {
                    let errorValue = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.value_big[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(data.money < parseInt(args[2]) * 250000) {
                    let noMoney = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_rubles_nomoney[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(data.rubles >= 999999999) {
                    let errorRubles = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_rubles_error[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorRubles], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let buyRubles = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.member.displayName}\`, ${lang.buy_rubles_successfully[langs]} \`${data.rubles + parseInt(args[2])}\``)
                .setTimestamp()
                message.reply({ embeds: [buyRubles], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                data.rubles += parseInt(args[2])
                data.money -= parseInt(args[2] * 250000)
                data.save()
            }else if(args[1] == `3`) {
                if(isNaN(args[2])) {
                    let errorNanEmbed = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_work_skill[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorNanEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(parseInt(args[2]) > 999999999) {
                    let errorValue = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.value_big[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(data.money < parseInt(args[2]) * 30000) {
                    let noMoney = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_rubles_nomoney[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(data.Job_skill >= 999999999) {
                    let errorRubles = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_work_skill_max[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorRubles], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let buyJobSkill = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_work_skills[langs]} \`${data.Job_skill + parseInt(args[2])}\``)
                .setTimestamp()
                message.reply({ embeds: [buyJobSkill], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                data.Job_skill += parseInt(args[2])
                data.money -= parseInt(args[2] * 30000)
                data.save()
            } else if (args[1] === `4`) {
                if(isNaN(args[2])) {
                    let errorNanEmbed = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_worms[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorNanEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(parseInt(args[2]) > 999999999) {
                    let errorValue = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.value_big[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorValue], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(data.money < parseInt(args[2]) * 10000) {
                    let noMoney = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_rubles_nomoney[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [noMoney], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                if(data.worms >= 999999999) {
                    let errorRubles = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.buy_worms_max[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorRubles], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }

                let buyWorms = new MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`${lang.successfull[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_worms_text[langs]} \`${data.worms + parseInt(args[2])}\` ${lang.worms[langs]}`)
                .setTimestamp()
                message.reply({ embeds: [buyWorms], allowedMentions: { repliedUser: false }, failIfNotExists: false })

                data.worms += parseInt(args[2])
                data.money -= parseInt(args[2] * 10000)
                data.save()
            }
        }else if(args[0] == `server`) {
            if(shop.length === 0) {
                let shopClear = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_server_clear[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [shopClear], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let totalRoles = await Shop.find({
                guildID: message.guild.id
            });
    
            if(prime === false) {
                if(totalRoles.length > 15) {
                    let errorRoles = new MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`${lang.title_error[langs]}`)
                    .setDescription(`\`${message.author.username}\`, ${lang.shop_server_prime[langs]}`)
                    .setTimestamp()
                    return message.reply({ embeds: [errorRubles], allowedMentions: { repliedUser: false }, failIfNotExists: false })
                }
            }

            if(isNaN(args[1])) {
                let roleIsNaN = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_server_role[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [roleIsNaN], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let tovar = await Shop.findOne({
                roleID: args[1],
                guildID: message.guild.id
            });

            if(!tovar) {
                let tovarUndefined = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_role_undefined[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [tovarUndefined], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let role = message.guild.roles.cache.find(r => r.name === tovar.roleName) || message.guild.roles.cache.find(r => r.id == tovar.roleID)

            if(!role) {
                let errorRole = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_role_notcreate[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(data.money < tovar.price) {
                let noRolePrice = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_role_nomoney[langs]} \`${tovar.price}\``)
                .setTimestamp()
                return message.reply({ embeds: [noRolePrice], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(role.position >= message.guild.me.roles.highest.position) {
                let errorPosition = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_role_position[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [errorPosition], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            if(message.member.roles.cache.has(role.id)) {
                let hasRole = new MessageEmbed()
                .setColor(`RED`)
                .setTitle(`${lang.title_error[langs]}`)
                .setDescription(`\`${message.author.username}\`, ${lang.buy_roles_has[langs]}`)
                .setTimestamp()
                return message.reply({ embeds: [hasRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })
            }

            let buyRole = new MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`${lang.successfull[langs]}`)
            .setDescription(`\`${message.author.username}\`, ${lang.buy_role_successfully[langs]} <@&${role.id}>`)
            .setTimestamp()
            message.reply({ embeds: [buyRole], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            message.member.roles.add(role.id)
            data.money -= tovar.price
            if(data.inventory === undefined) {
                data.inventory = role.id
            }else{
                data.inventory += `;${role.id}`
            }
            data.save()
        }
        } catch (e) {
            console.log(e)
        }
    }
}