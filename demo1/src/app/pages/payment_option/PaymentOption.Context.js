import {createContext, useContext, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../modules/auth'
import {toast} from 'react-toastify'
const PaymentOptionContext = createContext()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const PaymentOptionContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const getPaymentOptionsData = useQuery({
    queryKey: ['getPaymentOptionsLists'],
    queryFn: async () => {
      return axios.get(`${BASE_URL}/api/paymentOptions`, config).then((res) => res.data)
    },
  })

  const createNewPaymentOptionMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/paymentOptions`, data, config).then((res) => res.data)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      console.log('error')
    },

    onSuccess: () => {
      //alert('Added Student  Course fee  Successfully!')
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getPaymentOptionsLists'],
        })
      }
    },
  })

  // Course Types
  const deletePaymentOptionMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/paymentOptions/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      toast.error('Payment Option  deleted successfully')
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getPaymentOptionsLists']})
      }
    },
  })

  // update Course type
  const updatePaymentOptionsMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/paymentOptions/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert('Error while updating student...', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getPaymentOptionsLists']})
      }
    },
  })

  // ------------------------------------- Starting Day Book Context goes start here --------------------------------
  const createDayBookAccountMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/dayBook/addAccount`, data, config).then((res) => res.data)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      console.log('error')
    },

    onSuccess: () => {
      //alert('Added Student  Course fee  Successfully!')
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getDayBookAccountsLists'],
        })
      }
    },
  })

  const getDayBookAccountsLists = useQuery({
    queryKey: ['getDayBookAccountsLists'],
    queryFn: async () => {
      return axios.get(`${BASE_URL}/api/dayBook`, config).then((res) => res.data)
    },
  })

  const useGetSingleDayBookAccount = (id) => {
    return useQuery({
      queryKey: ['getDayBookAccountsLists', id],
      queryFn: async () => {
        return axios
          .get(`${BASE_URL}/api/dayBook/singleAccountAccount/${id}`)
          .then((res) => res.data)
      },
    })
  }

  const deleteDayBooksAccountMutation = useMutation({
    mutationFn: async (id) => {
      if (!window.confirm('Are you sure you want to delete')) {
        return
      }
      return axios.delete(`${BASE_URL}/api/dayBook/${id}`, config).then((res) => res.data)
    },

    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getDayBookAccountsLists']})
      }
    },
  })

  // update DayBookAccounts
  const updateDayBookAccountsMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/dayBook/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert('Error while updating day book Account...', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getDayBookAccountsLists']})
      }
    },
  })
  //  ************************* Day Book Data Start here ************************
  //  add day book data
  const createDayBookDataMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/dayBook/addData`, data, config).then((res) => res.data)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: async (data) => {
      //console.log(data)
      if (data.success === true) {
        toast.success(data.message, {bodyStyle: {fontSize: '18px'}})
      }
      //alert('Added Student  Course fee  Successfully!')
      //console.log('success')
      await queryClient.invalidateQueries({
        queryKey: ['getDayBookDataLists'],
      })
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        toast.error(error.response.data.message)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getDayBookDataLists'],
        })
      }
    },
  })

  const getDayBookDataQuery = useQuery({
    queryKey: ['getDayBookDataLists'],
    queryFn: async () => {
      return axios.get(`${BASE_URL}/api/dayBook/data`, config).then((res) => res.data)
    },
  })

  const useGetSingleDayBookAccountNameDataQuery = (id) => {
    //  console.log(id)
    const result = useQuery({
      queryKey: ['getDayBookDataLists', id],
      queryFn: async () => {
        return axios
          .get(`${BASE_URL}/api/dayBook/singleAccountDayBookLists/${id}`, config)
          .then((res) => res.data)
      },
    })
    return result
  }

  const deleteSingleDayBookDataById = useMutation({
    mutationFn: async (id) => {
      //console.log(id)
      return axios.delete(`${BASE_URL}/api/dayBook/data/${id}`, config).then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getDayBookDataLists']})
      }
    },
  })

  const updateDayBookDataMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/dayBook/data/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert('Error while updating day book Account...', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getDayBookDataLists']})
      }
    },
  })

  // ------------------------------------- Starting Day Book Context goes end here ----------------------------------

  return (
    <PaymentOptionContext.Provider
      value={{
        deletePaymentOptionMutation,
        createNewPaymentOptionMutation,
        updatePaymentOptionsMutation,
        getPaymentOptionsData,
        // ----------- Day Book Account ----------------
        createDayBookAccountMutation,
        getDayBookAccountsLists,
        deleteDayBooksAccountMutation,
        updateDayBookAccountsMutation,
        useGetSingleDayBookAccount,
        // ----------- Day Book Account ----------------
        // ----------- Day Book DATA ----------------
        createDayBookDataMutation,
        getDayBookDataQuery,
        useGetSingleDayBookAccountNameDataQuery,
        deleteSingleDayBookDataById,
        updateDayBookDataMutation,

        // ----------- Day Book DATA ----------------
      }}
    >
      {children}
    </PaymentOptionContext.Provider>
  )
}

export const usePaymentOptionContextContext = () => {
  const context = useContext(PaymentOptionContext)
  if (!context) {
    throw new Error('something went wrong')
  }
  return context
}
