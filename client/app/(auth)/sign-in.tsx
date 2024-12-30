import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router'; // Fixed import for router in Expo
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const signIn = () => {
    const [sendOtp, setSendOtp] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [mobile, setMobile] = useState('');
    const [serverOtp, setServerOtp] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for feedback
    const router = useRouter(); // Fix for Expo Router

    const API_BASE_URL = 'http://192.168.107.195:3000/auth';

    // Function to handle sending OTP
    const handleSendOtp = async () => {
        if (mobile.length !== 10) {
            Alert.alert('Validation Error', 'Mobile number should be 10 digits');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/send-otp`, {
               mobile
            });
            if (response.data.success) {
                setServerOtp(response.data.otp); 
                setSendOtp(false);
                setShowOtp(true);
                Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
            }
        } catch (error) {
          console.log(error)
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle submission of OTP for verification and login
    const handleSubmit = async () => {
      console.log(serverOtp)
        if (mobile.length !== 10) {
            Alert.alert('Validation Error', 'Mobile number should be 10 digits');
            return;
        }
        else if(otp.length !== 6){
            Alert.alert('Validation Error', 'OTP should be 6 digits');
            return;
            }
        if (otp != serverOtp) {
            Alert.alert('Error', 'Incorrect OTP. Please try again.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { mobile });
            if (response.data.success) {
                await AsyncStorage.setItem('token', response.data.token); 
        
                // Await AsyncStorage.getItem to properly log the value
                const token = await AsyncStorage.getItem('token');
                console.log(token); // Logs the token value
        
                router.replace('/choose-vehicle');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <ScrollView>
        <View className='h-screen items-center justify-center'>
            <TouchableOpacity
                className='absolute top-10 left-5 p-2 bg-[#76ABAE] rounded-xl w-16 text-center items-center justify-center mt-5'
                onPress={() => router.replace('/welcome')}
            >
                <Text className='text-black'> Back</Text>
            </TouchableOpacity>
            <View className=' border-2 border-[#76ABAE] rounded-3xl p-6'>
            <Text className='text-3xl font-bold text-center text-[#76ABAE]'>Sign In</Text>
            
            {/* Mobile Number Input */}
            <View className='flex'>
                    <TextInput
                    className='border-2 w-80 rounded-full text-white border-[#76ABAE] p-2 mt-5'
                    placeholder='Mobile Number'
                    placeholderTextColor={'#94a3b8'}
                        keyboardType='numeric'
                        maxLength={10}
                        value={mobile}
                        onChangeText={setMobile}
                    />
                    <TouchableOpacity
                        className='bg-[#76ABAE] absolute rounded-full p-2 items-center justify-center mt-[25px] right-2 w-24'
                        disabled={!sendOtp || loading}
                        onPress={handleSendOtp}
                    >
                        
                        <Text className='text-black'>Send OTP</Text>
                    </TouchableOpacity>
                    <View className='flex flex-row justify-center mt-4'>
                    <Text className='text-sm text-center text-gray-500'>New Here? </Text>
                    <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
                        <Text className='text-[#76ABAE]'>Sign Up</Text>
                        </TouchableOpacity>
                        </View>
                        </View>

            {/* OTP Input */}
            {showOtp && (
                <View className='w-80'>
                    <TextInput
                    className='border-2 w-80 rounded-full text-white border-[#76ABAE] p-2 mt-5'
                    placeholder='Enter OTP'
                        keyboardType='numeric'
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
                    />
                    
                    <TouchableOpacity
                        className='bg-blue-500 absolute rounded-lg p-2 items-center justify-center mt-[26px] right-2 w-20'
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text className='text-white'>Sign In</Text>
                    </TouchableOpacity>
                    
                </View>
            )}

            {/* Loading Indicator */}
            {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
        </View>
        </View>
        </ScrollView>
    );
};

export default signIn;
