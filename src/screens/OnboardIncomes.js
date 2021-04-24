import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Container, Header, Subtitle, Left, Right, Title, Tab, Tabs, ScrollableTab, Icon, Button, Card, CardItem, Content, Text, Body, Footer, FooterTab } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const styles = StyleSheet.create({
    body: {
        marginTop: 100,
        alignItems: 'center',
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


    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeName, setIncomeName] = useState('');
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState("Every Week");
    let frequencies = ["Every Week", "Every 2 Weeks", "Every Month"];
    const [todaysDate, setTodaysDate] = useState(new Date());
    const [paymentDate, setPaymentDate] = useState(new Date(todaysDate.getTime()));






    const [accountInfo, setAccountInfo] = useState([
    ]);


    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, date) => {
        const currentDate = date;
        setShow(Platform.OS === 'ios');
        setPaymentDate(currentDate);
    };


    let id = auth().currentUser.uid;

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


    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };


    const addIncome = () => {
        if (incomeAmount <= 0) {
            Alert.alert('Alert', 'Amount need to be greater than 0');
            return;
          } else if (isNaN(incomeAmount)) {
            Alert.alert('Alert', 'Amount needs to be a number');
            return;
          }
        firebase
            .database()
            .ref('incomes /')
            .push({
                income: {
                    name: incomeName,
                    amount: incomeAmount,
                    targetAccount: selectedAccount,
                    firstDate: paymentDate.getTime(),
                    frequency: selectedFrequency,
                    uuid: auth().currentUser.uid,
                },
            });
        navigation.replace('OnboardOutgoings')
    }



    return (


        <Container>
            <Body style={styles.body}>

                <Text style={styles.text} >
                    Please enter income Information. You can add more later
          </Text>

                <TextInput placeholder="Enter Income Name"
                    onChangeText={text => setIncomeName(text)}
                />
                <TextInput placeholder="Enter Income Amount"
                    type="number"
                    keyboardType='numeric'
                    onChangeText={text => setIncomeAmount(text)}
                />
                <View style={{ marginLeft: -20, marginTop: 20 }}>

                    <Button rounded onPress={showDatepicker} style={styles.addButtonModal}>
                        <Text>Select next payment date</Text>
                    </Button>
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

                {!incomeName || !incomeAmount ? (
                    <Button rounded disabled style={styles.addAccountButton}>
                        <Text>Add Income</Text>
                    </Button>
                ) : (
                    <Button rounded onPress={addIncome} style={styles.addAccountButton}>
                        <Text>Add Income</Text>
                    </Button>
                )}
            </Body>

        </Container>




    );
}

export default OnboardScreen;