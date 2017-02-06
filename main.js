var Discordie = require("discordie");
var config = require('./config/config.json');
var client = new Discordie();

var dat = require("./data/data.json");
var guildManager = require("./guildmanager");
var commands = require("./commands");
var dbManager = require('./dbmanager');

var gamesInProgress = [];

dbManager.initDB();

client.connect({
    token: config.token
});

client.Dispatcher.on("GATEWAY_READY", e => {
    console.log("Connected as: " + client.User.username);
    var guild = client.Guilds.find(g => g.name == "Spyfall Game");
    if(guild != null){
        guildManager.initialise(guild);
        commands.giveClient(client);
        
    }

});

client.Dispatcher.on("MESSAGE_CREATE", e => {
    commands.parseMessage(e);
});

client.Dispatcher.on("GUILD_MEMBER_ADD", e => {
    var channel = e.guild.textChannels.find(c => c.name == "welcome");
    channel.sendMessage(e.member.mention + ", Welcome to the Spyfall Discord server! If you're new to the game, head over to " + client.guild.find(c => c.name == "rules" ) + " for more information.");
});