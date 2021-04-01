import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Container, Header, Tab, Tabs, ScrollableTab, Icon, Button, Card, CardItem, Content, Text, Body, Footer } from 'native-base';
import Modal from 'react-native-modal';




const styles = StyleSheet.create({

  headerTitle: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  deleteButton: {
    height: 40,
    borderWidth: 2,
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
    justifyContent: 'space-between'
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




  const [account, setAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [updatedAccount, setUpdatedAccount] = useState('');
  const [updatedAccountName, setUpdatedAccountName] = useState('');
  const [totalBalance, setTotalBalance] = useState('');

  let id = auth().currentUser.uid;

  deleteAccount = (accountId) => {
    var record = firebase.database().ref('financialAccounts /' + accountId);
    record.remove();
  }

  logOut = () => {
    auth()
      .signOut()
      .then((res) => {
        navigation.replace('Login')
      })
  }



  addAccount = () => {
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
  }

  updateAccount = (accountId) => {
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

  const goHome = () => {
    navigation.replace('Home')
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


  return (

    <Container>
      <Header hasTabs />
      <Tabs renderTabBar={() => <ScrollableTab />}>
        {userAccountInfo.map(info => (
          <Tab heading={info.name}>
            <Content>
              <Card>
                <CardItem headers style={styles.headerTitle}>
                  <Text>Account Balance</Text>
                </CardItem>
                <CardItem>
                  <Body style={styles.headerTitle}>
                    <Text>
                      <Text>{info.amount}</Text>
                    </Text>
                  </Body>
                </CardItem>
              </Card>

              <Body style={styles.mainContent}>
                <Button rounded style={styles.deleteButton} onPress={goHome} >
                  <Text>Go Home</Text>
                </Button>
                <Button rounded style={styles.deleteButton} onPress={() => deleteAccount(info.accountId)}>
                  <Text>Delete</Text>
                </Button>
              </Body>
            </Content>

            <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
              <View style={{ flex: 1 }}>
                <Content>
                  <Card>
                    <Text style={styles.modalTitle}>Add New Account</Text>
                    <CardItem>
                      <Body>
                        <TextInput placeholder="Enter Amount in Account"
                          onChangeText={text => setAccount(text)}
                        />
                        <TextInput placeholder="Enter Account name"
                          onChangeText={text => setAccountName(text)}
                        />
                        <Body style={styles.modalButtons}>
                          <Button rounded onPress={toggleModal}>
                            <Text>Close</Text>
                          </Button>
                          <Button rounded onPress={addAccount} style={styles.addButtonModal}>
                            <Text>Add Account</Text>
                          </Button>
                        </Body>
                      </Body>
                    </CardItem>
                  </Card>
                </Content>
              </View>
            </Modal>

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
                          <Button rounded onPress={() => updateAccount(info.accountId)} style={styles.addButtonModal}>
                            <Text>Update Account</Text>
                          </Button>
                        </Body>
                      </Body>
                    </CardItem>
                  </Card>
                </Content>
              </View>
            </Modal>

            <View style={styles.footer} >
              <Button transparent onPress={() => updateAccountModal(info.name, info.amount)}>
                <Icon style={styles.UpdateButton} name='pencil' />
              </Button>
              <Button transparent onPress={toggleModal} >
                <Icon style={styles.addButton} name='add-circle-outline' />
              </Button>
            </View>
          </Tab>
        ))}
      </Tabs>
    </Container>


  );
}

export default AccountsScreen;