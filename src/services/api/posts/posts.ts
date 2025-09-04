import axios from 'axios'

// import Cookies from 'js-cookie';

const token = process.env.NEXT_PUBLIC_TOKEN!


const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})



export const getAllPosts = async () => {
  return await axiosInstance.get('blogposts')
}



export const getPostById = async (id: string) => {
  return await axiosInstance.get(`blogposts/${id}`)
}






export const createPost = async (payload) => {
  await axiosInstance.post('blogposts', payload)
}





export const updatePost = async (id: string, payload) => {
  await axiosInstance.put(`blogposts/${id}`, payload)
}





export const deletePost = async (id: string) => {
  await axiosInstance.delete(`blogposts/${id}`)
}


