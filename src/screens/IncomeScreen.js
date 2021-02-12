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


const IncomeScreen = ({ navigation }) => {

  const [userDetail, setUserDetail] = useState({
    id: '',
    email: '',
  });



  const [userIncomeInfo, setUserIncomeInfo] = useState([
  ]);




  const [income, setIncome] = useState('');
  const [incomeName, setIncomeName] = useState('');



  let id = auth().currentUser.uid;

  addIncome = () => {
    firebase
      .database()
      .ref('incomes /')
      .push({
        income: {
          name: incomeName,
          amount: income, //pass your income
          uuid: auth().currentUser.uid,
        },
      });
  }



  deleteIncome = (incomeId) => {
    var record = firebase.database().ref('incomes /' +incomeId);
    record.remove();
  }

  logOut = () => {
    auth()
    .signOut()
    .then((res) => {
      navigation.replace('Login')
    })
  }



  useEffect(() => {
    firebase.database().ref('incomes /').on('value', (dataSnapshot) => {
      let items = [];
      dataSnapshot.forEach((child) => {
        if (id === child.val().income.uuid) {
          items.push({
            name: child.val().income.name,
            amount: child.val().income.amount,
            incomeId: child.key,
          });
        }
      });
      setUserIncomeInfo(items)
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







  return (
    <View style={styles.container}>

      <Text style={styles.signUpButton}> hello {userDetail.email}</Text>
      <Text style={styles.signUpButton}> your income {userIncomeInfo.name} is {userIncomeInfo.amount}</Text>

      <Button title ="Logout" onPress={logOut} />

      <TextInput placeholder="Enter Income"
        style={styles.emailInput}
        onChangeText={text => setIncome(text)}
      />
      <TextInput placeholder="Enter Income name"
        style={styles.emailInput}
        onChangeText={text => setIncomeName(text)}
      />


      <Button title="Add Income" onPress={addIncome} />



      <ScrollView>
        {userIncomeInfo.map(info => (
          <Text key= {info.incomeId}>{info.name}  <Button title="X" onPress={() => deleteIncome(info.incomeId)} /></Text>
        ))}
      </ScrollView>



    </View>

  );
}

export default IncomeScreen;