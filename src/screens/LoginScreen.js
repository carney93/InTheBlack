import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Button} from 'react-native';
import { withOrientation } from 'react-navigation';
import auth from '@react-native-firebase/auth';

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
    flexDirection:'row'
  },
});


const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


    const goToSignup = () => {
      navigation.replace('Register')
          };
  

  return (
    <View style={styles.container}>
      <Image style={{ width: 120, height: 120 }} source={require('../../assets/logo.png')} />
      <Text h1 style={styles.appName}>In The Black</Text>

      <TextInput placeholder="Email"
        style={styles.emailInput}
        setEmail={text => setEmail(text)}

      />

      <TextInput placeholder="Password"
        style={styles.passwordInput}
        setPassword={text => setPassword(text)}
      />


     <TouchableOpacity
        style={styles.loginButton}
      >
       <Text style={styles.loginButtonTxt}>Login
			</Text>
      </TouchableOpacity>

      <Text>
      <Text style={styles.signUpText}>Don't have an account?</Text><Text style={styles.signUpButton}> SignUp</Text>
      <Button title="SignUp" onPress={goToSignup}>
      Go home
    </Button>
      </Text>
    </View>

  
  );
}

export default LoginScreen;