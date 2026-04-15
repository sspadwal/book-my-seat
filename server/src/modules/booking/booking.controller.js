import * as bookingService from './booking.service.js'
import ApiResponse from '../../common/utils/api-responses.js'

const bookings = async (req, res, next) => {
    try {
        const seatId = req.params.id;
        const userId = req.user.id;
        console.log("Booking seat:", seatId, "for user:", userId);
        const result = await bookingService.bookSeat(seatId, userId);
        ApiResponse.ok(res, "Seat booked successfully", result);
    } catch (error) {
        next(error);
    }
}

const seats = async (req, res, next) => {
    try {
        const allSeats = await bookingService.getSeats();
        ApiResponse.ok(res, "Seats fetched successfully", allSeats);
    } catch (error) {
        next(error);
    }
}
export { bookings, seats }