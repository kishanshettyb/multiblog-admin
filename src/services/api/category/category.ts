import axios from 'axios'

// import Cookies from 'js-cookie';

// const token = Cookies.get('token');

const token =
  '08480e0fdacdc8ee4f69271d661b7d2073da9eea53d0f5ac8528ce9871487a1ba5b066f8f54817866e5c5680e7f2c16c8ef5208426c0c30b61fb9225739a19457d06d836c710865c25f0a3bea81512222a436555f21b4c5de9d98a18f7e5c94d126dce9cb3610c74cb7cd4b75a2860a999a7eba1b3892c5eca00fb0dc09b0f04'
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
