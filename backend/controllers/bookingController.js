import db from '../models/index.js';

const { Booking, User, Event } = db;

// Create Booking
export const createBooking = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const booking = await Booking.create({ userId, eventId });
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Bookings by User
export const getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.findAll({
      where: { userId },
      include: [Event],
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Booking
export const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the booking exists and belongs to the user
    const booking = await Booking.findOne({ where: { id: bookingId, userId } });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Delete the booking
    await Booking.destroy({ where: { id: bookingId, userId } });

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

