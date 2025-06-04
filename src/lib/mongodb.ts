import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
  throw new Error(
    'Please add MONGODB_USERNAME and MONGODB_PASSWORD to .env.local',
  );
}

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@omnia-cluster.dnwcklu.mongodb.net/?retryWrites=true&w=majority&appName=omnia-cluster`;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to cache the client
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production, always create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
