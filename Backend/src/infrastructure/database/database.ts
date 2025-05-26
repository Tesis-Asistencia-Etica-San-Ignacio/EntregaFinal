import mongoose from 'mongoose';
import config from '../config';
import { seedAdminUser } from './seed/adminSeeder';

class Database {
  private static instance: Database;
  private readonly dbUri: string;

  private constructor() {
    this.dbUri = config.database.mongoUri;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.dbUri);
      console.log('✅ Database connected successfully')
      await seedAdminUser()
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Error while disconnecting database:', error);
    }
  }
}

export default Database.getInstance();
