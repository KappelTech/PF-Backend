import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import cors from 'cors'
import { authUser } from "./middleware/check-auth";
import setupRoutes from "./routes";



const app = express();
dotenv.config()
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.titlm.mongodb.net/node-angular?retryWrites=true&w=majority`;
mongoose
  .connect(uri, {
    tls: true,
  })
  .then(() => {
    logger.info('Connected to Database');
  })
  .catch((e) => {
    logger.info('Connection failed', e);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: '*', // Allow requests from your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, skipLoading',  // Allowed headers
  credentials: false, // Allow cookies if needed
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

setupRoutes(app, authUser);

export default app;
