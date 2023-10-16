
import React from 'react';
import { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [display,setDisplay] = useState(false);

  const resetformData = () =>{
    setDisplay(false);
    setEmail("");
    setName("");
    setPassword("");
  }
  
  return (
    <View>
      <Text style={{ fontSize: 30 }}>Simple Form in React Native</Text>

      <TextInput
        style={styles.TextInput}
        placeholder='Enter User Name'
        onChangeText={(text) => setName(text)}
        value={name}
      />

      <TextInput
        style={styles.TextInput}
        placeholder='Enter User Password'
        secureTextEntry = {true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <TextInput
        style={styles.TextInput}
        placeholder='Enter User Email'
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <View style = {{marginBottom:10}}>
      <Button title='Print Details' 
      color={'green'} 
      onPress={()=>setDisplay(true)}/>
      </View>
      <View style = {{marginBottom:10}}>
      <Button title='Clear Details' onPress={resetformData}/>
      <View>
        {
          display ?
          <View>
            <Text style = {{fontSize:15}}>User Name is :{name}</Text>
            <Text style = {{fontSize:15}}>User Password is :{password}</Text>
            <Text style = {{fontSize:15}}>User Email is :{email}</Text>
          </View>
          :null
        }
      </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  TextInput: {
    color: 'blue',
    borderWidth: 2,
    borderColor: 'blue',
    margin: 10

  }
})
export default App;
