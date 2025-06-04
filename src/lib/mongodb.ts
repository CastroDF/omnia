import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@omnia-cluster.dnwcklu.mongodb.net/?retryWrites=true&w=majority&appName=omnia-cluster`;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // En dev, usamos una variable global para cache
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // En prod, siempre nuevo
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
