var guildManager = require("./guildManager");
var main = require("./main");
var moment = require('moment');
var client;
var Game = require('./game');

function giveClient(c) {
    client = c;
}

function parseMessage(ctx) {
    var msg = ctx.message.content;
    var chnl = ctx.message.channel;

    console.log("Received message: " + msg);
    if (/\bWhat\b/i.test(msg)) {
        if (/\bchannel\b/ig.test(msg)) {
            if (/\bis this\b/ig.test(msg)) {
                chnl.sendMessage("This channel is: " + chnl.name);
            }
            if (/\bid is this\b/i.test(msg)) {
                chnl.sendMessage("This channel's id is: " + chnl.id);
            }
        }
    }

    if (/\blist\b/i.test(msg)) {
        if (/\bchannel\b|\bchannels\b/i.test(msg)) {
            chnl.sendMessage(guildManager.listChannels());
        }
    }

    if (/^\bclear\b|^\bcc\b/i.test(msg)) {
        if (/^\bchat\b|^\bcc\b/i.test(msg)) {

            // This should probably be at the start of the
            // parse function, but there might be come cases
            // where the bot needs to parse its own message
            //  - TC
            if (ctx.message.author.id === client.User.id) {
                return;
            }

            var result = msg.match(/\d+/);
            var num = 100;
            if (result != null) {
                num = result[0];
            }
            var msgs = chnl.fetchMessages(num, null, null).then(function (messages) {
                var ms = messages.messages.filter(m => !m.deleted);
                client.Messages.deleteMessages(ms, chnl);
            }, function (error) {
                chnl.sendMessage('Sorry, an error occured');
            });
        }
    }
    if (/^chat log\b/i.test(msg)) {
        var result = msg.match(/\d+/);
        var num = 10;
        if (result != null) {
            if (result[0] == 1) {
                chnl.sendMessage('Don\'t be silly');
                return;
            }
            num = result[0];
            var msgs = client.Messages.forChannel(chnl);
            var messageToSend = 'Here are the last ' + num + ' messages\n';
            msgs.forEach(function (m) {
                if (m.author.id === client.User.id) {
                    return;
                }
                messageToSend += (m.author.nickMention + ' *' + moment(m.timestamp).calendar() + (m.deleted ? ' (deleted)' : '') + '*\n' +
                    m.content);
                messageToSend += '\n\n';
            }, this);
            chnl.sendMessage(messageToSend);
        }
    }
    if (/^new game\b/i.test(msg)) {
        var gameRooms = guildManager.getGameRooms();
        var gameChannels = Game.freeChannels();
        if(gameChannels.length > 0) {
            var newGame = new Game(ctx.message.author, gameChannels[0]);
        }

    }
}

module.exports = {
    parseMessage: parseMessage,
    giveClient: giveClient
}