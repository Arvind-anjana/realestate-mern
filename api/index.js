import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

// routers import here
import userRoute from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cookieParser());

mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Detailed Connection Error: ');
    console.error(err.message);
  });

  const __dirname = path.resolve();

app.listen(5000, () => {
  console.log('Server is running on port 5000:');
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success : false,
    statusCode,
    message });
});