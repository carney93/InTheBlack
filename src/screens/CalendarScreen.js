import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '../../config';
import { Container, Header, Tab, Tabs, ScrollableTab, Icon, Button, Card, CardItem, Content, Text, Body } from 'native-base';


const styles = StyleSheet.create({

});


const CalendarScreen = ({ navigation }) => {
  

  let cars = [
    {
      "color": "purple",
      "type": "minivan",
      "Balance": "400",
      "registration": new Date('2017-01-03'),
      "capacity": 7
    },
    {
      "color": "red",
      "type": "station wagon",
      "Balance": "200",
      "registration": new Date('2018-03-03'),
      "capacity": 5
    }
  ]


  return (
    <Container>
      <Header hasTabs />

      <Tabs renderTabBar={() => <ScrollableTab />}>
        {cars.map(info => (
          <Tab heading={info.color}>
            <Content>
              <Card>
                <CardItem header>
                  <Text>Acccount Balance</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>
                    <Text style={styles.signUpButton}> {info.Balance}</Text>
                </Text>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          </Tab>
        ))}
      </Tabs>
    </Container>

  );
}

export default CalendarScreen;



