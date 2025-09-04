import axios from 'axios'

// import Cookies from 'js-cookie';

const token = process.env.NEXT_PUBLIC_TOKEN!


const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const getAllCategory = async () => {
  return await axiosInstance.get('categories?populate=*')
}



export const getCategoryById = async (id: string) => {
  return await axiosInstance.get(`categories/${id}?populate=*`)
}



export const createCategorys = async (payload) => {
  await axiosInstance.post('categories', payload)
}


export const updateCategory = async (id: string, payload) => {
  await axiosInstance.put(`categories/${id}`, payload)
}



export const deleteCategory = async (id: string) => {
  await axiosInstance.delete(`categories/${id}`)
}


