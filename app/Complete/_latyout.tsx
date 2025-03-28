import React from 'react';
import {View, Text} from 'react-native';
import {Tabs, Stack} from 'expo-router';

function Delivery() {
  return (
    <Stack>
      <Stack.Screen
        name="[orderId]"
        options={{title: '완료하기', headerShown: false}}
      />
    </Stack>
  );
}

export default Delivery;
