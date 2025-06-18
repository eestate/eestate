

    import Booking from '../models/Booking.js'
    import  {Property}  from '../models/Property.js';
    export const createBooking = async (req, res) => {
    try {
        console.log('Booking request body:', req.body);
        const { userId, agentId,propertyId, name, email, phone, message, date, time } = req.body;
        const booking = new Booking({
        userId,
        agentId,
        propertyId,
        name,
        email,
        phone,
        message,
        date,
        time,
        });
        await booking.save();
        res.status(201).json({ message: 'Booking scheduled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling booking', error: error.message });
    }
    };

    export const getAgentBookings = async (req, res) => {
    try {
        const { agentId } = req.params;
        const bookings = await Booking.find({ agentId }).populate('userId', 'name email').populate('propertyId','name address price propertyType');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
    };


export const updateBookingStatus = async (req, res) => {
  try {
    console.log('Handling PATCH /bookings/:id/status', req.params, req.body); 
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (booking.agentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        _id: booking._id,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error.message);
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};
