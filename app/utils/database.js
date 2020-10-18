const mongodb = require('mongodb');
const { getConnectionString } = require('./constants/secret.js');

const { MongoClient } = mongodb;

module.exports = async function connectToDatabase() {
  const connString = await getConnectionString().then((r) => r);
  const client = new MongoClient(connString, { useUnifiedTopology: true });
  log.info('Attempting to connect to db');
  try {
    await client.connect();
    log.info('Client Connected to Database.');
    return client.db('hessDB');
  } catch (e) {
    log.error('Error with Database connection', e);
  }
};

