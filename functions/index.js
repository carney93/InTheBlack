const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);

const database = admin.database();


// // Scheduled Function to run at midnight every night
exports.updatingIncomes = functions.pubsub.schedule("0 0 * * *")
  .onRun((context) => {

   database.ref("incomes /").on("value", (dataSnapshot) => {
    dataSnapshot.forEach((child) => {

        var date = new Date();
        var milliseconds = date.getTime();

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
              }
            });
          });
        }

        if (child.val().income.frequency === "Every Week") {

          var todaysdate = new Date().getTime();
          var updatedDate = todaysdate + 6.048e+8;

          database
            .ref('incomes /' + child.key)
            .update({
              income: {
                name: child.val().income.name,
                amount: child.val().income.amount,
                targetAccount: child.val().income.targetAccount,
                firstDate: updatedDate,
                frequency: child.val().income.frequency,
                uuid: child.val().income.uuid,
              },
            });

        } else if (child.val().income.frequency === "Every 2 Weeks") {

          var todaysdate = new Date().getTime();
          var updatedDate = todaysdate + (6.048e+8 * 2);

          database
            .ref('incomes /' + child.key)
            .update({
              income: {
                name: child.val().income.name,
                amount: child.val().income.amount,
                targetAccount: child.val().income.targetAccount,
                firstDate: updatedDate,
                frequency: child.val().income.frequency,
                uuid: child.val().income.uuid,
              },
            });

        } else if (child.val().income.frequency === "Every Month") {


          var todaysdate = new Date().getTime();
          var updatedDate = todaysdate + (6.048e+8 * 4);

          database
            .ref('incomes /' + child.key)
            .update({
              income: {
                name: child.val().income.name,
                amount: child.val().income.amount,
                targetAccount: child.val().income.targetAccount,
                firstDate: updatedDate,
                frequency: child.val().income.frequency,
                uuid: child.val().income.uuid,
              },
            });
        }
      });
    });
  });

