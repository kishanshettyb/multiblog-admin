import axios from 'axios'

// import Cookies from 'js-cookie';

const token = process.env.NEXT_PUBLIC_TOKEN!

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const addLike = async (payload) => {
  await axiosInstance.post('likes', payload)
}
