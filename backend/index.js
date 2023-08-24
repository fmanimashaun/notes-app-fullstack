require('dotenv').config()
const express = require('express');
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');
const Note = require('./models/note')



const reqLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(express.static('build'));
app.use(express.json());
app.use(reqLogger);
app.use(cors());


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
});

app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (body.content === undefined) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then((note) => {
    res.json(note);
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);

  const updatedNote = req.body;

  const note = notes.find((n) => n.id === id);

  if (note) {
    notes = notes.map((note) => (note.id === id ? updatedNote : note));
    res.json(updatedNote);
  } else {
    res.status(404).end();
  }
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
