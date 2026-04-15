export function AuthBox({ mode, setMode, form, onChange, onSubmit, loading }) {
  return (
    <div className="auth-wrapper">
      {/* Brand */}
      <div className="auth-brand">
        <div className="auth-brand__icon">🎬</div>
        <h1 className="auth-brand__title">Book My Ticket</h1>
        <p className="auth-brand__sub">Cinema seat booking made simple</p>
      </div>

      {/* Card */}
      <div className="auth-card">
        {/* Tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            id="tab-login"
            role="tab"
            type="button"
            aria-selected={mode === 'login'}
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            id="tab-register"
            role="tab"
            type="button"
            aria-selected={mode === 'register'}
            className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form id="auth-form" className="auth-form" onSubmit={onSubmit} noValidate>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="name" className="field__label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="field__input"
                value={form.name}
                onChange={onChange}
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email" className="field__label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="field__input"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
              autoComplete={mode === 'login' ? 'username' : 'email'}
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="field__label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="field__input"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading}
          >
            {loading
              ? 'Please wait…'
              : mode === 'login'
              ? '→ Login'
              : '→ Create Account'}
          </button>
        </form>

        {/* Switch link */}
        <p className="auth-switch">
          {mode === 'login' ? (
            <>Don&apos;t have an account?{' '}
              <button type="button" id="switch-to-register" className="auth-switch__link" onClick={() => setMode('register')}>
                Register
              </button>
            </>
          ) : (
            <>Already registered?{' '}
              <button type="button" id="switch-to-login" className="auth-switch__link" onClick={() => setMode('login')}>
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
