import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';


const styles = StyleSheet.create({
  container: {
    marginTop: 10,
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
});


const RegisterScreen = ({ navigation }) => {



  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const goToLogin = () => {
    navigation.replace('Home')
  }


  logOut = () => {
    auth()
      .signOut()
      .then((res) => {
        navigation.replace('Login')
      })
  }

  <Button title="Logout" onPress={logOut} />


  createUser = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .database()
          .ref('users /')
          .push({
            user: {
              email: email, //pass your email
              uuid: auth().currentUser.uid,
            },
          });
        navigation.replace('Onboard')
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <Image style={{ width: 120, height: 120 }} source={require('../../assets/logo.png')} />
      <Text h1 style={styles.appName}>In The Black</Text>

      <TextInput placeholder="Email"
        style={styles.emailInput}
        onChangeText={text => setEmail(text)}

      />

      <TextInput placeholder="Password"
        style={styles.passwordInput}
        onChangeText={text => setPassword(text)}
      />


      <TouchableOpacity
        style={styles.loginButton}
      >
        <Text style={styles.loginButtonTxt}>Register
			</Text>
      </TouchableOpacity>

      <Button title="Create User" onPress={createUser} />
      <Button title="Login" onPress={goToLogin}>
      </Button>

      <Button title="Logout" onPress={logOut} />

    </View>


  );
}

export default RegisterScreen;