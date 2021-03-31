const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);

const database = admin.database();


// // Scheduled Function
exports.pushDataEveryMinute = functions.pubsub.schedule("every 1 minutes")
    .onRun((context) => {
      const date = new Date();
      database.ref("incomes /-MW2G2LxjjhGF2lutrYi").set(date.getTime());
      return null;
    });

