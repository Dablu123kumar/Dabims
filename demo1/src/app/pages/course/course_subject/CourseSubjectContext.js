import {createContext, useContext} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useAuth} from '../../../modules/auth'
import axios from 'axios'
import {toast} from 'react-toastify'


const BASE_URL = process.env.REACT_APP_BASE_URL
const CourseSubjectContext = createContext()

export const CourseSubjectContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  /* ==============================
     ADD SUBJECTS TO STUDENT (Admission)
  ============================== */
  const addSubjectsToStudentMutation = useMutation({
    mutationFn: (data) =>
      axios.post(`${BASE_URL}/api/subjects/add`, data, config).then((res) => res.data),

    onSuccess: (data, variables) => {
      //console.log('vari',variables)
      toast.success(data.message)
      queryClient.invalidateQueries(['studentSubjects', variables.studentId, variables.courseId])
    },
    onError: (error)=>{
      toast.error(error?.response?.data?.message || 'Error adding subjects to student')
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries(['studentSubjects'])
      }
    },
  })

  /* ==============================
     GET STUDENT SUBJECTS (Student + Course)
  ============================== */
  const useGetStudentSubjects = (studentId, courseId) => {
    return useQuery({
      queryKey: ['studentSubjects', studentId, courseId],
      queryFn: () =>
        axios
          .get(`${BASE_URL}/api/subjects/marks/${studentId}/${courseId}`, config)
          .then((res) => {
            //console.log(res.data)
            return res.data
          }),
      enabled: !!studentId && !!courseId,
    })
  }
  /* ==============================
     GET STUDENT SUBJECTS (Student + Course)
  ============================== */
  const useGetStudentSubjectsBasedOnCategory = (studentId) => {
    return useQuery({
      queryKey: ['studentSubjectsBasedOnCategory', studentId],
      queryFn: () =>
        axios
          .get(`${BASE_URL}/api/subjects/based-on-student/${studentId}`, config)
          .then((res) => {
            //console.log(res.data)
            return res.data
          }),
      enabled: !!studentId,
    })
  }

  /* ==============================
     UPDATE SUBJECT MARKS
  ============================== */
  const updateStudentSubjectMarksMutation = useMutation({
    mutationFn: (data) =>
      axios.put(`${BASE_URL}/api/subjects/marks`, data, config).then((res) => res.data),

    onSuccess: (data, variables) => {
      toast.success(data.message)
      queryClient.invalidateQueries(['studentSubjects', variables.studentId, variables.courseId])
    },
    onError: (error)=>{
      toast.error(error?.response?.data?.message || 'Error updating subject marks')
    },

    onSettled: async (_, error, variables) => {
      if (!error) {
        await queryClient.invalidateQueries([
          'studentSubjects',
          variables.studentId,
          variables.courseId,
        ])
      }
    },
  })

  /* ==============================
     BULK UPDATE SUBJECT MARKS
  ============================== */
  const updateStudentBulkSubjectMarksMutation = useMutation({
  mutationFn: (data) =>
    axios
      .put(`${BASE_URL}/api/subjects/marks/bulk`, data, config)
      .then((res) => res.data),

  onSuccess: (data, variables) => {
    toast.success(data.message);
    queryClient.invalidateQueries([
      'studentSubjects',
      variables.studentId,
      variables.courseId,
    ]);
  },
  onError: (error)=>{
    toast.error(error?.response?.data?.message || 'Error updating subject marks in bulk');
  }
});
  /* ==============================
     GET ALL STUDENT MARKS (ADMIN)
  ============================== */
  const useGetAllStudentSubjectMarks = () => {
    return useQuery({
      queryKey: ['allStudentSubjectMarks'],
      queryFn: () => axios.get(`${BASE_URL}/api/subjects/marks`, config).then((res) => res.data),
    })
  }

  /* ==============================
     COURSE SUBJECTS (Existing - OK)
  ============================== */
  const useSubjectsBasedOnCourse = (courseId) => {
    return useQuery({
      queryKey: ['courseSubjects', courseId],
      queryFn: () =>
        axios.get(`${BASE_URL}/api/subjects/${courseId}`, config).then((res) => res.data),
      enabled: !!courseId,
    })
  }

  const createCourseSubjectMutation = useMutation({
    mutationFn: async (data) => {
      try {
        return axios.post(`${BASE_URL}/api/subjects`, data, config).then((res) => res.data)
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },

    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      // console.log('error')
    },

     onSuccess: () => {
      toast.success('Course subject added successfully')
      queryClient.invalidateQueries(['getCourseSubjectLists'])
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists']})
      }
    },
  })

  const getCourseSubjectLists = useQuery({
    queryKey: ['getCourseSubjectLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/subjects`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  // update Course type
  const updateCourseCategoryMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/subjects/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSuccess: () => {
      toast.success('Course subject updated')
      queryClient.invalidateQueries(['getCourseSubjectLists'])
    }, 
    onSettled: async (_, error, data) => {
      if (error) {
        alert('Error while updating student...', error)
      } else {
        // console.log('from course subject context ---->> ', data)
        await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists']})
      }
    },
  })

  // delete subject course
  // Course Types
  const deleteCourseSubjectMutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`${BASE_URL}/api/subjects/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      toast.success('Course subject deleted')
      queryClient.invalidateQueries(['getCourseSubjectLists'])
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists']})
      }
    },
  })

  // // update Course type
  // const updateCourseSubjectMarksMutation = useMutation({
  //   mutationFn: async (updateData) => {
  //     //console.log(updateData)
  //     return axios
  //       .post(`${BASE_URL}/api/subjects/marks`, updateData, config) // Corrected order of arguments
  //       .then((res) => res.data)
  //   },
  //   onSettled: async (_, error, data) => {
  //     if (error) {
  //       //alert('Error while updating student...', error)
  //     } else {
  //       // console.log('from course subject context ---->> ', data)
  //       await queryClient.invalidateQueries({
  //         queryKey: ['getStudentSubjectsMarksBasedOnCourse'],
  //       })
  //       // await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists', data._id]})
  //       //await queryClient.invalidateQueries({queryKey: ['getStudentSubjectsMarksBasedOnCourse']})
  //     }
  //   },
  // })

  // const addOnSubjectControllerMutation = useMutation({
  //   mutationFn: async (data) => {
  //     // console.log(data)
  //     return axios
  //       .post(`${BASE_URL}/api/subjects/add-on-subject`, data, config) // Corrected order of arguments
  //       .then((res) => res.data)
  //   },
  //   onSettled: async (_, error, data) => {
  //     if (error) {
  //       //alert('Error while updating student...', error)
  //     } else {
  //       // console.log('from course subject context ---->> ', data)
  //       await queryClient.invalidateQueries({
  //         queryKey: ['getAddOnSubjects'],
  //       })
  //       // await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists', data._id]})
  //       //await queryClient.invalidateQueries({queryKey: ['getStudentSubjectsMarksBasedOnCourse']})
  //     }
  //   },
  // })

  // const getAddOnSubjectsList = useQuery({
  //   queryKey: ['getAddOnSubjects'],
  //   queryFn: async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/subjects/all-add-on-subjects`, config)
  //       return response.data
  //     } catch (error) {
  //       throw new Error('Error fetching student data: ' + error.message)
  //     }
  //   },
  // })
  //  const updateStudentSubjectMarksMutation = useMutation({
  //   mutationFn: async (updateData) => {
  //     // console.log(updateData)
  //     return axios
  //       .put(
  //         `${BASE_URL}/api/subjects/marks/${updateData.studentId}/${updateData.marksId}`,
  //         updateData,
  //         config
  //       ) // Corrected order of arguments
  //       .then((res) => res.data)
  //   },
  //   onSettled: async (_, error, data) => {
  //     if (error) {
  //       //alert('Error while updating student...', error)
  //     } else {
  //       // console.log('from course subject context ---->> ', data)
  //       // await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists', data._id]})
  //       await queryClient.invalidateQueries({queryKey: ['getStudentSubjectsMarksBasedOnCourse']})
  //     }
  //   },
  // })
  // const useSubjectsBasedOnCourse = (courseId) => {
  //   return useQuery({
  //     queryKey: ['getSubjectsBasedOnCourse', courseId],
  //     queryFn: async () => {
  //       const response = await axios.get(`${BASE_URL}/api/subjects/${courseId}`, config)
  //       // console.log(response)
  //       return response.data
  //     },
  //     enabled: !!courseId, // Only run the query if courseId is provided
  //   })
  // }
  // const useGetStudentSubjectsMarksBasedOnCourse = (studentId) => {
  //   return useQuery({
  //     queryKey: ['getStudentSubjectsMarksBasedOnCourse'],
  //     queryFn: async () => {
  //       const response = await axios.get(`${BASE_URL}/api/subjects/marks/${studentId}`, config)
  //       // console.log(response)
  //       return response.data
  //     },
  //   })
  // }
  // const useGetStudentSubjectBasedOnStudent = (studentId) => {
  //   return useQuery({
  //     queryKey: ['getStudentSubjectBasedOnStudent'],
  //     queryFn: async () => {
  //       const response = await axios.get(`${BASE_URL}/api/subjects/marks/${studentId}`, config)
  //       // console.log(response)
  //       return response.data
  //     },
  //   })
  // }

  return (
    <CourseSubjectContext.Provider
      value={{
        // Admission
        addSubjectsToStudentMutation,

        // Student Subjects
        useGetStudentSubjects,
        useGetStudentSubjectsBasedOnCategory,
        updateStudentSubjectMarksMutation,
        updateStudentBulkSubjectMarksMutation,

        // Admin
        useGetAllStudentSubjectMarks,

        // Course
        useSubjectsBasedOnCourse,
        createCourseSubjectMutation,
        getCourseSubjectLists,
        updateCourseCategoryMutation,
        deleteCourseSubjectMutation,
        // useSubjectsBasedOnCourse,
        // updateCourseSubjectMarksMutation,
        // useGetStudentSubjectsMarksBasedOnCourse,
        // useGetStudentSubjectBasedOnStudent,
        // updateStudentSubjectMarksMutation,
        // Add-On-Subjects,
        // addOnSubjectControllerMutation,
        // getAddOnSubjectsList,
      }}
    >
      {children}
    </CourseSubjectContext.Provider>
  )
}

export const useCourseSubjectContext = () => {
  const context = useContext(CourseSubjectContext)
  if (!context) {
    throw new Error('useAdmissionContext must be used within an AdmissionContextProvider')
  }
  return context
}
