import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from '@mui/icons-material/EditNote';

function Note({ id, title, content, onDelete, onEdit }) {

function handleDelete(event) {
  event.preventDefault();
  onDelete(id);
}

function handleEdit(event) {
  event.preventDefault();
  onEdit(id, title, content);
}

  return (
    <div className="note" id={id}>
      <h1 id="title">{title}</h1>
      <p id="content">{content}</p>
      <form className="buttons">
        <button id="editNoteButton" onClick={(event) => handleEdit(event)}>
           <EditNoteIcon />
        </button>
        <button id="deleteNoteButton" onClick={(event) => handleDelete(event)}>
          <DeleteForeverIcon />
        </button>
      </form>
    </div>
  );
};

export default Note;
