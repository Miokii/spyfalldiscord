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

module.exports = {
    addGame: addGame,
    getGames: getGames
}