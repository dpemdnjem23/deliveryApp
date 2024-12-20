// // import messaging from '@react-native-firebase/messaging';

// // import Orders from './src/pages/Orders';
// // import Delivery from './src/pages/Delivery';
// // import Settings from './src/pages/Settings';
// import * as React from 'react';
// import {RootState} from './app/(store)/reducer';
// import {Stack} from 'expo-router/stack';

// import {useSelector} from 'react-redux';
// // import {RootState} from './src/store/reducer';
// // import useSocket from './src/hooks/useSocket';
// import {useEffect} from 'react';
// import axios from 'axios';
// import {Alert} from 'react-native';
// // import userSlice from './src/slices/user';

// import Config from 'react-native-config';
// // import orderSlice from './src/slices/order';
// // import usePermissions from './src/hooks/usePermissions';
// // import SplashScreen from 'react-native-splash-screen';

// import {FontAwesome, FontAwesome5} from '@expo/vector-icons';
// import {useAppDispatch} from './app/(store)';
// import {Tabs} from 'expo-router';
// import SignUp from './app/(pages)/users/SignUp';
// import SignIn from './app/(pages)/users/SignIn';
// import * as SecureStore from 'expo-secure-store';
// export type LoggedInParamList = {
//   Orders: undefined;
//   Settings: undefined;
//   Delivery: undefined;
//   Complete: {orderId: string};
// };
// export type RootStackParamList = {
//   SignIn: undefined;
//   SignUp: undefined;
// };

// function AppInner() {
//   const dispatch = useAppDispatch();
//   const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

//   // //   const [socket, disconnect] = useSocket();

//   // //   usePermissions();

//   //   // 앱 실행 시 토큰 있으면 로그인하는 코드
//   //   useEffect(() => {
//   //     const getTokenAndRefresh = async () => {
//   //       try {
//   //         const token = await EncryptedStorage.getItem('refreshToken');
//   //         if (!token) {
//   //           SplashScreen.hide();
//   //           return;
//   //         }
//   //         const response = await axios.post(
//   //           `${Config.API_URL}/refreshToken`,
//   //           {},
//   //           {
//   //             headers: {
//   //               authorization: `Bearer ${token}`,
//   //             },
//   //           },
//   //         );
//   //         dispatch(
//   //           userSlice.actions.setUser({
//   //             name: response.data.data.name,
//   //             email: response.data.data.email,
//   //             accessToken: response.data.data.accessToken,
//   //           }),
//   //         );
//   //       } catch (error) {
//   //         console.error(error);
//   //         if (axios.isAxiosError(error)) {
//   //           if (error.response?.data.code === 'expired') {
//   //             Alert.alert('알림', '다시 로그인 해주세요.');
//   //           }
//   //         }
//   //       } finally {
//   //         SplashScreen.hide();
//   //       }
//   //     };
//   //     getTokenAndRefresh();
//   //   }, [dispatch]);

//   //   useEffect(() => {
//   //     const callback = (data: any) => {
//   //       console.debug(data);
//   //       dispatch(orderSlice.actions.addOrder(data));
//   //     };
//   //     if (socket && isLoggedIn) {
//   //       socket.emit('acceptOrder', 'hello');
//   //       socket.on('order', callback);
//   //     }
//   //     return () => {
//   //       if (socket) {
//   //         socket.off('order', callback);
//   //       }
//   //     };
//   //   }, [dispatch, isLoggedIn, socket]);

//   //   useEffect(() => {
//   //     if (!isLoggedIn) {
//   //       console.debug('!isLoggedIn', !isLoggedIn);
//   //       disconnect();
//   //     }
//   //   }, [isLoggedIn, disconnect]);

//   useEffect(() => {
//     axios.interceptors.response.use(
//       response => {
//         return response;
//       },
//       async error => {
//         const {
//           config,
//           response: {status},
//         } = error;
//         if (status === 419) {
//           if (error.response.data.code === 'expired') {
//             const originalRequest = config;
//             const refreshToken = await SecureStore.getItem('refreshToken');
//             // token refresh 요청
//             const {data} = await axios.post(
//               `${Config.API_URL}/refreshToken`, // token refresh api
//               {},
//               {headers: {authorization: `Bearer ${refreshToken}`}},
//             );
//             // 새로운 토큰 저장
//             // dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
//             originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
//             // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
//             return axios(originalRequest);
//           }
//         }
//         return Promise.reject(error);
//       },
//     );
//   }, [dispatch]);

//   return isLoggedIn ? (
//     <Tabs>
//       <Tabs.Screen
//         name="Orders"
//         options={{
//           title: '오더 목록',
//           tabBarIcon: ({color}) => (
//             <FontAwesome5 name="list" size={20} style={{color}} />
//           ),
//           tabBarActiveTintColor: 'blue',
//         }}
//       />
//       <Tabs.Screen
//         name="Delivery"
//         options={{
//           headerShown: false,
//           title: '지도',
//           tabBarIcon: ({color}) => (
//             <FontAwesome5 name="map" size={20} style={{color}} />
//           ),
//           tabBarActiveTintColor: 'blue',
//         }}
//       />
//       <Tabs.Screen
//         name="Settings"
//         options={{
//           title: '내 정보',
//           tabBarIcon: ({color}) => (
//             <FontAwesome name="gear" size={20} style={{color}} />
//           ),
//           tabBarActiveTintColor: 'blue',
//         }}
//       />
//     </Tabs>
//   ) : (
//     <Stack>
//       <Stack.Screen name="SignIn" options={{title: '로그인'}} />
//       <Stack.Screen name="SignUp" options={{title: '회원가입'}} />
//     </Stack>
//   );
// }

// export default AppInner;
