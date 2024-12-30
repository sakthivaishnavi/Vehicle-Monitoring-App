const { Database } = require('@sqlitecloud/drivers');

const db = new Database('sqlitecloud://cokwqq8zhk.sqlite.cloud:8860/vehicle-tracking-analytics?apikey=WOVbBakYX9k0GsbNMQbbQmFDUZslsVX5dSqaAXdqwzA');
if(db) {
    console.log('Connected to the database');
}

module.exports = db;