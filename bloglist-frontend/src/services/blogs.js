import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getConfig = () => ({
  headers: { Authorization: token },
});

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, getConfig())
  return response.data
}

const deleteBlog = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll, create, setToken, update, deleteBlog }