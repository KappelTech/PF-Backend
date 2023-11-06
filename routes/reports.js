const express = require("express");
const { authUser } = require("../middleware/check-auth")



const Workout = require("../models/workout");
const user = require("../models/user")


const router = express.Router();


router.get("/:id", (req, res, next) => {
    // console.error(req)
    let query = {
        creator: req.params.id,
        personalWorkout: '1',
    }
let q = {
    $or:[
       
        {client: req.params.id},
        {$and:[
            {creator: req.params.id},
            {personalWorkout: '1'},
        ]}
    ],
   
}

    let fetchedWorkouts
    Workout.find(q).then((workouts) => {

        fetchedWorkouts = workouts

        return Workout.countDocuments(q)

    }).then((count) => {
        res.status(200).json({
            message: "Workout count fetched successfully!",
            workouts: fetchedWorkouts,
            workoutNumber: count,
        });
    })


})

module.exports = router;