const API_BASE = '/api'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}

export const loginUser = (payload) => request('/auth/login', { method: 'POST', body: payload })
export const registerUser = (payload) => request('/auth/register', { method: 'POST', body: payload })
export const fetchSeats = (token) => request('/bookings/seats', { method: 'GET', token })
export const bookSeat = (seatId, token) => request(`/bookings/${seatId}`, { method: 'POST', token })
