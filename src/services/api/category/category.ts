import axios from 'axios'

// import Cookies from 'js-cookie';

// const token = Cookies.get('token');

const token =
  '0ad82997636f10c2aef4b0e160746731e414125c1c602cc1365172aa25ca8c022d5bd0818f66d8a3e404ba6927b1457855b8790a68236d95332e63ecf0b771fb2de982360ca5e2e8c49e9f0159fbce671dc466bfb8ff5f7311dcc9791b8ff60d36a80944b9362083cda11e8db3fa2b6c13776103ed954524e1e71402aaeba1a1'
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const getAllCategory = async () => {
  return await axiosInstance.get('categories')
}

export const getCategoryById = async (id: string | number) => {
  return await axiosInstance.get(`categories?id=${id}`)
}

export const getTagsById = async (id: string | number) => {
  return await axiosInstance.get(`tags?id=${id}`)
}

export const getDomainsById = async (id: string | number) => {
  return await axiosInstance.get(`domains?id=${id}`)
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

export const updateCategory = async (id: string | number, payload) => {
  await axiosInstance.put(`categories?id=${id}`, payload)
}

export const updateTags = async (id: string | number, payload) => {
  await axiosInstance.put(`tags?id=${id}`, payload)
}

export const updateDomains = async (id: string | number, payload) => {
  await axiosInstance.put(`domains?id=${id}`, payload)
}

export const deleteCategory = async (id: string | number) => {
  await axiosInstance.delete(`categories?id=${id}`)
}

export const deleteTags = async (id: string | number) => {
  await axiosInstance.delete(`tags?id=${id}`)
}

export const deleteDomains = async (id: string | number) => {
  await axiosInstance.delete(`domains?id=${id}`)
}
