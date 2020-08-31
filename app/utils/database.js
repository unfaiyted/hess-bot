const getConnectionString = require("./constants/secret.js").getConnectionString;
const mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;

module.exports = async function connectToDatabase() {

    const connString = await getConnectionString().then(r => r);
    const client = new MongoClient(connString,{ useUnifiedTopology: true });
    log.info("Attempting to connect to db")
    try {
        await client.connect();
        log.info("Client Connected to Database.")
        return client.db('hessDB');
    } catch (e) {
        log.error("Error with Database connection", e)
    }
}

