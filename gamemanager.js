var guildManager = require("./guildmanager");

var gamesInProgress = [];

function addGame(game) {
    if (gamesInProgress.length >= 2)
        return false;
    gamesInProgress.push(game);
    return true;
}
function getGames() {
    return gamesInProgress;
}

function getGameForChannel(channel) {
    var g = gamesInProgress.filter(g => g.gameRoom.txtChnl.id === channel.id);
    if (g.length === 1) {
        return g[0];
    } else {
        return null;
    }
}

function isInGame(player) {
    var inGame = false;
    gamesInProgress.forEach(function (g) {
        if (g.players.find(p => p.id === player.id))
            inGame = true;
    }, this);
    return inGame;
}

function removeGame(game) {
    var i = gamesInProgress.findIndex(g => g.host.id === game.host.id);
    if (i != -1) {
        gamesInProgress.splice(i, 1);
    }
}

function roomForOneMore(){
    return guildManager.maxGames() >= (gamesInProgress.length+1);
}

function getNextGameNumber(){
    if(gamesInProgress.length <= 0){
        return 0;
    }else{
        return gamesInProgress.length +1;
    }
    
}

module.exports = {
    addGame: addGame,
    getGames: getGames,
    getGameForChannel: getGameForChannel,
    isInGame: isInGame,
    removeGame: removeGame,
    roomForOneMore : roomForOneMore,
    getNextGameNumber : getNextGameNumber
}