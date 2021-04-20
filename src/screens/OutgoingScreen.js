import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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


const OutgoingScreen = ({ navigation }) => {


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




    const [userDetail, setUserDetail] = useState({
        id: '',
        email: '',
    });



    const [accountInfo, setAccountInfo] = useState([
    ]);

    const [outgoingInfo, setOutgoingInfo] = useState([
    ]);

    const [outgoingAmount, setOutgoingAmount] = useState('');
    const [outgoingName, setOutgoingName] = useState('');
    const [totalBalance, setTotalBalance] = useState('');
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState("");
    let frequencies = ["Every Week", "Every 2 Weeks", "Every Month"];
    const [todaysDate, setTodaysDate] = useState(new Date());
    const [paymentDate, setPaymentDate] = useState(new Date(todaysDate.getTime()));

    const [updatedOutgoing, setUpdatedOutgoing] = useState("");
    const [updatedOutgoingName, setUpdatedOutgoingName] = useState("");
    const [updatedTargetAccount, setUpdatedTargetAccount] = useState("");
    const [updatedFrequency, setUpdatedFrequency] = useState("");
    const [updatedDate, setUpdatedDate] = useState(new Date(1598051730000));

 

    let id = auth().currentUser.uid;

    deleteOutgoing = (accountId) => {
        var record = firebase.database().ref('outgoings /' + accountId);
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

    updateAccountModal = (name, amount, targetAccount, frequency, nextDate) => {
        setUpdatedOutgoing(amount);
        setUpdatedOutgoingName(name);
        setUpdatedTargetAccount(targetAccount);
        setUpdatedFrequency(frequency);
        toggleModal2();
      }





    addOutgoing = () => {
        firebase
            .database()
            .ref('outgoings /')
            .push({
                outgoing: {
                    name: outgoingName,
                    amount: outgoingAmount,
                    targetAccount: selectedAccount,
                    firstDate: paymentDate.getTime(),
                    frequency: selectedFrequency,
                    uuid: auth().currentUser.uid,
                },
            });
        setModalVisible(false)
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

    //getting outgoings
    useEffect(() => {
        firebase.database().ref('outgoings /').on('value', (dataSnapshot) => {
            let items = [];
            dataSnapshot.forEach((child) => {
                if (id === child.val().outgoing.uuid) {
                    items.push({
                        name: child.val().outgoing.name,
                        amount: child.val().outgoing.amount,
                        targetAccount: child.val().outgoing.targetAccount,
                        frequency: child.val().outgoing.frequency,
                        nextDate:child.val().outgoing.firstDate,
                        accountId: child.key,
                    });
                }
            });
            setOutgoingInfo(items);
        });
    }, []);


    updateOutgoing = (accountId) => {
        firebase
          .database()
          .ref('outgoings /' + accountId)
          .update({
            outgoing: {
                name: updatedOutgoingName,
                amount: updatedOutgoing,
                targetAccount: updatedTargetAccount,
                frequency: updatedFrequency,
                nextDate: updatedDate.getTime(),
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
        navigation.replace('Calendar')
    }





    return (
        <Container>

            <Tabs renderTabBar={() => <ScrollableTab />}>
                {outgoingInfo.map(info => (
                    <Tab heading={info.name}>
                        <Content >
                            <Card style={styles.headerTitle}>
                                <CardItem headers style={styles.headerTitle}>
                                    <Title style={{ color: 'black' }}>€{info.amount}</Title>
                                </CardItem>
                            </Card>



                            <Body style={styles.mainContent}>
                                <Button danger rounded style={styles.deleteButton} onPress={() => deleteOutgoing(info.accountId)}>
                                    <Text>Delete</Text>
                                </Button>
                            </Body>
                        </Content>

                        <Modal isVisible={isModalVisible2} onBackdropPress={() => setModalVisible2(false)}>
                            <View style={{ flex: 1 }}>
                                <Content>
                                    <Card>
                                        <Text style={styles.modalTitle}>Add New Outgoing</Text>
                                        <CardItem>
                                            <Body>
                                                <TextInput placeholder="Update Outoing Name"
                                                    value={updatedOutgoingName}
                                                    onChangeText={text => setUpdatedOutgoingName(text)}
                                                />
                                                <TextInput placeholder="Update Outgoing Amount"
                                                    value={updatedOutgoing}
                                                    onChangeText={text => setUpdatedOutgoing(text)}
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
                                                    placeholder='Update frequency of Outgoing'
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
                                                    <Button rounded onPress={() => updateOutgoing(info.accountId)}  style={styles.addButtonModal}>
                                                        <Text>Add Outgoing</Text>
                                                    </Button>
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

            {!outgoingInfo[0] ? (
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
                            <Text style={styles.modalTitle}>Add New Outgoing</Text>
                            <CardItem>
                                <Body>
                                    <TextInput placeholder="Enter Outgoing Name"
                                        onChangeText={text => setOutgoingName(text)}
                                    />
                                    <TextInput placeholder="Enter Outgoing Amount"
                                        onChangeText={text => setOutgoingAmount(text)}
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
                                        placeholder='Select frequency of Outgoing'
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
                                        <Button rounded onPress={addOutgoing} style={styles.addButtonModal}>
                                            <Text>Add Outgoing</Text>
                                        </Button>
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

export default OutgoingScreen;