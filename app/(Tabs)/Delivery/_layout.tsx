import React from 'react';
import {View, Text} from 'react-native';
import {Tabs, Stack} from 'expo-router';

function Delivery() {
  return (
    <Stack>
      <Stack.Screen name="Ing" options={{title: '내 오더'}} />
    </Stack>
  );
}

export default Delivery;
