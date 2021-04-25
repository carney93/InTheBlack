import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Container, Header, Subtitle, Left, Right, Title, Tab, Tabs, ScrollableTab, Icon, Button, Card, CardItem, Content, Text, Body, Footer, FooterTab } from 'native-base';
import Modal from 'react-native-modal';
import { color } from 'react-native-reanimated';





const styles = StyleSheet.create({

  headerTitle: {
    justifyContent: 'center',
    textAlign: 'center',

  },
  deleteButton: {
    height: 40,

    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    marginTop: 20,
  },
  addButton: {
    fontSize: 50,
    marginBottom: 10,

  },
  modalButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  addButtonModal: {
    marginLeft: 20,
  },
  UpdateButton: {
    fontSize: 30,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },
  modalTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10,
  },
});


const AccountsScreen = ({ navigation }) => {

  const [userDetail, setUserDetail] = useState({
    id: '',
    email: '',
  });



  const [userAccountInfo, setUserAccountInfo] = useState([
  ]);

  const [incomeInfo, setIncomeInfo] = useState([
  ]);

  const [outgoingInfo, setOutgoingInfo] = useState([
  ]);

  const [dailySpending, setDailySpending] = useState([
  ]);



  const [account, setAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [updatedAccount, setUpdatedAccount] = useState('');
  const [updatedAccountName, setUpdatedAccountName] = useState('');
  const [totalBalance, setTotalBalance] = useState('');

  let id = auth().currentUser.uid;

  deleteAccount = (accountId) => {
    var record = firebase.database().ref('financialAccounts /' + accountId);
    record.remove();

    for (let i = 0; i < incomeInfo.length; i++) {
      if (accountId === incomeInfo[i].targetAccount) {
        var incomeRecord = firebase.database().ref('incomes /' + incomeInfo[i].accountId);
        incomeRecord.remove();
      }
    }

    for (let i = 0; i < outgoingInfo.length; i++) {
      if (accountId === outgoingInfo[i].targetAccount) {
        var outgoingRecord = firebase.database().ref('outgoings /' + outgoingInfo[i].accountId);
        outgoingRecord.remove();
      }
    }

    for (let i = 0; i < dailySpending.length; i++) {
      if (accountId === dailySpending[i].targetAccount) {
        var spendingRecord = firebase.database().ref('dailySpendings /' + dailySpending[i].spendingId);
        spendingRecord.remove();
      }
    }

  }

  logOut = () => {
    auth()
      .signOut()
      .then((res) => {
        navigation.replace('Login')
      })
  }



  addAccount = () => {
    if (isNaN(account)) {
      Alert.alert('Alert', 'Amount needs to be a number');
      return;
    }
    firebase
      .database()
      .ref('financialAccounts /')
      .push({
        financialAccount: {
          name: accountName,
          amount: account,
          uuid: auth().currentUser.uid,
        },
      });
    setModalVisible(false)
    setAccountName("")
    setAccount("")
  }

  updateAccount = (accountId) => {
    if (isNaN(updatedAccount)) {
      Alert.alert('Alert', 'Amount needs to be a number');
      return;
    }
    firebase
      .database()
      .ref('financialAccounts /' + accountId)
      .update({
        financialAccount: {
          name: updatedAccountName,
          amount: updatedAccount,
          uuid: auth().currentUser.uid,
        },
      });
    setModalVisible2(false)
  }

  //getting incomes so they can be removed if the bank account they are targeting is deleted
  useEffect(() => {
    firebase.database().ref('incomes /').on('value', (dataSnapshot) => {
      let items = [];
      dataSnapshot.forEach((child) => {
        if (id === child.val().income.uuid) {
          items.push({
            targetAccount: child.val().income.targetAccount,
            accountId: child.key,
          });
        }
      });
      setIncomeInfo(items);
    });
  }, []);

    //getting outgoings so they can be removed if the bank account they are targeting is deleted
    useEffect(() => {
      firebase.database().ref('outgoings /').on('value', (dataSnapshot) => {
        let items = [];
        dataSnapshot.forEach((child) => {
          if (id === child.val().outgoing.uuid) {
            items.push({
              targetAccount: child.val().outgoing.targetAccount,
              accountId: child.key,
            });
          }
        });
        setOutgoingInfo(items);
      });
    }, []);

  //getting spendings so they can be removed if the bank account they are targeting is deleted
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
      setUserAccountInfo(items);
    });
  }, []);

  updateAccountModal = (name, amount) => {
    setUpdatedAccount(amount);
    setUpdatedAccountName(name);
    toggleModal2();
  }




  useEffect(() => {
    let total;
    total = 0;
    firebase.database().ref('financialAccounts /').on('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        let temp1 = 0;
        let temp2 = 0;
        if (id === child.val().financialAccount.uuid) {
          temp1 = child.val().financialAccount.amount;
          temp2 = total;
          total = parseFloat(temp1) + parseFloat(temp2);
        }
      });
      setTotalBalance(total);
    });
  }, [userAccountInfo]);



  const goToHome = () => {
    navigation.replace('Home')
  }

  const goToInOut = () => {
    navigation.replace('InOut')
  }





  const goToDaily = () => {
    navigation.replace('DailySpending')
  }
  const goToMySpending = () => {
    navigation.replace('Analysis')
  }

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  useEffect(() => {
    firebase.database().ref('users /').on('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        if (id === child.val().user.uuid) {
          setUserDetail({
            id,
            email: child.val().user.email,
          });
        }
      });
    });
  }, []);

  function displayTransactions(id) {

    let chartInfo = dailySpending.map((item) => {
 
      if (item.targetAccount === id) {

        const date = new Date(item.date + 3600000);
        return (
          <Card style={{ alignItems: 'center' }}>
            <CardItem style={{ borderRadius: 20 }}>
              <Left>
                <View style={{ alignItems: 'flex-start', marginTop: 2 }}>
                  <Title style={{ color: 'black', marginLeft: 10 }}>- €{item.amount} </Title>
                  <Subtitle style={{ color: 'black' }}> {date.toUTCString()}</Subtitle>
                </View>
              </Left>
              <Right>
                <Subtitle style={{ color: 'black', marginRight: 10 }}>{item.name}</Subtitle>
              </Right>
            </CardItem>
          </Card>
        )
      }
    });


    return chartInfo
  }




  function displayBalance(amount) {

    if (amount < 0) {
      return <Title style={{ color: 'red' }}>€{amount}</Title>
    } else {
      return <Title style={{ color: 'black' }}>€{amount}</Title>
    }


  }



  return (

    <Container>

      <Tabs renderTabBar={() => <ScrollableTab />}>
        {userAccountInfo.map(info => (
          <Tab heading={info.name}>
            <Content >
              <Card style={styles.headerTitle}>
                <CardItem headers style={styles.headerTitle}>
                  <Title style={{ color: 'black' }}>{info.name} Balance</Title>
                </CardItem>
                <CardItem style={styles.headerTitle}>            
                    {displayBalance(info.amount)}
                </CardItem>
              </Card>

              <Body style={styles.mainContent}>
                <Button danger rounded style={styles.deleteButton} onPress={() => deleteAccount(info.accountId)}>
                  <Text>Delete Account</Text>
                </Button>
              </Body>
            </Content>


            <Content >
                <Title style={{ color: 'grey', marginLeft: 5, marginTop: 5  }}>Transactions</Title>

                {displayTransactions(info.accountId)}

              </Content>



            <Modal isVisible={isModalVisible2} onBackdropPress={() => setModalVisible2(false)}>
              <View style={{ flex: 1 }}>
                <Content>
                  <Card>
                    <Text style={styles.modalTitle}>Update Account</Text>
                    <CardItem>
                      <Body>
                        <TextInput placeholder="Update Amount in Account"
                          onChangeText={text => setUpdatedAccount(text)}
                          value={updatedAccount}
                        />
                        <TextInput placeholder="Update Account name"
                          onChangeText={text => setUpdatedAccountName(text)}
                          value={updatedAccountName}
                        />
                        <Body style={styles.modalButtons}>
                          <Button rounded onPress={toggleModal2}>
                            <Text>Close</Text>
                          </Button>

                          {!updatedAccount || !updatedAccountName ? (
                            <Button rounded disabled style={styles.addButtonModal}>
                              <Text>Update Account</Text>
                            </Button>
                          ) : (
                            <Button rounded onPress={() => updateAccount(info.accountId)} style={styles.addButtonModal}>
                              <Text>Update Account</Text>
                            </Button>
                          )}

                        </Body>
                      </Body>
                    </CardItem>
                  </Card>
                </Content>
              </View>
            </Modal>


            <View style={styles.footer} >
              <Button transparent onPress={toggleModal} >
                <Icon style={styles.addButton} name='add-circle-outline' />
              </Button>
              <Button transparent onPress={() => updateAccountModal(info.name, info.amount)}>
                <Icon style={styles.UpdateButton} name='pencil' />
              </Button>
            </View>
          </Tab>
        ))}
      </Tabs>

      {!userAccountInfo[0] ? (
        <Body style={{ textAlign: 'center', marginLeft: 10}}>
          <Text style={{color: 'grey'}}>There are no accounts added. Please add one</Text>
        </Body>

      ) : (
        <View  >
        </View>
      )}

      {!userAccountInfo[0] ? (
        <View style={styles.footer} >
          <Button transparent onPress={toggleModal} >
            <Icon style={styles.addButton} name='add-circle-outline' />
          </Button>
        </View>

      ) : (
        <View  >
        </View>
      )}


      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={{ flex: 1 }}>
          <Content>
            <Card>
              <Text style={styles.modalTitle}>Add New Account</Text>
              <CardItem>
                <Body>
                <TextInput placeholder="Enter Account name"
                    onChangeText={text => setAccountName(text)}
                  />
                  <TextInput placeholder="Enter Amount in Account"
                    type="number"
                    keyboardType='numeric'
                    onChangeText={text => setAccount(text)}
                  />
                  <Body style={styles.modalButtons}>
                    <Button rounded onPress={toggleModal}>
                      <Text>Close</Text>
                    </Button>

                    {!accountName || !account ? (
                      <Button rounded disabled style={styles.addButtonModal}>
                        <Text>Add Account</Text>
                      </Button>
                    ) : (
                      <Button rounded onPress={addAccount} style={styles.addButtonModal}>
                        <Text>Add Account</Text>
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
          <Button active>
            <Icon name='wallet' />
          </Button>
          <Button onPress={goToInOut}>
            <Icon name='swap-horizontal' />
          </Button>
          <Button onPress={goToDaily}>
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

export default AccountsScreen;