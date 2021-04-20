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


const IncomeScreen = ({ navigation }) => {






    let id = auth().currentUser.uid;





    const goToHome = () => {
        navigation.replace('Home')
    }


    const goToAccounts = () => {
        navigation.replace('Accounts')
    }

    const goToIncomes = () => {
        navigation.replace('Income')
    }

    const goToOutcomes = () => {
        navigation.replace('Outgoing')
    }

    const goToDaily = () => {
        navigation.replace('DailySpending')
    }
    const goToMySpending = () => {
        navigation.replace('Calendar')
    }





    return (
        <Container>

            <Header />
            <Content padder>
            <TouchableOpacity onPress={goToIncomes}>
                <Card>
                    <CardItem header>
                    <Title style={{ color: 'black'}}> Incomes </Title>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                                Manage your Incomes
                </Text>
                        </Body>
                    </CardItem>
                </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={goToOutcomes}>
                <Card>
                    <CardItem header >
                    <Title style={{ color: 'black'}}> Outcomes </Title>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                                Manage your Outcomes
                </Text>
                        </Body>
                    </CardItem>
                </Card>
                </TouchableOpacity>
            </Content>
            

            <Footer>
                <FooterTab>
                    <Button onPress={goToHome}>
                        <Icon name='home' />
                    </Button>
                    <Button onPress={goToAccounts}>
                        <Icon name='wallet' />
                    </Button>
                    <Button active>
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