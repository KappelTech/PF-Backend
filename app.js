const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const workoutsRoutes = require("./routes/workouts");
const programRoutes = require("./routes/programs");
const workoutItemRoutes = require("./routes/workoutItems");

const app = express();

mongoose
  .connect(
    "mongodb+srv://Brandon:kXUeDiNh3tl6zi6P@cluster0.titlm.mongodb.net/node-angular?retryWrites=true&w=majority"
  , {useNewUrlParser: true, useUnifiedTopology: true})
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


module.exports = app;
