import React, { useState } from "react";
import { Fab, Zoom } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const [isExpanded, setExpanded] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        id: props.nextId(),
        [name]: value,
      };
    });
  };

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      title: "",
      content: "",
    });
  }

  return (
    <div onMouseLeave={() => setExpanded(!isExpanded)}>
      <form className="create-note">
        {isExpanded ? (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        ) : null}
        <textarea
          onClick={() => setExpanded(!isExpanded)}
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? "3" : "1"}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
