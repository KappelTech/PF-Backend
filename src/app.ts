import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';

// import postsRoutes from './routes/posts';
// import postsRoutes from "./routes/posts"
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import workoutsRoutes from './routes/workouts';
import programRoutes from './routes/programs';
import workoutItemRoutes from './routes/workoutItems';
import passwordReset from './routes/passwordReset';
import reportRoutes from './routes/reports';
import favoriteWorkout from './routes/favoriteWorkouts';
import { authUser } from './middleware/check-auth';

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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Accept, Authorization, skiploading',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

// const protectedRouter = express.Router();
// protectedRouter.use(authUser);
// // Log an example message
// logger.info('App started');

// protectedRouter.use('/api/posts', postsRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/workouts', workoutsRoutes);
// app.use('/api/programs', programRoutes);
// app.use('/api/workoutItems', workoutItemRoutes);
// app.use('/api/passwordReset', passwordReset);
// app.use('/api/reports', reportRoutes);
// app.use('/api/favoriteWorkouts', favoriteWorkout);

// Create a router for protected routes
const protectedRouter = express.Router();
protectedRouter.use(authUser); // Apply authUser to all routes in protectedRouter

// Define routes that require authentication
// protectedRouter.use('/posts', postsRoutes);
protectedRouter.use('/user', userRoutes);
protectedRouter.use('/workouts', workoutsRoutes);
protectedRouter.use('/programs', programRoutes);
protectedRouter.use('/workoutItems', workoutItemRoutes);
protectedRouter.use('/reports', reportRoutes);
protectedRouter.use('/favoriteWorkouts', favoriteWorkout);

// Mount protected routes under /api
app.use('/api', protectedRouter);

// Define public routes that do not require authentication
app.use('/api/auth', authRoutes); // Public routes for login/signup
app.use('/api/passwordReset', passwordReset); // Public route for password reset

export default app;
