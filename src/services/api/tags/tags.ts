import axios from 'axios'

// import Cookies from 'js-cookie';

const token = process.env.NEXT_PUBLIC_TOKEN!


const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        Authorization: `Bearer ${token}`
    }
})







export const getTagsById = async (id: string) => {
    return await axiosInstance.get(`tags/${id}?populate=*`)
}




export const getAllTags = async () => {
    return await axiosInstance.get('tags?populate=*')
}





export const createTags = async (payload) => {
    await axiosInstance.post('tags', payload)
}







export const updateTags = async (id: string, payload) => {
    await axiosInstance.put(`tags/${id}`, payload)
}







export const deleteTags = async (id: string) => {
    await axiosInstance.delete(`tags/${id}`)
}

