import {createContext, useContext, useEffect, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../modules/auth'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

const CompanyContext = createContext()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const CompanyContextProvider = ({children}) => {
  const [selectedCompany,setSelectedCompany] = useState(null)
  const [emailTemplate,setEmailTemplate] = useState([])
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const getCompanyLists = useQuery({
    queryKey: ['getCompanyLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/company`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })
  const useGetSingleCompanyData = (companyId) => {
    //console.log('companyid',companyId)
    return useQuery({
      queryKey: ['getCompanyLists', companyId],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/company/${companyId}`, config)
          //console.log('data',response.data)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }
  const getEmailSuggestionStatus = useQuery({
    queryKey: ['getEmailRemainderSuggesstions'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/emailRemainder/status`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const getWelcomeEmailSuggestionStatus = useQuery({
    queryKey: ['getWelcomeEmailRemainderSuggesstions'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/emailRemainder/welcome/status`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  //console.log(getCompanyLists)

  //console.log(studentsLists)
  const createAddCompanyMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/company`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCompanyLists']})
      }
    },
  })

  // Course Types
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/company/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {},
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCompanyLists']})
      }
    },
  })

  // update Course type
  const updateCompanyMutation = useMutation({
    mutationFn: async (updateData) => {
      let id = updateData.get('id')
      return axios
        .put(`${BASE_URL}/api/company/${id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert('Error while updating student...', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getCompanyLists'],
        })
      }
    },
  })

  // add email remainder text from input fields data
  const postEmailRemainderText = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/emailRemainder`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getRemainderText']})
      }
    },
  })

  // add email remainder Days from input fields data
  const postEmailRemainderDays = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/emailRemainder/remainder-dates`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getRemainderDates']})
      }
    },
  })

  const getEmailRemainderDays = useQuery({
    queryKey: ['getRemainderDates'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/emailRemainder/remainder-dates`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  // add email remainder suggestions
  const postEmailSuggestionStatus = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/emailRemainder/status`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getEmailRemainderSuggesstions']})
      }
    },
  })

  const postWelcomeEmailSuggestionStatus = useMutation({
    mutationFn: async (data) => {
      console.log(data)
      return axios.post(`${BASE_URL}/api/emailRemainder/welcome/status`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getWelcomeEmailRemainderSuggesstions']})
      }
    },
  })


  
  // post whatsapp message suggestion
  const postWhatsAppMessageSuggestionStatus = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/whatsAppMessageSuggestion/status`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getWhatsAppMessageSuggesstions']})
      }
    },
  })

  const postLateFeesSuggestionStatus = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/emailRemainder/late-fees/status`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getLateFeesSuggesstions']})
      }
    },
  })

  const getLateFeesSuggestionStatus = useQuery({
    queryKey: ['getLateFeesSuggesstions'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/emailRemainder/late-fees/status`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const getEmailRemainderTextMessage = useQuery({
    queryKey: ['getRemainderText'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/emailRemainder`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const getWhatsAppMessageuggestionStatus = useQuery({
    queryKey: ['getWhatsAppMessageSuggesstions'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/whatsAppMessageSuggestion/status`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const postStudentGSTSuggestionStatus = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/student-gst-suggestions/add`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getStudentGSTSuggesstions']})
      }
    },
  })

  const getStudentGSTSuggestionStatus = useQuery({
    queryKey: ['getStudentGSTSuggesstions'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/student-gst-suggestions`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  // ************************************ Get Students According to Company Wise ********************************
  const useGetStudentsAccordingToCompanyQuery = (companyId) => {
    return useQuery({
      queryKey: ['getStudents', companyId],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/students/company/${companyId}`, config)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  // student commission start here --------------------------------------------------
  const createStudentCommissionMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/students/commission`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: async () => {
      toast(`Student Commission created successfully!`, {
        type: 'success',
        bodyStyle: {
          fontSize: '18px',
        },
      })
      await queryClient.invalidateQueries({
        queryKey: ['getDayBookDataLists'],
      })
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        toast.warn(error.response.data.error, {
          type: 'error',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getDayBookDataLists', 'getStudentCommissionLists'],
        })
      }
    },
  })

  const useGetStudentCommissionDataQuery = (data) => {
    //console.log('props',data)
    return useQuery({
      queryKey: ['getStudentCommissionLists', data],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/students/commissionList`,{ params: {studentName:data}, ...config})
          //console.log('response',response.data)
          return response.data // Return the data fetched from the API
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  // student commission end here --------------------------------------------------

  //  ------------------------------------- Student Issues Start here -------------------------------------------
  const createStudentIssueMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/student-issues`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: async (res) => {
      if (res.data.success) {
        toast.success(res.data.message)
      }
      await queryClient.invalidateQueries({
        queryKey: ['getStudentIssues'],
      })
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        toast.warn(error.response.data.error, {
          type: 'error',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudentIssues'],
        })
      }
    },
  })

  const useUpdateStudentIssueMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.put(`${BASE_URL}/api/student-issues/${data.id}`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: async (res) => {
      if (res.data.success) {
        toast.success(res.data.message)
      }
      await queryClient.invalidateQueries({
        queryKey: ['getStudentIssues'],
      })
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        toast.warn(error.response.data.error, {
          type: 'error',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudentIssues'],
        })
      }
    },
  })

  const useDeleteStudentIssueMutation = useMutation({
    mutationFn: async (id) => {
      //console.log(data)
      return axios.delete(`${BASE_URL}/api/student-issues/${id}`, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: async (res) => {
      if (res.data.success) {
        toast.success(res.data.message)
      }
      await queryClient.invalidateQueries({
        queryKey: ['getStudentIssues'],
      })
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        toast.warn(error.response.data.error, {
          type: 'error',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudentIssues'],
        })
      }
    },
  })

  const getStudentIssuesListsQuery = useQuery({
    queryKey: ['getStudentIssues'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/student-issues`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  //  ------------------------------------- Student Issues End here ---------------------------------------------

  // -------------------------------- Show Student status Dashboard start here -----------------------------------
  const useUpdateStudentStatusShowNotesDashboardMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(`${BASE_URL}/api/student-issues/showStudentDashboard`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: async (res) => {
      //console.log(res)
      if (res.data.success) {
        toast.success(res.data.message)
      }
      await queryClient.invalidateQueries({
        queryKey: ['getStudentIssuesStatus'],
      })
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        toast.warn(error.response.data.error, {
          type: 'error',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudentIssuesStatus'],
        })
      }
    },
  })

  const useGetSingleStudentIssueStatusQuery = (studentId) => {
    return useQuery({
      queryKey: ['getStudentIssuesStatus', studentId],
      queryFn: async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/student-issues/showStudentDashboard/${studentId}`,
            config
          )
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }
  const useGetAllStudentIssueStatusQuery = useQuery({
    queryKey: ['getStudentIssuesStatus'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/student-issues/showStudentDashboard`,
          config
        )
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  // -------------------------------- Show Student status Dashboard End here -----------------------------------

  // -------------------------------- Email Template Starts Here -----------------------------------
  const postEmailTemplate = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      const res = axios.post(`${BASE_URL}/api/email/template`, data, config)
      console.log('res',res?.data)
      return res  
     },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getEmailTemplate']})
      }
    },
  })

  const getEmailTemplate = useQuery({
    queryKey: ['getEmailTemplate'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/email/allTemplates`, config) 
        //console.log('allT',response.data)
        setEmailTemplate(response.data)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })


  useEffect(()=>{
    const savedCompany = localStorage.getItem('selectedCompany')
    if(savedCompany){
      setSelectedCompany(JSON.parse(savedCompany))
    }
  },[])
  useEffect(()=>{
    if(selectedCompany){
      localStorage.setItem('selectedCompany',JSON.stringify(selectedCompany))
    }
  },[selectedCompany])




  return (
    <CompanyContext.Provider
      value={{
        selectedCompany,
        setSelectedCompany,
        createAddCompanyMutation,
        getCompanyLists,
        useGetSingleCompanyData,
        deleteCompanyMutation,
        updateCompanyMutation,
        postEmailRemainderText,
        postEmailRemainderDays,
        postEmailSuggestionStatus,
        getEmailSuggestionStatus,
        postWelcomeEmailSuggestionStatus,
        getWelcomeEmailSuggestionStatus,
        useGetStudentsAccordingToCompanyQuery,
        createStudentCommissionMutation,
        useGetStudentCommissionDataQuery,
        /* ***************************** Student GSt ----------------------  */
        postStudentGSTSuggestionStatus,
        getStudentGSTSuggestionStatus,
        /* ***************************** Student GSt ----------------------  */
        /***************** Email Template ************************/
        postEmailTemplate,
        getEmailTemplate,
        emailTemplate,
        /***************************  whatsapp Message Suggestion start   *****************************/
        postWhatsAppMessageSuggestionStatus,
        getWhatsAppMessageuggestionStatus,
        getEmailRemainderTextMessage,
        getEmailRemainderDays,
        /***************************  whatsapp Message Suggestion end   *****************************/
        /***************************  whatsapp Message Suggestion start   *****************************/
        postLateFeesSuggestionStatus,
        getLateFeesSuggestionStatus,
        /***************************  whatsapp Message Suggestion end   *****************************/

        // student issues start here --------------------------------------
        createStudentIssueMutation,
        getStudentIssuesListsQuery,
        useUpdateStudentIssueMutation,
        useUpdateStudentStatusShowNotesDashboardMutation,
        useGetSingleStudentIssueStatusQuery,
        useDeleteStudentIssueMutation,
        useGetAllStudentIssueStatusQuery,

        // student issues end here --------------------------------------
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompanyContext = () => {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('Something went wrong! Please try again')
  }
  return context
}
