import {getConnectionString} from "./constants/secret.js";
import { default as mongodb } from "mongodb";
let MongoClient = mongodb.MongoClient;

// getConnectionData().then((connectionData) => {
//
//     console.log(connectionData, "cd");
//
//     global.connection = mysql.createConnection(connectionData);
//
//     connection.connect(function(err) {
//         if (err) {
//             console.error('Database connection failed: ' + err.stack);
//             return;
//         }
//
//         console.log('Connected to database.');
//     });
//
//     //connection.end();
// });

// Replace the uri string with your MongoDB deployment's connection string.

export async function connectToDatabase() {

    const connString = await getConnectionString().then(r => r);
    const client = new MongoClient(connString,{ useUnifiedTopology: true });
    try {
        await client.connect();
        console.log("Client Connected to Database.")
        return client.db('hessDB');
    } catch (e) {
        console.log("Error with Database connection", e)
    }
}

