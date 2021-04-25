import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Container, Header, Content, Footer, FooterTab, Button, Text, Icon, Card, CardItem, Title, Body, Subtitle, List, ListItem } from 'native-base';


import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...'])
LogBox.ignoreAllLogs();

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


const HomeScreen = ({ navigation }) => {

  const [userDetail, setUserDetail] = useState({
    id: '',
    email: '',
    name: '',
  });

  const [totalBalance, setTotalBalance] = useState('');
  const [incomeInfo, setIncomeInfo] = useState([
  ]);

  const [outgoingInfo, setOutgoingInfo] = useState([
  ]);


  const goToAccounts = () => {
    navigation.replace('Accounts')
  }


  const goToInOut = () => {
    navigation.replace('InOut')
  }

  const goToDaily = () => {
    navigation.replace('DailySpending')
  }
  const goToMySpending = () => {
    navigation.replace('Analysis')
  }


  let id = auth().currentUser.uid;





  const logOut = () => {
    auth()
      .signOut()
      .then((res) => {
        navigation.replace('Login')
      })
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

  useEffect(() => {
    firebase.database().ref('users /').on('value', (dataSnapshot) => {
      dataSnapshot.forEach((child) => {
        if (id === child.val().user.uuid) {
          setUserDetail({
            id,
            name: child.val().user.name,
            email: child.val().user.email,

          });
        }
      });
    });
  }, []);

  function displayBalance(amount) {

    if (amount < 0) {
      return <Title style={{ color: '#f52500' }}>€{amount}</Title>
    } else {
      return <Title style={{ color: 'black' }}>€{amount}</Title>
    }


  }

  function displayDate(date) {

 

    const newDate = new Date(date)
    let dateString = newDate.toUTCString()
    dateString = dateString.split(' ').slice(0, 4).join(' ');

    return (
      dateString
    )

  }

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
            nextDate: child.val().outgoing.nextDate,
            accountId: child.key,
          });
        }
      });
      setOutgoingInfo(items);
    });
  }, []);

  return (
    <Container>

      {userDetail ? (
        <Container>

          <Header style={{ color: 'black', marginLeft: -250 }}>
            <Button transparent onPress={logOut}>
              <Icon name='log-in-outline' />
            </Button>
          </Header>
          <Content padder>
            <Card>
              <CardItem header>
                <Title style={{ color: 'black' }}> Hello {userDetail.name} </Title>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Your total current balance:
                </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  {displayBalance(totalBalance)}
                </Body>
              </CardItem>
            </Card>


            {!incomeInfo[0] ? (
              <Body style={{ textAlign: 'center', marginTop: 50 }}>
                <Text style={{ color: 'grey' }}>You have no upcoming Incomes</Text>
              </Body>

            ) : (
              <View>
                <Subtitle style={{ color: 'gray', marginTop: 10 }}> Upcoming Incomes</Subtitle>
                <List horizontal={true} dataArray={incomeInfo}
                  renderRow={info => (
                    <ListItem  >
                      <Card>
                        <CardItem header>
                          <Title style={{ color: 'black' }}> {info.name} : €{info.amount}  </Title>
                        </CardItem>
                        <CardItem>
                          <Body>
                            <Text>Due: {displayDate(info.nextDate)} </Text>
                          </Body>
                        </CardItem>
                      </Card>

                    </ListItem>
                  )}>
                </List>
              </View>
            )}


            {!outgoingInfo[0] ? (
              <Body style={{ textAlign: 'center', marginTop: 50 }}>
                <Text style={{ color: 'grey' }}>You have no upcoming Outgoings</Text>
              </Body>

            ) : (
              <View>
                <Subtitle style={{ color: 'gray', marginTop: 10 }}> Upcoming Outgoings</Subtitle>
                <List horizontal={true} dataArray={outgoingInfo} // your array should go here
                  renderRow={info => (
                    <ListItem>
                      <Card>
                        <CardItem header>
                          <Title style={{ color: 'black' }}> {info.name} : €{info.amount}  </Title>
                        </CardItem>
                        <CardItem>
                          <Body>
                            <Text>Due: {displayDate(info.nextDate)} </Text>
                          </Body>
                        </CardItem>
                      </Card>

                    </ListItem>
                  )}>
                </List>
              </View>
            )}


          </Content>


          <Footer>
            <FooterTab>
              <Button active>
                <Icon name='home' />
              </Button>
              <Button onPress={goToAccounts}>
                <Icon name='wallet' />
              </Button>
              <Button onPress={goToInOut}>
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
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />

        </View>
      )}

    </Container>

  );
}

export default HomeScreen;

