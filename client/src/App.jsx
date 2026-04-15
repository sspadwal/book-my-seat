import { useState, useCallback } from 'react'
import './App.css'
import { AuthBox } from './components/AuthBox'
import { DashboardHeader } from './components/DashboardHeader'
import { SeatGrid } from './components/SeatGrid'
import { Toast } from './components/Toast'
import { useAuth } from './hooks/useAuth'
import { useSeats } from './hooks/useSeats'

function App() {
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type })
    const timer = setTimeout(() => setToast({ message: '', type: 'success' }), 4000)
    return () => clearTimeout(timer)
  }, [])

  const {
    mode, setMode,
    form, handleChange,
    loading: authLoading,
    token, user,
    handleLogin, handleRegister, handleLogout,
  } = useAuth()

  const {
    seats, loading: seatsLoading,
    loadSeats, handleBook,
  } = useSeats(token)

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    const result = mode === 'login'
      ? await handleLogin()
      : await handleRegister()
    notify(result.message, result.success ? 'success' : 'error')
  }

  const handleBookSeat = async (seatId) => {
    const result = await handleBook(seatId)
    notify(result.message, result.success ? 'success' : 'error')
  }

  const handleRefresh = async () => {
    const result = await loadSeats()
    if (result && !result.success) notify(result.message, 'error')
  }

  const onLogout = () => {
    handleLogout()
    notify('Logged out successfully.', 'success')
  }

  return (
    <div className="app-shell">
      <Toast message={toast.message} type={toast.type} />

      {!user ? (
        <AuthBox
          mode={mode}
          setMode={setMode}
          form={form}
          onChange={handleChange}
          onSubmit={handleAuthSubmit}
          loading={authLoading}
        />
      ) : (
        <div className="dashboard">
          <DashboardHeader user={user} onLogout={onLogout} />
          <SeatGrid
            seats={seats}
            userId={user?.id}
            onBook={handleBookSeat}
            onRefresh={handleRefresh}
            loading={seatsLoading}
          />
        </div>
      )}
    </div>
  )
}

export default App
