import {createContext, useContext, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useAuth} from '../../modules/auth'
import axios from 'axios'

const DynamicFieldContext = createContext()
const BASE_URL = process.env.REACT_APP_BASE_URL

export const DynamicFieldContextProvider = ({children}) => {
  const [fields, setFields] = useState([
    {
      type: 'text',
      name: '',
      value: '',
      mandatory: false,
      quickCreate: false,
      keyField: false,
      headerView: false,
      options: [],
      selectValue: '',
    },
  ])

  // console.log(fields)

  const [formName, setFormName] = useState({
    formName: '',
  })
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const [openModal, setOpenModal] = useState(false)
  const [newField, setNewField] = useState([{name: '', type: 'text', value: '', options: []}])
  const [formData, setFormData] = useState({})
  // console.log(formData)
  const [newOption, setNewOption] = useState('')
  const [newOptionIndex, setNewOptionIndex] = useState(null)

  const handleChange = (index, event) => {
    const values = [...fields]
    const updatedField = {...values[index], value: event.target.value}
    values[index] = updatedField
    setFields(values)

    setFormData({
      ...formData,
      [updatedField.name]: updatedField.value,
    })
  }

  const handleCheckboxChange = (index, optionValue, event, type) => {
    const values = [...fields]
    const updatedField = {...values[index]}
    if (!Array.isArray(updatedField.value)) {
      updatedField.value = []
    }
    // console.log('checkbox value', updatedField.value)

    if (event.target.checked) {
      if (updatedField.value.includes(optionValue) === false) {
        updatedField.value.push(optionValue)
      } else {
        updatedField.value = updatedField.value.filter((item) => item !== optionValue)
      }
    } else {
      updatedField.value = updatedField.value.filter((val) => val !== optionValue)
    }

    values[index] = updatedField
    setFields(values)

    setFormData({
      ...formData,
      [updatedField.name]: updatedField.value,
      type,
    })
  }

  const handleRadioChange = (index, optionValue, type) => {
    const values = [...fields]
    const updatedField = {...values[index], value: optionValue}
    values[index] = updatedField
    setFields(values)

    setFormData({
      ...formData,
      [updatedField.name]: updatedField.value,
      type,
    })
  }

  const handleFieldTypeChange = (index, newType) => {
    const values = [...fields]
    const updatedField = {
      ...values[index],
      type: newType,
      value: newType === 'checkbox' ? [] : newType === 'radio' ? '' : '',
    }
    values[index] = updatedField
    setFields(values)
  }

  const handleCloseModal = () => setOpenModal(false)

  const handleAddField = (index) => {
    const values = [...fields]
    const addedFields = {...values[index]}
    if (newField.trim()) {
      values.push(addedFields)
    }
  }

  const handleAddOption = (index) => {
    const values = [...fields]
    const updatedField = {...values[index]}
    if (newOption.trim()) {
      updatedField.options = [
        ...(updatedField.options || []),
        {label: newOption.trim(), value: newOption.trim()},
      ]
      values[index] = updatedField
      setFields(values)
      setNewOption('')
      setNewOptionIndex(null)
      toast.success('Option added successfully!')
    } else {
      toast.error('Please enter a valid option.')
    }
  }

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const values = [...fields]
    const updatedField = {...values[fieldIndex]}
    updatedField.options = updatedField.options.filter((_, index) => index !== optionIndex)
    values[fieldIndex] = updatedField
    setFields(values)
    toast.info('Option removed.')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    //console.log('Form Data:', formData)
  }

  const handlePropertyChange = (index, property) => {
    const values = [...fields]
    const updatedField = {...values[index], [property]: !values[index][property]}
    values[index] = updatedField
    setFields(values)
  }

  const createCustomFormFieldData = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      return axios.post(`${BASE_URL}/api/custom-field`, data, config)
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
        await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldData']})
      }
    },
  })

  const createaddFormFieldData = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      return axios.post(`${BASE_URL}/api/add-form`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      toast.success('Form Added  Successfully!!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        // console.log(error)
        // alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getaddFormData']})
      }
    },
  })

  const getAllAddedFormsName = useQuery({
    // queryFn: () => {
    //   return axios.get(`${BASE_URL}/api/custom-field`, config)
    // },
    // await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldData']})

    queryKey: ['getaddFormData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/add-form`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const getAllCustomFormFieldDataQuery = useQuery({
    // queryFn: () => {
    //   return axios.get(`${BASE_URL}/api/custom-field`, config)
    // },
    // await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldData']})

    queryKey: ['getCustomFormFieldData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/custom-field`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useGetSingleCustomFieldById = (id) => {
    // console.log(id)
    return useQuery({
      queryKey: ['getCustomFormFieldData', id],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/custom-field/${id}`, config)
          return response.data
          //console.log(response)
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  const updateFieldMutation = useMutation({
    mutationFn: async (id) => {
      // console.log('Dynamic Field Context', id)
      // Perform the PUT request using the `id`
      return axios.put(`${BASE_URL}/api/custom-field/${id.id}`, id, config).then((res) => res.data)
    },

    onSuccess: () => {
      toast.success('Form Field Updated Successfully !!')
    },
    onSettled: async (_, error) => {
      if (error) {
        //toast.error('Error while updating form:', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getCustomFormFieldData'],
        })
      }
    },
  })

  const updateFormNameMutation = useMutation({
    mutationFn: async (id) => {
      // Perform the PUT request using the `id`
      return axios.put(`${BASE_URL}/api/add-form/${id.id}`, id, config).then((res) => res.data)
    },

    onSuccess: () => {
      toast.success('Form Updated Successfully !!')
    },
    onSettled: async (_, error) => {
      if (error) {
        //toast.error('Error while updating form:', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getaddFormData'],
        })
      }
    },
  })

  const deleteFormMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/add-form/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Form Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error While Deleting Form:', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getaddFormData']})
      }
    },
  })

  const deleteFieldMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/custom-field/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Field Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        //toast.error('Error While Deleting the Field !!', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldData']})
      }
    },
  })

  const useGetSingleFormNameById = (id) => {
    return useQuery({
      queryKey: ['getaddFormData', id],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/add-form/${id}`, config)
          return response.data
          //console.log(response)
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  return (
    <DynamicFieldContext.Provider
      value={{
        handleChange,
        newField,
        setNewField,
        handleCloseModal,
        handleAddField,
        handleSubmit,
        handlePropertyChange,
        handleRemoveOption,
        handleAddOption,
        handleFieldTypeChange,
        handleRadioChange,
        handleCheckboxChange,
        fields,
        setFields,
        newOption,
        setNewOption,
        newOptionIndex,
        setNewOptionIndex,
        openModal,
        setOpenModal,
        setFormName,
        formName,
        setFormData,
        // api calls using Query Client
        createCustomFormFieldData,
        getAllCustomFormFieldDataQuery,
        getAllAddedFormsName,
        createaddFormFieldData,
        useGetSingleFormNameById,
        updateFormNameMutation,
        deleteFormMutation,
        deleteFieldMutation,
        useGetSingleCustomFieldById,
        updateFieldMutation,
      }}
    >
      {children}
    </DynamicFieldContext.Provider>
  )
}

export const useDynamicFieldContext = () => {
  const context = useContext(DynamicFieldContext)
  if (!context) {
    throw new Error('Something went wrong! Please try again')
  }
  return context
}
