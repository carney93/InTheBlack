import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Button, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';


const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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
  loginButton: {
    backgroundColor: 'black',
    marginTop: 10,
    height: 40,
    width: 200,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginButtonTxt: {
    color: 'white',
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Roboto"
  },
  signUpText: {
    color: 'black',
    fontSize: 15,
    fontFamily: "Roboto"
  },
  signUpButton: {
    color: 'black',
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Roboto",
    flexDirection: 'row'
  },
});


const OnboardScreen = ({ navigation }) => {

  const [userDetail, setUserDetail] = useState({
    id: '',
    email: '',
  });



  const [userAccountInfo, setUserAccountInfo] = useState([
  ]);

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
      setUserAccountInfo(items);
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
    });
  }, []);



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

  deleteAccount = (accountId) => {
    var record = firebase.database().ref('financialAccounts /' +accountId);
    record.remove();
  }


  addAccount = () => {
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
  }


  completeSignup = () => {

    navigation.replace('Drawer')
  }

  return (
    <View style={styles.container}>

      <Text style={styles.signUpButton}> Welcome {userDetail.email} to the app. Please enter your fianancial institutions and enter amount</Text>


      <TextInput placeholder="Enter Account"
        style={styles.emailInput}
        onChangeText={text => setAccount(text)}
      />
      <TextInput placeholder="Enter Account name"
        style={styles.emailInput}
        onChangeText={text => setAccountName(text)}
      />


      <Button title="Add Account" onPress={addAccount} />



      <ScrollView>
        {userAccountInfo.map(info => (
          <Text key={info.accountId}>{info.amount}<Button title="X" onPress={() => deleteAccount(info.accountId)} /></Text>
        ))}
      </ScrollView>


      <Button title="Finish" onPress={completeSignup} />
    </View>

  );
}

export default OnboardScreen;