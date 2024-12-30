import { useVehicle } from '@/context/VehicleContext';
import { useFocusEffect, useRouter } from 'expo-router'; // Import useRouter for navigation
import { useEffect } from 'react';
import { Text } from 'react-native';
const main = () => {
  const router = useRouter(); // Initialize router
  useFocusEffect(() => {
    console.log('Focused');
    router.replace('/choose-vehicle'); // Redirect to the welcome screen
  }
  );
  return (
  <Text>Hello</Text>// No need for additional JSX in this case
  );
}

export default main;
