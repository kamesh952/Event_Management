import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { createBooking, getUserBookings, deleteBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', authenticateUser, createBooking);
router.get('/', authenticateUser, getUserBookings);
router.delete('/:bookingId', authenticateUser, deleteBooking);

export default router;
