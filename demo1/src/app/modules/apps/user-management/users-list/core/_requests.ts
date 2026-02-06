import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {User, UsersQueryResponse} from './_models'
import {toast} from 'react-toastify'

const API_URL = process.env.REACT_APP_THEME_API_URL
const BASE_URL = process.env.REACT_APP_BASE_URL
const USER_URL = `${API_URL}/user`
// const GET_USERS_URL = `${API_URL}/users/query`
const GET_USERS_URL = ``

const getUsers = async (query: string): Promise<UsersQueryResponse> => {
  // console.log(query);

  return axios
    .get(`${BASE_URL}/api/users?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getUserById = async (id: ID): Promise<User | undefined> => {
  // console.log(id);

  return axios
    .get(`${BASE_URL}/api/users/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const createUser = async (user: User): Promise<User | undefined> => {
  return axios
    .post(`${BASE_URL}/api/users`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const updateUser = async (user: User): Promise<User | undefined> => {
  //console.log(user);
  return axios
    .post(`${BASE_URL}/api/users/${user.id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const deleteUser = async (userId: ID): Promise<void> => {
  try {
    if (!window.confirm('Are you sure you want to delete this user')) {
      return
    }
    const res = await axios.delete(`${BASE_URL}/api/users/${userId}`)
    toast.success(res.data.data.message)
    toast.error(res.data.message)
    return res.data
  } catch (error: any) {
    toast.error(`You are not authorized to delete`)
  }
}

const deleteSelectedUsers = async (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

export {getUsers, deleteUser, deleteSelectedUsers, getUserById, createUser, updateUser}
