const express = require("express");
const { authUser } = require("../middleware/check-auth")



const Workout = require("../models/workout");
const user = require("../models/user")


const router = express.Router();


router.get("/:id", (req, res, next) => {
    console.error(req.params.id)
    let query = {
        creator: req.params.id,
        personalWorkout: '1',
    }
    let fetchedWorkouts
    Workout.find(query).then((workouts) => {

        fetchedWorkouts = workouts

        return Workout.countDocuments(query)

    }).then((count) => {
        res.status(200).json({
            message: "Workout count fetched successfully!",
            workouts: fetchedWorkouts,
            workoutNumber: count,
        });
    })


})

module.exports = router;