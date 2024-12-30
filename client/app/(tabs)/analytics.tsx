import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AnalyticsData {
  timestamp: string;
  data: string; // JSON string containing metric data (e.g., { "voltage": 5.0, "speed": 20 })
}

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [selectedMetric, setSelectedMetric] = useState<string>('voltage'); // Default metric is voltage

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token
      const response = await axios.get<AnalyticsData[]>('http://192.168.107.195:3000/get-analytics-data', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      });

      const fetchedData = response.data;

      // Process data into 10-minute intervals
      const processedData = processData(fetchedData, selectedMetric);
      setChartData(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
      setLoading(false);
    }
  };

  const processData = (data: AnalyticsData[], metricKey: string): ChartData => {
    const groupedData: Record<string, number[]> = {};

    data.forEach((item) => {
      const timestamp = new Date(item.timestamp);
      const intervalStart = new Date(
        timestamp.getFullYear(),
        timestamp.getMonth(),
        timestamp.getDate(),
        timestamp.getHours(),
        Math.floor(timestamp.getMinutes() / 10) * 10
      );

      const intervalKey = intervalStart.toISOString();
      const parsedData = JSON.parse(item.data);

      if (!groupedData[intervalKey]) {
        groupedData[intervalKey] = [];
      }
      groupedData[intervalKey].push(parsedData[metricKey]);
    });

    const labels: string[] = [];
    const values: number[] = [];

    Object.keys(groupedData)
      .sort()
      .forEach((key) => {
        const intervalValues = groupedData[key];
        const averageValue =
          intervalValues.reduce((sum, val) => sum + parseFloat(val || 0), 0) /
          intervalValues.length;

        labels.push(
          new Date(key).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
        values.push(averageValue);
      });

    return {
      labels,
      datasets: [{ data: values }],
    };
  };

  useEffect(() => {
    fetchData();
  }, [selectedMetric]);

  const chartWidth = Dimensions.get('window').width * 0.9;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>ANALYTICS</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#76ABAE" />
        ) : (
          <>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedMetric}
                onValueChange={(value) => setSelectedMetric(value)}
                style={styles.picker}
              >
                <Picker.Item label="Fuel" value="voltage" color="#76ABAE" />
                <Picker.Item label="Speed" value="speed" color="#76ABAE" />
              </Picker>
            </View>

            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <BarChart
                data={chartData}
                width={chartWidth}
                height={220}
                yAxisLabel=""
                yAxisSuffix={selectedMetric === 'voltage' ? ' V' : ''}
                chartConfig={{
                  backgroundColor: '#76ABAE',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#76ABAE',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                verticalLabelRotation={30}
                style={{ borderRadius: 10 }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    alignItems: 'center',
    paddingBottom: 90,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#76ABAE',
    color: '#000',
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    width: '50%',
  },
  pickerWrapper: {
    width: '60%',
    backgroundColor: '#243642',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#76ABAE',
    marginBottom: 20,
    marginTop:20,
    overflow: 'hidden',
  },
  picker: {
    
    color: '#76ABAE',
    width: '100%',
  },
});

export default Analytics;
