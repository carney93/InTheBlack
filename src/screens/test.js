import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Button, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';




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


    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, date) => {
        const currentDate = date;
        setShow(Platform.OS === 'ios');
        setPaymentDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };




    const [userDetail, setUserDetail] = useState({
        id: '',
        email: '',
    });

    const [todaysDate, setTodaysDate] = useState(new Date());



    const [accountInfo, setAccountInfo] = useState([
    ]);

    const [incomeInfo, setIncomeInfo] = useState([
    ]);

    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeName, setIncomeName] = useState('');
    const [totalBalance, setTotalBalance] = useState('');
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState("");
    let frequencies = ["Every Week", "Every 2 Weeks", "Every Month"];
    const [paymentDate, setPaymentDate] = useState(new Date(1598051730000));



    let id = auth().currentUser.uid;

    deleteIncome = (accountId) => {
        var record = firebase.database().ref('incomes /' + accountId);
        record.remove();
    }

    logOut = () => {
        auth()
            .signOut()
            .then((res) => {
                navigation.replace('Login')
            })
    }


 


    addIncome = () => {
        firebase
            .database()
            .ref('incomes /')
            .push({
                income: {
                    name: incomeName,
                    amount: incomeAmount,
                    targetAccount: selectedAccount,
                    nextDate: paymentDate.getTime(),
                    frequency: selectedFrequency,
                    uuid: auth().currentUser.uid,
                },
            });
    }


    //getting accounts
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
            setAccountInfo(items);
        });
    }, []);

    //getting incomes
    useEffect(() => {
        firebase.database().ref('incomes /').on('value', (dataSnapshot) => {
            let items = [];
            dataSnapshot.forEach((child) => {
                if (id === child.val().income.uuid) {
                    items.push({
                        name: child.val().income.name,
                        amount: child.val().income.amount,
                        targetAccount: child.val().income.targetAccount,
                        accountId: child.key,
                    });
                }
            });
            setIncomeInfo(items);
        });
    }, []);



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
    }, [accountInfo]);




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

    const goHome = () => {
        navigation.replace('Home')
      }
    




    return (
        <View style={styles.container}>

            <Text style={styles.signUpButton}> hello {userDetail.email}</Text>
            <Text style={styles.signUpButton}> your account {accountInfo.name} is {accountInfo.amount} and total is {totalBalance}</Text>

            <Button title="Logout" onPress={logOut} />

            <TextInput placeholder="Enter Income Amount"
                style={styles.emailInput}
                onChangeText={text => setIncomeAmount(text)}
            />
            <TextInput placeholder="Enter Income Type"
                style={styles.emailInput}
                onChangeText={text => setIncomeName(text)}
            />

            <View>
                <View>
                    <Button onPress={showDatepicker} title="Select next payment date" />
                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={paymentDate}
                        mode={mode}
                        display="calendar"
                        onChange={onChange}
                        minimumDate={todaysDate}
                    />
                )}
            </View>

            <Picker
                selectedValue={selectedFrequency}
                placeholder='Select frequency of income'
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue) => setSelectedFrequency(itemValue)}
            >
                {frequencies.map(info => (
                    <Picker.Item label={info} value={info} />
                ))}
            </Picker>
            
            <Picker
                selectedValue={selectedAccount}
                placeholder='Select an Account'
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue) => setSelectedAccount(itemValue)}
            >
                {accountInfo.map(info => (
                    <Picker.Item label={info.name} value={info.accountId} />
                ))}
            </Picker>

            <Button title="Add Income" onPress={addIncome} />
            <Button title="Go Home" onPress={goHome} />



            <ScrollView>
                {incomeInfo.map(info => (
                    <Text key={info.accountId}>{info.name}{info.amount}<Button title="X" onPress={() => deleteIncome(info.accountId)} /></Text>
                ))}
            </ScrollView>



        </View>

    );
}

export default IncomeScreen;