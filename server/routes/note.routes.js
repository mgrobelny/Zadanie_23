import { Router } from 'express';
import * as NoteController from '../controllers/note.controller';

const router = new Router({ mergeParams: true });

// Add a new Note
router.route('/notes').post(NoteController.addNote);

// delete Note
router.route('/notes/:taskId').delete(NoteController.deleteNote);

// rename Note
router.route('/notes/:taskId').put(NoteController.renameNote);

export default router;
