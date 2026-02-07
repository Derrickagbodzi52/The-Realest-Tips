const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'realest_tips';
const usersCollection = process.env.MONGODB_USERS_COLLECTION || 'users';

let client;
let db;

async function connectMongo() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
  }
  return db.collection(usersCollection);
}

async function createUser(user) {
  const collection = await connectMongo();
  return collection.insertOne(user);
}

async function findUserByEmail(email) {
  const collection = await connectMongo();
  return collection.findOne({ email });
}

module.exports = {
  createUser,
  findUserByEmail,
};
