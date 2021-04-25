import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Container, Header, Subtitle, Left, Right, Title, Tab, Tabs, ScrollableTab, Icon, Button, Card, CardItem, Content, Text, Body, Footer, FooterTab } from 'native-base';
import Modal from 'react-native-modal';




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
    modalTitle: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 10,
    },

    addButton: {
        fontSize: 50,
        marginBottom: 10,

    },
    modalButtons: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    UpdateButton: {
        fontSize: 30,
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent'
    },
    addButtonModal: {
        marginLeft: 20,
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


    const onChangeUpdated = (event, date) => {
        const currentDate = date;
        setShow(Platform.OS === 'ios');
        setUpdatedDate(currentDate);
    };


    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };







    const [accountInfo, setAccountInfo] = useState([
    ]);

    const [incomeInfo, setIncomeInfo] = useState([
    ]);

    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeName, setIncomeName] = useState('');
    const [totalBalance, setTotalBalance] = useState('');
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState("Every Week");
    let frequencies = ["Every Week", "Every 2 Weeks", "Every Month"];
    const [todaysDate, setTodaysDate] = useState(new Date());
    const [paymentDate, setPaymentDate] = useState(new Date(todaysDate.getTime()));

    const [updatedIncome, setUpdatedIncome] = useState("");
    const [updatedIncomeName, setUpdatedIncomeName] = useState("");
    const [updatedTargetAccount, setUpdatedTargetAccount] = useState("");
    const [updatedFrequency, setUpdatedFrequency] = useState("");
    const [updatedDate, setUpdatedDate] = useState(new Date());



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


    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    };

    updateAccountModal = (name, amount, targetAccount, frequency) => {
        setUpdatedIncome(amount);
        setUpdatedIncomeName(name);
        setUpdatedTargetAccount(targetAccount);
        setUpdatedFrequency(frequency);
        toggleModal2();
    }





    addIncome = () => {
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
                    nextDate: paymentDate.getTime() + 3600000,
                    frequency: selectedFrequency,
                    uuid: auth().currentUser.uid,
                },
            });
        setModalVisible(false)
        setIncomeAmount("");
        setIncomeName("");
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
            if (items === undefined || items.length == 0) {
                setSelectedAccount("")
            } else {
                setSelectedAccount(items[0].accountId)
            }
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
                        frequency: child.val().income.frequency,
                        nextDate: child.val().income.nextDate,
                        accountId: child.key,
                    });
                }
            });
            setIncomeInfo(items);
        });
    }, []);


    updateIncome = (accountId) => {
        if (updatedIncome <= 0) {
            Alert.alert('Alert', 'Amount need to be greater than 0');
            return;
        } else if (isNaN(updatedIncome)) {
            Alert.alert('Alert', 'Amount needs to be a number');
            return;
        }
        firebase
            .database()
            .ref('incomes /' + accountId)
            .update({
                income: {
                    name: updatedIncomeName,
                    amount: updatedIncome,
                    targetAccount: updatedTargetAccount,
                    frequency: updatedFrequency,
                    nextDate: updatedDate.getTime() + 3600000,
                    uuid: auth().currentUser.uid,
                },
            });
        setModalVisible2(false)
    }


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







    const goToHome = () => {
        navigation.replace('Home')
    }


    const goToInOut = () => {
        navigation.replace('InOut')
    }



    const goToAccounts = () => {
        navigation.replace('Accounts')
    }

    const goToDaily = () => {
        navigation.replace('DailySpending')
    }
    const goToMySpending = () => {
        navigation.replace('Analysis')
    }





    return (
        <Container>
            <Tabs renderTabBar={() => <ScrollableTab />}>
                {incomeInfo.map(info => (
                    <Tab heading={info.name}>
                        <Content >
                            <Card style={styles.headerTitle}>
                                <CardItem headers style={styles.headerTitle}>
                                    <Title style={{ color: 'black' }}>€{info.amount}</Title>
                                </CardItem>
                            </Card>
                            <Body style={styles.mainContent}>
                                <Button danger rounded style={styles.deleteButton} onPress={() => deleteIncome(info.accountId)}>
                                    <Text>Delete</Text>
                                </Button>
                            </Body>
                        </Content>
                        <Modal isVisible={isModalVisible2} onBackdropPress={() => setModalVisible2(false)}>
                            <View style={{ flex: 1 }}>
                                <Content>
                                    <Card>
                                        <Text style={styles.modalTitle}>Update Income</Text>
                                        <CardItem>
                                            <Body>
                                                <TextInput placeholder="Update Income Name"
                                                    value={updatedIncomeName}
                                                    onChangeText={text => setUpdatedIncomeName(text)}
                                                />
                                                <TextInput placeholder="Update Income Amount"
                                                    keyboardType='numeric'
                                                    value={updatedIncome}
                                                    onChangeText={text => setUpdatedIncome(text)}
                                                />
                                                <View style={{ marginLeft: -20, marginTop: 20 }}>

                                                    <Button rounded onPress={showDatepicker} style={styles.addButtonModal}>
                                                        <Text>Update next payment date</Text>
                                                    </Button>
                                                    {show && (
                                                        <DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={paymentDate}
                                                            mode={mode}
                                                            display="calendar"
                                                            onChange={onChangeUpdated}
                                                            minimumDate={todaysDate}
                                                        />
                                                    )}
                                                </View>

                                                <Picker
                                                    selectedValue={updatedFrequency}
                                                    placeholder='Update frequency of Income'
                                                    style={{ height: 50, width: 150 }}
                                                    onValueChange={(itemValue) => setUpdatedFrequency(itemValue)}
                                                >
                                                    {frequencies.map(info => (
                                                        <Picker.Item label={info} value={info} />
                                                    ))}
                                                </Picker>
                                                <Picker
                                                    selectedValue={updatedTargetAccount}
                                                    placeholder='Update Account of Choice'
                                                    style={{ height: 50, width: 150 }}
                                                    onValueChange={(itemValue) => setUpdatedTargetAccount(itemValue)}
                                                >
                                                    {accountInfo.map(info => (
                                                        <Picker.Item label={info.name} value={info.accountId} />
                                                    ))}
                                                </Picker>

                                                <Body style={styles.modalButtons}>
                                                    <Button rounded onPress={toggleModal2}>
                                                        <Text>Close</Text>
                                                    </Button>
                                                    {!updatedIncome || !updatedIncomeName ? (
                                                        <Button rounded disabled style={styles.addButtonModal}>
                                                            <Text>Update Income</Text>
                                                        </Button>
                                                    ) : (
                                                        <Button rounded onPress={() => updateIncome(info.accountId)} style={styles.addButtonModal}>
                                                            <Text>Update Income</Text>
                                                        </Button>
                                                    )}
                                                </Body>
                                            </Body>
                                        </CardItem>
                                    </Card>
                                </Content>
                            </View>
                        </Modal>

                        <View style={styles.footer} >
                            <Button transparent onPress={toggleModal} >
                                <Icon style={styles.addButton} name='add-circle-outline' />
                            </Button>
                            <Button transparent onPress={() => updateAccountModal(info.name, info.amount, info.targetAccount, info.frequency)}>
                                <Icon style={styles.UpdateButton} name='pencil' />
                            </Button>
                        </View>

                    </Tab>
                ))}
            </Tabs>


{!incomeInfo[0] ? (
                <Body style={{ textAlign: 'center', marginLeft: 10 }}>
                    <Text style={{ color: 'grey' }}>You have no incomes set up. Please add one</Text>
                </Body>

            ) : (
                <View  >
                </View>
            )}

            {!incomeInfo[0] ? (
                <View style={styles.footer} >

                    <Button transparent onPress={toggleModal} >
                        <Icon style={styles.addButton} name='add-circle-outline' />
                    </Button>
                </View>
            ) : (
                <View style={styles.footer} >
                </View>
            )}

            <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={{ flex: 1 }}>
                    <Content>
                        <Card>
                            <Text style={styles.modalTitle}>Add New Income</Text>
                            <CardItem>
                                <Body>
                                    <TextInput placeholder="Enter Income Name"
                                        onChangeText={text => setIncomeName(text)}
                                    />
                                    <TextInput placeholder="Enter Income Amount"
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

                                    <Body style={styles.modalButtons}>
                                        <Button rounded onPress={toggleModal}>
                                            <Text>Close</Text>
                                        </Button>
                                        {!incomeAmount || !incomeName || !selectedAccount ? (
                                            <Button rounded disabled style={styles.addButtonModal}>
                                                <Text>Add Income</Text>
                                            </Button>
                                        ) : (
                                            <Button rounded onPress={addIncome} style={styles.addButtonModal}>
                                                <Text>Add Income</Text>
                                            </Button>
                                        )}
                                    </Body>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </View>
            </Modal>

            <Footer>
                <FooterTab>
                    <Button onPress={goToHome}>
                        <Icon name='home' />
                    </Button>
                    <Button onPress={goToAccounts}>
                        <Icon name='wallet' />
                    </Button>
                    <Button active onPress={goToInOut}>
                        <Icon name='swap-horizontal' />
                    </Button>
                    <Button onPress={goToDaily}>
                        <Icon name='calendar' />
                    </Button>
                    <Button onPress={goToMySpending}>
                        <Icon name='analytics' />
                    </Button>
                </FooterTab>
            </Footer>

        </Container>


    );

}

export default IncomeScreen;