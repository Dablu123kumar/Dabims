import {createContext, useContext, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../modules/auth'
import {toast} from 'react-toastify'
const StudentCourseFeeContext = createContext()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const StudentCourseFeesContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  function useSingleStudentCourseFees(studentId) {
    const result = useQuery({
      queryKey: ['getStudentCourseFeesLists', studentId],
      queryFn: async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/courseFees/studentFees/${studentId}`,
            config
          )
          //console.log('singlestudentfee', response.data)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })

    return result
  }

  function useGetStudentMonthlyCourseFeesCollection(companyId) {
    const result = useQuery({
      queryKey: ['getPaymentInstallmentCollectionFees'],
      queryFn: async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/courseFees/paymentInstallmentFees/${companyId}`,
            config
          )
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })

    return result
  }
  function useGetStudentMonthlyCourseFeesCollectionExpireationInstallment(searchData) {
    const result = useQuery({
      queryKey: ['getStudentCourseFeesLists'],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/courseFees/nextinstallment`, config)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })

    return result
  }

  // const useDeleteSingleStudentCourseFees = useMutation({
  //   mutationKey: ['getStudentCourseFeesLists'],
  //   mutationFn: async (id) => {
  //     try {
  //       console.log(id)
  //       const response = await axios.delete(`${BASE_URL}/api/courseFees/${id}`, config)
  //       return response.data
  //     } catch (error) {
  //       throw new Error('Error fetching student data: ' + error.message)
  //     }
  //   },
  // })
  const useDeleteSingleStudentCourseFees = useMutation({
    mutationFn: async (id) => {
      // return axios.delete().then((res) => res.data)
      const res = await axios.delete(`${BASE_URL}/api/courseFees/${id}`, config)
      return res.data
    },
    onSuccess: async (data) => {
      // console.log(data)
      await queryClient.invalidateQueries({
        queryKey: ['getStudents', data?.studentId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['getStudentCourseFeesLists'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['getDayBookDataLists'],
      })
      if (data.success) {
        toast.success(data.message)
      }
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudents'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['getStudentCourseFeesLists'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['getDayBookDataLists'],
        })
      }
    },
  })

  //console.log(getStudentCourseData)

  //console.log(studentsLists)
  const createStudentCourseFeesMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axios.post(`${BASE_URL}/api/courseFees`, data, config)
        return res.data
      } catch (error) {
        // Throwing the error will trigger the onError callback
        throw error
      }
    },

    onMutate: () => {
      //console.log('Mutation started')
    },

    onError: (error) => {
      // Display the error message to the user before any page reload
      //console.error('Mutation failed:', error)
      toast.error(`Error: ${error.response?.data?.error || error.message}`)
      // Optionally, you can prevent a page reload by stopping event propagation or further actions here
    },

    onSuccess: async (data) => {
      //console.log('Mutation succeeded:', data)
      await queryClient.invalidateQueries({
        queryKey: ['getStudents', data?.id],
      })
      await queryClient.invalidateQueries({
        queryKey: ['getStudentCourseFeesLists'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['getDayBookDataLists'],
      })
      toast.success('Added Student Course fee Successfully!')
    },

    onSettled: async (_, error) => {
      if (error) {
        // Display the error message before any further actions
        console.error('Error during mutation:', error.response?.data?.error || error.message)
        toast.error(`Error: ${error.response?.data?.error || error.message}`)

        // Optionally, throw the error again if you need to trigger global error handling
        throw new Error(error.response?.data?.error || 'An unknown error occurred')
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudentCourseFeesLists'],
        })
      }
    },
  })

  const createStudentCourseFeesOnlineMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axios.post(`${BASE_URL}/api/courseFees/online-payment`, data, config)
        console.log(res)
        return res.data
      } catch (error) {
        // Throwing the error will trigger the onError callback
        throw error
      }
    },

    onMutate: () => {
      //console.log('Mutation started')
    },

    onError: (error) => {
      // Display the error message to the user before any page reload
      //console.error('Mutation failed:', error)
      toast.error(`Error: ${error.response?.data?.error || error.message}`)
      // Optionally, you can prevent a page reload by stopping event propagation or further actions here
    },

    onSuccess: async (data) => {
      //console.log('Mutation succeeded:', data)
      await queryClient.invalidateQueries({
        queryKey: ['getStudents', data?.id],
      })
      await queryClient.invalidateQueries({
        queryKey: ['getStudentCourseFeesLists'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['getDayBookDataLists'],
      })
      toast.success('Added Student Course fee Successfully!')
    },

    onSettled: async (_, error) => {
      if (error) {
        // Display the error message before any further actions
        console.error('Error during mutation:', error.response?.data?.error || error.message)
        toast.error(`Error: ${error.response?.data?.error || error.message}`)

        // Optionally, throw the error again if you need to trigger global error handling
        throw new Error(error.response?.data?.error || 'An unknown error occurred')
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudentCourseFeesLists'],
        })
      }
    },
  })

  // Course Types
  const deleteCourseMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/courses/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      alert('Course  deleted successfully')
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getStudentCourseFeesLists']})
      }
    },
  })

  // update Course type
  const updateStudentSingleCourseFeesMutation = useMutation({
    mutationFn: async (updateData) => {
      // console.log(updateData)
      try {
        const res = await axios.put(
          `${BASE_URL}/api/courseFees/${updateData._id}`,
          updateData,
          config
        )
        return res.data // Return the response data
      } catch (error) {
        // Throw an error to be caught in onError
        throw error
      }
    },
    onSuccess: async (data) => {
      // console.log(data.updatedData[0].studentInfo)
      await queryClient.invalidateQueries({
        queryKey: ['getStudents', data?.updatedData[0]?.studentInfo],
      })
      await queryClient.invalidateQueries({
        queryKey: ['getStudentCourseFeesLists'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['getDayBookDataLists'],
      })
      // Success message
      toast.success('Student Course fees updated successfully!', {
        bodyStyle: {
          fontSize: '18px',
        },
      })
    },
    onError: (error) => {
      // Check if error.response exists to get the server error message
      const errorMessage = error.response?.data?.message || 'Something went wrong'
      alert(errorMessage)
    },
  })
  // get all students course fees
  const getAllStudentsCourseFees = useQuery({
    queryKey: ['getStudentCourseFeesLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/courseFees/allCourseFess`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data:' + error.message)
      }
    },
  })

  //Approval Query's
  const createStudentStatusMutation = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      return axios.post(`${BASE_URL}/api/receipt-approval`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: async (data) => {
      // console.log('Mutation succeeded:', data)
      // await queryClient.invalidateQueries({
      //   queryKey: ['getStudents', data?.id],
      // })
      // await queryClient.invalidateQueries({
      //   queryKey: ['getStudentCourseFeesLists'],
      // })
      // await queryClient.invalidateQueries({
      //   queryKey: ['getDayBookDataLists'],
      // })
      toast.success('Added Student Course fee Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        // console.log(error)
        // alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getRecieptStatusData']})
      }
    },
  })

  const getAllRecieptStatusData = useQuery({
    queryKey: ['getRecieptStatusData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/receipt-approval`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data:' + error.message)
      }
    },
  })

  const useGetNotPaidStudents = (toDate, fromDate, companyId) => useQuery({
    queryKey: ['getNotPaidStudents', toDate, fromDate, companyId],
    queryFn: async () => {
      const response = await axios.post(`${BASE_URL}/api/courseFees/get-not-paid-students`, {toDate, fromDate, companyId}, config)
      return response.data
    },
enabled: !!toDate && !!fromDate && !!companyId, // Only run query when both dates are provided
  })

  return (
    <StudentCourseFeeContext.Provider
      value={{
        useSingleStudentCourseFees,
        useDeleteSingleStudentCourseFees,
        deleteCourseMutation,
        createStudentCourseFeesMutation,
        createStudentCourseFeesOnlineMutation,
        updateStudentSingleCourseFeesMutation,
        useGetStudentMonthlyCourseFeesCollection,
        useGetStudentMonthlyCourseFeesCollectionExpireationInstallment,
        getAllStudentsCourseFees,
        createStudentStatusMutation,
        getAllRecieptStatusData,
        useGetNotPaidStudents,
      }}
    >
      {children}
    </StudentCourseFeeContext.Provider>
  )
}

export const useStudentCourseFeesContext = () => {
  const context = useContext(StudentCourseFeeContext)
  if (!context) {
    throw new Error('useAdmissionContext must be used within an AdmissionContextProvider')
  }
  return context
}
