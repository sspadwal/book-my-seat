import { useState } from 'react'
import { loginUser, registerUser } from '../api'

const initialForm = { name: '', email: '', password: '' }

export function useAuth() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(() => localStorage.getItem('accessToken') || '')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      const data = await loginUser({ email: form.email, password: form.password })
      const { accessToken, user: u } = data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(u))
      setToken(accessToken)
      setUser(u)
      setForm(initialForm)
      return { success: true, message: `Welcome back, ${u.name || u.email}! Loading seats…` }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    try {
      const data = await registerUser({ name: form.name, email: form.email, password: form.password })
      setMode('login')
      setForm(initialForm)
      return { success: true, message: `Account created for ${data.data.name}. Please log in.` }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
    setForm(initialForm)
  }

  return {
    mode, setMode,
    form, handleChange,
    loading,
    token, user,
    handleLogin, handleRegister, handleLogout,
  }
}
