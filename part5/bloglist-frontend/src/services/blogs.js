import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async (blogData) => {
  const response = await axios.post(baseUrl, blogData, {
    headers: { Authorization: token }
  })

  return response.data;
}

const updateLikes = async (blogData) => {
  const response = await axios.put(`${baseUrl}/${blogData.id}`, blogData, {
    headers: { Authorization: token }
  })

  return response.data
}

const deleteBlog = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: token }
  })
}

export default { getAll, createBlog, setToken, updateLikes, deleteBlog }