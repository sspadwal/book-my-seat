import { useCallback, useEffect, useState } from 'react'
import { bookSeat, fetchSeats } from '../api'

export function useSeats(token) {
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(false)

  const loadSeats = useCallback(async () => {
    if (!token) return { success: false, message: 'Not authenticated' }
    setLoading(true)
    try {
      const data = await fetchSeats(token)
      // backend returns { success, message, data: [...] }
      // handle both shapes defensively
      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : []
      setSeats(rows)
      return { success: true, message: `Loaded ${rows.length} seats` }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) loadSeats()
    else setSeats([])
  }, [token, loadSeats])

  const handleBook = async (seatId) => {
    setLoading(true)
    try {
      const data = await bookSeat(seatId, token)
      // bookSeat returns { success, message, data: seat }
      const bookedSeat = data?.data ?? data
      setSeats((prev) =>
        prev.map((s) =>
          s.seat_id === bookedSeat.seat_id ? { ...s, ...bookedSeat } : s
        )
      )
      return { success: true, message: `🎉 Seat ${bookedSeat.seat_id} booked successfully!` }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  return { seats, loading, loadSeats, handleBook }
}
