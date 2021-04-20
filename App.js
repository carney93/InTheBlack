import React from "react";
import Navigator from './routes/HomeStack'
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);


export default function App(){

  return (
     <Navigator />

  );


}

