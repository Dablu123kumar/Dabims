import {createContext, useContext, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../../modules/auth'

const NumberOfYearsCourseTypesContext = createContext()
const BASE_URL = process.env.REACT_APP_BASE_URL

export const NumberOfYearsCourseTypesContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const numberOfCourseYearsTypesLists = useQuery({
    queryKey: ['getNumberOfCourseYearsTypes'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/courses/numberOfYears`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  //console.log(numberOfCourseYearsTypesLists)

  //console.log(studentsLists)
  const createNumberOfYearsCourseTypeMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios
        .post(`${BASE_URL}/api/courses/numberOfYears`, data, config)
        .then((res) => res.data)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      alert('Added Number of Years Course Type Successfully!')
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error.response.data.error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseTypes']})
      }
    },
  })

  // Course Types
  const deleteNumberOfYearsCourseTypeMutation = useMutation({
    mutationFn: async (id) => {
      return axios
        .delete(`${BASE_URL}/api/courses/numberOfYears/${id}`, config)
        .then((res) => res.data)
    },
    onSuccess: () => {
      alert('Number of Course Years Types deleted successfully')
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getNumberOfCourseYearsTypes']})
      }
    },
  })

  // update Course type
  const updateNumberOfYearsCourseTypeMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/courses/numberOfYears/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getNumberOfCourseYearsTypes']})
      }
    },
  })

  return (
    <NumberOfYearsCourseTypesContext.Provider
      value={{
        updateNumberOfYearsCourseTypeMutation,
        numberOfCourseYearsTypesLists,
        deleteNumberOfYearsCourseTypeMutation,
        createNumberOfYearsCourseTypeMutation,
      }}
    >
      {children}
    </NumberOfYearsCourseTypesContext.Provider>
  )
}

export const useNumberOfYearsCourseTypesContext = () => {
  const context = useContext(NumberOfYearsCourseTypesContext)
  if (!context) {
    throw new Error('useAdmissionContext must be used within an AdmissionContextProvider')
  }
  return context
}
