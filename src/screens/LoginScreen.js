import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import firebase from '../../config';
import { Container, Text, Item, Input, Button, Content } from 'native-base';
import auth from '@react-native-firebase/auth';



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
    borderColor: "black"
  },
  signUpText: {
    color: 'black',
    fontSize: 15,
    fontFamily: "Roboto",
    marginBottom: 0
  },
});


const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const goToSignup = () => {
    navigation.replace('Register')
  };

  const login = () => {
    console.log(email)
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        navigation.replace('Home')
      })
      .catch((err) => {
        alert(err);
      });
  };


  return (
    <Container style={styles.container}>

      <Image style={{ width: 120, height: 120 }} source={require('../../assets/logo.png')} />
      <Text h1 style={styles.appName}>In The Black</Text>



      <Item style={styles.input}>
        <Input style={styles.inputText} placeholder='Email' 
        onChangeText={text => setEmail(text)} />
      </Item>

      <Item style={styles.input}>
        <Input style={styles.inputText} placeholder='Password'
        onChangeText={text => setPassword(text)} />
      </Item>

      <Content>

        <Button rounded style={styles.loginButton} onPress={login}>
          <Text>Login</Text>
        </Button>
      </Content>

      <LoginApp />


      <Text style={styles.signUpText}>Don't have an account?</Text>
      <Content>

        <Button rounded style={styles.registerButton} onPress={goToSignup}>
          <Text>Register</Text>
        </Button>
      </Content>
    </Container>







  );
}

export default LoginScreen;