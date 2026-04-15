import { SeatCard } from './SeatCard'

export function SeatGrid({ seats, userId, onBook, onRefresh, loading }) {
  const available = seats.filter((s) => !s.is_booked).length
  const booked = seats.filter((s) => s.is_booked).length

  return (
    <section className="seat-section" aria-label="Seat Map">
      <div className="seat-section__header">
        <div>
          <h2 className="seat-section__title">Seat Map</h2>
          <p className="seat-section__sub">
            <span className="pill pill--green">{available} available</span>
            <span className="pill pill--red">{booked} booked</span>
            <span className="pill pill--grey">{seats.length} total</span>
          </p>
        </div>
        <button
          id="refresh-seats-btn"
          className="btn btn--outline"
          onClick={onRefresh}
          disabled={loading}
          type="button"
        >
          {loading ? '⟳ Loading…' : '↻ Refresh'}
        </button>
      </div>

      {loading && seats.length === 0 ? (
        <div className="seat-section__loading">
          <div className="spinner" aria-label="Loading seats" />
          <p>Loading seat map…</p>
        </div>
      ) : seats.length === 0 ? (
        <div className="seat-section__empty">
          <p>🪑 No seats found. Please seed the database first.</p>
        </div>
      ) : (
        <div className="seat-grid" role="list">
          {seats
            .slice()
            .sort((a, b) => a.seat_id - b.seat_id)
            .map((seat) => (
              <div key={seat.seat_id} role="listitem">
                <SeatCard
                  seat={seat}
                  userId={userId}
                  onBook={onBook}
                  disabled={loading}
                />
              </div>
            ))}
        </div>
      )}
    </section>
  )
}
