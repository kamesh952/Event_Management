import express from 'express';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Event Routes
router.post('/', authenticateUser, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', authenticateUser, updateEvent);
router.delete('/:id', authenticateUser, deleteEvent);

export default router;