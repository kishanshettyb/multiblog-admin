import axios from 'axios'

// import Cookies from 'js-cookie';

const token = process.env.NEXT_PUBLIC_TOKEN!


const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})





export const getDomainsById = async (id: string) => {
  return await axiosInstance.get(`domains/${id}?populate=*`)
}


export const getAllDomain = async () => {
  return await axiosInstance.get('domains?populate=*')
}



export const createDomains = async (payload) => {
  await axiosInstance.post('domains', payload)
}



export const updateDomains = async (id: string, payload) => {
  await axiosInstance.put(`domains/${id}`, payload)
}





export const deleteDomains = async (id: string) => {
  await axiosInstance.delete(`domains/${id}`)
}
