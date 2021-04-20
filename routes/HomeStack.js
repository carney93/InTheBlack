import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import HomeScreen from '../src/screens/HomeScreen';
import AccountScreen from '../src/screens/AccountsScreen';
import CalendarScreen from '../src/screens/CalendarScreen';
import OnboardScreen from '../src/screens/OnboardScreen';
import IncomeScreen from '../src/screens/IncomeScreen';
import DailySpendingScreen from '../src/screens/DailySpendingScreen';
import OutgoingScreen from '../src/screens/OutgoingScreen';
import InOutScreen from '../src/screens/PaymentsChoice'
import OnboardIncomes from '../src/screens/OnboardIncomes'
import OnboardOutgoings from '../src/screens/OnboardOutgoings'




const screens = {
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false
        },
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            headerShown: false
        },
    },
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            headerShown: false
        },
    }, 
    Accounts: {
        screen: AccountScreen,
        navigationOptions: {
            headerShown: false
        },
    }, 
    InOut: {
        screen: InOutScreen,
        navigationOptions: {
            headerShown: false
        },
    }, 
    Calendar: {
        screen: CalendarScreen,
        navigationOptions: {
            headerShown: false
        },
    }, 
    Onboard: {
        screen: OnboardScreen,
        navigationOptions: {
            headerShown: false
        },
    }, 
    Income: {
        screen: IncomeScreen,
        navigationOptions: {
            headerShown: false
        },
    }, 
    DailySpending: {
        screen: DailySpendingScreen,
        navigationOptions: {
            headerShown: false
        },
    }, 
    Outgoing: {
        screen: OutgoingScreen,
        navigationOptions: {
            headerShown: false
        },
    }, 
    OnboardIncomes: {
        screen: OnboardIncomes,
        navigationOptions: {
            headerShown: false
        },
    }, 
    OnboardOutgoings: {
        screen: OnboardOutgoings,
        navigationOptions: {
            headerShown: false
        },
    }, 
}
const AppNavigator = createStackNavigator(screens);


export default createAppContainer(AppNavigator);