import express from "express";
import pg from "pg";
import env from "dotenv";
import cors from "cors";

const app = express();
const port = 3000;

env.config();

app.use(cors());
app.use(express.json("application/json"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

var corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  headers: 'Content-Type, Access-Control-Allow-Headers',
}

app.get("/api/list", cors(corsOptions), async (req, res) => {
  try {
    const listResults = await db.query("select * from keeper");
    console.log(listResults.rows);
    res.json(listResults.rows);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/create", cors(corsOptions), async (req, res) => {
  console.log(req.body);
  if (req.body) {
    const note = req.body;
    try {
      const query = await db.query("insert into keeper (title, content) values ($1, $2)", [note.title, note.content]);
      return res.status(200);
    } catch (err) {
      console.log(err);
    }
  }
  else {
    console.log("Form Submission Error: Empty body");
    return res.status(400).send("Bad Request");
    
  }
});

app.patch("/api/edit/", cors(corsOptions), async (req, res) => {
  if (req.body) {
    console.log(req.body);
    const editedNote = req.body;
    try {
      const query = await db.query("update keeper set title = $2, content = $3 where id = $1", [editedNote.id, editedNote.title, editedNote.content]);
      return res.status(200);
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log("Form Submission Error: Empty body");
    return res.status(400).send("Bad Request");
    
  }
})

app.delete("/api/delete/:id", cors(corsOptions), async (req, res) => {
  console.log (req.params.id);
  const id = parseInt(req.params.id);
  try {
      const query = await db.query("delete from keeper where id = $1", [id]);
      return res.status(200);
  } catch (err) {
    console.log(err.message);
  };
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});