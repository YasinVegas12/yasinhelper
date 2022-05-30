const fs = require("fs");
const Guild = require("../structures/GuildSchema.js");
const User = require("../structures/UserSchema.js");
const Prime = require("../structures/PrimeSchema.js");
const Ticket = require("../structures/TicketSchema.js");
const BanSupport = require("../structures/BanSupportSchema.js");
const lang = require("../language.json");

module.exports = async (client, message) => { 
    console.log(`${client.user.username} has been started!`);

    setInterval(async function () {
        const nows = Date.now()
    
        const primes = {
            pEnd: {
              $lt: nows,
            },
            status: "Активна",
          }
    
        const results = await Prime.find(primes)
    
        if (results && results.length) {
          for (const result of results) {
            if(result.type === "server") {

              let dat = await Guild.findOne({
                  guildID: result.guildID
              });

              const sRole = dat.supportrole

              if (sRole.length > 5) {
                  sRole.length = 5
    
                  await Guild.findOneAndUpdate({
                      guildID: result.guildID
                  }, {
                      prime: false,
                      $set: {
                        supportrole: sRole
                      } 
                  });
              } else {
                  dat.prime = false
                  dat.save()
              }
            }else if(result.type === "user") {
  
              let dataUser = await User.find({
                  userID: result.userID
              });
  
              for(i = 0; i < dataUser.length; i++ ) {
                  dataUser[i].job = "безработный"
                  dataUser[i].save()
              }

              let server = client.guilds.cache.get("971617079851638784")
  
              let member = (await server.members.fetch()).get(result.userID);
            
              if(member) member.roles.remove("713022992585588738").catch(() => { });
            }
          } 
    
        await Prime.updateMany(primes, {
            status: "Неактивна"
        });
      }
    },10000);

  setInterval(async () => {

    try {

    const channels = await Ticket.find({ status: "Closed" });

    channels.forEach(async g => {

      let guild = client.guilds.cache.get(g.guildID)
      if (!guild) return;

      let data = await Guild.findOne({
        guildID: guild.id
      });

      let langs = data.language

      let channel = guild.channels.cache.find(c => c.id == g.channelID);
      if (!channel) return;

      let now = new Date()
      
      let time = g.tDelete
      if (time <= now) {

      let member = await guild.members.fetch(g.userID).catch(() => { })
      
      if (!guild.me.permissions.has("ADMINISTRATOR")) return;

      let delete_ticket_content = [];
        await channel.messages.fetch({limit: 100}).then(async messagestwo => {
         messagestwo.forEach(async msgcopy => {
          let date = new Date(+msgcopy.createdAt.valueOf() + 10800000);
            let formate_date = `[${date.getHours().toString().padStart(2, '0')}-` + 
              `${date.getMinutes().toString().padStart(2, '0')}-` + 
              `${date.getSeconds().toString().padStart(2, '0')}]`;
        if (!msgcopy.embeds[0]){
          delete_ticket_content.push(`${formate_date} ${msgcopy.member?.displayName ?? "Unknown"}: ${msgcopy.content}`)
        }else{
          delete_ticket_content.push(`${msgcopy.embeds[0].description}`)
          delete_ticket_content.push(`${formate_date} ${msgcopy.member?.displayName ?? "Unknown"}: ${msgcopy.content}`)
        }
      });
    });

    let i = delete_ticket_content.length - 1;
      while (i>=0){
        await fs.appendFileSync(`./${channel.name}.txt`, `${delete_ticket_content[i]}\n`);
          i--
        }

    let reportschannel = data.reportschannel
    const ticketlog = guild.channels.cache.find(c => c.name == reportschannel) || guild.channels.cache.find(c => c.id == reportschannel)

    if(ticketlog) await ticketlog.send({ content: `\`[SYSTEM]\` \`${lang.channel_send[langs]} ${channel.name} ${lang.channels_send[langs]}\``, files: [ `./${channel.name}.txt` ] })

    if(member) await member.send({ content: `\`[SYSTEM]\` \`${lang.user_send[langs]} ${channel.name} ${lang.user_sends[langs]}\``, files: [ `./${channel.name}.txt` ] }).catch(err => { if(err.message == `Cannot send messages to this user`) {}})

    channel.delete().catch(err => {})

    let ticketDB = await Ticket.findOne({ channelID: g.channelID, guildID: g.guildID})
    ticketDB.status = "Deleted"
    await ticketDB.save()

    fs.unlinkSync(`./${channel.name}.txt`)
}
})
    } catch(e) {
      console.log(e)
    }
},15000);

setInterval(async function () {
    const now = Date.now()

    const banSupports = {
        expires: {
          $lt: now,
        },
        current: true
      }

    const results = await BanSupport.find(banSupports)

    if(results) {

    await BanSupport.deleteMany(banSupports, {
      current: false
    });
    }
},20000);
}