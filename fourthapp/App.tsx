
import React, { useState } from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';

import Exstyle, {} from './style';

//State 
/*
const App = () => {

  let data = "Pratham";
  const [name, setName] = useState("Sagar");

  function testName() {
    setName("Pavan");
  }
  return (
    <View>
      <Text style={{ fontSize: 30 }}>{name}</Text>
      <Text style = {{fontSize:30}}>{data}</Text>

      <Button title='Update Name' onPress={testName} />
    </View>
  )
}
export default App;

*/

// const App = () =>{

//   const [name,setName] = useState("Peter");
//   return(
//     <View>
//       <Text style = {{fontSize:30}}>Props in React Native</Text>
//       <Button title='Update Props' onPress={()=>setName("Pavan")}/>
//       <User name = {name} age = {29}/>
//     </View>
//   );
// }


// const User = (props)=>{
//     return(
//       <View style = {{backgroundColor:'green',padding:5}}>
//         <Text style = {{fontSize:30}}>Name : {props.name}</Text>

//         <Text style = {{fontSize:30}}>Age : {props.age}</Text>
//       </View>
//     )
// }
// export default App;

//Baic Styling in react native

// const App = () =>{
//   return (
//     <View>
//       <Text style = {{fontSize : 50,color:'red',backgroundColor:'green'}}>
//         Styles in React Native 
//       </Text>

//       <Text style = {style.textBox}>
//         Styles in React Native 
//       </Text>

//       <Text style = {style.textBox}>
//         Styles in React Native 
//       </Text>

//       <Text style = {[Exstyle.textBox,Exstyle.textBox]}>
//         Styles in React Native 
//       </Text>

//     </View>
//   );
// }

// const style = StyleSheet.create({
//   textBox:{
//     color:'#fff',
//     fontSize:25,
//     backgroundColor:'blue',
//     marginBottom:10,
//     padding:10,
//     borderRadius:10,
//     height:100,
//     textAlignVertical:'center',
//     textAlign:'center',
//     borderColor:'red',
//     borderWidth:2,


//   }
// })
// export default App;


//Text Input in react - native 

const App = () =>{
  const [name,setName] = useState("");
  return(
    <View>
      
      <Text style = {{fontSize:30}}>Handle text input</Text>

      <Text style = {{fontSize:30}}>Your Name is :{name}</Text>
      <TextInput
      style = {styles.TextInput}
      value={name}
      placeholder='Enter your name'
      onChangeText={(text)=>setName(text)}
      />
      <Button title='Clear Input Value ' onPress={()=>setName('')}/>
    </View>
  );
}


const styles = StyleSheet.create({
  TextInput:{
    fontSize:18,
    color:'red',
    borderWidth:2,
    borderColor:'blue',
    margin:10
  }
}) 

export default App;