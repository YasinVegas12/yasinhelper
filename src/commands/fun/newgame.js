const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Guild = require("../../structures/GuildSchema.js");
const lang = require("../../language.json");
const config = require("../../config.json");
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "newgame",
    module: "fun",
    description: "Сыграть в новую игру",
    description_en: "Play a new game",
    description_ua: "Зіграти в нову гру",
    usage: "newgame",
    example: "/newgame",
    example_en: "/newgame",
    example_ua: "/newgame",
  async run(client,message,args,langs) {

    try {

        let data = await Guild.findOne({
            guildID: message.guild.id
        });
    
        if(!data) return;

        let primeCommand = new MessageEmbed()
        .setColor(`RED`)
        .setTitle(`${lang.title_error[langs]}`)
        .setDescription(`\`${message.author.username}\`, ${lang.prime_server_command[langs]}`)
        .setTimestamp()
        if (data.prime === false) return message.reply({ embeds: [primeCommand], allowedMentions: { repliedUser: false }, failIfNotExists: false }) 

        class Game {
            score = 0;
        
            player = new Player(random(2, config.game.settings.xMax), random(2, config.game.settings.yMax))
            box = new Box(random(2, config.game.settings.xMax - 2), random(2, config.game.settings.yMax - 2))
            finish = new Finish(random(0, config.game.settings.xMax), random(0, config.game.settings.yMax))
        
            render() {
                if (this.box.x == this.finish.x && this.box.y == this.finish.y) {
                    this.score++;
                    this.resetPositions();
                }
                let game = `${lang.newgame_score[langs]}: ${this.score}\n`
        
                for (let i = 0; i < config.game.settings.yMax; i++) {
                    for (let j = 0; j < config.game.settings.xMax; j++) {
                        if (i == this.player.y && j == this.player.x)
                            game += config.game.objects.player;
                        else if (i == this.box.y && j == this.box.x)
                            game += config.game.objects.box;
                        else if (i == this.finish.y && j == this.finish.x)
                            game += config.game.objects.finish;
                        else
                            game += config.game.objects.background;
                    }
                    game += "\n"
                }
                return game;
            }
            resetPositions() {
                this.x = random(2, config.game.settings.xMax - 2);
                this.y = random(2, config.game.settings.yMax - 2);
                this.box.x = random(2, config.game.settings.xMax - 2);
                this.box.y = random(2, config.game.settings.yMax - 2);
                this.finish.x = random(2, config.game.settings.xMax - 2);
                this.finish.y = random(2, config.game.settings.yMax - 2);
            }
        }
        
        class Player {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        
            moveLeft(box) {
                if (this.x <= 0) return;
                if (this.y == box.y) {
                    if (this.x == 1 && box.x == 0) return;
                    if (box.x + 1 == this.x) {
                        box.x -= 1;
                    }
                }
                this.x -= 1;
            }
        
            moveRight(box) {
                if (this.x >= config.game.settings.xMax - 1) return;
                if (this.y == box.y) {
                    if (this.x == config.game.settings.xMax - 2 && box.x == config.game.settings.xMax - 1) return;
                    if (box.x - 1 == this.x) {
                        box.x += 1;
                    }
                }
                this.x += 1;
            }
        
            moveUp(box) {
                if (this.y <= 0) return;
                if (this.x == box.x) {
                    if (this.y == 1 && box.y == 0) return;
                    if (box.y + 1 == this.y) {
                        box.y -= 1;
                    }
                }
                this.y -= 1;
            }
        
            moveDown(box) {
                if (this.y >= config.game.settings.yMax - 1) return;
                if (this.x == box.x) {
                    if (this.y == config.game.settings.yMax - 2 && box.y == config.game.settings.yMax - 1) return;
                    if (box.y - 1 == this.y) {
                        box.y += 1;
                    }
                }
                this.y += 1;
            }
        }
        
        class Box {
            constructor(x, y) {
                this.x = x;
                this.y = y
            }
        }
        
        class Finish {
            constructor(x, y) {
                this.x = x;
                this.y = y
            }
        }
        
        function random(min, max) {
            return Math.floor(min + Math.random() * (max - min))
        }
        
            let game = new Game();

            const row = new MessageActionRow()

			.addComponents(
				new MessageButton()
                    .setCustomId('leftButton')
                    .setStyle('PRIMARY')
                    .setEmoji(config.game.controls.left),
                new MessageButton()
                    .setCustomId('upButton')
                    .setStyle('PRIMARY')
                    .setEmoji(config.game.controls.up),
                new MessageButton()
                    .setCustomId('downButton')
                    .setStyle('PRIMARY')
                    .setEmoji(config.game.controls.down),
                new MessageButton()
                    .setCustomId('rightButton')
                    .setStyle('PRIMARY')
                    .setEmoji(config.game.controls.right),
                new MessageButton()
                    .setCustomId('endButton')
                    .setStyle('DANGER')
                    .setEmoji(config.game.controls.stop)
                );
        
            let msg = await message.reply({ content: game.render(), ephemeral: true, components: [row], allowedMentions: { repliedUser: false }, failIfNotExists: false })

            const filterLeftButton = i => i.customId === 'leftButton' && i.user.id === `${message.author.id}`;
            const filterUpButton = i => i.customId === 'upButton' && i.user.id === `${message.author.id}`;
            const filterDownButton = i => i.customId === 'downButton' && i.user.id === `${message.author.id}`;
            const filterRightButton = i => i.customId === 'rightButton' && i.user.id === `${message.author.id}`;
            const filterEndButton = i => i.customId === 'endButton' && i.user.id === `${message.author.id}`;

            const collectorLeft = message.channel.createMessageComponentCollector({ filterLeftButton, time: 6000000  });
            const collectorUp = message.channel.createMessageComponentCollector({ filterUpButton, time: 6000000  });
            const collectorDown = message.channel.createMessageComponentCollector({ filterDownButton, time: 6000000  });
            const collectorRight = message.channel.createMessageComponentCollector({ filterRightButton, time: 6000000  });
            const collectorEnd = message.channel.createMessageComponentCollector({ filterEndButton, time: 6000000  });

            collectorLeft.on('collect', async i => {
                if (i.customId === 'leftButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    await i.deferUpdate().catch(err => {});
		            await wait(100);
                    game.player.moveLeft(game.box);
                    msg.edit({ content: game.render(), allowedMentions: { repliedUser: false }, failIfNotExists: false });
                }
            });

            collectorUp.on('collect', async i => {
                if (i.customId === 'upButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    await i.deferUpdate().catch(err => {});
		            await wait(100);
                    game.player.moveUp(game.box);
                    msg.edit({ content: game.render(), allowedMentions: { repliedUser: false }, failIfNotExists: false });
                }
            });

            collectorDown.on('collect', async i => {
                if (i.customId === 'downButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    await i.deferUpdate().catch(err => {});
		            await wait(100);
                    game.player.moveDown(game.box);
                    msg.edit({ content: game.render(), allowedMentions: { repliedUser: false }, failIfNotExists: false });
                }
            });

            collectorRight.on('collect', async i => {
                if (i.customId === 'rightButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    await i.deferUpdate().catch(err => {});
		            await wait(100);
                    game.player.moveRight(game.box);
                    msg.edit({ content: game.render(), allowedMentions: { repliedUser: false }, failIfNotExists: false });
                }
            });

            collectorEnd.on('collect', async i => {
                if (i.customId === 'endButton' && i.user.id === `${message.author.id}` && i.message.id === `${msg.id}`) {
                    msg.delete().catch(err => {}) && message.delete().catch(err => {})
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
}