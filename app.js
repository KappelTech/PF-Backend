require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const workoutsRoutes = require("./routes/workouts");
const programRoutes = require("./routes/programs");
const workoutItemRoutes = require("./routes/workoutItems");
const passwordReset = require("./routes/passwordReset");
const reportRoutes = require("./routes/reports");
const favoriteWorkout = require("./routes/favoriteWorkouts");

const app = express();
const uri = mongoURI = `mongodb+srv://Brandon:kXUeDiNh3tl6zi6P@cluster0.titlm.mongodb.net/node-angular?retryWrites=true&w=majority`;
console.log(uri);
mongoose
  .connect(
    uri, {
      tls: true
    })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((e) => {
    console.log("Connection failed", e);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization, skiploading"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use( "/api/posts", postsRoutes)
app.use( "/api/user", userRoutes)
app.use( "/api/auth", authRoutes)
app.use( "/api/workouts", workoutsRoutes)
app.use( "/api/programs", programRoutes)
app.use( "/api/workoutItems", workoutItemRoutes)
app.use( "/api/passwordReset", passwordReset)
app.use( "/api/reports", reportRoutes)
app.use( "/api/favoriteWorkouts", favoriteWorkout)


module.exports = app;
