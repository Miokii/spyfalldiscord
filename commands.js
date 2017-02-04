var guildManager = require("./guildManager");
var main = require("./main");
var msgs;

function giveClient(c){
    msgs = c;
}

function parseMessage(ctx){
    msg = ctx.message.content;
    chnl = ctx.message.channel;

    console.log("Received message: " + msg);
    if(/\bWhat\b/ig.test(msg)){
        if(/\bchannel\b/ig.test(msg)){
            if(/\bis this\b/ig.test(msg)){
                chnl.sendMessage("This channel is: " +chnl.name);
            }
            if(/\bid is this\b/ig.test(msg)){
                chnl.sendMessage("This channel's id is: " + chnl.id);
            }
        }
    }

    if(/\blist\b/ig.test(msg)){
        if(/\bchannel\b|\bchannels\b/ig.test(msg)){
            chnl.sendMessage(guildManager.listChannels());
        }
    }

    if(/\bclear\b|\bcc\b/ig.test(msg)) {
        if(/\bchat\b|\bcc\b/ig.test(msg)){
            var result = /\d/g[Symbol.match](msg);
            var num;
            var i = 0;
            if(result != null){
                while(result[i] != null){
                    console.log(result[i]);
                    num += result[i];
                    i++;
                }
                console.log(num);

                var arrayOfMessages = msgs.toArray
                if(chnl.messages[0].id == null){
                    chnl.sendMessage("I can't delete that many!");
                    console.log(chnl.messages);
                }else{
                    for(var y = chnl.messages.length; y > (chnl.messages.length - num); y--){
                        msgs.deleteMessage(chnl.messages[y]);
                    }
                }
            }
        }
    }

}

module.exports = {
    parseMessage : parseMessage,
    giveClient : giveClient
}