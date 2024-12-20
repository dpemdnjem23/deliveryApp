import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import {Tabs, Stack} from 'expo-router';

export default function TabLayout() {
  return (
    <Stack>
      <Stack.screen
        name="index"
        options={{title: '로그인', headerShown: false}}></Stack.screen>
      <Stack.screen name="SignUp " options={{title: '회원가입'}}></Stack.screen>
    </Stack>
  );
}
