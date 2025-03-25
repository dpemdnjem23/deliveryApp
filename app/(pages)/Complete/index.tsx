import {useAppDispatch} from '@/app/(store)';
import {LoggedInParamList} from '@/app/_layout';
import commonFunction from '@/components/commonFunction';
import * as ImagePicker from 'expo-image-picker';
import {ImageManipulator} from 'expo-image-manipulator';
import {Image} from 'expo-image';

import {useLocalSearchParams, usePathname, useRouter} from 'expo-router';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import orderSlice from '@/app/(slices)/order';

function Complete() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useLocalSearchParams<{orderId: string}>();
  console.debug(params, 'orderId localSeachParams');

  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  const accessToken = commonFunction.getAccessToken();

  const onResponse = useCallback(async response => {
    console.debug(
      response.width,
      response.height,
      response.exif,
      'complete response',
    );
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.debug('orientation', orientation);

    const manipulator = ImageManipulator.ImageManipulator.manipulate(
      response.path,
    );

    const data = (
      await manipulator
        .resize({width: 600, height: 600})
        .rotate(0)
        .renderAsync()
    )
      .saveAsync({
        compress: 1,
        format: response.mime.includes('JPEG')
          ? ImageManipulator.SaveFormat.JPEG
          : ImageManipulator.SaveFormat.PNG,
      })
      .then(r => {
        setImage({
          uri: r.uri,
          type: response.mime,
          name: `resized_image.${response.mime}`,
        });
      });
  }, []);

  //자동저장
  const onTakePhoto = useCallback(async () => {
    try {
      const imagePicker = await ImagePicker.launchCameraAsync({
        base64: true, // ✅ base64 포함
        exif: true, // ✅ Exif 데이터 포함
      });
      onResponse(imagePicker);
      return imagePicker;
    } catch (err) {
      console.error(err);
    }
  }, [onResponse]);

  const onChangeFile = useCallback(async () => {
    try {
      const imagePicker = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        exif: true,
        mediaTypes: 'images',
      });

      onResponse(imagePicker);
      return imagePicker;
    } catch (err) {
      console.error(err);
    }
  }, [onResponse]);

  const orderId = params?.orderId;
  const onComplete = useCallback(async () => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요');
      return;
    }
    if (!orderId) {
      Alert.alert('알림', '유효하지 않은 주문입니다.');
      return;
    }

    const formData = new FormData();

    formData.append('image', image);
    formData.append('orderId', orderId);

    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/orders/complete`,
        formData,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );

      Alert.alert('알림', '완료처리 되었습니다.');
      router.back();
      router.replace('settings');
      dispatch(orderSlice.actions.rejectOrder(orderId));
    } catch (err) {
      const errorResponse = (err as AxiosError).response;

      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, [dispatch, router, image, orderId, accessToken]);

  return (
    <View>
      <View style={styles.orderId}>
        <Text style={{color: 'black'}}> 주문버호 :{orderId}</Text>
      </View>
      <View style={styles.preview}>
        {preview && (
          <Image style={styles.previewImage} source={preview}></Image>
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable onPress={onTakePhoto} style={styles.button}>
          <Text style={styles.buttonText}>이미지 촬영</Text>
        </Pressable>
        <Pressable onPress={onChangeFile} style={styles.button}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </Pressable>
        <Pressable
          onPress={onComplete}
          style={[styles.button, !image && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderId: {
    padding: 20,
  },
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
  },
  previewImage: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'contain',
  },
  buttonWrapper: {flexDirection: 'row', justifyContent: 'center'},
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'black',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
});
export default Complete;
