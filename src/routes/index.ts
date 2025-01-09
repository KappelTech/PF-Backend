import postsRoutes from "./posts"
import userRoutes from './user';
import authRoutes from './auth';
import workoutsRoutes from './workouts';
import programRoutes from './programs';
import workoutItemRoutes from './workoutItems';
import passwordReset from './passwordReset';
import reportRoutes from './reports';
import favoriteWorkout from './favoriteWorkouts';
import Ping from "./ping";

import express from 'express';

const setupRoutes = (app, auth ) => {
const publicRouter = express.Router();
publicRouter.use('/ping', Ping); // Ping route
publicRouter.use('/auth', authRoutes); // Login/signup
publicRouter.use('/passwordReset', passwordReset); // Password reset
publicRouter.use('/user', userRoutes);
publicRouter.use('/posts', postsRoutes);


app.use('/api', publicRouter); // Public routes


// Protected routes
const protectedRouter = express.Router();
protectedRouter.use(auth); // Apply auth middleware to all protected routes
// protectedRouter.use('/posts', postsRoutes);
// protectedRouter.use('/user', userRoutes);
protectedRouter.use('/workouts', workoutsRoutes);
protectedRouter.use('/programs', programRoutes);
protectedRouter.use('/workoutItems', workoutItemRoutes);
protectedRouter.use('/reports', reportRoutes);
protectedRouter.use('/favoriteWorkouts', favoriteWorkout);

// Mount routers
app.use('/api', protectedRouter); // Protected routes

}

export default setupRoutes
