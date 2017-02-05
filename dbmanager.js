var config = require('./config/config.json');
var firebaseConfig = require('./config/firebase-config.json');
var admin = require('firebase-admin');

function initDB() {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: config.databaseURL
    });
    this.database = admin.database();
}
function getRef(refPath = null) {
    if(refPath) {
        return this.database.ref(refPath);
    } else {
        return this.database.ref();
    }
}

module.exports = {
    initDB: initDB,
    getRef: getRef
}