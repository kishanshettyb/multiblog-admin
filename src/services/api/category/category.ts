import axios from 'axios'

// import Cookies from 'js-cookie';

// const token = Cookies.get('token');

const token =
  'c3ba31a0e856d699c55442d2d98a9d79c9ab34de690f8e6b35a3f5ae45e5fd691246219054561dfeaf34f66e264102c986c3c93b6517ae8b9cedee8f8f1d28de6a3389d630a5548d43b45d91cd40e5d5ed20dd56fd0d8bb2a515d2c30634b8799ad63bd363aacfe8fe88938d7ed6c91d24294aeb7faa04db2905fde89f96e6e6'
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const getAllCategory = async () => {
  return await axiosInstance.get('category')
}

export const getAllTags = async () => {
  return await axiosInstance.get('tags')
}

export const getAllDomain = async () => {
  return await axiosInstance.get('domain')
}
