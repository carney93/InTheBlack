import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Container, Text, Item, Input, Button, Content } from 'native-base';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';


function LoginApp() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;



  return (
    <View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: 'center',
  },
  appName: {
    alignItems: 'center',
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Roboto"
  },
  input: {
    marginTop: 10,
    height: 40,
    width: 200,
    borderBottomWidth: 0,

  },
  inputText: {
    height: 40,
    width: 200,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
  },
  loginButton: {
    marginTop: 20,
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderColor: "black"
  },
  registerButton: {
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderColor: "black",
  },
  signUpText: {
    color: 'black',
    fontSize: 15,
    fontFamily: "Roboto",
    marginBottom: 0
  },
});


const RegisterScreen = ({ navigation }) => {



  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');


  const goToLogin = () => {
    navigation.replace('Login')
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
              name: name, //pass your email
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
    <Container style={styles.container}>

    <Image style={{ width: 120, height: 120 }} source={require('../../assets/logo.png')} />
    <Text h1 style={styles.appName}>In The Black</Text>

    <Item style={styles.input}>
        <Input 
        onChangeText={text => setName(text)} style={styles.inputText} placeholder='First Name' />
      </Item>

    <Item style={styles.input}>
        <Input 
        onChangeText={text => setEmail(text)} style={styles.inputText} placeholder='Email' />
      </Item>

      <Item style={styles.input}>
        <Input onChangeText={text => setPassword(text)} style={styles.inputText} placeholder='Password' />
      </Item>


      <Content>

        <Button rounded style={styles.loginButton} onPress={createUser}>
          <Text>Register</Text>
        </Button>
      </Content>


      <Text style={styles.signUpText}>Already have an Account?</Text>
      <Content>

        <Button rounded style={styles.registerButton} onPress={goToLogin}>
          <Text>Log In</Text>
        </Button>
      </Content>

    </Container>


  );
}

export default RegisterScreen;