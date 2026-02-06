import axios from 'axios'
import {createContext, useContext, useEffect} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useAuth} from '../../modules/auth'
import {toast} from 'react-toastify'

const BatchContext = createContext(null)
const baseUrl = process.env.REACT_APP_BASE_URL || ''

/* ===========================
      API Helper Functions
=========================== */

// CREATE BATCH
const createBatchApi = async (payload, config) => {
  const res = await axios.post(`${baseUrl}/api/batches`, payload, config)
  return res.data
}

// GET ALL BATCH WITH FILTERS
const fetchAllBathes = async (filters,companyId, config) => {
  console.log('compny',companyId)
  // const query = new URLSearchParams(filters).toString()
  const query = new URLSearchParams(
  Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value
    }
    return acc
  }, {})
).toString()
  const res = await axios.get(`${baseUrl}/api/batches/company/${companyId}?${query}`, config)
  return res.data
}

// GET BATCH BY ID OR SINGLE BATCH
const fetchBatchById = async (id, config) => {
  const res = await axios.get(`${baseUrl}/api/batches/${id}`, config)
  return res.data
}

// UPDATE BATCHES
const updateBatchApi = async ({id, payload}, config) => {
  const res = await axios.put(`${baseUrl}/api/batches/${id}`, payload, config)
  return res.data
}

// DELETE BATCH
const deleteBatchApi = async (id, config) => {
  const res = await axios.delete(`${baseUrl}/api/batches/${id}`, config)
  return res.data
}

// UPDATE BATCH STATUS (ADMIN ONLY)
const updateBatchStatusApi = async ({id, status}, config) => {
  const res = await axios.patch(`${baseUrl}/api/batches/${id}/status`, {status}, config)
  return res.data
}

// GET PENDING BATCHES (SUPERADMIN ONLY)
const fetchPendingBatches = async (config) => {
  const res = await axios.get(`${baseUrl}/api/batches/pending/all`, config)
  return res.data
}

// FETCH STUDENT'S PROGRESS
const fetchStudentProgress = async(batchId,studentId,config)=>{
  const res = await axios.get(`${baseUrl}/api/batches/${batchId}/student/${studentId}/progress`, config)
  return res.data;
};

// ADD STUDENT TO BATCH
const addStudentToBatchApi =async ({batchId,payload}, config)=>{
  const res = await axios.post(`${baseUrl}/api/batches/${batchId}/student`,payload, config)
  return res.data;
}

// UPDATE STUDENT SUBJECT STATUS API
const updateSubjectStatusApi = async({batchId,studentId,subjectId,payload}, config)=>{
  const res = await axios.put(`${baseUrl}/api/batches/${batchId}/student/${studentId}/subject/${subjectId}`, payload, config);
  return res.data;
}

// REMOVE STUDENT FROM BATCH
const removeStudentFromBatchApi = async({batchId,studentId}, config)=>{
  const res = await axios.delete(`${baseUrl}/api/batches/${batchId}/student/${studentId}`, config);
  return res.data
}

/* ===========================
      Provider
=========================== */
export const BatchProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  //console.log('auth',auth)
  const config = {
    headers: { Authorization: `Bearer ${auth?.api_token}` },
  }
  /* ============
       QUERIES
  ============= */

  // all batches (filters)
  const useGetALLbatches = (filters = {},companyId) => {
    return useQuery(['batches',companyId, filters ], () => fetchAllBathes(filters,companyId, config), 
    {
      enabled: !!companyId,
      staleTime: 1000 * 60 * 2,
    })
  }

  /// single batch or batch by id
  const useGetBatchById = (id) => {
    return useQuery(['batch', id], () => fetchBatchById(id, config), {
      enabled: !!id,
    })
  }

  /// pending batches
  const useGetPendingBatches = () => {
    return useQuery(['batches', 'pending'], () => fetchPendingBatches(config), {
      staleTime: 100 * 60 * 2,
    })
  }

  // get student progress
  const useGetStudentProgress = (batchId,studentId)=>{
    return useQuery(['batch-student-progress',batchId,studentId],
        ()=> fetchStudentProgress(batchId,studentId, config),
        {enabled: !!batchId && !!studentId}
    )
  };

  /* ============
      MUTATIONS
  ============= */

  //create
  const useCreateBatch = () => {
    return useMutation((payload) => createBatchApi(payload, config), {
      onSuccess: () => {
        queryClient.invalidateQueries(['batches'])
        toast.success('Batch created successfully')
      },
    })
  }

  // update
  const useUpdateBatch = () => {
    return useMutation(({id, payload}) => updateBatchApi({id, payload}, config), {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['batches'])
        if (variables?.id) {
          queryClient.invalidateQueries(['batch', variables?.id])
        }
        toast.success('Batch updated')
      },
    })
  }

  // delete
  const useDeleteBatch = () => {
    return useMutation((id) => deleteBatchApi(id, config), {
      onSuccess: () => {
        queryClient.invalidateQueries(['batches'])
        toast.success('Batch deleted')
      },
    })
  }

  /// update status
  const useUpdateBatchStatus = () => {
    return useMutation(({id, status}) => updateBatchStatusApi({id, status}, config), {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries(['batches'])
        queryClient.invalidateQueries(['batch', vars?.id])
        queryClient.invalidateQueries(['batches', 'pending'])
        toast.success('Batch status updated')
      },
    })
  }

  // add student to batch
  const useAddStudentToBatch = ()=>{
    return useMutation(({batchId,payload})=> addStudentToBatchApi({batchId,payload}, config),{
      onSuccess: (_,variables) =>{
        queryClient.invalidateQueries(['batches']);
        queryClient.invalidateQueries(['batch',variables?.batchId]);
        toast.success('Student added to batch')
      }
    })
  };

  // update subject status
  const useUpdateSubjectStatus =()=>{
    return useMutation(
      ({batchId,studentId,subjectId,payload}) =>
        updateSubjectStatusApi({batchId,studentId,subjectId,payload}, config),
      {
        onSuccess: (_, variables)=>{
          queryClient.invalidateQueries(['batch',variables?.batchId]);
          queryClient.invalidateQueries(['batch-student-progress',variables?.batchId,variables?.studentId])
          toast.success('Subject status updated')
        }
      }
    )
  };

  // remove student from batch
  const useRemoveStudentFromBatch = ()=>{
    return useMutation(({batchId,studentId}) => removeStudentFromBatchApi({batchId,studentId}, config),{
      onSuccess: (_, variables) =>{
        queryClient.invalidateQueries(['batches'])
        queryClient.invalidateQueries(['batch',variables?.batchId])
        toast.success('Student removed from batch')
      }
    })
  };

  /* ============
      EXPORT VALUE
  ============= */

  const value = {
      useCreateBatch,
      useDeleteBatch,
      useUpdateBatch,
    useGetALLbatches,
    useGetBatchById,
    useGetPendingBatches,
    useUpdateBatchStatus,
    useGetStudentProgress,
    useAddStudentToBatch,
    useUpdateSubjectStatus,
    useRemoveStudentFromBatch,
  }

  return <BatchContext.Provider value={value}>{children} </BatchContext.Provider>
}

export const useBatchContext = ()=>{
  const ctx = useContext(BatchContext);
  if(!ctx){
    throw new Error("useBatchContext must be used within BatchProvider");
  }
  return ctx;
}

export default BatchContext
