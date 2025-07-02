import { Router } from 'express';
const router = Router();
import { createNote, getNotes, getNote, updateNote, deleteNote } from '../controllers/noteController.js';

// Create a note
router.post('/', createNote);

// Get all notes
router.get('/', getNotes);

// Get a single note
router.get('/:id', getNote);

// Update a note
router.put('/:id', updateNote);

// Delete a note
router.delete('/:id', deleteNote);

export default router; 