import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { VictoryPie } from 'victory-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Container, Header, Content, Card, CardItem, Text, Right, Footer, FooterTab ,Icon, Button} from 'native-base';






const styles = StyleSheet.create({
  chart: {
    flex: 1,
  },
});



const CalendarScreen = ({ navigation }) => {

  const [dailySpending, setDailySpending] = useState([
  ]);


  const [filtered, setFiltered] = useState([
  ]);



  let id = auth().currentUser.uid;


  const goToHome = () => {
    navigation.replace('Home')
  }
  

  const goToDailySpending = () => {
    navigation.replace('DailySpending')
  }

  const goToInOut = () => {
    navigation.replace('InOut')
  }

  const goToAccounts = () => {
    navigation.replace('Accounts')
  }



  //getting spendings
  useEffect(() => {
    firebase.database().ref('dailySpendings /').on('value', (dataSnapshot) => {
      let items = [];
      dataSnapshot.forEach((child) => {
        if (id === child.val().dailySpending.uuid) {
          items.push({
            amount: child.val().dailySpending.spendingAmount,
            category: child.val().dailySpending.category,
          });
        }
      });
      setDailySpending(items);

    });
  }, []);


  //getting spendings
  useEffect(() => {
    let filteredArray = dailySpending.reduce((accumulator, cur) => {
      let c = cur.category;
      let found = accumulator.find(elem => elem.category === c)
      if (found) {
        found.amount = parseFloat(cur.amount) + parseFloat(found.amount) ;
      }
      else accumulator.push(cur);
      return accumulator;
    }, []);

    setFiltered(filteredArray)
  }, [dailySpending]);





  function getChartData() {


    let total = 0;


    for (let i = 0; i < filtered.length; i++) {
      total = parseFloat(total) + parseFloat(filtered[i].amount);
    }


    let chartData = filtered.map((item) => {

      let percentage = (item.amount / total * 100).toFixed();


      return {
        name: item.category,
        y: Number(item.amount),
        label: `${percentage}%`,

      }
    })

    return chartData;


  }





  function chart() {
    let data = getChartData();
    return (
      <View>
        <VictoryPie
          data={data}
          colorScale={["#845EC2", "#4B4453", "#B0A8B9", "#C34A36", "#FF8066", "#4A4453", "#B0A8B9", "#C15E4B", "#872B1E", "#9679C5", "#4A4453", "#B0A8BA", "#CB6C5A", "#903A2C"]}
        />
      </View>
    );
  }


  function chartInfo() {


    let total = 0;

    for (let i = 0; i < filtered.length; i++) {
      total = parseFloat(total) + parseFloat(filtered[i].amount);
    }




    let chartInfo = filtered.map((item) => {

      let percentage = (item.amount / total * 100).toFixed();

      return (
        <Card>
          <CardItem>
            <Text>{item.category}</Text>
            <Right>
              <Text> €{item.amount} - {percentage}%</Text>
            </Right>
          </CardItem>
        </Card>
      )
    });

    return chartInfo
  }


  return (
    <Container>
      <ScrollView>


        {chart()}

        {chartInfo()}

      </ScrollView>

      <Footer>
        <FooterTab>
          <Button onPress={goToHome}>
            <Icon name='home' />
          </Button>
          <Button onPress={goToAccounts}>
            <Icon name='wallet' />
          </Button>
          <Button onPress={goToInOut}>
            <Icon name='swap-horizontal' />
          </Button>
          <Button onPress={goToDailySpending}>
            <Icon name='calendar' />
          </Button>
          <Button active>
            <Icon name='analytics' />
          </Button>
        </FooterTab>
      </Footer>

    </Container>

  );
}

export default CalendarScreen;



