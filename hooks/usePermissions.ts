import {useEffect} from 'react';
import {Alert, Linking, Platform, View} from 'react-native';

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from 'expo-camera';

function usePermissions() {
  //권한

  useEffect(() => {
    const checkAndRequestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const {status} = await Location.getForegroundPermissionsAsync();

          console.debug(status);
          if (status === 'denied') {
            Alert.alert(
              '이 앱은 위치권한 허용이 필요합니다',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.debug('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          } else if (status !== 'granted') {
            const {status: newStatus} =
              await Location.requestForegroundPermissionsAsync();
            console.debug('Requested location permission status:', newStatus);
          }
        }
        if (Platform.OS === 'android') {
          const {status} = await Camera.getCameraPermissionsAsync();
          //   if (!permission) {
          //     return;
          //   }
          // 권한이 거부되었을때.

          console.debug(status, 'camera permission');

          if (status === 'granted' || status === 'denied') {
            console.debug('카메라 권한요청');
          } else {
            console.debug(status);
            throw new Error('카메라 지원 안 함');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAndRequestLocationPermission();
  }, []);
}
export default usePermissions;
