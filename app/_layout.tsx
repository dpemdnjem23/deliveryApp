import React, {useEffect} from 'react';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import {Tabs, Stack, useRouter, Slot} from 'expo-router';
import {Provider, useSelector, useDispatch} from 'react-redux';
import store from './(store)';
import commonFunction from '@/components/commonFunction';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {Alert, Text, View} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useFonts} from 'expo-font';
import {useColorScheme} from '@/hooks/useColorScheme';
import useSocket from '@/hooks/useSocket';
import usePermissions from '@/hooks/usePermissions';
import {setIsLoggedIn} from './(slices)/user';
import orderSlice from './(slices)/order';
import {RootState} from '../node_modules/reselect/dist/reselect.d';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav></RootLayoutNav>
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const orders = useSelector((state: RootState) => state.order.orders);

  const isLoggedIn = useSelector(state => state?.user?.isLoggedIn);
  const [isLoading, setIsLoading] = React.useState(true); // 초기 로딩 상태 추가

  const dispatch = useDispatch();
  const router = useRouter();
  // useSocket();
  const [socket, disconnect] = useSocket();

  usePermissions();
  //앱 실행 시 토큰이 있으며 로그인 실행
  // 초기 상태 체크 함수
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        //accesstoken이 존재하면 로그인과 똑같이 수행해서 로그인한다.
        const token = await commonFunction.getAccessToken();

        if (!token) {
          SplashScreen.hideAsync();
          return;
        }

        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/api/users/refresh`,
          {},
          {headers: {authorization: `Bearer ${token}`}},
        );

        //accssToken으로 로그인하기 token이 있다면 활성화,
        dispatch(setIsLoggedIn(true));
        //토큰이 없다면
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.debug(error.response?.data.code, 'axioserror');
          if (error.response?.data.message === 'jwt expired') {
            Alert.alert('알림', '다시 로그인 해주세요');
          }
        }
      } finally {
        SplashScreen.hideAsync();
      }
    };

    getTokenAndRefresh();
  }, [dispatch]);

  useEffect(() => {
    const callback = (data: any) => {
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');

      socket.on('order', callback);
    }
    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [dispatch, isLoggedIn, socket]);
  //전역 설정, 만약, accessToken이 expired가 된경우라면, refresh를 통해 access를 재발급 한다.

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     disconnect();
  //   }
  // }, [isLoggedIn, disconnect]);

  useEffect(() => {
    let isRefreshing = false;

    const interceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          //status 가 419인 경우는 토큰 재발급해야하는 경우
          if (error.response.data.message === 'jwt expired') {
            //글로벌  intercepotor로 모든 요청에 해당한다.
            //accesstoken으로 로그인이아니라 이용하다가 accesstoken이 사라진경우
            //refreshtoken으로 재발급한다.
            //refreshToken이 없는경우 로그아웃.

            if (isRefreshing) {
              return Promise.reject(error); // 이미 재시도한 요청은 무한 루프 방지
            }
            isRefreshing = true;
            try {
              const originalRequest = config;
              const refreshToken = await commonFunction.getRefreshToken();
              // 토큰 재발급 중인지 확인하는 플래그

              const {data} = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/api/users/refresh`,
                {},
                {headers: {authorization: `Bearer ${refreshToken}`}},
              );
              // const

              // console.debug('이거 무조건실행');

              originalRequest.headers.authorization = `Bearer ${data.accessToken}`;
              await SecureStore.setItemAsync(
                'accessToken',
                JSON.parse(data.accessToken),
              );
              return axios(originalRequest);
              //token refresh 요
            } catch (err) {
              // Refresh 토큰이 expired 인경우 최종적으로 로그아웃, 재로그인필요

              isRefreshing = false;
              console.debug('Refresh token expired or invalid ');
              dispatch(setIsLoggedIn(false));

              router.replace('/auth/SignIn');
              return;
            }
          }
        }
        // console.error(error);

        return Promise.reject(error); // 다른 에러는 그대로 반환
      },
    );
    return () => axios.interceptors.response.eject(interceptor); // 컴포넌트 언마운트 시 인터셉터 해제
  }, []);

  //
  useEffect(() => {
    const redirectPage = async () => {
      if (isLoading) {
        if (!isLoggedIn) {
          router.replace('/auth/SignIn'); // 로그인 안 된 경우 로그인 페이지로 이동
        } else {
          router.replace('/(Tabs)'); // 로그인 된 경우 홈 화면으로 이동
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // 테스트용 지연

        SplashScreen.hideAsync(); // 로딩 완료 후 Splash Screen 숨김
      }
    };
    redirectPage();
  }, [isLoading, isLoggedIn, router]);

  // ✅ 로딩 중일 때는 아무것도 렌더링하지 않음
  if (!isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* <Stack.Screen name="index" options={{title: '로그인'}} /> */}
        <Stack.Screen
          name="+not-found"
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="auth" options={{headerShown: false}} />
        <Stack.Screen name="(Tabs)" options={{headerShown: false}} />
        {/* <Stack.Screen name="(pages)" options={{headerShown: false}} /> */}

        {/* <Stack.Screen
         name="(pages)/users/SignUp/index"
         options={{title: '주문목록'}}
       />
       <Stack.Screen name="(pages)/Settings/index" options={{title: '설정'}} /> */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
