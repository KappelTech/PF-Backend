import express from 'express';
import { authUser } from '../middleware/check-auth';

const router = express.Router();

import WorkoutItem from '../models/workoutItem';

router.post('', authUser, (req, res, next) => {
  // console.error(req.body)
  let items = req.body;
  WorkoutItem.insertMany(items).then((createdWorkoutItem) => {
    res.status(201).json(createdWorkoutItem);
  });

  // const workoutItem = new WorkoutItem({
  //   name: req.body.name,
  //   description: req.body.description,
  //   comments: req.body.comments,
  //   workout: req.body.workout,
  //   // client: req.userData.userId
  // });

  // workoutItem.save().then((createdWorkoutItem) => {
  //   res.status(201).json({
  //     message: "Workout Item Added Successfully",
  //     workoutItemId: createdWorkoutItem._id,
  //   });
  // });
});

router.put('', authUser, (req, res, next) => {
  console.error(req.body);
  let items = req.body;

  // workoutItems = new WorkoutItem({
  //   _id: item.id,
  //   name: item.name,
  //   description: item.description,
  //   comments: item.comments,
  //   workout: item.workout? item.workout : null
  // });

  WorkoutItem.bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: item },
      },
    })),
  ).then((result) => {
    console.error(result);
  });

  // WorkoutItem.updateMany({ _id: { $in: [items._id]} }, items, {multi: true}).then((result) => {
  //   // console.error(result)
  //   if(result.nModified > 0) {
  //   res.status(200).json({ message: "Update Successful" });
  //   } else {
  //   res.status(401).json({ message: "Not Authorized" });
  //   }
  // });
});

router.get('', (req, res, next) => {
  WorkoutItem.find().then((item) => {
    if (item) {
      res.status(200).json({
        message: 'Programs found',
        workoutItems: item,
      });
    }
  });
});

router.get('/:id', (req, res, next) => {
  console.error(req.params.id);
  let workoutId = req.params.id;
  WorkoutItem.find({ workout: workoutId }).then((item) => {
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Workout item not found' });
    }
  });
});

router.delete('/:id', authUser, async (req, res, next) => {
  try {
    console.error(req.params); // Log the params (for debugging)
    const result = await WorkoutItem.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      return res.status(200).json({ message: 'Deletion Successful' });
    } else {
      return res.status(404).json({ message: 'Workout item not found' });
    }
  } catch (error) {
    console.error(error); // Log any errors
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

const WorkoutItems = router;
export default WorkoutItems;
