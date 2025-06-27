import { useEffect, useState, useRef } from 'react';
import { Fab, Zoom } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Note from './Note';

export default function NotesModule() {

const addUrl = "http://localhost:3000/api/create";
const editUrl = "http://localhost:3000/api/edit";
const listUrl = "http://localhost:3000/api/list";
const deleteUrl = "http://localhost:3000/api/delete";


const [note, setNote] = useState({
    title: "",
    content: "",
  });

const [notes, setNotes] = useState([]);
const notesRef = useRef([]);

const [isEditing, setEditing] = useState(false);

var editingIdRef = useRef(null);
var editingTitleRef = useRef(null);
var editingContentRef = useRef(null);

const [isExpanded, setExpanded] = useState(false);

useEffect(() => {
    let ignore = false;
    const syncNotes = async () => {
        try {
        const response = await fetch(listUrl);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const currentNoteList = await response.json();
        if (!ignore) {
          setNotes(currentNoteList);
          notesRef.current = currentNoteList;
        };

      } catch (err) {
        console.error(err.message);
      }
    };
    syncNotes();

    return () => {
      ignore = true;
    };
}, []);


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


function openEditNote(id, title, content) { 
  editingIdRef.current = id;
  editingTitleRef.current = title;
  editingContentRef.current = content;
  setEditing(!isEditing);
  setExpanded(true);
  setNote({
    id: id,
    title: title,
    content: content,
  });
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

  notesRef.current = notes.map((note) => {
    if (note.id === editedNote.id) {
      return editedNote;
    } else {
      return note;
    }
  });

   setEditing(!isEditing);

   setNotes(notes.map((note) => {
    if (note.id === editedNote.id) {
      return editedNote;
    } else {
      return note;
    }
   }));
}

function findNextId() {
  const idList = notes.map((note) => note.id);
  const lastId = idList.toSorted().pop();
  const nextId = lastId + 1;
  return nextId;
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

function handleNoteFieldChange(event) {
    const { name, value } = event.target;
    let noteId = isEditing ? editingIdRef.current : findNextId();
    setNote((prevNote) =>  {
      return {
      ...prevNote,
      id: noteId,
      [name]: value,
    }
  });
};

function handleCancel(event) {
  setEditing(!isEditing);
  setExpanded(false);
  setNote({
    title: "",
    content: "",
  });
};

function handleSave(event) {
  const editedNote = note;
  console.log(editedNote);
  saveEditedNote(editedNote);
  setNote({
      title: "",
      content: "",
    });
}

function handleAddNoteSubmit(event) {
    addNote(note);
    setNote({
      title: "",
      content: "",
    });
  }

return (
  <>
    <section id="create-note-area">
      <form className="create-note" onMouseLeave={!isEditing ? () => setExpanded(!isExpanded): null}>
        {isExpanded ? (
          <input
            name="title"
            onChange={handleNoteFieldChange}
            value={note.title}
            placeholder="Title"
          />
        ) : null}
        <textarea
          onClick={!isEditing ? () => setExpanded(!isExpanded) : null}
          name="content"
          onChange={handleNoteFieldChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? "3" : "1"}
        />
        <input type="hidden" name="id" value={isEditing ? editingIdRef.current : "0"} />
        <div className="buttons">
        { !isEditing ? ( 
          <Zoom in={isExpanded}>
          <Fab onClick={handleAddNoteSubmit}>
            <AddIcon />
          </Fab>
        </Zoom>
          )
        : (
        <>
        <Zoom in={isEditing}>
          <Fab onClick={handleSave}>
            <SaveIcon />
          </Fab>
        </Zoom>
        <Zoom in={isEditing}>
          <Fab onClick={handleCancel}>
            <CancelIcon />
          </Fab>
        </Zoom>
        </>) 
          }
        </div>
      </form>
    </section>
  <section id="notes-area" className="notes-container">
        {notes.map((noteItem) => {
          return (
            <Note
              key={noteItem.id}
              id={noteItem.id}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={deleteNote}
              onEdit={openEditNote}
            />
          );
        })}
      </section>
  </>
  
    );
};