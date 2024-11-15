import express from 'express';
import { authUser } from '../middleware/check-auth';

import Workout from '../models/workout';

const router = express.Router();

router.get('/:id', (req, res, next) => {
  // console.error(req)
  let query = {
    creator: req.params.id,
    personalWorkout: '1',
  };
  let q = {
    $or: [
      { client: req.params.id },
      { $and: [{ creator: req.params.id }, { personalWorkout: '1' }] },
    ],
    date: {
      $gte: req.query.dateStart,
      $lt: req.query.dateEnd,
    },
  };
  // console.error(q)

  let fetchedWorkouts;
  Workout.find(q)
    .then((workouts) => {
      fetchedWorkouts = workouts;

      return Workout.countDocuments(q);
    })
    .then((count) => {
      res.status(200).json({
        message: 'Workout count fetched successfully!',
        workouts: fetchedWorkouts,
        workoutNumber: count,
      });
    });
});

const Reports = router;
export default Reports;
