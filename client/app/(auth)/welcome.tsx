import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Image } from 'react-native'

const welcome = () => {
    const handleSignUp=()=>{
        router.replace('/(auth)/sign-up');
    }

  return (
    <SafeAreaView className='flex-1 justify-end mb-60 items-center dark:text-white p-2'>
      <View className='flex justify-center items-center mt-4'>
        <Image
          source={require('../../assets/images/welcome.png')}
          className='w-80 h-80'
        />
        </View>
      <Text className='text-3xl font-bold text-[#76ABAE]'>Welcome!</Text>
      <Text className='text-md m-2 text-gray-400'>Seamless Vehicle tracking made simple...</Text>
      <TouchableOpacity onPress={()=>{
        handleSignUp();
        
      }}>
        <Text className='text-lg font-semibold border-2 bg-[#76ABAE] rounded-3xl p-2 w-64 text-center mt-5'>Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default welcome