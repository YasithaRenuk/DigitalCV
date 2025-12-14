import { MongoClient } from 'mongodb';
import { serverEnv } from '@/config/server-env';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(serverEnv.mongodbUri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(serverEnv.mongodbUri);
  clientPromise = client.connect();
}

export default clientPromise;
