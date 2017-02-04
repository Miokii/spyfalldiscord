var guildManager = require("./guildManager");
var main = require("./main");
var moment = require('moment');
var client;

function giveClient(c) {
    client = c;
}

function parseMessage(ctx) {
    var msg = ctx.message.content;
    var chnl = ctx.message.channel;

    console.log("Received message: " + msg);
    if (/\bWhat\b/ig.test(msg)) {
        if (/\bchannel\b/ig.test(msg)) {
            if (/\bis this\b/ig.test(msg)) {
                chnl.sendMessage("This channel is: " + chnl.name);
            }
            if (/\bid is this\b/ig.test(msg)) {
                chnl.sendMessage("This channel's id is: " + chnl.id);
            }
        }
    }

    if (/\blist\b/ig.test(msg)) {
        if (/\bchannel\b|\bchannels\b/ig.test(msg)) {
            chnl.sendMessage(guildManager.listChannels());
        }
    }

    if (/\bclear\b|\bcc\b/ig.test(msg)) {
        if (/\bchat\b|\bcc\b/ig.test(msg)) {

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

}

module.exports = {
    parseMessage: parseMessage,
    giveClient: giveClient
}