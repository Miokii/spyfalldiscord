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
    }
}

Game.prototype.addPlayer = function (player) {
    if (this.players.length >= 7)
        return;
    if (this.players.find(p => p.id === player.id)) {
        this.channel.sendMessage(player.nickMention + ' you are already in the game');
        return;
    }
    this.channel.sendMessage(player.nickMention + ' joined the game');
    this.players.push(player);
};

Game.prototype.startGame = function () {
    this.channel.sendMessage(this.host.nickMention + ' has started the game!\nInformation will be sent via private message.');
    this.spy = this.players[Math.floor(Math.random() * this.players.length)];

    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id === this.spy.id) {
            this.players[i].openDM().then(function (dm) {
                dm.sendMessage('You are the spy!')
            }, function (error) {
                // some error occurred.
                console.log('An error occured');
                throw error;
            });
        } else {
            this.players[i].openDM().then(function (dm) {
                dm.sendMessage('You are not the spy. The location is\n' + this.location);
            }.bind(this), function (error) {
                // some error occurred.
                console.log('An error occured');
                throw error;
            });
        }
    }
    var starter = this.players[Math.floor(Math.random() * this.players.length)];
    this.channel.sendMessage(starter.nickMention + ' is first');
};

Game.getRandomLocation = function () {
    return locs[Math.floor(Math.random() * locs.length)];
}

Game.freeChannels = function () {
    var games = gm.getGames();
    var gameChannels = guildManager.getGameRooms();
    var frees = gameChannels.filter(function (c) {
        var keep = true;
        games.forEach(function (game) {
            if (game.channel.id === c.id) {
                keep = false;
            }
        }, this);
        return keep;
    });
    if (frees === null) {
        frees = [];
    }
    return frees;
}

module.exports = Game;
