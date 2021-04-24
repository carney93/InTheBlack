import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Container, Header, Subtitle, Left, Right, Title, Tab, Tabs, ScrollableTab, Icon, Button, Card, CardItem, Content, Text, Body, Footer, FooterTab } from 'native-base';


const styles = StyleSheet.create({
  body: {
    marginTop: 150,
    alignItems: 'center',
  },
  appName: {
    alignItems: 'center',
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Roboto"
  },
  emailInput: {
    marginTop: 10,
    height: 40,
    width: 200,
    borderWidth: 2,
    borderRadius: 20,
  },
  passwordInput: {
    marginTop: 10,
    height: 40,
    width: 200,
    borderWidth: 2,
    borderRadius: 20,
  },
  addAccountButton: {
    marginTop: 10,
    marginLeft: 100,
  },

  text: {
    padding: 10,
  },

});


const OnboardScreen = ({ navigation }) => {





  const [account, setAccount] = useState('');
  const [accountName, setAccountName] = useState('');

  let id = auth().currentUser.uid;




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
    });
  }, []);






  addAccount = () => {
    if(isNaN(account)){
      Alert.alert('Alert', 'Amount needs to be a number');
      return;
      } 
    firebase
      .database()
      .ref('financialAccounts /')
      .push({
        financialAccount: {
          name: accountName,
          amount: account, //pass your income
          uuid: auth().currentUser.uid,
        },
      });
    navigation.replace('OnboardIncomes')
  }



  return (


    <Container>
      <Body style={styles.body}>

        <Text style={styles.text} >
          Hello. Please enter your fianancial account details here. You can add more later
          </Text>


        <TextInput placeholder="Enter Account Amount"
         keyboardType='numeric'
          style={styles.emailInput}
          onChangeText={text => setAccount(text)}
        />
        <TextInput placeholder="Enter Account name"
          style={styles.emailInput}
          onChangeText={text => setAccountName(text)}
        />

        {!accountName || !account  ? (
          <Button rounded disabled style={styles.addAccountButton}>
            <Text>Add Account</Text>
          </Button>
        ) : (
          <Button rounded onPress={addAccount} style={styles.addAccountButton}>
            <Text>Add Account</Text>
          </Button>
        )}
      </Body>

    </Container>




  );
}

export default OnboardScreen;