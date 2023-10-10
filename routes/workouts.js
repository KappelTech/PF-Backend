const express = require("express");
const { authUser } = require("../middleware/check-auth")

const router = express.Router();

const Workout = require("../models/workout");
const user = require("../models/user")
const WorkoutItem = require("../models/workoutItem");
const workoutItem = require("../models/workoutItem");

router.post("", authUser, (req, res, next) => {
  console.error(req.body)
  const items = req.body.workoutItems

  const workout = new Workout({
    date: req.body.date ? req.body.date : null,
    name: req.body.name,
    creator: req.userData.userId,
    client: req.body.user ? req.body.user : null,
    program: req.body.program ? req.body.program : null,
    workoutItems: req.body.workoutItems,
    personalWorkout: req.body.personalWorkout ? '1' : '0'
  });


  console.error(workout)

  workout.save().then((createdWorkout) => {
    // console.error(createdWorkout)
    res.status(201).json({
      message: "Workout Added Successfully",
      workoutId: createdWorkout._id,
    });
  });
}
);



router.put("/:id", authUser, async (req, res, next) => {
  console.error(req.userData)

  const workout = await Workout.findByIdAndUpdate(req.params.id,
     {
      date: req.body.date ? req.body.date : null,
      name: req.body.name,
      creator: req.userData.userId,
      client: req.body.user ? req.body.user : null,
      program: req.body.program ? req.body.program : null,
      workoutItems: req.body.workoutItems,
      personalWorkout: req.body.personalWorkout ? '1' : '0'
     }, 
     {new:true});
  // ...

  // workout = req.body;

  // console.error(workout)
  // return 
  workout.save().then((result) => {
    // console.error(result)
    res.status(200).json({ message: "Update Successful", workoutId: result._id })
  })



  // const workout = new Workout({
  //   _id: req.body.id,
  //   date: req.body.date,
  //   name: req.body.name,
  //   creator: req.userData.userId ? req.userData.userId : null,
  //   client: req.body.user ? req.body.user : null,
  //   program: req.body.program ? req.body.program : null,
  //   workoutItems: req.body.workoutItem,
  //   personalWorkout: req.body.personalWorkout ? '1' : '0'
  // });
  // console.error(workout)
  // Workout.updateOne({ _id: req.params.id }, workout).then((result) => {
  //   // console.error(result)
  //   res.status(200).json({ message: "Update Successful" });

  //   // if(result.nModified > 0) {
  //   // res.status(200).json({ message: "Update Successful" });
  //   // } else {
  //   // res.status(401).json({ message: "Not Authorized" });
  //   // }
  // });
});

router.get("", (req, res, next) => {
  // console.error(req.query)
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  // const client = req.query.client
  let query = {}
  if (req.query.client == 'all') {
    query = {}
  } else if (req.query.client) {
    query = { client: req.query.client }
  }

  if (req.query.program == 'all') {
    query = {}
  } else if (req.query.program) {
    query = { program: req.query.program }
  }

  if (req.query.type == 'client') {
    // console.error('HERE')
    query = { client: { $ne: null } }
  }
  if (req.query.type == 'program') {
    query = { program: { $ne: null } }
  }
  // console.error('QUERY:', query)
  const workoutQuery = Workout.find(query).sort({ date: -1 });
  let fetchedWorkouts;
  if (pageSize && currentPage) {
    workoutQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  workoutQuery
    .then((documents) => {
      fetchedWorkouts = documents;
      return Workout.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Workouts fetched successfully!",
        workouts: fetchedWorkouts,
        maxWorkouts: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Workout.findById(req.params.id)
    .populate({ path: 'creator' })
    .then((workout) => {
      console.error(workout)
      if (workout) {
        res.status(200).json(workout);
      } else {
        res.status(404).json({ message: "workout not found" });
      }
    });
});

router.get("/myWorkouts/:id", (req, res, next) => {
  // console.error(req.params)
  Workout.find({ client: req.params.id }).then((workout) => {
    if (workout) {
      res.status(200).json(workout);
    } else {
      res.status(404).json({ message: "workout not found" });
    }
  });
});

router.get("/personalWorkouts/:id", (req, res, next) => {
  // console.error(req.params)
  Workout.find({ creator: req.params.id, personalWorkout: '1' }).then((workout) => {
    if (workout) {
      // console.error(workout)
      res.status(200).json(workout);
    } else {
      res.status(404).json({ message: "workout not found" });
    }
  });
});

router.get("/programWorkouts/:id", (req, res, next) => {
  // console.error(req.params)
  Workout.find({ program: req.params.id }).then((workout) => {
    if (workout) {
      res.status(200).json(workout);
    } else {
      res.status(404).json({ message: "workout not found" });
    }
  });
});

router.delete("/:id", authUser, (req, res, next) => {
  Workout.deleteOne({ _id: req.params.id, }).then((result) => {
    WorkoutItem.deleteMany({ "workout": req.params.id }).then((res) => {
      // console.error(res)
    })
    // console.error(result)
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion Successful" });
    } else {
      res.status(401).json({ message: "Not Authorized" });
    }
  });
});

module.exports = router;
