import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);

  //const url = "https://keeper99.herokuapp.com"

  const url = "http://localhost:3008";

  useEffect(()=>{
    axios.get(url+'/notes')
    .then(function (response) {
      //console.log(response.data)
      setNotes(response.data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

    //console.log("here");
  },[count]);
  

  function addNote(newNote) {
    axios({
      method: 'post',
      url: url + '/notes',
      data: newNote
    })
    axios.get(url + '/notes')
    .then(function (response) {
      //console.log(response.data)
      setNotes(response.data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    setCount(count+1)

  };

  function deleteNote(id) {
    axios.delete(url+ '/notes/'+id)
    axios.get(url+'/notes')
    .then(function (response) {
      setNotes(response.data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    setCount(count-1)
  };
  console.log(notes);
  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {  
      notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            uid={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        )
      }) 
    }
    
    <Footer />
    </div>
  );
}

export default App;
