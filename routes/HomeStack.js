import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';


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
    
}
const AppNavigator = createStackNavigator(screens);


export default createAppContainer(AppNavigator);