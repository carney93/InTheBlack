import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, ScrollView, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import CalendarStrip from 'react-native-calendar-strip';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';


const styles = StyleSheet.create({
  container: { flex: 1 },
  emailInput: {
    marginTop: 10,
    height: 40,
    width: 200,
    borderWidth: 2,
    borderRadius: 20,
  },
});


const DailySpendingScreen = ({ navigation }) => {

  let id = auth().currentUser.uid;

  const [todaysDate, setTodaysDate] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [spendingName, setSpendingName] = useState('');
  const [spendingAmount, setSpendingamount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().getTime());
  const [selectedAccount, setSelectedAccount] = useState("");

  const [accountInfo, setAccountInfo] = useState([
  ]);

  const [dailySpending, setDailySpending] = useState([
  ]);

  const [displaySpending, setDisplaySpending] = useState([
  ]);

  const [spendingAdded, setSpendingAdded] = useState(false);
  const [spendingDeleted, setSpendingDeleted] = useState(false);




  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  }

  const goHome = () => {
    navigation.replace('Home')
  }

  //getting spendings
  useEffect(() => {
    firebase.database().ref('dailySpendings /').on('value', (dataSnapshot) => {
      let items = [];
      dataSnapshot.forEach((child) => {
        if (id === child.val().dailySpending.uuid) {
          items.push({
            name: child.val().dailySpending.spendingName,
            amount: child.val().dailySpending.spendingAmount,
            targetAccount: child.val().dailySpending.targetAccount,
            date: child.val().dailySpending.spendingDate,
            spendingId: child.key,
          });
        }
      });
      setDailySpending(items); 
    });
  }, []);

  //getting accounts
  useEffect(() => {
    firebase.database().ref('financialAccounts /').on('value', (dataSnapshot) => {
      let items = [];
      dataSnapshot.forEach((child) => {
        if (id === child.val().financialAccount.uuid) {
          items.push({
            name: child.val().financialAccount.name,
            amount: child.val().financialAccount.amount,
            accountId: child.key,
          });
        }
      });
      setAccountInfo(items);
      setSelectedAccount(accountInfo[0].accountId);
    });
  }, []);

  useEffect(() => {
    for (let i = 0; i < accountInfo.length; i++) {
      if (accountInfo[i].accountId === selectedAccount) {
        firebase
          .database()
          .ref('financialAccounts /' + accountInfo[i].accountId)
          .update({
            financialAccount: {
              name: accountInfo[i].name,
              amount: parseFloat(accountInfo[i].amount) - parseFloat(spendingAmount),
              uuid: auth().currentUser.uid,
            },
          });
      }
    }
  }, [spendingAdded]);  

  const addItem = () => {
    firebase
      .database()
      .ref('dailySpendings /')
      .push({
        dailySpending: {
          spendingName: spendingName,
          spendingAmount: spendingAmount,
          targetAccount: selectedAccount,
          spendingDate: selectedDate,
          uuid: auth().currentUser.uid,
        },
      });
    spendingAdded ? setSpendingAdded(false) : setSpendingAdded(true);
    setModalVisible(false)
  }

  const convertDate = (itemValue) => {
    var date = new Date(itemValue);
    var milliseconds = date.getTime();
    setSelectedDate(milliseconds);
  }


  const deleteSpending = (spendingId, targetAccount, spendingAmount) => {
    for (let i = 0; i < accountInfo.length; i++) {
      if (accountInfo[i].accountId === targetAccount) {
        firebase
          .database()
          .ref('financialAccounts /' + accountInfo[i].accountId)
          .update({
            financialAccount: {
              name: accountInfo[i].name,
              amount: parseFloat(accountInfo[i].amount) + parseFloat(spendingAmount),
              uuid: auth().currentUser.uid,
            },
          });
      }
    }
    var record = firebase.database().ref('dailySpendings /' + spendingId);
    record.remove();
    spendingDeleted ? setSpendingDeleted(false) : setSpendingDeleted(true);
}


  useEffect(() => {
    let filteredSpending = dailySpending.filter(function (info) {
      var selectedDateFormatted = new Date(selectedDate);
      var spendingDate = new Date(info.date);
      return spendingDate.toLocaleDateString() === selectedDateFormatted.toLocaleDateString();
    })
    setDisplaySpending(filteredSpending)
  }, [selectedDate, spendingAdded, spendingDeleted]);


  return (
    <View style={styles.container}>
      <CalendarStrip
        style={{ height: 150, paddingTop: 20, paddingBottom: 50 }}
        selection={'border'}
        selectionAnimation={{ duration: 300, borderWidth: 1 }}
        highlightDateNumberStyle={{ color: 'grey' }}
        highlightDateNameStyle={{ color: 'grey' }}
        dateNumberStyle={{ color: 'black' }}
        dateNameStyle={{ color: 'black' }}
        startingDate={todaysDate}
        selectedDate={todaysDate}
        onDateSelected={(itemValue) => convertDate(itemValue)}
      />

      <Button title="Go Home" onPress={goHome} />
      <Button title="Add" onPress={toggleModal} />

      <ScrollView>
        {displaySpending.map(info => (
          <Text key={info.spendingId}>{info.name}<Button title="X" onPress={() => deleteSpending(info.spendingId, info.targetAccount, info.amount)} /></Text>
        ))}
      </ScrollView>

      <Modal hasBackdrop={true} color={'white'} backdropColor={'grey'} onBackdropPress={() => setModalVisible(false)} isVisible={isModalVisible}>

        <TextInput placeholder="Enter Spending Name"
          style={styles.emailInput}
          onChangeText={text => setSpendingName(text)}
        />
        <TextInput placeholder="Enter Spending amount"
          style={styles.emailInput}
          onChangeText={text => setSpendingamount(text)}
        />
        <Picker
          selectedValue={selectedAccount}
          label='Select An Account'
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => setSelectedAccount(itemValue)}
        >
          {accountInfo.map(info => (
            <Picker.Item label={info.name} value={info.accountId} />
          ))}
        </Picker>

        <Button title="Add Item" onPress={addItem} />
      </Modal>
    </View>

  );
}

export default DailySpendingScreen;

