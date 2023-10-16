
import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';

const App = () => {
  const fruit = (val) => {
    console.warn(val);
  }
  return (
    <View>
      <Text style={{ fontSize: 30 }}> Button and onPress Event</Text>
      <Button title='On Press' onPress={() => fruit("Hello ")} color={'green'} />
      <Button title='On Press' onPress={() => fruit("Hii")} color={'pink'} />

      <Text style={{ fontSize: 30 }}> Button and onPress Event</Text>
      <Button title='On Press' onPress={() => fruit("Hello ")} color={'green'} />
      <Button title='On Press' onPress={() => fruit("Hii")} color={'pink'} />

      <Text style={{ fontSize: 30 }}> Button and onPress Event</Text>
      <Button title='On Press' onPress={() => fruit("Hello ")} color={'green'} />
      <Button title='On Press' onPress={() => fruit("Hii")} color={'pink'} />

      <Text style={{ fontSize: 30 }}> Button and onPress Event</Text>
      <Button title='On Press' onPress={() => fruit("Hello ")} color={'green'} />
      <Button title='On Press' onPress={() => fruit("Hii")} color={'pink'} />

      <Text style={{ fontSize: 30 }}> Button and onPress Event</Text>
      <Button title='On Press' onPress={() => fruit("Hello ")} color={'green'} />
      <Button title='On Press' onPress={() => fruit("Hii")} color={'pink'} />

      <Text style={{ fontSize: 30 }}> Button and onPress Event</Text>
      <Button title='On Press' onPress={() => fruit("Hello ")} color={'green'} />
      <Button title='On Press' onPress={() => fruit("Hii")} color={'pink'} />

      <Text style={{ fontSize: 30 }}> Button and onPress Event</Text>
      <Button title='On Press' onPress={() => fruit("Hello ")} color={'green'} />
      <Button title='Final Press Submit ' onPress={() => fruit("Hii")} />
    </View>
  )
}


export default App;
