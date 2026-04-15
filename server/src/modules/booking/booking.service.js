import { pool } from "../../common/config/db.js";
import ApiError from "../../common/utils/api-errors.js";

const getSeats = async () => {
    const result = await pool.query("SELECT * FROM myapp.bookings ORDER BY seat_id ASC");
    return result.rows;
};

const bookSeat = async (seatId, userId) => {
    const conn = await pool.connect();
    try {
        await conn.query("BEGIN");
        
        // Lock the row by seat_id so users select by the actual seat number
        const sql = "SELECT * FROM myapp.bookings WHERE seat_id = $1 AND is_booked = false FOR UPDATE";
        const result = await conn.query(sql, [seatId]);

        if (result.rowCount === 0) {
            await conn.query("ROLLBACK");
            throw ApiError.conflict("Seat already booked");
        }

        const sqlU = "UPDATE myapp.bookings SET is_booked = true, user_id = $2 WHERE seat_id = $1 RETURNING *";
        const updateResult = await conn.query(sqlU, [seatId, userId]);

        await conn.query("COMMIT");
        return updateResult.rows[0];
    } catch (error) {
        await conn.query("ROLLBACK");
        throw error;
    } finally {
        conn.release();
    }
};

export { getSeats, bookSeat };
