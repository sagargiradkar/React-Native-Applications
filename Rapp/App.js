// import { StatusBar } from 'expo-status-bar';
// import { useState } from 'react';
// import { Button, StyleSheet, Text, View ,Platform} from 'react-native';

// export default function App() {
//   // const [hide,setHide] = useState(false);
//   // const [barStyle,setBarStyle] = useState("default");
//   // return (
//   //   <View style={styles.container}>
//   //     <StatusBar 
//   //     backgroundColor="blue"
//   //     barStyle={barStyle}
//   //     hidden={hide}
//   //     />
//   //     <Button title='Toggle Status Bar' onPress={()=>setHide(!hide)}/>
//   //     <Button title='Update style'onPress={()=>setBarStyle("dark-content")}/>
//   //   </View>
//   return(
//   // <View>
//   //   <Text style = {{fontSize:30}}> platform :{Platform.OS}</Text>
//   //   {
//   //     Platform.OS =='android' ?
//   //     <View style = {{backgroundColor:"green",height:100,width:100}}></View>
//   //     :
//   //     <View style = {{backgroundColor:"red",height:100,width:100}}></View>
//   //   }
//   //   <Text style={styles.text}>Hello</Text>
//   //   <Text style={{fontSize:40}}>{JSON.stringify(Platform.constants.reactNativeVersion)}</Text>
//   // </View>

//   <View style = {styles.container}>
//     <View style = {styles.modal}>
//         <View style = {styles.body}>
//           <Text>Some Text</Text>
//           <Button title='Close'/>
//         </View>
//     </View>
//     <Button title='Open Dialog'/>
//   </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   modal:{
//     flex:1,
//     backgroundColor:'rgba(50,50,50,.5)',
//     justifyContent:'center',
//     alignItems:'center',
//   },
//   body:{
//     backgroundColor:'#fff',
//     height:300,
//     width:300,
//     padding:20
//   }
// });


import React from "react";
import {Text ,View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const App = ()=>{
  retuern (
    <View>
      
    </View>

  );
}