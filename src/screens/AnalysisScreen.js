import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { VictoryPie } from 'victory-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Container, Header, Content, Card, CardItem, Body, Text, Right, Footer, FooterTab, Icon, Button } from 'native-base';






const styles = StyleSheet.create({
  chart: {
    flex: 1,
  },
});



const AnalysisScreen = ({ navigation }) => {

  const [dailySpending, setDailySpending] = useState([
  ]);


  const [previousMonth, setPreviousMonth] = useState([
  ]);


  const [filtered, setFiltered] = useState([
  ]);


  const [percentDifference, setPercentDifference] = useState([
  ]);


  const [spentMore, setSpentMore] = useState(false);




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


  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  var lastMonthFirst = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  var LastMonthlast = date.setDate(1); // going to 1st of the month
  LastMonthlast = date.setHours(-1);

  //getting spendings
  useEffect(() => {
    firebase.database().ref('dailySpendings /').on('value', (dataSnapshot) => {
      let items = [];
      let lastMonthItems = [];
      dataSnapshot.forEach((child) => {
        if (id === child.val().dailySpending.uuid) {
          if (child.val().dailySpending.spendingDate > firstDay.getTime() && child.val().dailySpending.spendingDate < lastDay.getTime()) {
            items.push({
              amount: child.val().dailySpending.spendingAmount,
              category: child.val().dailySpending.category,
            });
          } else if (child.val().dailySpending.spendingDate > lastMonthFirst && child.val().dailySpending.spendingDate < LastMonthlast) {
            lastMonthItems.push({
              amount: child.val().dailySpending.spendingAmount,
              category: child.val().dailySpending.category,
            });
          }
        }
      });
      setDailySpending(items);
      setPreviousMonth(lastMonthItems);
    });
  }, []);


  //getting spendings
  useEffect(() => {
    let filteredArray = dailySpending.reduce((accumulator, cur) => {
      let c = cur.category;
      let found = accumulator.find(elem => elem.category === c)
      if (found) {
        found.amount = parseFloat(cur.amount) + parseFloat(found.amount);
      }
      else accumulator.push(cur);
      return accumulator;
    }, []);

    setFiltered(filteredArray)
  }, [dailySpending]);

  //find previous percentage difference between months
  useEffect(() => {

    let prevTotal = 0;

    let newTotal = 0;

    for (let i = 0; i < dailySpending.length; i++) {
      newTotal = parseFloat(newTotal) + parseFloat(dailySpending[i].amount);
    }

    for (let i = 0; i < previousMonth.length; i++) {
      prevTotal = parseFloat(prevTotal) + parseFloat(previousMonth[i].amount);
    }

    let perDiff;

    if (prevTotal > newTotal && prevTotal !=0) {
      perDiff = (prevTotal - newTotal) / prevTotal * 100;
      setSpentMore(true)
    } else if (prevTotal < newTotal && prevTotal !=0) {
      perDiff = (newTotal - prevTotal) / prevTotal * 100;
    } else if (prevTotal == newTotal) {
      perDiff = 0;
    } else if (prevTotal == 0 && newTotal > prevTotal) {
      perDiff = 100;
    } else if (newTotal == 0 && newTotal < prevTotal) {
      perDiff = 100;
      setSpentMore(true)
    } 


    setPercentDifference(perDiff.toFixed());

  }, [previousMonth]);





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


<Header>

</Header>
      
        <Card>
          <CardItem>
            <Body>
              {!spentMore ? (
                <Text>Spent {percentDifference}% more than last month</Text>
              ) : (
                <Text>Spent {percentDifference}% less than last month</Text>
              )}
            </Body>
          </CardItem>
        </Card>

        {!dailySpending[0] ? (
                <Body style={{ textAlign: 'center', marginTop: 150 }}>
                    <Text style={{ color: 'grey' }}>You have made no purchases this month.</Text>
                </Body>

            ) : (
                <View  >
                </View>
            )}
      
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

export default AnalysisScreen;



