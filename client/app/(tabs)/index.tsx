import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Dimensions, StyleSheet } from 'react-native';
import MapView, { MarkerAnimated } from 'react-native-maps';
import { useVehicle } from '@/context/VehicleContext';

const Index = () => {
  const { selectedVehicle } = useVehicle();
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({
    latitude: 11.273340,
    longitude: 77.60632,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    const ws = new WebSocket('ws://10.1.76.27ip:8080');
    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log('Message from server:', receivedData.data.voltage);
      setData(receivedData.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Selected Vehicle */}
      {selectedVehicle && (
        <View style={styles.header}>
          <Text style={styles.headerText}>{selectedVehicle.name}</Text>
        </View>
      )}

      {/* Map Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MAP</Text>
        <View style={styles.mapContainer}>
          <MapView region={location} style={styles.map}>
            <MarkerAnimated coordinate={location} title="Vehicle" description="Current Location" />
          </MapView>
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.dataContainer}>
        {renderDataBox('FUEL LEVEL', data ? `${data.voltage} V` : 'No vehicle selected')}
        {renderDataBox('SPEED', selectedVehicle ? '60 km/h' : 'No vehicle selected')}
        {renderDataBox('ENGINE STATUS', selectedVehicle ? 'ON' : 'No vehicle selected')}
        {renderDataBox('GEAR NUMBER', selectedVehicle ? '3' : 'No vehicle selected')}
      </View>
    </ScrollView>
  );
};

const renderDataBox = (title, value) => (
  <View style={styles.dataBox}>
    <Text style={styles.dataTitle}>{title}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#76ABAE',
    backgroundColor: '#243642',
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    width: '80%',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#76ABAE',
    backgroundColor: '#243642',
    borderRadius: 10,
    padding: 8,
    textAlign: 'center',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  mapContainer: {
    height: width * 0.6, // Aspect ratio for responsiveness
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
  },
  map: {
    flex: 1,
  },
  dataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataBox: {
    width: '45%', // Adjust width for two columns
    backgroundColor: '#243642',
    borderWidth: 2,
    borderColor: '#76ABAE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#76ABAE',
    textAlign: 'center',
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 14,
    color: '#76ABAE',
    textAlign: 'center',
  },
});

export default Index;
