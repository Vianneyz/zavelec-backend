import express from "express";
import cors from "cors";
import nano from "nano";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Connexion CouchDB
const couch = nano("http://admin:MonSuperMDP@51.75.200.14:5984");
const db = couch.db.use("zavelec");

// Route test
app.get("/", (req, res) => {
  res.send({ message: "Backend ZAVELEC OK 🚀" });
});

// Ajouter un patient
app.post("/patient", async (req, res) => {
  try {
    const response = await db.insert(req.body);
    res.send({ ok: true, id: response.id });
  } catch (err) {
    res.status(500).send({ ok: false, error: err.message });
  }
});

// Lister patients
app.get("/patients", async (req, res) => {
  try {
    const docs = await db.list({ include_docs: true });
    res.send(docs.rows.map(r => r.doc));
  } catch (err) {
    res.status(500).send({ ok: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
