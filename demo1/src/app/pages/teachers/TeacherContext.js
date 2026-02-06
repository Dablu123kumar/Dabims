import React, { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const TeacherContext = createContext(null)

const baseUrl = process.env.REACT_APP_BASE_URL || ''

// API helpers
const fetchTeachers = async () => {
  const res = await axios.get(`${baseUrl}/api/teachers`)
  return res.data
}

const fetchTeacherById = async (id) => {
  const res = await axios.get(`${baseUrl}/api/teachers/${id}`)
  return res.data
}

const createTeacherApi = async (payload) => {
  const res = await axios.post(`${baseUrl}/api/teachers`, payload)
  return res.data
}

const updateTeacherApi = async ({ id, payload }) => {
  const res = await axios.put(`${baseUrl}/api/teachers/${id}`, payload)
  return res.data
}

const deleteTeacherApi = async (id) => {
  const res = await axios.delete(`${baseUrl}/api/teachers/${id}`)
  return res.data
}

export const TeacherProvider = ({ children }) => {
  const queryClient = useQueryClient()

  // Queries
  const useGetAllTeachers = () =>
    useQuery(['teachers'], () => fetchTeachers(), { staleTime: 1000 * 60 * 2 })

  const useGetTeacherById = (id) =>
    useQuery(['teachers', id], () => fetchTeacherById(id), { enabled: !!id })

  // Mutations
  const useCreateTeacher = () =>
    useMutation((payload) => createTeacherApi(payload), {
      onSuccess: () => {
        queryClient.invalidateQueries(['teachers'])
      },
    })

  const useUpdateTeacher = () =>
    useMutation(({ id, payload }) => updateTeacherApi({ id, payload }), {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['teachers'])
        if (variables?.id) queryClient.invalidateQueries(['teachers', variables.id])
      },
    })

  const useDeleteTeacher = () =>
    useMutation((id) => deleteTeacherApi(id), {
      onSuccess: () => {
        queryClient.invalidateQueries(['teachers'])
      },
    })

  const value = {
    useGetAllTeachers,
    useGetTeacherById,
    useCreateTeacher,
    useUpdateTeacher,
    useDeleteTeacher,
  }

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
}

export const useTeacherContext = () => {
  const ctx = useContext(TeacherContext)
  if (!ctx) throw new Error('useTeacherContext must be used within TeacherProvider')
  return ctx
}

export default TeacherContext
