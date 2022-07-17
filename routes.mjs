import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors  from "cors";
import path from "path"
//import ejs from "ejs";
import uri from "./uri.mjs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get("/",cors(), function(req, res) {
    res.sendFile(path.join(__dirname, "frontend/build/index.html"));
  });
}

else {
  app.use(express.static(path.join(__dirname, 'frontend/public')));
  app.get("/",cors(), function(req, res) {
    res.sendFile(path.join(__dirname, "frontend/public/index.html"));
  });
}


app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

// const publicPath = path.join(__dirname, "public")
// app.use(express.static(publicPath))


mongoose.connect(uri,
 {useNewUrlParser: true})

// const db = mongoose.connection;

const noteSchema = new mongoose.Schema({
    title: String,
    content: String
  });
  
  const Note = mongoose.model("Note", noteSchema);


//// rest getALL, delALL, createONE, put, patch , del one


///////////////////////////////////Requests Targetting all Notes////////////////////////


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.options("*", cors({ origin: "https://sticknotes99.herokuapp.com", optionsSuccessStatus: 200 }));
  
app.use(cors({ origin:  "https://sticknotes99.herokuapp.com", optionsSuccessStatus: 200 }));

app.route("/notes")

/*eslint-disable */ /// disable for find() conflict with array method

.get(function(req, res){
  Note.find(function(err, foundNotes){
    if (!err) {
      //console.log(foundNotes);
      res.send(foundNotes);
    } else {
      res.send(err);
    }
  });
})

/*eslint-enable */

.post(function(req, res){
  //console.log(req.body);
  //console.log("post recieved");
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content
  });

  newNote.save(function(err){
    if (!err){
      res.send("Successfully added a new note.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Note.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all notes.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Note////////////////////////

app.route("/notes/:noteTitle")

.get(function(req, res){

  Note.findOne({title: req.params.noteTitle}, function(err, foundNote){
    if (foundNote) {
      res.send(foundNote);
    } else {
      res.send("No notes matching that title was found.");
    }
  });
})

.put(function(req, res){

  Note.update(
    {title: req.params.noteTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected note.");
      }
    }
  );
})

.patch(function(req, res){

  Note.update(
    {title: req.params.noteTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated note.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Note.deleteOne(
    {_id: req.params.noteTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding note.");
      } else {
        res.send(err);
      }
    }
  );
});


app.listen(process.env.PORT ||3008, function() {
  console.log("Server started on port 3008");
});



















// const { MongoClient, ServerApiVersion } = require('mongodb');
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("keeperDB").collection("notes");
//   // perform actions on the collection object
//   client.close();
// });
