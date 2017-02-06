var guildManager = require('./guildmanager');

function GameRoom(roomNum) {
    if(roomNum > guildManager.maxGames){
        console.log("No more gamerooms available");
        return;
    }

    var vc = guildManager.getGameVoiceChannels();
    this.voiceChnl = vc[roomNum];

    var tc = guildManager.getGameTxtChannels();
    this.txtChnl = tc[roomNum];

    var roles = guildManager.getGameRoles();
    this.role = roles[roomNum];

    console.log("Setting up game room " + roomNum);
    console.log(this.role + this.voiceChnl + this.txtChnl);
}

module.exports = GameRoom;