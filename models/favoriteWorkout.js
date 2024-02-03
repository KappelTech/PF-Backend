const mongoose = require('mongoose');

const favoriteWorkout = mongoose.Schema({
  workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   
});

module.exports = mongoose.model('FavoriteWorkout', favoriteWorkout);