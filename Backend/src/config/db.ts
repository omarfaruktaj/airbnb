import mongoose from 'mongoose';
import { config } from './config';

const DatabaseURL = config.get('databaseURL');

const connectDB = async () => {
  try {
    await mongoose.connect(DatabaseURL as string);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;
