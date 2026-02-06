export interface IProfileDetails {
  avatar: string
  fName: string
  lName: string
  company: string
  contactPhone: string
  companySite: string
  country: string
  language: string
  timeZone: string
  currency: string
  communications: {
    email: boolean
    phone: boolean
  }
  allowMarketing: boolean
}

export interface AddMissionFormInterface {
  companyName?: string
  rollNumber?: number
  image?: string
  _id?: string
  name: string
  father_name: string
  mobile_number: string
  phone_number: string
  present_address: string
  courseRemainderDuration?: string

  date_of_birth: Date
  city: string
  email: string
  // student_status: string
  // Qualification
  education_qualification: string

  // course
  select_course: string

  // commision
  // name_of_person_for_commision?: string
  // commision_paid?: string
  // commision_date?: string | Date
  // commision_voucher_number?: string
  // for office use only
  course_fees: string | number

  netCourseFees: string | number
  remainingCourseFees?: string | number

  discount: string | number
  down_payment?: string | number
  date_of_joining: string | Date
  installment_duration: string | Date
  no_of_installments: string | number
  no_of_installments_amount: string | number
  createdAt?: string | Date
  updatedAt?: string | Date
  __v?: string | number
}

export interface updateMissionFormInterface {
  companyName?: string
  _id: string | undefined
  name: string
  father_name: string
  mobile_number: string
  phone_number: string
  present_address: string
  //permanent_address: string
  date_of_birth: Date
  city: string
  email: string
  // student_status: string
  // Qualification
  education_qualification: string
  //professional_qualification: string
  // course
  select_course: string
  // document_attached: string
  select_software: string
  // commision
  // name_of_person_for_commision?: string
  // commision_paid?: string
  // commision_date?: string | Date
  // commision_voucher_number?: string
  // for office use only
  course_fees: string | number
  register_fee: string | number
  down_payment?: string | number
  date_of_joining: string | Date
  slot_time: string | Date
  recipt_no: string | number
  no_of_installments: string | number
  no_of_installments_amount: string | number
  date: string | Date
  courseRemainderDuration?: string
}

export const addMissionFormInitialValues: AddMissionFormInterface = {
  companyName: '',
  rollNumber: 0,
  image: '',
  name: '',
  father_name: '',
  mobile_number: '',
  phone_number: '',
  present_address: '',
  //permanent_address: '',
  date_of_birth: new Date(),
  city: '',
  email: '',
  // student_status: '',
  education_qualification: '',
  // professional_qualification: '',
  select_course: '',
  //document_attached: '',
  //select_software: '',
  // name_of_person_for_commision: '',
  // commision_paid: '',
  // commision_date: '',
  // commision_voucher_number: '',
  course_fees: '',
  discount: '',
  netCourseFees: '',
  //remainingCourseFees: '',
  //down_payment: '',
  date_of_joining: '',
  installment_duration: new Date(),
  no_of_installments: '',
  no_of_installments_amount: '',
  createdAt: '',
  updatedAt: '',
  courseRemainderDuration: '',
  __v: 0,
}

export interface addUser {
  fName: string
  lName: string
  email: string
  phone: string
  role: string
  password: string
}
export const addUserInitialValues: addUser = {
  fName: 'Max',
  lName: 'Smith',
  email: 'example@gmail.com',
  phone: '+91 1235689',
  role: 'Admin',
  password: '234572dsjn',
}

export interface IUpdateEmail {
  newEmail: string
  confirmPassword: string
}

export interface IUpdatePassword {
  currentPassword: string
  newPassword: string
  passwordConfirmation: string
}

export interface IConnectedAccounts {
  google: boolean
  github: boolean
  stack: boolean
}

export interface IEmailPreferences {
  successfulPayments: boolean
  payouts: boolean
  freeCollections: boolean
  customerPaymentDispute: boolean
  refundAlert: boolean
  invoicePayments: boolean
  webhookAPIEndpoints: boolean
}

export interface INotifications {
  notifications: {
    email: boolean
    phone: boolean
  }
  billingUpdates: {
    email: boolean
    phone: boolean
  }
  newTeamMembers: {
    email: boolean
    phone: boolean
  }
  completeProjects: {
    email: boolean
    phone: boolean
  }
  newsletters: {
    email: boolean
    phone: boolean
  }
}

export interface IDeactivateAccount {
  confirm: boolean
}

export const profileDetailsInitValues: IProfileDetails = {
  avatar: '/media/avatars/300-1.jpg',
  fName: 'Max',
  lName: 'Smith',
  company: 'Keenthemes',
  contactPhone: '044 3276 454 935',
  companySite: 'keenthemes.com',
  country: '',
  language: '',
  timeZone: '',
  currency: '',
  communications: {
    email: false,
    phone: false,
  },
  allowMarketing: false,
}

export const updateEmail: IUpdateEmail = {
  newEmail: 'support@keenthemes.com',
  confirmPassword: '',
}

export const updatePassword: IUpdatePassword = {
  currentPassword: '',
  newPassword: '',
  passwordConfirmation: '',
}

export const connectedAccounts: IConnectedAccounts = {
  google: true,
  github: true,
  stack: false,
}

export const emailPreferences: IEmailPreferences = {
  successfulPayments: false,
  payouts: true,
  freeCollections: false,
  customerPaymentDispute: true,
  refundAlert: false,
  invoicePayments: true,
  webhookAPIEndpoints: false,
}

export const notifications: INotifications = {
  notifications: {
    email: true,
    phone: true,
  },
  billingUpdates: {
    email: true,
    phone: true,
  },
  newTeamMembers: {
    email: true,
    phone: false,
  },
  completeProjects: {
    email: false,
    phone: true,
  },
  newsletters: {
    email: false,
    phone: false,
  },
}

export const deactivateAccount: IDeactivateAccount = {
  confirm: false,
}
