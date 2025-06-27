import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NoteList from "./components/NotesModule";
import CreateArea from "./components/CreateArea";
import EditArea from './components/EditArea';

function App() {

  const addUrl = "http://localhost:3000/api/create";
  const editUrl = "http://localhost:3000/api/edit";

  const [isEditing, setEditing] = useState(false);

  const [notes, setNotes] = useState(NoteList.notes)
  const notesRef = useRef(notes);
  var editingIdRef = useRef(null);
  var editingTitleRef = useRef(null);
  var editingContentRef = useRef(null);

function addNote(newNote) {
    console.log(newNote);
    const addNotes = async () => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const body = JSON.stringify(newNote);
        const req = new Request(addUrl, {
            method: "POST",
            body: body,
            headers: headers
        });
        console.log(req);

        try {
        const addResponse = await fetch(req);
          if (!addResponse.ok) {
            throw new Error(`Response status: ${addResponse.status}`);
          }
       } catch (err) {
          console.error(err.message);
        }
      };
      
      addNotes();
      notesRef.current.push(newNote);
      
      setNotes(prevNotes => {
        return [...prevNotes, newNote];
      });
  };

function findNextId() {
  const idList = notes.map((note) => note.id);
  const lastId = idList.toSorted().pop();
  const nextId = lastId + 1;
  return nextId;
};

function openEditArea(id, title, content) { 
  editingIdRef.current = id;
  editingTitleRef.current = title;
  editingContentRef.current = content;
  console.log("Edited post id: " + id + ", title: " + title + ", content: " + content);
  setEditing(!isEditing);
}


function saveEditedNote(editedNote) {
  console.log(editedNote);

  const editDbCopy = async () => {
    const body = JSON.stringify(editedNote)
    console.log(body);
    const headers = new Headers();
      headers.append("Content-Type", "application/json");
    const req = new Request(editUrl, {
      method: "PATCH",
      body: body,
      headers: headers
    });

    try {
      const editResponse = await fetch(req);
        if (!editResponse.ok) {
          throw new Error(`Response status: ${editResponse.status}`);
        }
        console.log("success");
    } catch (err) {
      console.log(err.message);
    }
  };
    editDbCopy();
    setEditing(!isEditing);

    setNotes(prevNotes => {
      return [
        ...prevNotes, editedNote
      ]
    });
  };

  function deleteNote(id) {
    const permaDelete = async () => {
      const req = new Request(`${deleteUrl}/${id}`, {
        method: "DELETE"
      })
      try {
        const res = await fetch(req);
        if (!res.ok) {
          throw new Error (`Response status: ${res.status}`);
        }
      } catch (err) {
        console.log(err.message);
      }
    } 
    permaDelete();

    notesRef.current.filter((note) => {
      return note.id !== id;
    });

   setNotes(prevNotes => {
        return prevNotes.filter((note) => {
          return note.id !== id;
        });
      });
  }


  return (
    <>
      <Header />
      <CreateArea onAdd={addNote} nextId={findNextId} />
      <NoteList onEdit={openEditArea} onDelete={deleteNote} />
      <EditArea
        noteId={editingIdRef.current}
        currentTitle={editingTitleRef.current}
        currentContent={editingContentRef.current}
        clicked={isEditing}
        onSave={saveEditedNote}
      />
      <Footer />
    </>
  );
};

export default App;