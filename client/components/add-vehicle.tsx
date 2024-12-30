import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';

const AddVehicle = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(true);

  const toggleModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      visible={isModalVisible}
      
      animationType="fade"
      onRequestClose={toggleModal}
    >
      {/* Blurred Background */}
      <View className="flex items-center justify-center">
        {/* Modal Content */}
        <View className="bg-white rounded-3xl shadow-xl shadow-[#76ABAE] p-5 w-80">
          <Text className="text-2xl font-bold text-center mb-2">Add New Vehicle</Text>

          <View className="pt-4 pb-4">
            <View className="mb-4">
              <Text className="text-lg font-semibold">Vehicle Name</Text>
              <TextInput
                className="border border-gray-400 rounded-3xl mt-2 p-2"
                placeholder="Enter Vehicle Name"
              />
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold">Vehicle Number</Text>
              <TextInput
                className="border border-gray-400 rounded-3xl mt-2 p-2"
                placeholder="Enter Vehicle Number"
              />
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold">Vehicle Type</Text>
              <TextInput
                className="border border-gray-400 rounded-3xl mt-2 p-2"
                placeholder="Enter Vehicle Type"
              />
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold">Vehicle Model</Text>
              <TextInput
                className="border border-gray-400 rounded-3xl mt-2 p-2"
                placeholder="Enter Vehicle Model"
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-blue-500 rounded-3xl p-2 mt-4 items-center justify-center"
            onPress={toggleModal}
          >
            <Text className="text-white">Add Vehicle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddVehicle;
