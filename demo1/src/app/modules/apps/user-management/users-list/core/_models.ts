import {ID, Response} from '../../../../../../_metronic/helpers'
// export type User = {
//   id?: ID
//   name?: string
//   avatar?: string
//   email?: string
//   position?: string
//   role?: string
//   last_login?: string
//   two_steps?: boolean
//   joined_day?: string
//   online?: boolean
//   initials?: {
//     label: string
//     state: string
//   }
// }
export type User = {
  id?: ID
  avatar?: string
  fName?: string
  lName?: string
  email?: string
  role?: string
  phone?: string
  password?: string
}
export type User1 = {
  _id?: ID
  avatar?: string
  fName?: string
  lName?: string
  email?: string
  role?: string
  phone?: string
  password?: string
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  role: 'Admin',
  fName: '',
  email: '',
  phone: '',
  lName: '',
  password: '',
}
