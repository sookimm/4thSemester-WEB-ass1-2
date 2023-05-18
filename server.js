/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Sooyeon Kim      Student ID: 149385213     Date: May 19, 2023
 *  Cyclic Link: https://scary-bee-snaps.cyclic.app
 *
 ********************************************************************************/

const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./string.env" });

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

// Define the MongoDB connection string
const MONGODB_CONN_STRING = process.env.MONGODB_CONN_STRING;

// Initialize the database
db.initialize(MONGODB_CONN_STRING)
  .then(() => {
    // Define routes

    // Home route
    app.get("/", (req, res) => {
      res.json({ message: "API Listening" });
    });

    // Add movie
    app.post("/api/movies", (req, res) => {
      db.addNewMovie(req.body)
        .then((mov) => {
          res.status(201).json(mov);
        })
        .catch(() => {
          res.status(500).json({ message: "Fail: Cannot add new movie" });
        });
    });

    // Get movies
    app.get("/api/movies", (req, res) => {
      db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        .then((mov) => {
          res.json(mov);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    });

    // Get movie by ID
    app.get("/api/movies/:_id", (req, res) => {
      db.getMovieById(req.params._id)
        .then((mov) => {
          res.json(mov);
        })
        .catch(() => {
          res
            .status(500)
            .json({ message: `Fail: Cannot load movie ${req.params._id}` });
        });
    });

    // Update movie
    app.put("/api/movies/:_id", (req, res) => {
      db.updateMovieById(req.body, req.params._id)
        .then((mov) => {
          res.json({ message: `Success: Movie has been updated` });
        })
        .catch(() => {
          res
            .status(500)
            .json({ message: `Fail: Cannot update movie ${req.params._id}` });
        });
    });

    // Delete movie
    app.delete("/api/movies/:_id", (req, res) => {
      db.deleteMovieById(req.params._id)
        .then(() => {
          res.status(201).json({ message: `Movie has been deleted` });
        })
        .catch(() => {
          res
            .status(500)
            .json({ message: `Fail: Cannot delete movie ${req.params._id}` });
        });
    });

    // 404 route
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
