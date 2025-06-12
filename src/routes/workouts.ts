import express from 'express';
import { authUser } from '../middleware/check-auth';

import Workout from '../models/workout';
import WorkoutResults from '../models/workoutResults';
import FavoriteWorkout from '../models/favoriteWorkout';

const router = express.Router();

// Create workouts
router.post('/workouts', authUser, async (req, res, next) => {
  try {
    // Validate request body
    const { date, name, client, program, workoutItems, personalWorkout } = req.body;
    // if (!name) {
    //   return res.status(400).json({ message: "Name and workoutItems are required" });
    // }

    // Create new workout object
    const workout = new Workout({
      date: date ? new Date(date) : null,
      name,
      creator: req.userData.userId,
      client: client || null,
      program: program || null,
      workoutItems,
      personalWorkout: personalWorkout === '1' ? '1' : '0',
      favorite: false,
    });

    // Save workout to database
    const createdWorkout = await workout.save();

    // Respond with success
    res.status(201).json({
      message: 'Workout Added Successfullyy',
      workoutId: createdWorkout._id,
    });
  } catch (error) {
    // Handle errors
    console.error('Error adding workout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create workout result for a workout
router.post('/workoutResults', authUser, async (req, res, next) => {
  try {
    // Validate request body
    const { date, workout, comment, client } = req.body;
    if (!date || !workout) {
      return res.status(400).json({ message: 'Date and workout are required' });
    }

    // Create workout result object
    const workoutResult = new WorkoutResults({
      date: date ? new Date(date) : null,
      workout,
      comment,
      client,
    });

    // Save workout result to database
    const result = await workoutResult.save();

    // Respond with success
    res.status(201).json({
      message: 'Workout Added Successfully',
      workoutResultId: result._id,
    });
  } catch (error) {
    // Handle errors
    console.error('Error adding workout result:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update workout by ID
router.put('/:id', authUser, async (req, res, next) => {
  console.log('workout', req.body);

  try {
    // Validate request body
    const { date, name, client, program, workoutItems, personalWorkout } = req.body;
    // if (!name || !workoutItems) {
    //   return res.status(400).json({ message: "Name and workoutItems are required" });
    // }

    // Update workout document
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        date: date ? new Date(date) : null,
        name,
        creator: req.userData.userId,
        client: client || null,
        program: program || null,
        workoutItems,
        // personalWorkout: personalWorkout === '1' ? '1' : '0',
        personalWorkout
      },
      { new: true }, // Return the updated document
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Respond with success
    res.status(200).json({
      message: 'Update Successful',
      workoutId: updatedWorkout._id,
    });
  } catch (error) {
    // Handle errors
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get workouts by type of workout (admin workouts) Types: client, program
// routes/workouts.js
router.get('/workouts/:userId', async (req, res, next) => {
  try {
    const creator = req.params.userId;
    const workouts = await Workout.find({ creator, personalWorkout: true }).sort({ date: -1 });
    res.status(200).json({ workouts });
  } catch (error) {
    // Error handling
    console.error('Error fetching workouts:', error);
    res.status(500).json({
      message: 'Fetching workouts failed.',
      error: error.message,
    });
  }
});

router.post('/getWorkouts', async (req, res, next) => {
  try {
    const { pagesize: pageSize, page: currentPage, workoutType, client, program } = req.query;
    const query = { 
      personalWorkout: false,
      client: client,
      program: program
     };

    // Add filters based on the request parameters
    if (workoutType === 'client') {
      query.client = { $ne: null };
    } else if (workoutType === 'program') {
      query.program = { $ne: null };
    }

    if (client && client !== 'undefined') {
      query.client = client;
    }

    if (program && program !== 'undefined') {
      query.program = program;
    }

    console.error('query', query);

    // Prepare the base workout query
    let workoutQuery = Workout.find(query).sort({ date: -1 }).populate({ path: 'client' });

    // Apply pagination if applicable
    if (pageSize && currentPage) {
      const pageSizeInt = parseInt(pageSize);
      const currentPageInt = parseInt(currentPage);
      workoutQuery = workoutQuery.skip(pageSizeInt * (currentPageInt - 1)).limit(pageSizeInt);
    }

    // Execute the query and get the total count
    const [fetchedWorkouts, count] = await Promise.all([
      workoutQuery.exec(),
      Workout.countDocuments(query),
    ]);

    // Send the response
    res.status(200).json({
      message: 'Workouts fetched successfully!',
      workouts: fetchedWorkouts,
      maxWorkouts: count,
    });
  } catch (error) {
    // Error handling
    console.error('Error fetching workouts:', error);
    res.status(500).json({
      message: 'Fetching workouts failed.',
      error: error.message,
    });
  }
});

// Get workout by id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientId } = req.query;

    // Fetch the workout and its creator, and check if it's favorited
    const workout = await Workout.findById(id)
      .populate({ path: 'creator' })
      .populate({
        path: 'workoutItems.exercise', // Populates the exercise field inside workout items
      })
      .lean();

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if the workout is favorited by the client
    const isFavorited = await FavoriteWorkout.exists({ user: clientId, workout: id });
    workout.favorite = Boolean(isFavorited);

    // Fetch workout results for each workout item
    if (workout.workoutItems) {
      const workoutItemsWithResults = await Promise.all(
        workout.workoutItems.map(async (item) => {
          const query = { client: clientId, workout: item._id };
          const workoutResults = await WorkoutResults.find(query).lean();
          return { ...item, workoutResults };
        }),
      );

      // @ts-ignore
      workout.workoutItems = workoutItemsWithResults;
    }

    res.status(200).json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get All Client Workouts
router.get('/clientWorkouts/:id', async (req, res, next) => {
  try {
    const clientId = req.params.id;

    // Fetch workouts for the client, sorted by date in descending order
    const workouts = await Workout.find({ client: clientId }).sort({ date: -1 }).lean();

    if (!workouts || workouts.length === 0) {
      return res.status(404).json({ message: 'No workouts found for this client' });
    }

    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error fetching client workouts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/personalTrainingWorkouts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dateStart, dateEnd } = req.query;

    // Build the query object
    // const query = { 
    //   client: id };
      const query: Record<string, any> = { client: id };

    // Add date range to the query if both start and end dates are provided
    if (dateStart && dateEnd) {
      query.date = {
        $gte: new Date(dateStart),
        $lt: new Date(dateEnd),
      };
    }

    // Fetch workouts based on the query
    const workouts = await Workout.find(query).lean();

    if (!workouts || workouts.length === 0) {
      return res.status(404).json({ message: 'No workouts found' });
    }

    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error fetching personal training workouts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/myWorkouts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dateStart, dateEnd } = req.query;

    // Build the query object
    // const query = {
    //   creator: id,
    //   personalWorkout: '1',
    // };
    const query: Record<string, any> = { client: id };

    // Add date range to the query if both start and end dates are provided
    if (dateStart && dateEnd) {
      query.date = {
        $gte: dateStart,
        $lt: dateEnd,
      };
    }
    console.log(query);

    // Fetch workouts based on the query and sort them by date in descending order
    const workouts = await Workout.find(query).sort({ date: -1 }).lean();

    if (!query.date && (!workouts || workouts.length === 0)) {
      return res.status(404).json({ message: 'No workouts found' });
    }

    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/programWorkouts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch workouts associated with the given program ID, sorted by date in descending order
    const workouts = await Workout.find({ program: id }).sort({ date: -1 }).lean();

    if (!workouts || workouts.length === 0) {
      return res.status(404).json({ message: 'No workouts found for this program' });
    }

    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/clientComment/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = req.body;

    // Update the workout item with the given ID by pushing the new comment
    const result = await Workout.updateOne(
      { 'workoutItems._id': id },
      { $push: { 'workoutItems.$.clientComments': comment } },
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Comment added successfully' });
    } else {
      res.status(404).json({ message: 'Workout item not found' });
    }
  } catch (error) {
    console.error('Error adding client comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', authUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Workout.deleteOne({ _id: id, creator: req.userData.userId });
    console.log(result);
    // if (result.deletedCount > 0) {
    //   res.status(200).json({ message: "Deletion Successful" });
    // } else {
    //   res.status(401).json({ message: "Not Authorized or Workout Not Found" });
    // }
  } catch (error) {
    console.error('Error during deletion:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const Workouts = router;
export default Workouts;
