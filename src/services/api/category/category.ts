import axios from 'axios'

// import Cookies from 'js-cookie';

// const token = Cookies.get('token');

const token =
  '46afdc3df26035f644a252317eed34995642d3dc9d13d48fd4e2780505d8653b7ac62d8b70a85296c7bd5e8d87b2b2fe9773f54426c7189e81e5daf4eeadcc851e17f73166d085fefa8d13e02053c0e64ef17f5ee32875b5d177238fa4642af14f80e90e887a23e336765b67c1232b3432153d8f00f426cf168c11955a87b506'
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
