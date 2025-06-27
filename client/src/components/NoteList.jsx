import { useEffect, useState, useRef } from 'react';
import Note from './Note';

function NoteList(props) {

const listUrl = "http://localhost:3000/api/list";
const deleteUrl = "http://localhost:3000/api/delete";

const [notes, setNotes] = useState([]);
const notesRef = useRef([]);

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

function handleDelete(event) {
    props.onDelete(props.id);
};

function handleEdit(event) {
  props.onEdit(props.id, props.title, props.content);
}

return (
    <section className="note-container">
        {notes.map((noteItem) => {
          return (
            <Note
              key={noteItem.id}
              id={noteItem.id}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          );
        })}
      </section>
)

};

export default NoteList;