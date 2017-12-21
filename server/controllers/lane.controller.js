import Lane from '../models/lane';
import Note from '../models/note';
import uuid from 'uuid';

export function addLane(req, res) {
  if (!req.body.name) {
    res.status(403).end();
  }

  const newLane = new Lane(req.body);

  newLane.notes = [];

  newLane.id = uuid();
  newLane.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json( saved );
  });
};

export function getLanes(req, res) {
  Lane.find().exec((err, lanes) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ lanes });
  });
};

export function renameLane(req, res) {
  Lane.findOne({ id: req.params.laneId}).exec((err, lane) => {
    if (err) {
      res.status(500).send(err);
    }
    lane.set({ name: req.body.name });
    lane.save(() => {
      res.status(200).end();
    });
  });
}

export function editLane(req, res) {
  const lane = req.body;
  if(!lane.id ) {
    res.status(403).end();
  }
  Lane.findOneAndUpdate({id: lane.id}, lane, {new: true}, (err, updated) => {
    if(err) {
      res.status(500).send(err);
    }
    res.json(updated);
  })
}

export function deleteLane(req, res) {
  Lane.findOne({ id: req.params.laneId }).exec((err, lane) => {
    if (err) {
      res.status(500).send(err);
    }

    lane.notes.forEach(noteId => {
      Note.findOne({ _id: noteId }).exec((err, note) => {
        if (err) {
          res.status(500).send(err);
        }
        note.remove();
      });
    });

    lane.remove(() => {
      res.status(200).end();
    });
  });
}