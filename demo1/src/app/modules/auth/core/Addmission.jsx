import { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { useAuth } from './Auth'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const AdmissionContext = createContext()
const BASE_URL = process.env.REACT_APP_BASE_URL

export const AdmissionContextProvider = ({ children }) => {
  const selectedCompanyId = useSelector((state) => state.company.selectedCompany?._id || '')
  const [studentId, setStudentId] = useState('')
  const queryClient = useQueryClient()
  let { auth, currentUser } = useAuth()
  const [admissionFormData, setAdmissionFormData] = useState([])
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }
  const studentsLists = useQuery({
    queryKey: ['getStudents'],
    queryFn: async () => {
      try {
        const cId = currentUser?.role === 'SuperAdmin' ? selectedCompanyId : ''
        const url = cId ? `${BASE_URL}/api/students?companyId=${cId}` : `${BASE_URL}/api/students`
        const response = await axios.get(url, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  // students by company and course
  const GetStudentsByCompanyAndCourse = (companyId,courseId)=>{
    return useQuery({
      queryKey: ['studentsByCompanyCourse',companyId,courseId],
      queryFn: async ()=>{
        if(!companyId || !courseId) return []

        const response = await axios.get(`${BASE_URL}/api/students/company/${companyId}/course/${courseId}`,config)

        return response.data.data
      },
      enabled : !!companyId && !!courseId,
    })
  }
  const getCompleteCourseStudentsLists = useQuery({
    queryKey: ['getCompleteCourseStudentsLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/complete/course/students`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useGetSingleStudentUsingWithEmail = (studentId) => {
    return useQuery({
      queryKey: ['getStudents', studentId],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/students/${studentId}`)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }
  const useGetSingleStudentUsingById = (studentId) => {
    //console.log(studentId)
    return useQuery({
      queryKey: ['getStudents', studentId],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/addmission_form/${studentId}`)
          //console.log(response.data)
          return response.data
        } catch (error) {
          console.error('Error fetching student data:', error)
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
      enabled: !!studentId, // Ensure the query runs only if studentId is defined
    })
  }

  //console.log(studentsLists)
  const createStudentMutation = useMutation({
    mutationFn: async (newAdmission) => {
      try {
        const response = await axios.post(`${BASE_URL}/api/addmission_form`, newAdmission, config)
        return response.data
      } catch (error) {
        // Throw error to be caught in onError
        throw error
      }
    },
    onMutate: () => {
      console.log('mutate')
    },
    onError: (error) => {
      // Extract error message
      const errorMessage = error.response?.data?.message || 'Something went wrong'
      toast.error(`Error: ${errorMessage}`, {
        bodyStyle: {
          fontSize: '18px',
        },
      })
    },
    onSuccess: () => {
      toast.success('Admission done successfully 😊', {
        bodyStyle: {
          fontSize: '18px',
        },
      })
      //console.log('success')
    },
    onSettled: async (data, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['getStudents'] })
      }
    },
  })

  // delete student
  const deleteStudentMutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`${BASE_URL}/api/students/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      toast(`Student deleted Successfully`, {
        type: 'success',
        bodyStyle: {
          fontSize: '18px',
        },
      })
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['getStudents'] })
      }
    },
  })

  // update Student
  const updateStudentMutation = useMutation({
    mutationFn: async (updateStudent) => {
      let id = updateStudent.get('id')
      console.log('DEBUG MUTATION: calling PUT /api/students/' + id)
      try {
        const res = await axios.put(`${BASE_URL}/api/students/${id}`, updateStudent, config)
        console.log('DEBUG MUTATION: response status', res.status, 'data:', res.data)
        return {
          student: res.data,
          oldCourse: updateStudent.get('oldCourse'),
        }
      } catch (err) {
        console.error('DEBUG MUTATION: PUT failed', err.response?.status, err.response?.data || err.message)
        throw err
      }
    },

    onSuccess: async (res,variables) =>{
            //console.log('res', res)
            const updatedStudent = res.student
            const oldCourse = res.oldCourse
            const newCourse = updatedStudent.select_course
            //console.log(updatedStudent)
            
              // ✅ Detect course change
    const courseChanged =
      updatedStudent?.message?.toLowerCase().includes("course") ||
      updatedStudent?.select_course;

    if (oldCourse !== newCourse) {
      await axios.post(
        `${BASE_URL}/api/students/sendCourseChangeEmail`,
        {
          userIds: [updatedStudent._id],
          newCourse: updatedStudent.select_course,
          company: {
            companyName: updatedStudent.companyName.companyName,
            email: updatedStudent.companyName.email,
          },
        },
        config
      );
    }


    await queryClient.invalidateQueries({ queryKey: ["getStudents"] });
    },
    onSettled: async (_, error) => {
      if (error) {
        toast(`Error while updating student... ${error}`, {
          type: 'error',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        await queryClient.invalidateQueries({ queryKey: ['getStudents'] })
      }
    },
  })

  /********************** Student Fees Alert Start   *******************/
  const createAlertStudentPendingFeesMutation = useMutation({
    mutationFn: async (newAlertPendingFees) => {
      //console.log(newAlertPendingFees)
      try {
        return axios
          .post(
            `${BASE_URL}/api/students/createAlertStudentPendingFees/add`,
            newAlertPendingFees,
            config
          )
          .then((res) => res.data)
      } catch (error) {
        return
      }
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      // console.log('error')
    },

    onSuccess: () => {
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudentsAlertPendingFessDetails'],
        })
      }
    },
  })

  // const getAlertStudentPendingFeesQuery = useQuery({
  //   queryKey: ['getStudentsAlertPendingFessDetails'],
  //   queryFn: async () => {
  //     try {
  //       const response = await axios.get(
  //         `${BASE_URL}/api/students/createAlertStudentPendingFees/get`,
  //         config
  //       )
  //       return response.data
  //     } catch (error) {
  //       throw new Error('Error fetching student fees alert data: ' + error.message)
  //     }
  //   },
  // })

  const getAlertStudentPendingFeesQuery = useQuery({
    queryKey: ['getStudentsAlertPendingFessDetails'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/students/createAlertStudentPendingFees/get`,
          config
        )
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })
  const getAllStudentsAlertStudentPendingFeesQuery = useQuery({
    queryKey: ['getStudentsAlertPendingFessDetails', 1],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/students/getStudentAlertStudentPendingFees`,
          config
        )
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const deleteAlertStudentPendingFeesMutation = useMutation({
    mutationFn: async (id) => {
      // console.log(id)
      // return axios
      //   .delete(`${BASE_URL}/api/students/createAlertStudentPendingFees/${id}`, config)
      //   .then((res) => res.data)
      const res = await axios.delete(
        `${BASE_URL}/api/students/createAlertStudentPendingFees/${id}`,
        config
      )
      //console.log(res)
      if (!res.data.success) {
        throw new Error('Failed to delete student fees alert')
      } else {
        toast(`Student fees alert deleted Successfully`, {
          type: 'success',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      }
      return res.data
    },
    onSuccess: () => { },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['getStudentsAlertPendingFessDetails'] })
      }
    },
  })

  const updateAlertPendingStudentFeesMutation = useMutation({
    mutationFn: async (updateStudent) => {
      //console.log(updateStudent)
      const res = await axios.put(
        `${BASE_URL}/api/students/createAlertStudentPendingFees/${updateStudent.id}`,
        updateStudent,
        config
      )

      if (res.data.success) {
        toast(`Student fees alert updated Successfully`, {
          type: 'success',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        throw new Error('Error while updating alert student pending fees')
      }

      return res.data
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast(`Error while updating student... ${error}`, {
        //   type: 'error',
        //   bodyStyle: {
        //     fontSize: '18px',
        //   },
        // })
      } else {
        await queryClient.invalidateQueries({ queryKey: ['getStudentsAlertPendingFessDetails'] })
      }
    },
  })

  const updateDropOutStudentMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      const res = await axios.put(
        `${BASE_URL}/api/students/dropOutStudents/${data.studentId}`,
        data,
        config
      )

      if (res.data.success) {
        toast(res.data.message, {
          type: 'success',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        throw new Error('Error while updating alert student pending fees')
      }

      return res.data
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast(`Error while updating student... ${error}`, {
        //   type: 'error',
        //   bodyStyle: {
        //     fontSize: '18px',
        //   },
        // })
      } else {
        await queryClient.invalidateQueries({ queryKey: ['getStudents'] })
      }
    },
  })
  /********************** Student Fees Alert End  *******************/

  // student renew course fees
  const updateStudentRenewCourseFeesMutation = useMutation({
    mutationFn: async (updateStudent) => {
      return axios
        .put(
          `${BASE_URL}/api/students/renewStudentCourseFees/${updateStudent.studentId}`,
          updateStudent,
          config
        ) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      // console.log()
      if (error) {
        toast(error.response.data.message, {
          type: 'error',
          bodyStyle: {
            fontSize: '18px',
          },
        })
        return
      } else {
        await queryClient.invalidateQueries({ queryKey: ['getStudents'] })
      }
    },
  })

  return (
    <AdmissionContext.Provider
      value={{
        admissionFormData,
        setAdmissionFormData,
        createStudentMutation,
        studentsLists,
        getCompleteCourseStudentsLists,
        deleteStudentMutation,
        updateStudentMutation,
        setStudentId,
        GetStudentsByCompanyAndCourse,
        useGetSingleStudentUsingWithEmail,
        useGetSingleStudentUsingById,
        /********************** Student Fees Alert Start   *******************/
        createAlertStudentPendingFeesMutation,
        getAlertStudentPendingFeesQuery,
        deleteAlertStudentPendingFeesMutation,
        updateAlertPendingStudentFeesMutation,
        getAllStudentsAlertStudentPendingFeesQuery,
        /********************** Student Fees Alert End  *******************/
        // ------------------ drop out students available here -------------------
        updateDropOutStudentMutation,
        updateStudentRenewCourseFeesMutation,
        // ------------------ drop out students available here -------------------
      }}
    >
      {children}
    </AdmissionContext.Provider>
  )
}

export const useAdmissionContext = () => {
  const context = useContext(AdmissionContext)
  if (!context) {
    throw new Error('useAdmissionContext must be used within an AdmissionContextProvider')
  }
  return context
}
