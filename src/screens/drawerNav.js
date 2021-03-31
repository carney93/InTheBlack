import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Accounts from '../screens/AccountsScreen';
import Home from '../screens/HomeScreen';
import Calendar from '../screens/CalendarScreen';
import Income from '../screens/IncomeScreen';
import DailySpending from '../screens/DailySpendingScreen';

const Drawer = createDrawerNavigator();

export default function drawerNav({ navigation }) {

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Accounts" component={Accounts} />
        <Drawer.Screen name="Incomes" component={Income} />
        <Drawer.Screen name="Calendar" component={Calendar} />
        <Drawer.Screen name="Daily Spending" component={DailySpending} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
