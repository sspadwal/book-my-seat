export function SeatCard({ seat, userId, onBook, disabled }) {
  const isBooked = seat.is_booked
  const isOwned  = isBooked && String(seat.user_id) === String(userId)

  const statusClass  = isOwned ? 'owned' : isBooked ? 'booked' : 'available'
  const statusLabel  = isOwned ? 'Your seat' : isBooked ? 'Booked' : 'Available'

  return (
    <div className={`seat-card seat-card--${statusClass}`}>
      <strong className="seat-card__number">#{seat.seat_id}</strong>
      <span className={`seat-card__status`}>{statusLabel}</span>
      <button
        id={`book-seat-${seat.seat_id}`}
        className={`btn ${isBooked ? 'btn--ghost' : 'btn--primary'} seat-card__btn`}
        disabled={isBooked || disabled}
        onClick={() => onBook(seat.seat_id)}
        type="button"
      >
        {isBooked ? 'Taken' : 'Book'}
      </button>
    </div>
  )
}
