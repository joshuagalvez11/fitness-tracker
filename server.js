const express = require("express");
let mongoose = require("mongoose");
let db = require("./models/");
let path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.get("/api/workouts", function(req, res) {
    db.Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: "$exercises.duration"}
        }
    }])
        .then(dbWorkout => {
            res.json(dbWorkout)
        })
        .catch(err => {
            res.json(err);
          });
});

app.get("/api/workouts/range", function(req, res) {
    db.Workout.aggregate([{
        $addFields: {
            totalDuration: {$sum: "$exercises.duration"}
        }
    }]).limit(7)
        .then(dbWorkout => {
            res.json(dbWorkout)
        })
        .catch(err => {
            res.json(err);
          });
});


app.put("/api/workouts/:id", (req, res) => {
    
      db.Workout.findOneAndUpdate(req.params.id, { $push: { exercises: req.body } }, { new: true })
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      });
  });

  app.post("/api/workouts/", (req, res) => { 
    db.Workout.create(req.body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/exercise", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});
app.get("/stats", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});



app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
  