const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);

const database = admin.database();


// // Scheduled Function
exports.pushDataEveryMinute = functions.pubsub.schedule("every 5 minutes")
  .onRun((context) => {


    database.ref("incomes /").on("value", (dataSnapshot) => {

      var date = new Date();
      var milliseconds = date.getTime();

      dataSnapshot.forEach((child) => {
        functions.logger.info("testing: ", child.val().income.name, child.val().income.amount)
        if (child.val().income.firstDate < milliseconds) {

          database.ref("financialAccounts /").on("value", (dataSnapshot) => {
            dataSnapshot.forEach((child2) => {
              if (child.val().income.targetAccount === child2.key) {
                database
                  .ref('financialAccounts /' + child.val().income.targetAccount)
                  .update({
                    financialAccount: {
                      name: child2.val().financialAccount.name,
                      amount: parseFloat(child2.val().financialAccount.amount) + parseFloat(child.val().income.amount),
                      uuid: child2.val().financialAccount.uuid,
                    },
                  });
                return null;
              }
            });
          });

          if (child.val().income.frequency === "Every Week") {

          } else if (child.val().income.frequency === "Every 2 Weeks") {

          } else if (child.val().income.frequency === "Every Month") {

          }

        }
      });
    });
  });

