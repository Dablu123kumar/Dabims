import {createContext, useContext} from 'react'
import {useAuth} from '../../modules/auth'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {toast} from 'react-toastify'
import axios from 'axios'

const attendanceContext = createContext()
const BASE_URL = process.env.REACT_APP_BASE_URL

export const AttendanceContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  // Trainers Query's Start here

  const createTrainerData = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      const res = await axios.post(`${BASE_URL}/api/add-trainer`, data, config)
      // console.log(res)
      return res.data
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
        toast.error(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getTrainerData']})
      }
    },
  })

  const getAllTrainersData = useQuery({
    queryKey: ['getTrainerData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/add-trainer`, config)
        // console.log(response.data.trainers)
        return response.data.trainers
      } catch (error) {
        throw new Error('Error fetching Trainer data: ' + error.message)
      }
    },
  })

  const useGetSingleTrainerDataById = (id) => {
    return useQuery({
      queryKey: ['getTrainerData', id],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/add-trainer/${id}`, config)
          return response.data
          //console.log(response)
        } catch (error) {
          throw new Error('Error fetching trainer data: ' + error.message)
        }
      },
    })
  }

  const updateTrainerDataMutation = useMutation({
    mutationFn: async (formData) => {
      const trainerId = formData.get('id')
      // console.log(trainerId)
      // Perform the PUT request using the `id`
      return axios
        .put(`${BASE_URL}/api/add-trainer/${trainerId}`, formData, config)
        .then((res) => res.data)
      // console.log(res)
    },

    onSuccess: () => {
      toast.success('Trainer Updated Successfully !!')
    },
    onSettled: async (_, error) => {
      if (error) {
        toast.error('Error while updating trainer:', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getTrainerData'],
        })
      }
    },
  })

  const deleteTrainerDataMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/add-trainer/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Form Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error While Deleting Form:', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getTrainerData']})
      }
    },
  })

  // Lab Query's Start here

  const createLabData = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      const res = await axios.post(`${BASE_URL}/api/add-lab`, data, config)
      // console.log(res)
      return res.data
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
        toast.error(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getLabData']})
      }
    },
  })

  const getAllLabsData = useQuery({
    queryKey: ['getLabData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/add-lab`, config)
        // console.log(response.data.trainers)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useGetSingleLabDataById = (id) => {
    return useQuery({
      queryKey: ['getLabData', id],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/add-lab/${id}`, config)
          return response.data
          //console.log(response)
        } catch (error) {
          throw new Error('Error fetching lab data: ' + error.message)
        }
      },
    })
  }

  const updateLabDataMutation = useMutation({
    mutationFn: async (id) => {
      //console.log(id)
      // Perform the PUT request using the `id`
      return axios.put(`${BASE_URL}/api/add-lab/${id.id}`, id, config).then((res) => res.data)
      // console.log(res)
    },

    onSuccess: () => {
      toast.success('Lab Updated Successfully !!')
    },
    onSettled: async (_, error) => {
      if (error) {
        toast.error('Error while updating Lab:', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getLabData'],
        })
      }
    },
  })

  const deleteLabDataMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/add-lab/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Form Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error While Deleting Form:', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getLabData']})
      }
    },
  })

  // Batch Timings Quiery's Start Here

  const createBatchTiming = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      const res = await axios.post(`${BASE_URL}/api/add-timing`, data, config)
      // console.log(res)
      return res.data
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
        toast.error(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getBatchTiming']})
      }
    },
  })

  const getAllBatchTimings = useQuery({
    queryKey: ['getBatchTiming'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/add-timing`, config)
        // console.log(response.data.trainers)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useGetSingleBatchTimeById = (id) => {
    return useQuery({
      queryKey: ['getBatchTiming', id],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/add-timing/${id}`, config)
          return response.data
          //console.log(response)
        } catch (error) {
          throw new Error('Error fetching lab data: ' + error.message)
        }
      },
    })
  }

  const updateBatchTimeMutation = useMutation({
    mutationFn: async (id) => {
      // console.log(id)
      // Perform the PUT request using the `id`
      return axios.put(`${BASE_URL}/api/add-timing/${id.id}`, id, config).then((res) => res.data)
      // console.log(res)
    },

    onSuccess: () => {
      toast.success('Lab Updated Successfully !!')
    },
    onSettled: async (_, error) => {
      if (error) {
        toast.error('Error while updating Lab:', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getBatchTiming'],
        })
      }
    },
  })

  const deleteBatchTimeMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/add-timing/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Form Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error While Deleting Form:', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getBatchTiming']})
      }
    },
  })

  /// attendence query statrt here 
  
  const saveAttendenceMutation = useMutation({
    mutationFn:async(data)=>{
      const res = await axios.post(`${BASE_URL}/api/attendence`,data,config)
      return res.data
    },
    onSuccess: async(data)=>{
       console.log(data)
       toast.success(data?.message)
    },
    onSettled: async (_,error)=>{
      if(error){
        console.log(error)
        toast.error(error.response?.data?.message || 'Error in saving attendence') 
      }
      else{
        await queryClient.invalidateQueries({queryKey:['getAttendance']})
      }
    }
  })

  const useGateAttendenceByBatch = (batchId,month,year) =>{
    return useQuery(
      ['getAttendance',batchId,month,year],
        async ()=>{
        const res = await axios.get(`${BASE_URL}/api/attendence/${batchId}?month=${month}&year=${year}`,config)
        return res.data
      },
      {
        enabled : !!batchId ,
        keepPreviousData : true,
      }
    )
  }

  const useGateAttendanceByStudentId = (studentId)=>{
    return useQuery(
      ['getAttendanceByStudnedId',studentId],
      async ()=> {
        const res =  await axios.get(`${BASE_URL}/api/attendence/student/${studentId}`,config)
          return res.data
      },
      {
        enabled : !!studentId,
        keepPreviousData:true,
      }

    )
  }

  return (
    <attendanceContext.Provider
      value={{
        // Trainers
        createTrainerData,
        getAllTrainersData,
        updateTrainerDataMutation,
        deleteTrainerDataMutation,
        useGetSingleTrainerDataById,
        // Labs
        createLabData,
        getAllLabsData,
        useGetSingleLabDataById,
        updateLabDataMutation,
        deleteLabDataMutation,
        // Timings
        createBatchTiming,
        getAllBatchTimings,
        useGetSingleBatchTimeById,
        updateBatchTimeMutation,
        deleteBatchTimeMutation,

        // attendence
        saveAttendenceMutation,
        useGateAttendenceByBatch,
        useGateAttendanceByStudentId
      }}
    >
      {children}
    </attendanceContext.Provider>
  )
}

export const useAttendanceContext = () => {
  const context = useContext(attendanceContext)
  if (!context) {
    throw new Error('useAttendanceContext must be used within attendanceContextProvider')
  }
  return context
}
