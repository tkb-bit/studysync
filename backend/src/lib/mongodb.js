// backend/src/lib/mongodb.js
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || null
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    if (!uri) {
      global._mongoClientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI"'));
    } else {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  if (!uri) {
    clientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI"'));
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise
