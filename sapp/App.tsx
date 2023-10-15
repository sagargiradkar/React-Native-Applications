
import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';

const name = "Sagar";
let age = 39;
var email = 'spgiradkar2002@gmail.com';
function fruit(){
  return "Apple";
}
const App = () =>{
  return(
    <View>
      <Text  style = {{fontSize:30}}>Name : {name}</Text>

      <Text  style = {{fontSize:30}}>Age : {age}</Text>

      <Text  style = {{fontSize:30}}>Email Id: {email}</Text>

      <Text  style = {{fontSize:30}}>Fruit :{fruit()}</Text>

      <Text  style = {{fontSize:30}}>{fruit()}</Text>
      <Button title='Submit Button'></Button>
      <UserData/>
      <UserData/>
      
    </View>
  )
}

const UserData = ()=>{
  return(
    <View>

<Text  style = {{fontSize:30}}>Name : {name}</Text>

<Text  style = {{fontSize:30}}>Age : {age}</Text>

<Text  style = {{fontSize:30}}>Email Id: {email}</Text>

<Text  style = {{fontSize:30}}>Fruit :{fruit()}</Text>

<Text  style = {{fontSize:30}}>{fruit()}</Text>
<Button title='Submit Button'></Button>
    </View>
  )
}
export default App;
