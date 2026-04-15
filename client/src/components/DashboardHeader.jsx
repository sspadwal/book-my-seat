export function DashboardHeader({ user, onLogout }) {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] || '?').toUpperCase()

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__left">
        <div className="avatar" aria-hidden="true">{initials}</div>
        <div>
          <p className="dashboard-header__title">
            <span>{user?.name || user?.email}</span>
          </p>
          <p className="dashboard-header__sub">{user?.email}</p>
        </div>
      </div>
      <button
        id="logout-btn"
        className="btn btn--outline"
        onClick={onLogout}
        type="button"
      >
        Logout
      </button>
    </header>
  )
}
