import {useSelector} from 'react-redux';
import {RootState} from '../(store)/reducer';
import React, {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import {View, Text, Dimensions, Alert} from 'react-native';
import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import TMap from '@/modules/TMap';
import { * as Router } from 'expo-router';



function Ing() {
  const deliveries = useSelector((state: RootState) => state.order.deliveries);
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      // 위치 권한 요청
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('위치 권한이 거부되었습니다.');
        return;
      }

      // 현재 위치 가져오기
      let currentLocation = await Location.getCurrentPositionAsync({});
      console.log(currentLocation);
      setMyPosition({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);
  if (deliveries?.[0]) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>주문을 먼저 수락해주세요</Text>
      </View>
    );
  }

  if (!myPosition || !myPosition.latitude) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>내 위치를 로딩 중입니다. 권한을 허용했는지 확인해주세요.</Text>
      </View>
    );
  }

  const {start, end} = deliveries?.[0];

  return (
    <View>
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <NaverMapView
          style={{height: Dimensions.get('window').height - 120}}
          initialCamera={{
            latitude: (start.latitude + end.latitude) / 2,
            longitude: (start.longitude + end.longitude) / 2,
            zoom: 10,
            tilt: 50,
          }}
          isShowZoomControls
          isShowLocationButton
          isShowCompass={false}
          isShowScaleBar>
          {myPosition.latitude && (
            <NaverMapMarkerOverlay
              latitude={myPosition.latitude}
              longitude={myPosition.longitude}
              width={100}
              height={100}
              anchor={{x: 0.5, y: 0.5}}
              caption={{text: '나'}}
              image={require('@/assets/red-dot.png')}
            />
          )}
          {myPosition?.latitude && (
            <NaverMapPathOverlay
              coords={[
                {
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                },
                {latitude: start.latitude, longitude: start.longitude},
              ]}
              color="orange"></NaverMapPathOverlay>
          )}
          <NaverMapMarkerOverlay
            latitude={start.latitude}
            longitude={start.longitude}
            width={15}
            height={15}
            globalZIndex={1000}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '출발'}}
            image={require('@/assets/blue-dot.png')}
            onTap={() => {
              TMap.openNavi(
                '출발지',
                start.latitude.toString(),
                start.longitude.toString(),
                'MOTORCYCLE',
              ).then(data => {
                console.debug('TMap callback', data);
                if (!data) {
                  Alert.alert('알림', '티맵을 설치하세요');
                }
              });
            }}></NaverMapMarkerOverlay>
          <NaverMapPathOverlay
            coords={[
              {
                latitude: start.latitude,
                longitude: start.longitude,
              },
              {latitude: end.latitude, longitude: end.longitude},
            ]}
            globalZIndex={1000}
            color="orange"
            onTap={() => {
              TMap.openNavi(
                '도착지',
                end.longitude.toString(),
                end.latitude.toString(),
                'MOTORCYCLE',
              ).then(data => {
                console.log('TMap callback', data);
                if (!data) {
                  Alert.alert('알림', '티맵을 설치하세요.');
                }
              });
            }}></NaverMapPathOverlay>
          <NaverMapMarkerOverlay
            latitude={end.latitude}
            longitude={end.longitude}
            width={15}
            globalZIndex={1000}
            height={15}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '도착'}}
            image={require('@/assets/green-dot.png')}
            onTap={() => {
              console.log(navigation);
              navigation.push('Complete', {orderId: deliveries[0].orderId});
            }}></NaverMapMarkerOverlay>
        </NaverMapView>
      </View>
    </View>
  );
}

export default Ing;
