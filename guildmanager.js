var txtChnlWelcome;
var txtChnlGeneral;
var txtChnlGR1;
var txtChnlGR2;

var voiceChnlGR1;
var voiceChnlGR2;

var roleAdmin;
var roleGM;
var inGame1;
var inGame2;

var gameRoles = [];
var gameTxtChnls = [];
var gameVoiceChnls = [];
var guild;

function initialise(g) {
    guild = g;
    txtChnlWelcome = guild.generalChannel;
    txtChnlWelcome = guild.textChannels.find(c => c.name == "welcome");
    txtChnlGR1 = guild.textChannels.find(c => c.name == "gameroom_1");
    gameTxtChnls.push(txtChnlGR1);
    txtChnlGR2 = guild.textChannels.find(c => c.name == "gameroom_2");
    gameTxtChnls.push(txtChnlGR2);

    voiceChnlGR1 = guild.voiceChannels.find(c => c.name == "GameRoom #1");
    gameVoiceChnls.push(voiceChnlGR1);
    voiceChnlGR2 = guild.voiceChannels.find(c => c.name == "GameRoom #2");
    gameVoiceChnls.push(voiceChnlGR2);
    /* - console clutter 
        console.log("Game channels found: \n");
        console.log(getGameRooms());
        console.log("\nChannels logged.\n\n");
    */
    roleAdmin = guild.roles.find(r => r.name == "Admin");
    roleGM = guild.roles.find(r => r.name == "Game Manager");
    inGame1 = guild.roles.find(r => r.name == "In Game #1");
    gameRoles.push(inGame1);
    inGame2 = guild.roles.find(r => r.name == "In Game #2");
    gameRoles.push(inGame2);
    /*
        console.log("Game roles found: \n")
        console.log(getGameRoles());
        console.log("\nRoles logged.\n\n");
    */
}

function addRole(player, role) {
    if (!guild) {
        return;
    }
    var gMember = guild.members.find(p => p.id === player.id);
    if (!gMember) return false;
    gMember.assignRole(role).then(function () {
        // success
        console.log('Assigned role successfully');
        return true;
    }, function (error) {
        throw error;
        return false;
    });
}

function removeRole(player, role) {
    if (!guild) {
        return;
    }
    var gMember = guild.members.find(p => p.id === player.id);
    if (!gMember) return false;
    gMember.unassignRole(role).then(function () {
        return true;
    }, function (error) {
        throw error;
        return false;
    });
}


function getGameTxtChannels() {
    return gameTxtChnls;
}

function getGameVoiceChannels() {
    return gameVoiceChnls;
}

function getGameRoles() {
    return gameRoles;
}

function maxGames() {
    max = 15;
    if (gameTxtChnls.length <= max) {
        max = gameTxtChnls.length;
    }
    if (gameVoiceChnls.length <= max) {
        max = gameVoiceChnls.length;
    }
    if (gameRoles.length <= max) {
        max = gameRoles.length;
    }
    return max;
}

function listChannels() {
    var list = "";
    if (gameTxtChnls.length < 1) {
        return "I could not find any channels."
    } else {
        list += "Found " + gameTxtChnls.length + " channels: \n";
    }
    for (var i = 0; i < gameTxtChnls.length; i++) {
        list += "\n" + gameTxtChnls[i].name;
    }
    return list;
}

module.exports = {
    initialise: initialise,
    listChannels: listChannels,
    getGameTxtChannels: getGameTxtChannels,
    getGameVoiceChannels: getGameVoiceChannels,
    getGameRoles: getGameRoles,
    addRole: addRole,
    maxGames: maxGames,
    removeRole: removeRole
}
