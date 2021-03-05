import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Button, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Picker } from '@react-native-picker/picker';




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

    //to check if new income has been added
    const [incomeAdded, setIncomeAdded] = useState(false);

    const [accountInfo, setAccountInfo] = useState([
    ]);

    const [incomeInfo, setIncomeInfo] = useState([
    ]);

    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeName, setIncomeName] = useState('');
    const [totalBalance, setTotalBalance] = useState('');
    const [selectedAccount, setSelectedAccount] = useState("");



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


    useEffect(() => {
        if(incomeAdded){
        for (i = 0; i < accountInfo.length; i++) {
            if (accountInfo[i].targetAccount === selectedAccount) {
                firebase
                    .database()
                    .ref('financialAccounts /' + accountInfo[i].accountId)
                    .update({
                        financialAccount: {
                            name: accountInfo[i].name,
                            amount: accountInfo[i].amount + parseFloat(incomeAmount),
                            uuid: auth().currentUser.uid,
                        },
                    });
            }

        }
        setIncomeAdded(false)
    }}, [incomeAdded]);


    addIncome = () => {
        firebase
            .database()
            .ref('incomes /')
            .push({
                income: {
                    name: incomeName,
                    amount: incomeAmount,
                    targetAccount: "aib",
                    uuid: auth().currentUser.uid,
                },
            });
        setIncomeAdded(true);
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
            console.log(accountInfo);
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

            <Picker
                selectedValue={selectedAccount}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue) => setSelectedAccount(itemValue)}
            >
                {accountInfo.map(info => (
                    <Picker.Item label={info.name} />
                ))}
            </Picker>


            <Button title="Add Account" onPress={addIncome} />



            <ScrollView>
                {incomeInfo.map(info => (
                    <Text key={info.accountId}>{info.name}{info.amount}<Button title="X" onPress={() => deleteIncome(info.accountId)} /></Text>
                ))}
            </ScrollView>



        </View>

    );
}

export default IncomeScreen;