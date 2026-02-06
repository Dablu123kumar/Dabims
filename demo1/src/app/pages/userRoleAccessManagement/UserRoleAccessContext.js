import axios from 'axios'
import {createContext, useContext} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useAuth} from '../../modules/auth'

const UserRoleAccess = createContext()
const BASE_URL = process.env.REACT_APP_BASE_URL

export const UserRoleAccessProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }
  const postUserRoleAccessData = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      return axios.post(`${BASE_URL}/api/user-role`, data, config)
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
        // toast.error(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getUserRoleAccessData']})
      }
    },
  })

  const getAllUserAccessRoleData = useQuery({
    // queryFn: () => {
    //   return axios.get(`${BASE_URL}/api/custom-field`, config)
    // },
    // await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldData']})

    queryKey: ['getUserRoleAccessData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user-role`, config)
        //console.log('roledata',response.data)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  return (
    <UserRoleAccess.Provider value={{postUserRoleAccessData, getAllUserAccessRoleData}}>
      {children}
    </UserRoleAccess.Provider>
  )
}

const useUserRoleAccessContext = () => {
  const context = useContext(UserRoleAccess)
  if (!context) {
    throw new Error('SomeThing went wrong !! Please Try Again Later!!')
  }
  return context
}

export default useUserRoleAccessContext
