import Note from '../models/note';
import Lane from '../models/lane';
import uuid from "uuid";

export function addNote(req, res) {
  const { note, laneId } = req.body;

  if (!req.body.task) {
    res.status(400).end();
  }

  const newNote = new Note(req.body);

  newNote.id = uuid();
  newNote.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    Lane.findOne({ id: req.params.laneId })
      .then(lane => {
        lane.notes.push(saved);
        return lane.save();
      })
      .then(() => {
        res.json(saved);
      });
  });
}

export function renameNote(req, res) {
  Note.findOne({ id: req.params.taskId }).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }
    note.set({ task: req.body.task });
    note.save(() => {
      res.status(200).end();
    });
  });
}

export function editNote(req, res)  {
  const note = req.body;
  if(!note.id || !note.task) {
    res.status(403).end();
  }
  Note.findOneAndUpdate({id: note.id}, note, {new: true}, (err, updated) => {
    if(err) {
      res.status(500).send(err);
    }
    res.json(updated);
  })
}

export function deleteNote(req, res) {
  Note.findOne({ id: req.params.taskId }).exec((err, note) => {
    if (err) {
      res.status(500).send(err);
    }

    note.remove(() => {
      res.status(200).end();
    });
  });
}