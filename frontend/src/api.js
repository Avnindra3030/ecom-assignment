import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const client = axios.create({ baseURL: API })

export function setAuth(token) {
  if (token) client.defaults.headers.common['Authorization'] = 'Bearer ' + token
  else delete client.defaults.headers.common['Authorization']
}
