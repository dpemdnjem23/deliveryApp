import React from 'react';
import {View, Text} from 'react-native';
import {Tabs, Stack} from 'expo-router';

function Delivery() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Ing" component={Ing} options={{title: '내 오더'}} />
      <Stack.Screen
        name="Complete"
        component={Complete}
        options={{title: '완료하기'}}
      />
    </Stack.Navigator>
  );
}

export default Delivery;
