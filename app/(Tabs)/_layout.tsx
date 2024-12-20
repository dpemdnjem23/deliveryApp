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
