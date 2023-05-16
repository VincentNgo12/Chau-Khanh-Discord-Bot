const Discord = require('discord.js');
const { Player , QueryType } = require('discord-player');

// get some extractors if you want to handpick sources
const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');

const answers = require('./answers.js')
const getRandom = require("./getRandomElement.js")
const APIRequest = require("./APIRequests.js")


const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const myKEY = process.env['DiscordBotKey']


// Create Client object
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    'GuildVoiceStates',
	],
});


// this is the entrypoint for discord-player based application
const player = new Player(client);


// Add player error listeners:
player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});



// Add event listeners for the player
player.on("trackStart", (queue, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
    queue.metadata.send("✅ | Queue finished!");
});



// This method will load all the extractors from the @discord-player/extractor package
player.extractors.loadDefault();


// this event is emitted whenever discord-player starts to play a track
player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
});


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


// This event will be triggered whenever the bot joins a new server
client.on('guildCreate', guild => {
  // Send a welcome message in the server's default channel
  const channel = guild.defaultChannel;
  if (channel) {
    channel.send(`Xin chào mọi người! Mình là Châu Khánh, người tình của Đức Huy. Mình mong các bạn sẽ chào đón và ủng hộ mình, rất vui được làm quen vói mọi người!!!`);
  }
});


const HuyID = "176217107724369920";







// Translate string
// async function translateString(string){
//   try{
//     let dich
//     fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ "en" + "&tl=" + "vi" + "&dt=t&q=" + encodeURI(string))
//     .then(res => res.json())
//     .then(re => {dich = re[0][0][0]})
//     return dich
//   }
//   catch(error){
//     console.log(error);
//     return 'Error getting quote.';
//   }
// }



client.on('messageCreate', async function(msg){
  if (msg.content.toLowerCase().includes("xinh quá")) {
    if (msg.author.id.toString() === HuyID){
      msg.reply(getRandom(answers.traLoiKhenCuaHuy));
    }
    else{
      msg.reply(getRandom(answers.traLoiKhen));
    }
  }
  // Tra Loi goi
  if (msg.content.toLowerCase().includes("ơi!!")){
    if (msg.author.id.toString() === HuyID){
      msg.reply(getRandom(answers.traLoiGoiHuy));
    }
    else{
      msg.reply(getRandom(answers.traLoiGoi));
    }
  }

  if (msg.content.toLowerCase().includes("mình cảm thấy yếu đuối")){
    let originalString
    await APIRequest.getZenQuote().then(quote => {
      originalString = quote
    })
    
    
    fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ "en" + "&tl=" + "vi" + "&dt=t&q=" + encodeURI(originalString))
    .then(res => res.json())
    .then(re => {msg.reply(getRandom(answers.quotesPrefixes) + re[0][0][0])})
    
  }

  // Loi khuyen
  if (msg.content.toLowerCase().includes("hãy cho mình lời khuyên")){
    let originalString
    await APIRequest.getAffirmation().then(quote => {
      originalString = quote
    })

    fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ "en" + "&tl=" + "vi" + "&dt=t&q=" + encodeURI(originalString))
    .then(res => res.json())
    .then(re => {msg.reply(getRandom(answers.quotesPrefixes) + re[0][0][0])})
  }
});





client.login(myKEY);