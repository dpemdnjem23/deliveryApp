// import {Stack, Tabs, useRouter} from 'expo-router';
// import {Pressable, Text, View} from 'react-native';
// import {useEffect} from 'react';
// import {FontAwesome, FontAwesome6} from '@expo/vector-icons';
// import {useAppDispatch} from './(store)';
// import {useSelector} from 'react-redux';

// export default function Home() {
//   const router = useRouter();
//   const isLoggedIn = useSelector(state => !!state.user.email);
//   const dispatch = useAppDispatch();

//   const toSingIn = () => {
//     router.push('/users/SignIn');
//   };

//   const toSignUp = () => {
//     router.push('/users/SignUp');
//   };
//   // console.debug(isLoggedIn);
//   // useEffect(() => {
//   //   navigation.setOptions({headerShown: false});
//   // }, [navigation]);

//   return (
//     <View>

//       <Pressable onPress={toSingIn}>
//         <Text>로그인</Text>
//       </Pressable>
//       <Pressable onPress={toSignUp}>
//         <Text>회원가입하기</Text>
//       </Pressable>
//     </View>

//   );

// }
import React from 'react';
import commonFunction from '@/components/commonFunction';
import useSocket from '@/hooks/useSocket';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import {Tabs, Stack} from 'expo-router';

export default function TabLayout() {
  const isLoggedIn = commonFunction.getAccessToken();
  const [socket, disconnect] = useSocket();

  return (
    <Tabs screenOptions={{tabBarActiveTintColor: 'blue'}}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',

          tabBarIcon: ({color}) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Orders"
        options={{
          title: '오더 목록',
          // headerShown: false,

          tabBarIcon: ({color}) => (
            <FontAwesome6 size={28} name="receipt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Delivery/index"
        options={{
          title: '배달',
          // headerShown: false,
          tabBarIcon: ({color}) => (
            <FontAwesome size={28} name="rocket" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          title: '내 정보',
          // headerShown: false,
          tabBarIcon: ({color}) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
