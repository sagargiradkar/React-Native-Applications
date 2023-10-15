
import {Button,Text,View,} from 'react-native';
const UserData = ()=>{
    let ename = "Abhishek";
    let eage = 52;
    let email = "21143051@pvgcoet.ac.in"
    return(
    <View>

    <Text  style = {{fontSize:30}}>Employee name : {ename}</Text>

    <Text  style = {{fontSize:30}}>Employee Age : {eage}</Text>

    <Text  style = {{fontSize:30}}>EmploEmail Id: {email}</Text>
    <Button title='Submit Button'></Button>
    </View>
    )
}

export default UserData;