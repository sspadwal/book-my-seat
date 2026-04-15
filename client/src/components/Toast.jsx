export function Toast({ message, type }) {
  if (!message) return null
  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="polite">
      <span className="toast__icon">{type === 'success' ? '✓' : '✕'}</span>
      <span>{message}</span>
    </div>
  )
}
