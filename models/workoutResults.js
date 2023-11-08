const mongoose = require('mongoose');

const wokroutResultsSchema = mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workout: { type: mongoose.Schema.Types.ObjectId, ref:"Workout"},
    date: { type: Date, },
    comment: { type: String },
});

module.exports = mongoose.model('WorkoutResults', wokroutResultsSchema);
