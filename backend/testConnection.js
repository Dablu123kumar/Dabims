import { connectDB } from './src/db/db.js';

console.log('Starting connection test...');
connectDB()
  .then((connected) => {
    if (connected) {
      console.log('Database connection successful!');
    } else {
      console.log('Database connection failed!');
    }
    process.exit(0);
  })
  .catch((err) => {
    console.log('Error in connection test:', err);
    process.exit(1);
  });