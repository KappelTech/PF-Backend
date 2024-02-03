const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const workoutsRoutes = require("./routes/workouts");
const programRoutes = require("./routes/programs");
const workoutItemRoutes = require("./routes/workoutItems");
const passwordReset = require("./routes/passwordReset");
const reportRoutes = require("./routes/reports");
const favoriteWorkout = require("./routes/favoriteWorkouts");

const app = express();
const uri = "mongodb+srv://Brandon:kXUeDiNh3tl6zi6P@cluster0.titlm.mongodb.net/node-angular?retryWrites=true&w=majority"

mongoose
  .connect(
    uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex:true})
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Connection failed");
  });
// MONGO ATLAS PW: kXUeDiNh3tl6zi6P
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use( "/api/posts", postsRoutes)
app.use( "/api/user", userRoutes)
app.use( "/api/workouts", workoutsRoutes)
app.use( "/api/programs", programRoutes)
app.use( "/api/workoutItems", workoutItemRoutes)
app.use( "/api/passwordReset", passwordReset)
app.use( "/api/reports", reportRoutes)
app.use( "/api/favoriteWorkouts", favoriteWorkout)


module.exports = app;
