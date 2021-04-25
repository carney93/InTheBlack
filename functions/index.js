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


        if (child.val().income.nextDate < milliseconds) {

          database
            .ref('financialAccounts /')
            .child(child.val().income.targetAccount)
            .child('financialAccount')
            .child('amount')
            .transaction(function (amount) {
              return (amount || 0) + child.val().income.amount
            })

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
                  nextDate: updatedDate,
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
                  nextDate: updatedDate,
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
                  nextDate: updatedDate,
                  frequency: child.val().income.frequency,
                  uuid: child.val().income.uuid,
                },
              });
          }
        }


      });
    });
  });


  // // Scheduled Function to run at midnight every night
exports.updatingOutgoings = functions.pubsub.schedule("0 0 * * *")
.onRun((context) => {

  database.ref("outgoings /").on("value", (dataSnapshot) => {
    dataSnapshot.forEach((child) => {

      var date = new Date();
      var milliseconds = date.getTime();


      if (child.val().outgoing.nextDate < milliseconds) {

        database
          .ref('financialAccounts /')
          .child(child.val().outgoing.targetAccount)
          .child('financialAccount')
          .child('amount')
          .transaction(function (amount) {
            return (amount || 0) - child.val().outgoing.amount
          })

        if (child.val().outgoing.frequency === "Every Week") {

          var todaysdate = new Date().getTime();
          var updatedDate = todaysdate + 6.048e+8;

          database
            .ref('outgoings /' + child.key)
            .update({
              outgoing: {
                name: child.val().outgoing.name,
                amount: child.val().outgoing.amount,
                targetAccount: child.val().outgoing.targetAccount,
                nextDate: updatedDate,
                frequency: child.val().outgoing.frequency,
                uuid: child.val().outgoing.uuid,
              },
            });

        } else if (child.val().outgoing.frequency === "Every 2 Weeks") {

          var todaysdate = new Date().getTime();
          var updatedDate = todaysdate + (6.048e+8 * 2);

          database
            .ref('outgoings /' + child.key)
            .update({
              outgoing: {
                name: child.val().outgoing.name,
                amount: child.val().outgoing.amount,
                targetAccount: child.val().outgoing.targetAccount,
                nextDate: updatedDate,
                frequency: child.val().outgoing.frequency,
                uuid: child.val().outgoing.uuid,
              },
            });

        } else if (child.val().outgoing.frequency === "Every Month") {


          var todaysdate = new Date().getTime();
          var updatedDate = todaysdate + (6.048e+8 * 4);

          database
            .ref('outgoings /' + child.key)
            .update({
              outgoing: {
                name: child.val().outgoing.name,
                amount: child.val().outgoing.amount,
                targetAccount: child.val().outgoing.targetAccount,
                nextDate: updatedDate,
                frequency: child.val().outgoing.frequency,
                uuid: child.val().outgoing.uuid,
              },
            });
        }
      }


    });
  });
});
