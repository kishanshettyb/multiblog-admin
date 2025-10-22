import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_LOGIN_URL!
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const adminLogin = async (payload: { email: string; password: string }) => {
  const response = await axiosInstance.post('login', payload)
  return response.data
}
