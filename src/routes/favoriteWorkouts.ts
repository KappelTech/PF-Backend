import express from 'express';
import FavoriteWorkout from '../models/favoriteWorkout';

const router = express.Router();

//Post Favorite Workout
router.post('', async (req, res, next) => {
  const favorieWorkout = new FavoriteWorkout({
    workout: req.body.workout,
    user: req.body.client,
  });

  favorieWorkout.save().then((result) => {
    res.status(201).json({
      message: 'Favorite Workout Added Successfully',
      workoutResultId: result._id,
    });
  });
});

//Get Favorite Workouts
router.get('/:id', async (req, res, next) => {
  const workouts = await FavoriteWorkout.find({ user: req.params.id }).populate('workout');

  if (workouts) {
    res.status(200).json(workouts);
  } else {
    res.status(404).json({ message: 'No workouts found' });
  }
});

router.put('/:id', (req, res, next) => {
  FavoriteWorkout.deleteOne({ workout: req.params.id, user: req.body.user }).then((result) => {
    // console.error(result)
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Deletion Successful' });
    } else {
      res.status(401).json({ message: 'Not Authorized' });
    }
  });
});

const FavoriteWorkouts = router;
export default FavoriteWorkouts;
