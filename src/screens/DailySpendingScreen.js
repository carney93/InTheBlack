import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TextInput, Alert, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import CalendarStrip from 'react-native-calendar-strip';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { Container, Header, Subtitle, Left, Right, Title, Tab, Tabs, ScrollableTab, List, ListItem, Icon, Button, Card, CardItem, Content, Text, Body, Footer, FooterTab } from 'native-base';


const styles = StyleSheet.create({
  container: { flex: 1 },
  emailInput: {
    marginTop: 10,
    height: 40,
    width: 200,
    borderWidth: 2,
    borderRadius: 20,
  },
  modalTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10,
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  addButtonModal: {
    marginLeft: 20,
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
  const [selectedCategory, setSelectedCategory] = useState("Housing");

  const [accountInfo, setAccountInfo] = useState([
  ]);

  const [dailySpending, setDailySpending] = useState([
  ]);

  const [displaySpending, setDisplaySpending] = useState([
  ]);

  const [dayTotal, setDayTotal] = useState("");


  const [spendingAdded, setSpendingAdded] = useState(false);
  const [spendingDeleted, setSpendingDeleted] = useState(false);

  let spendingCategories = ['Housing', 'Transportation', 'Food', 'Utilities', 'Clothing', 'Medical/Healthcare', 'Insurance', 'Household Items/Supplies', 'Personal', 'Loans', 'Education', 'Savings', 'Gifts/Donations', 'Entertainment']




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
            category: child.val().dailySpending.category,
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
      if (items === undefined || items.length == 0) {
        setSelectedAccount("")
      } else {
        setSelectedAccount(items[0].accountId)
      }
      setAccountInfo(items);
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
    if (spendingAmount <= 0) {
      Alert.alert('Alert', 'Amount need to be greater than 0');
      return;
    } else if (isNaN(spendingAmount)) {
      Alert.alert('Alert', 'Amount needs to be a number');
      return;
    }
    firebase
      .database()
      .ref('dailySpendings /')
      .push({
        dailySpending: {
          spendingName: spendingName,
          spendingAmount: spendingAmount,
          targetAccount: selectedAccount,
          category: selectedCategory,
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

  const goToHome = () => {
    navigation.replace('Home')
  }

  const goToInOut = () => {
    navigation.replace('InOut')
  }

  const goToAccounts = () => {
    navigation.replace('Accounts')
  }


  const goToMySpending = () => {
    navigation.replace('Analysis')
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
  }, [selectedDate, spendingAdded, spendingDeleted, dailySpending]);


  useEffect(() => {
    let total = 0;
    for (let i = 0; i < displaySpending.length; i++) {
    total =  parseFloat(displaySpending[i].amount) + parseFloat(total);
    }
    console.log(total)
    setDayTotal(total)
  }, [displaySpending]);

  return (
    <Container>
      <ScrollView>
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

      <Body>
        <Button rounded onPress={toggleModal}>
          <Text>Add Purchase</Text>
        </Button>

        <List>
          <ListItem itemHeader first style={{ justifyContent: 'center' }}>
            <Text>Daily Spendings
            </Text>
          </ListItem>
          <ListItem itemHeader first style={{ justifyContent: 'center', marginTop: -45 }}>
            <Text>€{dayTotal}
            </Text>
          </ListItem>
          {displaySpending.map(info => (
            <ListItem key={info.spendingId} style={{ justifyContent: 'center' }}>
              <Text>{info.name} : €{info.amount}</Text>
            </ListItem>
          ))}
       
        </List>
      </Body>
      </ScrollView>

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={{ flex: 1 }}>
          <Content>
            <Card>
              <Text style={styles.modalTitle}>Add New Account</Text>
              <CardItem>
                <Body>
                  <TextInput placeholder="Enter Spending Name"
                    onChangeText={text => setSpendingName(text)}
                  />
                  <TextInput placeholder="Enter Spending amount"
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
                  <Picker
                    selectedValue={selectedCategory}
                    label='Select a Category'
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  >
                    {spendingCategories.map((info, index) => (
                      <Picker.Item label={info} value={info} key={index} />
                    ))}
                  </Picker>
                  <Body style={styles.modalButtons}>
                    <Button rounded onPress={toggleModal}>
                      <Text>Close</Text>
                    </Button>
                    {!spendingName || !spendingAmount ? (
                      <Button rounded disabled style={styles.addButtonModal}>
                        <Text>Add Spending</Text>
                      </Button>
                    ) : (
                      <Button rounded onPress={addItem} style={styles.addButtonModal}>
                        <Text>Add Spending</Text>
                      </Button>
                    )}

                  </Body>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </View>
      </Modal>



      <Footer>
        <FooterTab>
          <Button onPress={goToHome}>
            <Icon name='home' />
          </Button>
          <Button onPress={goToAccounts}>
            <Icon name='wallet' />
          </Button>
          <Button onPress={goToInOut}>
            <Icon name='swap-horizontal' />
          </Button>
          <Button active>
            <Icon name='calendar' />
          </Button>
          <Button onPress={goToMySpending}>
            <Icon name='analytics' />
          </Button>
        </FooterTab>
      </Footer>
    </Container>

  );
}

export default DailySpendingScreen;

