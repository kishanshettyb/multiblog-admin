import axios from 'axios'

// import Cookies from 'js-cookie';

// const token = Cookies.get('token');

const token =
  'c3a883b53e877e922a38b731c7c183658c580af00d53d9e84c8c86c298839eb1c77f309737d1400bc4b315d6af98ea8a49e842ff77da340aa92e1284c54a4513bb9632a4d5ad1bf53f8c056351f4a219ee14bc9048dfaff4e272b3fd20ff64aa28aff9aecc123b25601154f9c62b8a660c31ad8129e49fc0c3625a6ec07e3295'
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const getAllCategory = async () => {
  return await axiosInstance.get('categories')
}

export const getCategoryById = async (id: string) => {
  return await axiosInstance.get(`categories/${id}`)
}

export const getTagsById = async (id: string) => {
  return await axiosInstance.get(`tags/${id}`)
}

export const getDomainsById = async (id: string) => {
  return await axiosInstance.get(`domains/${id}`)
}
export const getAllTags = async () => {
  return await axiosInstance.get('tags')
}

export const getAllDomain = async () => {
  return await axiosInstance.get('domains')
}

export const createCategorys = async (payload) => {
  await axiosInstance.post('categories', payload)
}

export const createTags = async (payload) => {
  await axiosInstance.post('tags', payload)
}

export const createDomains = async (payload) => {
  await axiosInstance.post('domains', payload)
}

export const updateCategory = async (id: string, payload) => {
  await axiosInstance.put(`categories/${id}`, payload)
}

export const updateTags = async (id: string, payload) => {
  await axiosInstance.put(`tags/${id}`, payload)
}

export const updateDomains = async (id: string, payload) => {
  await axiosInstance.put(`domains/${id}`, payload)
}

export const deleteCategory = async (id: string) => {
  await axiosInstance.delete(`categories/${id}`)
}

export const deleteTags = async (id: string) => {
  await axiosInstance.delete(`tags/${id}`)
}

export const deleteDomains = async (id: string) => {
  await axiosInstance.delete(`domains/${id}`)
}
