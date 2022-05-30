const Discord = require('discord.js');
const mongoose = require('mongoose');
const { readdirSync } = require('fs');

class YasinHelperClient extends Discord.Client {
  constructor(config, options = {}) {
    super(options);

    this.commands = new Discord.Collection();
    this.token = config.token;
    this.dataURL = config.dataURL;
    this.developer = config.developer;
  }

  loadEvents() {
    const files = readdirSync('./src/events').filter(name => name.endsWith('.js'));

    files.forEach(file => {
      const event = require(`../events/${file}`);
      const eventName = file.split('.js')[0];
      this.on(eventName, event.bind(null, this));
    })
    console.log(`[Events] Events successfully has been loaded.`);
  };

  loadCommands() {
    readdirSync('./src/commands').forEach(module => {
      const commandFiles = readdirSync(`./src/commands/${module}/`).filter(file => file.endsWith('.js'));
      
        for (const file of commandFiles) {
          const command = require(`../commands/${module}/${file}`);
          command.category = module;
        this.commands.set(command.name, command);
      } 
    })
    console.log(`[Commands] Commands successfully has been loaded.`);
  };

  loadDataBase() {
    mongoose.connect(
      this.dataURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
      err => {
        if (err) throw err;
        console.log('[Database] Database is successfully connected.');
      },
    );
  };

  loadTriggers() {
    const files = readdirSync('./src/triggers').filter(name => name.endsWith('.js'));

    files.forEach(file => {
      const event = require(`../triggers/${file}`);
      this.on(`messageCreate`, event.bind(null, this));
    })
    console.log(`[Triggers] Triggers successfully has been loaded.`);
  };
};

module.exports = YasinHelperClient;