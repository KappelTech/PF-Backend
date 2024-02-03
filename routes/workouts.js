const express = require("express");
const { authUser } = require("../middleware/check-auth")

const router = express.Router();

const Workout = require("../models/workout");
const user = require("../models/user")
const WorkoutResults = require("../models/workoutResults");
const FavWorkout = require("../models/favoriteWorkout");

router.post("/workouts", authUser, (req, res, next) => {
  // console.error(req.body)
  // return
  const items = req.body.workoutItems

  
  const workout = new Workout({
    date: req.body.date ? new Date(req.body.date) : null,
    name: req.body.name,
    creator: req.userData.userId,
    client: req.body.client ? req.body.client : null,
    program: req.body.program ? req.body.program : null,
    workoutItems: req.body.workoutItems,
    personalWorkout: req.body.personalWorkout == '1' ? '1' : '0',
    favorite: false
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

router.post("/workoutResults", authUser, (req, res, next) => {

  const workoutResult = new WorkoutResults({
    date: req.body.date,
    workout: req.body.workout,
    comment: req.body.comment,
    client: req.body.client
  });


  // console.error(workoutResult)
  // return

  workoutResult.save().then((result) => {
    // console.error(createdWorkout)
    res.status(201).json({
      message: "Workout Added Successfully",
      workoutResultId: result._id,
    });
  });
}
);




router.put("/:id", authUser, async (req, res, next) => {
  // console.error(req.userData)

  const workout = await Workout.findByIdAndUpdate(req.params.id,
    {
      date: req.body.date ? req.body.date : null,
      name: req.body.name,
      creator: req.userData.userId,
      client: req.body.client ? req.body.client : null,
      program: req.body.program ? req.body.program : null,
      workoutItems: req.body.workoutItems,
      personalWorkout: req.body.personalWorkout == '1' ? '1' : '0',
      // favorite: req.body.favorite, 
    },
    { new: true });
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

// router.get("", (req, res, next) => {
//   // console.error(req.query)
//   const pageSize = +req.query.pagesize;
//   const currentPage = +req.query.page;
//   // const client = req.query.client
//   let query = {}
//   if (req.query.client == 'all') {
//     query = {}
//   } else if (req.query.client) {
//     query = { client: req.query.client }
//   }

//   if (req.query.program == 'all') {
//     query = {}
//   } else if (req.query.program) {
//     query = { program: req.query.program }
//   }

//   if (req.query.type == 'client') {
//     // console.error('HERE')
//     query = { client: { $ne: null } }
//   }
//   if (req.query.type == 'program') {
//     query = { program: { $ne: null } }
//   }
//   // console.error('QUERY:', query)
//   const workoutQuery = Workout.find(query).sort({ date: -1 });
//   let fetchedWorkouts;
//   if (pageSize && currentPage) {
//     workoutQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
//   }
//   workoutQuery
//     .then((documents) => {
//       fetchedWorkouts = documents;
//       return Workout.count();
//     })
//     .then((count) => {
//       res.status(200).json({
//         message: "Workouts fetched successfully!",
//         workouts: fetchedWorkouts,
//         maxWorkouts: count,
//       });
//     });
// });

router.post("/getWorkouts", (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let query = req.body
  if (query.workoutType == 'client') {
    query.client = { $ne: null }
    delete query.workoutType
  }
  if (query.workoutType == 'program') {
    query.program = { $ne: null }
    delete query.workoutType
  }
  if (query.workoutType == '') delete query.workoutType
  if (query.client == '') delete query.client
  if (query.program == '') delete query.program
  // console.error('body', query)
  query.personalWorkout = false
  console.error(query)
  // return

  const workoutQuery = Workout.find(query).sort({ date: -1 }).populate({ path: 'client' });
  let fetchedWorkouts;
  if (pageSize && currentPage) {
    workoutQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  workoutQuery.then((documents) => {
    fetchedWorkouts = documents;
    return Workout.countDocuments(query);
  }).then((count) => {
    res.status(200).json({
      message: "Workouts fetched successfully!",
      workouts: fetchedWorkouts,
      maxWorkouts: count,
    });
  });
});


router.get("/:id", async (req, res, next) => {

  let workout = await Workout.findById(req.params.id).populate({ path: 'creator' }).lean()

  let Fav = await FavWorkout.find({ user:req.query.clientId, workout: req.params.id})

  if(Fav.length){
    // console.error(Fav)
    workout.favorite = true
  }

  if (workout && workout.workoutItems) {
    // getresults(workout)
    for (let item of workout.workoutItems) {
      item.workoutResult 
      let query = {
        client: req.query.clientId,
        workout: item._id
      }
     let workoutres = await WorkoutResults.find(query).lean()
      if(workoutres){
        item.workoutResults = workoutres

      }

    }
  }
  if (workout) {
    res.status(200).json(workout);
  } else {
    res.status(404).json({ message: "workout not found" });
  }
});

router.get("/favoriteWorkouts/:id", async (req,res,next)=> {
  let query = {
    client: req.params.id,
    favorite: true
  }

  let workout = await Workout.find(query)
  if (workout) {
    res.status(200).json(workout);
  } else {
    res.status(404).json({ message: "workout not found" });
  }
})

router.put("/addFavorite/:id", authUser, async (req,res,next)=> {
  console.error(req.body)

  const workout = await Workout.findByIdAndUpdate(req.params.id, {$set: {favorite: req.body.favorite }})

  if (workout) {
    res.status(200).json(workout);
  } else {
    res.status(404).json({ message: "workout not found" });
  }

})

router.get("/personalTrainingWorkouts/:id", (req, res, next) => {
  // console.error(req.params)

  let query = {
    client: req.params.id,
    date: {
      "$gte": req.query.dateStart,
      "$lt": req.query.dateEnd
    }
  }
  if (!req.query.dateStart && !req.query.dateEnd) {
    delete query.date
  }

  Workout.find(query).then((workout) => {
    if (workout) {
      res.status(200).json(workout);
    } else {
      res.status(404).json({ message: "workout not found" });
    }
  });
});

router.get("/myWorkouts/:id", (req, res, next) => {
  // console.error(req.query)
  let query = {
    creator: req.params.id,
    personalWorkout: '1',
    date: {

      "$gte": req.query.dateStart,
      "$lt": req.query.dateEnd
    }
  }
  if (!req.query.dateStart && !req.query.dateEnd) {
    delete query.date
  }
  // return
  Workout.find(query).sort({ date: -1 }).then((workout) => {
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
  Workout.find({ program: req.params.id }).sort({ date: -1 }).then((workout) => {
    if (workout) {
      res.status(200).json(workout);
    } else {
      res.status(404).json({ message: "workout not found" });
    }
  });
});

router.put("/clientComment/:id", (req, res, next) => {
  // console.error(req.body)
  // console.error(req.params)
  Workout.updateOne(
    { "workoutItems._id": req.params.id },
    {
      $push:
        { "workoutItems.$.clientComments": req.body }
    }
  ).then(res => {
    // console.error(res)
  })

  // work.save().then(res=> {
  //   console.error(res)
  // })
})

router.delete("/:id", authUser, (req, res, next) => {
  Workout.deleteOne({ _id: req.params.id, }).then((result) => {

    // console.error(result)
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion Successful" });
    } else {
      res.status(401).json({ message: "Not Authorized" });
    }
  });
});

module.exports = router;
