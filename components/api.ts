import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';
// Axios 인스턴스 생성
const api = axios.create({
  baseURL:
    Platform.OS !== 'web'
      ? process.env.EXPO_PUBLIC_API_URL
      : process.env.EXPO_PUBLIC_WEB_API_URL, // API 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 요청 전에 토큰을 추가
api.interceptors.request.use(
  async config => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 요청 오류 처리
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 응답 후 처리
api.interceptors.response.use(
  response => {
    // 응답 데이터 처리
    return response;
  },
  error => {
    // 예시: 401 Unauthorized 오류 처리
    if (error.response?.status === 401) {
      console.log('Unauthorized - Please login again');
      // 로그인 화면으로 리디렉션하는 로직 추가 가능
    }
    return Promise.reject(error);
  },
);

export default api;
