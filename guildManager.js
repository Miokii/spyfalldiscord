var txtChnlWelcome;
var txtChnlGeneral;
var txtChnlGR1;
var txtChnlGR2;

var voiceChnlGR1;
var voiceChnlGR2;

function findChannels(guild){
    txtChnlWelcome = guild.generalChannel;
    txtChnlWelcome = guild.textChannels.find(c => c.name == "welcome");
    txtChnlGR1 = guild.textChannels.find(c => c.name == "gameroom_1");
    txtChnlGR2 = guild.textChannels.find(c => c.name == "gameroom_2");

    voiceChnlGR1 = guild.voiceChannels.find(c => c.name == "GameRoom #1");
    voiceChnlGR1 = guild.voiceChannels.find(c => c.name == "GameRoom #2");
    console.log("Channels logged.");
}

function listChannels() {
    return txtChnlGR1.name;
}

function getGameRooms() {
    return [txtChnlGR1, txtChnlGR2];
}
module.exports = {
    findChannels : findChannels,
    listChannels : listChannels,
    getGameRooms: getGameRooms
}