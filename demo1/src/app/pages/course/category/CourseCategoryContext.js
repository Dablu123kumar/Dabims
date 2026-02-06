import {createContext, useContext, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../../modules/auth'
const CourseCategoryContext = createContext()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const CourseCategoryContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const getCourseCategoryLists = useQuery({
    queryKey: ['getCourseCategoryLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/courses/categories`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  //console.log(getCourseCategoryLists)

  //console.log(studentsLists)
  const createCourseCategoryMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/courses/addCategory`, data, config).then((res) => res.data)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      alert('Added Course Category Successfully!')
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseCategoryLists']})
      }
    },
  })

  // Course Types
  const deleteCourseCategoryMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/courses/category/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      alert('Course Category deleted successfully')
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseCategoryLists']})
      }
    },
  })

  // update Course type
  const updateCourseCategoryMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/courses/category/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert('Error while updating student...', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseCategoryLists']})
      }
    },
  })

  return (
    <CourseCategoryContext.Provider
      value={{
        getCourseCategoryLists,
        deleteCourseCategoryMutation,
        createCourseCategoryMutation,
        updateCourseCategoryMutation,
      }}
    >
      {children}
    </CourseCategoryContext.Provider>
  )
}

export const useGetCourseCategoryContextContext = () => {
  const context = useContext(CourseCategoryContext)
  if (!context) {
    throw new Error('useAdmissionContext must be used within an AdmissionContextProvider')
  }
  return context
}
