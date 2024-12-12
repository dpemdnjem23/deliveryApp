import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {View, Text, StyleSheet} from 'react-native';
import {Stack, Tabs} from 'expo-router';
import SignIn from './(pages)/SignIn';

import SignInLayout from './(pages)/SignIn/_layout';
import {Provider, useSelector} from 'react-redux';
// import {Provider} from 'react-redux';

// import SignIn from '@/app/(pages)/SignIn/SignIn';
// import {name} from '../node_modules/prettier/plugins/acorn';
import store from '@/app/(store)';
import {RootState} from './(store)/reducer.ts';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

function App() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  return isLoggedIn ? (
    <Tabs>
      <Tabs.Screen name="Orders" options={{title: '오더 목록'}} />
      <Tabs.Screen name="Delivery" options={{title: '내 오더'}} />
      <Tabs.Screen name="Settings" options={{title: '내 정보'}} />
    </Tabs>
  ) : (
    <Stack>
      <Stack.Screen
        name="(pages)/SignIn/index"
        options={{
          title: '로그인',
        }}></Stack.Screen>
      <Stack.Screen
        name="(pages)/SignUp/index"
        options={{
          title: '회원가입',
        }}></Stack.Screen>
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
