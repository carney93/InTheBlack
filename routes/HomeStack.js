import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import HomeScreen from '../src/screens/HomeScreen';
import IncomeScreen from '../src/screens/IncomeScreen';


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
            headerShown: true
        },
    }, 
    Income: {
        screen: IncomeScreen,
        navigationOptions: {
            headerShown: true
        },
    }, 
}
const AppNavigator = createStackNavigator(screens);


export default createAppContainer(AppNavigator);