import React from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import {Tabs, Stack} from 'expo-router';
import {Provider, useSelector} from 'react-redux';
import store from './(store)';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{title: '로그인'}} />

        <Stack.Screen name="(pages)" options={{headerShown: false}} />
        <Stack.Screen name="(Tabs)" options={{headerShown: false}} />
        {/* <Stack.Screen name="(pages)" options={{headerShown: false}} /> */}

        {/* <Stack.Screen
         name="(pages)/users/SignUp/index"
         options={{title: '주문목록'}}
       />
       <Stack.Screen name="(pages)/Settings/index" options={{title: '설정'}} /> */}
      </Stack>

      {/* {isLoggedIn ? ( */}
      {/* <Tabs screenOptions={{tabBarActiveTintColor: 'blue'}}>
        <Tabs.Screen
          name="(Tabs)/Orders"
          options={{
            title: 'orders',
            headerShown: false,

            tabBarIcon: ({color}) => (
              <FontAwesome6 size={28} name="receipt" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(Tabs)/Delivery"
          options={{
            title: 'delivery',
            headerShown: false,
            tabBarIcon: ({color}) => (
              <FontAwesome size={28} name="rocket" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(Tabs)/Settings"
          options={{
            title: 'settings',
            headerShown: false,
            tabBarIcon: ({color}) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(pages)/index"
          options={{
            title: 'settings',
            headerShown: false,
            tabBarIcon: ({color}) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(pages)/SignUp"
          options={{
            title: 'settings',
            headerShown: false,
            tabBarIcon: ({color}) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
      </Tabs> */}
    </Provider>
  );
}
