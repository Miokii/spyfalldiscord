var moment = require('moment');
var locs = require('./data/locations.json');
var gm = require('./gamemanager');
var guildManager = require('./guildManager');

function Game(host, channel) {
    this.channel = channel;
    this.players = [host];
    this.host = host;
    this.spy = null;
    this.location = Game.getRandomLocation();

    if (gm.addGame(this)) {
        // success
        channel.sendMessage('@everyone A new game is starting! Type join to play (max 7 players)');
    } else {
        // no room for more games
        channel.sendMessage('Sorry, there are no more game channels available!');
    }
}

Game.prototype.addPlayer = function (player) {
    if (this.players.length < 7)
        return;
    this.players.push(player);
};

Game.prototype.start = function () {

};

Game.getRandomLocation = function () {
    return locs[Math.floor(Math.random() * locs.length)];
}

Game.freeChannels = function () {
    var games = gm.getGames();
    var gameChannels = guildManager.getGameRooms();
    var frees = gameChannels.filter(function (c) {
        games.forEach(function (game) {
            console.log('Comparing ' + game.channel.name + ' to ' + c.name);
            if (game.channel.id === c.id) {
                console.log('returning false!');
                return false;
            }
        }, this);
        return true;
    });
    console.log(frees);
    if(frees === null) {
        frees = [];
    }
    return frees;
}

module.exports = Game;
