import {useQuery} from 'react-query'
import {KTCard} from '../../_metronic/helpers'
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL

function UserList() {
  const fetchAllUsers = async () => {
    try {
      const {data} = await axios.get(`${BASE_URL}/api/users`)
      return data
    } catch (error) {
      throw new Error('Error fetching users')
    }
  }

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    onError: (error) => {
      console.error(error)
      // You can add additional error handling logic here if needed
    },
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error fetching users</p>
  }

  // console.log(users)

  return (
    <KTCard>
      <div className='table-responsive'>
        <table className='table table-striped gy-7 gs-7'>
          <thead>
            <tr className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'>
              <th className='min-w-200px'>Name</th>
              <th className='min-w-400px'>Role</th>
              <th className='min-w-100px'>Email</th>
              <th className='min-w-200px'>Phone</th>
              <th className='min-w-200px'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id}>
                <td>{user.fName}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{/* Add actions here */}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </KTCard>
  )
}

export default UserList
