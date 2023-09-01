import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb';

import User from '~/models/database/schemas/users.schemas';

class DatabaseService {
  private client: MongoClient;
  private dbInstance: Db;

  constructor() {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    this.client = new MongoClient(process.env.URI!);
    this.dbInstance = this.client.db(process.env.DB_NAME);
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.dbInstance.command({ ping: 1 });
      console.log('You successfully connected to MongoDB!');
    } catch (error) {
      console.error('Can not connect to MongoDB!, error: ', error);
    }
  }

  get users(): Collection<User> {
    return this.dbInstance.collection(process.env.USERS_COLLECTION_NAME!);
  }
}

export default new DatabaseService();
