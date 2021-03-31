import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
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


const HomeScreen = ({ navigation }) => {

  const [userDetail, setUserDetail] = useState({
    id: '',
    email: '',
  });

  const goToAccounts = () => {
    navigation.replace('Accounts')
  }


  const goToIncomes = () => {
    navigation.replace('Income')
  }

  const goToDaily = () => {
    navigation.replace('DailySpending')
  }


  let id = auth().currentUser.uid;


  logOut = () => {
    auth()
      .signOut()
      .then((res) => {
        navigation.replace('Login')
      })
  }

  useEffect(() => {
    firebase.database().ref('users /').on('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        if (id === child.val().user.uuid) {
          setUserDetail({ //set state here
            id,
            email: child.val().user.email,
          });
        }
      });
    });
    console.log('email', userDetail.email)
  }, []);


  return (
    <View style={styles.container}>


      <Text style={styles.signUpButton}> hello {userDetail.email}</Text>

      <Button title="Go to Accounts" onPress={goToAccounts} />

      <Button title="Go to Incomes" onPress={goToIncomes} />
      <Button title="Go to Daily Spending" onPress={goToDaily} />

      <Button title="Logout" onPress={logOut} />


    </View>

  );
}

export default HomeScreen;

