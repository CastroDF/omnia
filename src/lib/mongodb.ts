import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
  throw new Error(
    'Invalid/Missing environment variables: "MONGODB_USERNAME" and "MONGODB_PASSWORD" are required',
  );
}

// Construct MongoDB URI from username and password
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@omnia-cluster.dnwcklu.mongodb.net/?retryWrites=true&w=majority&appName=omnia-cluster`;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the value across module reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the database connection helper
export const getDatabase = async (): Promise<Db> => {
  const client = await clientPromise;
  return client.db('omnia');
};

export default clientPromise;
