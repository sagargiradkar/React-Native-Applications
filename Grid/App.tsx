import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';

// const App = () =>{
//   return(
//     <View>
//       <Text style = {{fontSize:31}}>List With Map Function</Text>
//       <View style= {{flex:1,flexDirection:'row',flexWrap:'wrap'}}>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       <Text style={style.item}>Sam</Text>
//       </View>
//     </View>
//   )

// }
// const style = StyleSheet.create({
//   item:{
//     fontSize:25,
//     backgroundColor:'blue',
//     color:"#fff",
//     margin:5,
//     padding:5,
//     width:120,
//     height:120,
//     textAlign:'center',
//     textAlignVertical:'center'

//   }
// })

const App = ()=>{

  const users = [
    {
      id:1,
      name:"Sagar",
      email:"abc@test.com"
    },
    {
      id:2,
      name:"Sam",
      email:"abc@test.com"

    }
    ,
    {
      id:3,
      name:"Peter",
      email:"abc@test.com"
    }
    ,
    {
      id:4,
      name:"Tony",
      email:"abc@test.com"
    },
    {
      id:2,
      name:"Sam",
      email:"abc@test.com"

    },
    {
      id:2,
      name:"Sam",
      email:"abc@test.com"

    },
    {
      id:2,
      name:"Sam",
      email:"abc@test.com"

    },
    {
      id:2,
      name:"Sam",
      email:"abc@test.com"

    },
    {
      id:2,
      name:"Sam",
      email:"abc@test.com"

    },
    {
      id:2,
      name:"Sam",
      email:"abc@test.com"

    },
    {
      id:2,
      name:"Sam",
      email:"abc@test.com"

    }
  ]
  return (
    <View>
      <Text style={{fontSize:27}}>Components in Loop with FlatList</Text>
      <FlatList
        data={users}
        renderItem={({item})=> <UserData item={item}/>}
      />
    </View>
  );
};
const UserData = (props) =>{
  const item = props.item;
  return(
    <View style={styles.box}>
          <Text style={styles.item}>{item.name}</Text>
          <Text style={styles.item}>{item.email}</Text>
        </View>
  )
}
const styles = StyleSheet.create({
  item:{
    fontSize:24,
    color:'orange',
    flex:1,
    margin:2,
    textAlign:'center',


  },
  box:{
    flexDirection:'row',
    borderWidth:2,
    borderColor:'orange',
    marginBottom:10,
    padding:10,
    borderRadius:10

  }
})
export default App;
