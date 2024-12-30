const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const mqtt = require('mqtt');
const db = require('./config/db');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MQTT broker details
const brokerUrl = 'mqtt://broker.hivemq.com';
const topic1 = 'Pleasure/ADC';
const topic2 = 'Pleasure/GPS';

// Ensure the database table exists
db.run(
  `CREATE TABLE IF NOT EXISTS mqtt_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT NOT NULL,
      average_voltage REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table "mqtt_data" ensured to exist');
    }
  }
);

// Connect to the MQTT broker
const mqttClient = mqtt.connect(brokerUrl, {
  clientId: `qpperzPGO3`, 
});

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

// WebSocket client connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  clients.push(ws);

  // Remove client on disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter((client) => client !== ws);
  });
});

// MQTT broker connection
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker!');

  // Subscribe to both topics
  mqttClient.subscribe([topic1, topic2], (err) => {
    if (err) {
      console.error('Failed to subscribe:', err);
    } else {
      console.log(`Subscribed to topics: ${topic1}, ${topic2}`);
    }
  });
});

// Buffer for incoming messages
let messageBuffer = [];

// Handle incoming MQTT messages
mqttClient.on('message', (topic, message) => {
  const data = message.toString();
  console.log(`Message received on topic '${topic}': ${data}`);
  messageBuffer.push({ topic, data: JSON.parse(data) });

  // Broadcast data to WebSocket clients
  const payload = { topic, data: JSON.parse(data) };
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
});

// Process buffer and save averages every 15 minutes
setInterval(() => {
  if (messageBuffer.length > 0) {
    const topicGroups = messageBuffer.reduce((acc, curr) => {
      if (!acc[curr.topic]) acc[curr.topic] = [];
      acc[curr.topic].push(curr.data.voltage);
      return acc;
    }, {});

    const insertStmt = db.prepare('INSERT INTO mqtt_data (topic, average_voltage) VALUES (?, ?)');
    for (const topic in topicGroups) {
      const voltages = topicGroups[topic];
      const averageVoltage = voltages.reduce((sum, val) => sum + val, 0) / voltages.length;

      insertStmt.run([topic, averageVoltage], (err) => {
        if (err) {
          console.error('Error inserting average data:', err.message);
        } else {
          console.log(`Average data for topic '${topic}' inserted: ${averageVoltage}`);
        }
      });
    }

    messageBuffer = []; // Clear the buffer after processing
    insertStmt.finalize();
  }
}, 15 * 60 * 1000); // 15 minutes in milliseconds

// Handle MQTT errors
mqttClient.on('error', (err) => {
  console.error('MQTT Connection error:', err);
});
app.get("/get-analytics-data", (req, res) => {
  db.all('SELECT timestamp,data FROM mqtt_data', (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      console.log(rows)
      res.json(rows);
    }
  });
}
);
// Add routes
app.use('/auth', require('./routes/auth'));
app.use('/protected', require('./routes/protected'));

// Start the server
app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
console.log('WebSocket server running on ws://localhost:8080');
