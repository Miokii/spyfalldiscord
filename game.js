var moment = require('moment');
var locs = require('./data/locations.json');
var gm = require('./gamemanager');
var guildManager = require('./guildmanager');
var gameRoom = require('./gameroom');

function Game(host) {
    
    this.gameRoom = new gameRoom(gm.getNextGameNumber())//Creates game room object, containing room information
    this.players = [host];
    this.host = host;
    this.spy = null;
    this.location = Game.getRandomLocation();
    this.inProgress = false;

    if (gm.addGame(this)) {
        // success
        console.log("Adding game host "+this.host+" to role "+this.gameRoom.role );
        guildManager.addRole(this.gameRoom.role);
        this.gameRoom.txtChnl.sendMessage('@everyone A new game is starting! Type join to play (max 7 players)');
    }
}

Game.prototype.addPlayer = function (player) {
    if(this.inProgress) {
        this.gameRoom.txtChnl.sendMessage('Sorry ' + player.nickMention + ', the game has already started!');
        return;
    }
    if (this.players.length >= 7) {
        this.gameRoom.txtChnl.sendMessage('Sorry ' + player.nickMention + ', this game is full!');
        return;
    }
    if (this.players.find(p => p.id === player.id)) {
        this.gameRoom.txtChnl.sendMessage(player.nickMention + ' you are already in the game');
        return;
    }
    if (gm.isInGame(player)) {
        this.gameRoom.txtChnl.sendMessage(player.nickMention + ' you are already in another game!');
        return;
    }
    //set player game role
    this.gameRoom.txtChnl.sendMessage(player.nickMention + ' joined the game');
    this.players.push(player);
};

Game.prototype.startGame = function () {
    this.inProgress = true;
    this.gameRoom.txtChnl.sendMessage(this.host.nickMention + ' has started the game!\nInformation will be sent via private message.');
    this.spy = this.players[Math.floor(Math.random() * this.players.length)];

    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id === this.spy.id) {
            this.players[i].openDM().then(function (dm) {
                dm.sendMessage('You are the spy!');
                var locRef = "Location Reference:";
                for(var x = 0; x < locs.length; x++){
                    locRef += '\n' + locs[x];
                }
                dm.sendMessage(locRef);
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
    this.gameRoom.txtChnl.sendMessage(starter.nickMention + ' is first');
};

Game.getRandomLocation = function () {
    return locs[Math.floor(Math.random() * locs.length)];
}

Game.freeChannels = function () {
    var games = gm.getGames();
    var gameChannels = guildManager.getGameRooms();//Change to gameroom object
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
