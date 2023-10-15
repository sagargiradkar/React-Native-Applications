
import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import UserData  from './components/UserData';
import Udata from './components/Udata';


const App = () =>{
  return(
    <View>
      <Udata/>
      <UserData/>
      <Udata/>
      <UserData/>
    </View>
  )
}

export default App;
