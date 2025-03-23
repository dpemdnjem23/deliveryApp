import commonFunction from '@/components/commonFunction';
import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Dimensions,
  ViewStyle,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../(store)/reducer';
import axios, {AxiosError} from 'axios';
import {setIsLoggedIn, setMoney} from '../(slices)/user';
import orderSlice, {Order} from '../(slices)/order';
import * as SecureStore from 'expo-secure-store';
import {Image} from 'expo-image';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';

import * as Location from 'expo-location';

function Settings() {
  const accessToken = commonFunction.getAccessToken();
  const completes = useSelector((state: RootState) => state.order.completes);
  const money = useSelector((state: RootState) => state.user.money);
  const name = useSelector((state: RootState) => state.user.name);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const {granted} = await Location.requestForegroundPermissionsAsync();
        /**
         * Note: Foreground permissions should be granted before asking for the background permissions
         * (your app can't obtain background permission without foreground permission).
         */
        if (granted) {
          await Location.requestBackgroundPermissionsAsync();
        }
      } catch (e) {
        console.error(`Location request has been failed: ${e}`);
      }
    })();
  }, []);

  useEffect(() => {
    async function getMoney() {
      const response = await axios.get<{data: number}>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/orders/showmethemoney`,
        {
          headers: {authorization: `Bearer ${accessToken}`},
        },
      );
      dispatch(setMoney(response.data.data));
    }
    getMoney();
  }, [dispatch]);

  useEffect(() => {
    async function getCompletes() {
      const response = await axios.get<{data: number}>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/orders/completes`,
        {
          headers: {authorization: `Bearer ${accessToken}`},
        },
      );
      console.debug('completes', response.data);
      dispatch(orderSlice.actions.setCompletes(response.data.data));
    }
    getCompletes();
  }, [dispatch]);

  const onSignOut = async () => {
    try {
      const response = await axios.get<{data: number}>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/signout`,
        {
          headers: {authorization: `Bearer ${accessToken}`},
        },
      );
      Alert.alert('알림', '로그아웃 되었습니다.');
      //delete accessToken, user , refreshToken

      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('user');
      dispatch(setIsLoggedIn(false));
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  };

  const renderItem = useCallback(({item}: {item: Order}) => {
    return (
      <Image
        source={`${process.env.EXPO_PUBLIC_API_URL}/${item.image}`}
        style={{
          width: Dimensions.get('window').width / 3,
          height: Dimensions.get('window').width / 3,
        }}
        contentFit="contain"></Image>
    );
  }, []);

  useEffect(() => {
    async function getLocation() {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    }

    getLocation();
  }, []);

  return (
    <View>
      <View style={styles.money}>
        <Text style={styles.moneyText}>
          {name}님의 수익금{' '}
          <Text style={{fontWeight: 'bold'}}>
            {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Text>
          원
        </Text>
      </View>
      <View>
        <FlatList
          data={completes}
          numColumns={3}
          keyExtractor={o => o.orderId}
          renderItem={renderItem}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={[styles.loginButton, styles.loginButtonActive]}
          onPress={onSignOut}>
          <Text style={styles.loginButtonText}>로그아웃</Text>
        </Pressable>
      </View>
      <NaverMapView
        style={{height: '100%'}}
        isShowZoomControls
        isShowLocationButton
        isShowCompass={false}
        isShowScaleBar
        initialCamera={{
          latitude: 33.20530773,
          longitude: 126.14656715029,
          zoom: 10,
          tilt: 50,
        }}>
        <NaverMapMarkerOverlay
          latitude={33.3565607356}
          longitude={126.48599018}
          onTap={() => console.log(1)}
          anchor={{x: 0.5, y: 1}}
          width={100}
          height={100}
        />
      </NaverMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  money: {
    padding: 20,
  },
  moneyText: {
    fontSize: 16,
  },
  buttonZone: {
    alignItems: 'center',
    paddingTop: 20,
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
export default Settings;
