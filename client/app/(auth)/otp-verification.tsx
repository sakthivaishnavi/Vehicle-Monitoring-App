import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import axios from 'axios'
const otpVerification = () => {
  
  const [otp,setOtp]=React.useState('')
  const handleSubmit=()=>{
    if(otp.length!==6){
      alert('OTP should be of 6 digits')
      return
    }
    
    else{
      axios.post('http://localhost:3000/auth/verify-otp',{otp:otp}).then((res)=>{
        if(res.data.success){
          router.replace('/sign-in')
        }
      }).catch((err)=>{
        console.log(err)
      }
      )
    }
  }

  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text className='text-xl font-bold'>otpVerification</Text>
      <TextInput className='border-2 w-80 rounded-lg text-white p-2 mt-5' maxLength={6} keyboardType='numeric' placeholder='Enter OTP'/>
      <TouchableOpacity className='bg-blue-500 w-80 rounded-lg p-2 mt-5 items-center justify-center' onPress={()=>{handleSubmit}}>
        <Text className='text-white' >Verify</Text>  
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default otpVerification