import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb';
import RefreshToken from '~/models/database/schemas/refreshToken.schema';
import Task from '~/models/database/schemas/task.schema';

import User from '~/models/database/schemas/user.schemas';

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fizzytask.wk9bt5p.mongodb.net/?retryWrites=true&w=majority`;

class DatabaseService {
  private client: MongoClient;
  private dbInstance: Db;

  constructor() {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    this.client = new MongoClient(URI);
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

  get refreshTokens(): Collection<RefreshToken> {
    return this.dbInstance.collection(process.env.REFRESH_TOKENS_COLLECTION_NAME!);
  }

  get tasks(): Collection<Task> {
    return this.dbInstance.collection(process.env.TASKS_COLLECTION_NAME!);
  }
}

export default new DatabaseService();
