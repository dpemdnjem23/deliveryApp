import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import {Tabs, Stack} from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="SignIn" options={{title: '로그인'}}></Stack.Screen>
      <Stack.Screen name="SignUp" options={{title: '회원가입'}}></Stack.Screen>
    </Stack>
  );
}
