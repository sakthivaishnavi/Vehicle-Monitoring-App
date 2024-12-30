
import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function SomeScreen() {
  return (
    <View>
      <Text style={{ color: Colors['light'].text }}>Sample Screen Text</Text>
    </View>
  );
}