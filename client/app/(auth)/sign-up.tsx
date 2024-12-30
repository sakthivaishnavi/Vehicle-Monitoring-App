import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const signUp = () => {
    const [showPassword, setShowPassword] = useState(true);
    const [mobile, setMobile] = useState('');
    const [sendOtp, setSendOtp] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [serverOtp, setServerOtp] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const API_BASE_URL = 'http://192.168.107.195:3000/auth';
    const handleSendOtp = async () => {
        if (mobile.length !== 10) {
            Alert.alert('Validation Error', 'Mobile number should be 10 digits');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/send-otp`, {
                mobile// Send mobile as query param
            });
            if (response.data.success) {
                setServerOtp(response.data.otp);
                setSendOtp(false);
                setShowOtp(true);
                console.log(response.data.otp);
                Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async () => {
        // Basic input validation
        console.log(otp)
        if (mobile.length !== 10) {
            Alert.alert('Invalid Input', 'Mobile number should be of 10 digits');
            return;
        }

        try {
            if(otp !== serverOtp){
                Alert.alert('Invalid OTP', 'Please enter the correct OTP');
                return;
            }
            
            const response = await axios.post(`${API_BASE_URL}/register`, { mobile, username });
            if (response.data.success) {
                Alert.alert('Success', 'Account created successfully');
                router.replace('/(auth)/sign-in');
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Network Error', 'An error occurred while processing your request.');
        }
    };


    return (
        <ScrollView>
            <View className="h-screen items-center justify-center">
            <TouchableOpacity
                className='absolute top-10 left-5 p-2 bg-[#76ABAE] rounded-xl w-16 text-center items-center justify-center mt-5'
                onPress={() => router.replace('/welcome')}
            >
                <Text className='text-black'>Back</Text>
            </TouchableOpacity>
            <View className='border-2  border-[#76ABAE] rounded-3xl p-6'>
                <Text className="text-3xl font-bold text-center text-[#76ABAE]">Create Account</Text>
                <TextInput
                    className='border-2 w-80 rounded-full text-white border-[#76ABAE] p-2 mt-5'
                    placeholder="User name"
                    placeholderTextColor={'#94a3b8'}
                    onChangeText={setUsername}
                    value={username}
                />
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
                {showOtp && (
                    <View className='w-80'>
                        <TextInput
                    className='border-2 w-80 rounded-full text-white border-[#76ABAE] p-2 mt-5'
                    placeholder='Enter OTP'
                    placeholderTextColor={'#94a3b8'}
                            keyboardType='numeric'
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                        />
                        <TouchableOpacity
                            className='bg-[#76ABAE] absolute rounded-full p-2 items-center justify-center mt-[25px] right-2 w-24'
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text className='text-black'>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                )}
                        <View className='flex flex-row justify-center mt-4'>
                        <Text className='text-sm text-center text-gray-500'>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
                            <Text className='text-[#76ABAE]'>Sign In</Text>
                            </TouchableOpacity>
                            </View>
                    </View>
            </View>
            </View>
        </ScrollView>
    );
};

export default signUp;
