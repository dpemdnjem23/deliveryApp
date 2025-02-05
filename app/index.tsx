import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

import axios, {AxiosError} from 'axios';
import {usePathname, useRouter} from 'expo-router';
import {useAppDispatch} from './(store)';
import userSlice from './(slices)/user';
import DismissKeyboardView from '../components/DismissKeyboardView';
import commonFunction from '@/components/commonFunction';

function SignIn() {
  // const API_URL = Constants.manifest2?.extra;
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  // console.log(accessToken, 'accesstoken');
  useEffect(() => {
    const token = async () => {
      const accessToken = await commonFunction.getAccessToken();

      let isMounted = true;
      console.debug(accessToken, pathname, isMounted);

      if (accessToken && pathname !== '/Home' && isMounted) {
        console.debug('dhodhktsl');
        router.replace('/Home');
      }
      console.debug('여기도달');

      return () => {
        isMounted = false;
      };
    };
    token();
  }, []);
  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      console.debug(
        Platform.OS !== 'web'
          ? process.env.EXPO_PUBLIC_API_URL
          : process.env.EXPO_PUBLIC_WEB_API_URL,
      );
      const response = await axios.post(
        `${
          Platform.OS !== 'web'
            ? process.env.EXPO_PUBLIC_API_URL
            : process.env.EXPO_PUBLIC_WEB_API_URL
        }/api/users/signin`,
        {
          email,
          password,
        },
      );

      if (!response) {
        console.error(response);
      }

      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
          refreshToken: response.data.data.refreshToken,
        }),
      );
      await SecureStore.setItemAsync(
        'user',
        JSON.stringify(response.data.data),
      );

      await SecureStore.setItemAsync(
        'accessToken',
        JSON.stringify(response.data.accessToken),
      );
      router.push('/Home');
    } catch (error) {
      const errorResponse = error as AxiosError<unknown, any>;
      console.debug(errorResponse);
      if (errorResponse) {
        Alert.alert('알림', errorResponse.message.toString());
      }
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, email, password]);

  const toSignUp = useCallback(() => {
    router.push('/SignUp');
  }, [router]);

  const canGoNext = email && password;
  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeEmail}
          placeholder="이메일을 입력해주세요"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
          placeholderTextColor="#666"
          importantForAutofill="yes"
          onChangeText={onChangePassword}
          value={password}
          autoComplete="password"
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          disabled={!canGoNext}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text style={{color: 'black'}}>회원가입하기</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    color: 'black',
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignIn;
