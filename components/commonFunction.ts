import * as SecureStore from 'expo-secure-store';

export type User = {
  id: string;
  name: string;
  email: string;
};
const getUserData = async (): Promise<User | null> => {
  const value = await SecureStore.getItemAsync('user');
  if (value) {
    try {
      return JSON.parse(value) as User;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }
  return null;
};
const getAccessToken = async (): Promise<string | null> => {
  try {
    const value2 = await SecureStore.getItemAsync('accessToken'); // ✅ await 추가

    if (value2) {
      return JSON.parse(value2); // 정상적인 JSON 파싱
    }

    return null; // 값이 없으면 null 반환
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

export default {
  getUserData,
  getAccessToken,
};
