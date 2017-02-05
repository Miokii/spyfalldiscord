var gamesInProgress = [];

function addGame(game) {
    if(gamesInProgress.length >= 2)
        return false;
    gamesInProgress.push(game);
    return true;
}
function getGames() {
    return gamesInProgress;
}

function getGameForChannel(channel) {
    var g = gamesInProgress.filter(g => g.channel.id === channel.id);
    if(g.length === 1) {
        return g[0];
    } else {
        return null;
    }
}

module.exports = {
    addGame: addGame,
    getGames: getGames,
    getGameForChannel: getGameForChannel
}