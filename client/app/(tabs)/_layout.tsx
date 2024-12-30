import { router, Tabs } from 'expo-router';
import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { VehicleProvider } from '@/context/VehicleContext';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={{ flex:1 }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors['light'].tint,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#31363F',
            height: 60,
            // borderRadius: 5,
            borderTopWidth: 2,
            borderColor: '#76ABAE',
            position: 'absolute',
            width:'100%'
          },
          tabBarLabelStyle: {
            color: Colors['light'].text, // Set text color from Colors.ts
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'analytics' : 'analytics-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          
          options={{
            title: "",
            
            tabBarIcon: ({ color, focused }) => (
             
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
}
