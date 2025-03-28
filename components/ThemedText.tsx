import {useColorScheme, Text, TextProps} from 'react-native';
import {useTheme} from '@react-navigation/native'; // React Navigation의 테마 적용 가능
import React from 'react';

// ThemedText Props 타입 정의
interface ThemedTextProps extends TextProps {
  type?: 'title' | 'body' | 'link';
}

export function ThemedText({style, type = 'body', ...props}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const {colors} = useTheme(); // 현재 테마 색상 가져오기

  const textStyles = {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    body: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#ddd' : '#333',
    },
    link: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#4DA6FF' : '#007AFF',
      textDecorationLine: 'underline',
    },
  };

  return <Text style={[textStyles[type], style]} {...props} />;
}
