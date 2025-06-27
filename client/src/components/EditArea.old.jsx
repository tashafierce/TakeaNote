import { useState } from 'react';
import { Fab, Zoom } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

function EditArea({ noteId, currentTitle, currentContent, clicked, onSave }) {

const [note, setNote] = useState({
  title: "",
  content: "",
});

function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) =>  {
      return {
      ...prevNote,
      id: noteId,
      [name]: value,
    }
  });
};

function handleSave(event) {
  const editedNote = note;
  console.log(editedNote);
  onSave(editedNote);
  setNote({
      title: "",
      content: "",
    });
}
    return (
      <section id="edit-form">
              <div
          className={
            clicked
              ? "edit-container"
              : "edit-container hidden"
          }
        >
            <form className="edit-note">
            <input
              name="title"
              onChange={handleChange}
              placeholder={currentTitle} value={note.title}
            />
            <textarea
              name="content"
              onChange={handleChange}
              rows="3" placeholder={currentContent} value={note.content} />
            <input type="hidden" name="id" value={clicked ? noteId : 0} />
            <Zoom in="true">
              <Fab onClick={handleSave}>
                <SaveIcon />
              </Fab>
            </Zoom>
          </form>
        </div>
      </section>
    );
};

export default EditArea;