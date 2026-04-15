import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import authRoute from './modules/auth/auth.routes.js'
import bookingRoute from './modules/booking/booking.routes.js'

import errorMiddleware from './common/middleware/error.middleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Allow Vite dev server and any localhost client
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/auth", authRoute);
app.use("/api/bookings", bookingRoute);

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, '..', 'index.html'));
});

app.use(errorMiddleware);

export default app;