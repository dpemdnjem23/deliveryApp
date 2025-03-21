import {useDispatch} from 'react-redux';

import orderSlice, {Order} from '../app/(slices)/order';
import {useRouter} from 'expo-router';
import React, {useCallback, useState} from 'react';
import commonFunction from './commonFunction';
import {useAppDispatch} from '@/app/(store)';
import axios from 'axios';
import {
  Alert,
  Dimensions,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import getDistanceFromLatLonInKm from '@/utils/utils';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
} from '@mj-studio/react-native-naver-map';

interface Props {
  item: Order;
}
function EachOrder({item}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [detail, showDetail] = useState(false);
  const accessToken = commonFunction.getAccessToken();

  //order가 들어온것을 수락하는 경우
  const onAccept = useCallback(async () => {
    if (!accessToken) {
      return;
    }
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_APU_URL}/api/orders/accept`,
        {
          orderId: item.orderId,
        },
        {
          headers: {authorization: `Bearer ${accessToken}`},
        },
      );
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      router.push('/(Tabs)/Delivery');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          // 타인이 이미 수락한 경우
          Alert.alert('알림', error.response.data.message);
          dispatch(orderSlice.actions.rejectOrder(item.orderId));
        }
      }
    }
  }, [dispatch, accessToken, item, router]);

  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item]);
  const {start, end} = item;

  const toggleDetail = useCallback(() => {
    showDetail(prevState => !prevState);
  }, []);

  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text style={styles.eachInfo}>
          {getDistanceFromLatLonInKm(
            start.latitude,
            start.longitude,
            end.latitude,
            end.longitude,
          ).toFixed(1)}
          km
        </Text>
      </Pressable>

      {detail && (
        <View>
          <View
            style={{
              width: Dimensions.get('window').width - 30,
              height: 200,
              marginTop: 10,
            }}>
            <NaverMapView
              style={{height: '100%'}}
              initialCamera={{
                latitude: (start.latitude + end.latitude) / 2,
                longitude: (start.longitude + end.latitude) / 2,
                zoom: 10,
                tilt: 50,
              }}
              isShowZoomControls
              isShowLocationButton
              isShowCompass={false}
              isShowScaleBar>
              <NaverMapMarkerOverlay
                latitude={start.latitude}
                longitude={start.longitude}
                width={15}
                height={15}
                isHidden={false}
                globalZIndex={10000}
                caption={{text: '시작'}}
                image={{symbol: 'blue'}}></NaverMapMarkerOverlay>
              <NaverMapPathOverlay
                coords={[
                  {latitude: start.latitude, longitude: start.longitude},
                  {latitude: end.latitude, longitude: end.longitude},
                ]}
                globalZIndex={10000}
                zIndex={1000}
                color="black"
                width={50}></NaverMapPathOverlay>
              <NaverMapMarkerOverlay
                latitude={end.latitude}
                longitude={end.longitude}
                tintColor="red"
                width={100}
                height={100}
                image={{symbol: 'red'}}></NaverMapMarkerOverlay>
            </NaverMapView>
          </View>
          <View>
            <Pressable onPress={onAccept} style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable onPress={onReject} style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
  },
  eachInfo: {
    flex: 1,
    color: 'black',
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EachOrder;
