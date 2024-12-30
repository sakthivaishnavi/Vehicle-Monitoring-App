import React from 'react';
import { Stack } from 'expo-router';
import { VehicleProvider } from '@/context/VehicleContext';

const Layout = () => {
  return (
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="otp-verification" options={{ headerShown: false }} />
        <Stack.Screen name="choose-vehicle" options={{ headerShown: false }} />
      </Stack>
      
  );
  
};

export default Layout;