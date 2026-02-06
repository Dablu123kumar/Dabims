import {createContext, useContext, useEffect, useState} from 'react'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useAuth} from '../../../modules/auth'
import axios from 'axios'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CustomFormFieldDataContext = createContext()
const BASE_URL = process.env.REACT_APP_BASE_URL

export const CustomFormFieldDataContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }
  const [input, setInput] = useState({})
  const {fields, setFields, getAllCustomFormFieldDataQuery} = useDynamicFieldContext()
  // console.log('fields from custom', fields)
  const [formData, setFormData] = useState([{}])
  // console.log(formData)
  const [fieldValues, setFieldValues] = useState([])

  useEffect(() => {
  //console.log('CustomFormFieldDataQuery data:', getAllCustomFormFieldDataQuery?.data)
  if (Array.isArray(getAllCustomFormFieldDataQuery?.data)) {
    setFieldValues(getAllCustomFormFieldDataQuery.data.map((field) => field.value || []))
  } else if (Array.isArray(getAllCustomFormFieldDataQuery?.data?.data)) {
    // In case API returns { data: [...] }
    setFieldValues(getAllCustomFormFieldDataQuery.data.data.map((field) => field.value || []))
  } else {
    console.warn('Unexpected API response:', getAllCustomFormFieldDataQuery?.data)
    setFieldValues([]) // avoid crash
  }
}, [getAllCustomFormFieldDataQuery?.data])
///////////////// addd for default ////////
  // useEffect(() => {
  //   if (getAllCustomFormFieldDataQuery?.data) {
  //     setFieldValues(getAllCustomFormFieldDataQuery.data.map((field) => field.value || []))
  //   }
  // }, [getAllCustomFormFieldDataQuery?.data])

  const handleInputChange = (index, newValue, fieldName, type) => {
    // console.log(type)
    // console.log(fieldName)

    const updatedValues = [...fieldValues]
    updatedValues[index] = newValue
    setFieldValues(updatedValues)

    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: {newValue, type},
    }))
    // setFormData((prevFormData) => {
    //   const prevFormDataArray = prevFormData || []
    //   console.log(prevFormDataArray)
    //   return prevFormDataArray.concat([{[fieldName]: newValue, type}])
    // })
  }

  // const handleChange = (event) => {
  //   const {name, value} = event.target
  //   console.log('Input name:', name)
  //   console.log('Input value:', value)
  //   setInput(value)
  // }

  const handleOptionChange = (index, event, fieldName, type, optionValue) => {
    const values = [...fields]
    // console.log('handle option change ', values)
    const updatedField = {
      ...values[index],
      value: optionValue,
      name: fieldName || values[index].name,
    }

    values[index] = updatedField
    setFields(values)
    //console.log('update field farom ', fields)

    setFormData((prevFormData) => ({
      ...prevFormData,
      [updatedField.name]: {newValue: optionValue, type},
    }))
  }

  const handleCheckboxChange = (index, optionValue, event, fieldName, type) => {
    const values = [...fields]
    const updatedField = {
      ...values[index],
      name: fieldName || values[index].name,
    }

    // Ensure updatedField.value is an array
    if (!Array.isArray(updatedField.value)) {
      updatedField.value = []
    }

    if (event.target.checked) {
      // Add the optionValue if it doesn't already exist
      if (!updatedField.value.includes(optionValue)) {
        updatedField.value.push(optionValue)
      }
    } else {
      // Remove the optionValue if it exists
      updatedField.value = updatedField.value.filter((checkValue) => checkValue !== optionValue)
    }

    values[index] = updatedField
    setFields(values)

    setFormData((prevFormData) => ({
      ...prevFormData,
      [updatedField.name]: {
        newValue: updatedField.value,
        type,
      },
    }))
  }

  const handleSelectChange = (index, event, fieldName, type) => {
    const selectedValue = event.target.value
    //console.log(selectedValue, index)
    const values = [...fields]

    const updatedField = {
      ...values[index],
      name: fieldName || values[index].name,
      selectValue: selectedValue || values[index].selectValue,
    }
    // console.log(updatedField)
    values[index] = updatedField

    setFields(values)

    setFormData((prevFormData) => ({
      ...prevFormData,
      [updatedField.name]: {newValue: selectedValue, type},
    }))

    // console.log('Updated Fields:', values)
  }

  const handleRadioChange = (index, optionValue, type) => {
    const values = [...fields]
    const updatedField = {...values[index], value: optionValue}
    values[index] = updatedField
    setFields(values)

    setFormData({
      ...formData,
      [updatedField.name]: {newValue: updatedField.value, type},
    })
  }

  const createCustomFromFieldValuesMutation = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      return axios.post(`${BASE_URL}/api/submit-form`, data, config)
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
        //toast.error(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldValuesData']})
      }
    },
  })

  const createCustomFromsFieldValuesMutation = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      return axios.post(`${BASE_URL}/api/submit-form/enquiry-form`, data, config)
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
        //toast.error(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldValuesData']})
      }
    },
  })

  const useSaveReorderedColumns = () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: async (data) => {
        return axios.post(`${BASE_URL}/api/columns/save`, data, config)
      },
      onError: (error) => {
        // toast.error(`Error saving columns: ${error.response?.data?.error || error.message}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getReorderingRowsAndColumnsData']})
        // toast.success('Columns reordered successfully!')
      },
    })
  }

  const getReorderedColumnData = useQuery({
    queryKey: ['getReorderingRowsAndColumnsData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/columns`, config)
        // console.log('column', response)
        return response.data
      } catch (error) {
        throw new Error('Error fetching column data: ' + error.message)
      }
    },
  })

  const deleteReorderedColumnsMutation = useMutation({
    mutationFn: async (id) => {
      // console.log(id)
      return axios.delete(`${BASE_URL}/api/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Field Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error While Deleting the Field !!', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getReorderingRowsAndColumnsData']})
      }
    },
  })

  // console.log('204', getReorderedColumnData)

  // Save Reordered Rows Mutation

  const useSaveReorderedRows = () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: async (data) => {
        return axios.post(`${BASE_URL}/api/rows/save`, data, config)
      },
      onError: (error) => {
        //toast.error(`Error saving rows: ${error.response?.data?.error || error.message}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getReorderingRowsData']})
        // toast.success('Rows reordered successfully!')
      },
    })
  }

  // const transformRowData = (rows) => {
  //   console.log('Rows to transform:', rows) // Log rows before transformation

  //   return rows.map((row) => {
  //     const fieldMap = row.fields.reduce((acc, field) => {
  //       acc[field.name] = field.value
  //       return acc
  //     }, {})

  //     return {
  //       id: row.id,
  //       fields: fieldMap,
  //     }
  //   })
  // }

  const getReorderedRowData = useQuery({
    queryKey: ['getReorderingRowsData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/rows`, config)
        return response.data
      } catch (error) {
        console.error('Error fetching row data:', error) // Detailed error
        throw new Error('Error fetching row data: ' + error.message)
      }
    },
  })

  // console.log('row', useReorderedRowData)

  const getAllFormsFieldValue = useQuery({
    // queryFn: () => {
    //   return axios.get(`${BASE_URL}/api/custom-field`, config)
    // },
    // await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldData']})

    queryKey: ['getCustomFormFieldValuesData'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/submit-form`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useGetSingleFormValueById = (id) => {
    return useQuery({
      queryKey: ['getCustomFormFieldValuesData', id],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/submit-form/${id}`, config)
          // console.log(response)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  const updateFormFieldMutation = useMutation({
    mutationFn: async (id) => {
      // console.log(id)
      // Perform the PUT request using the `id`
      return axios
        .put(`${BASE_URL}/api/submit-form/${id.id}`, id, config)
        .then((res) => res.formFieldValues)
    },

    onSuccess: () => {
      toast.success('Form Updated Successfully !!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error while updating form:', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getCustomFormFieldValuesData'],
        })
      }
    },
  })

  const deleteFormDataMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/submit-form/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Form Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        //6toast.error('Error While Deleting Form:', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldValuesData']})
      }
    },
  })

  const deleteSingleRowDataMutation = useMutation({
    mutationFn: async (id) => {
      // console.log(id)
      return axios.delete(`${BASE_URL}/api/rows/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      // toast.success('Form Deleted  Successfully!!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error While Deleting Form:', error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getReorderingRowsData']})
      }
    },
  })

  // Default Select fetching
  const createDefaultSelectFieldMutation = useMutation({
    mutationFn: async (data) => {
      // console.log(data)
      return axios.post(`${BASE_URL}/api/select-field`, data, config)
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
        //toast.error(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getAllDefaultSelectFields']})
      }
    },
  })

  const getAllDefaultSelectFields = useQuery({
    // queryFn: () => {
    //   return axios.get(`${BASE_URL}/api/custom-field`, config)
    // },
    // await queryClient.invalidateQueries({queryKey: ['getCustomFormFieldData']})

    queryKey: ['getAllDefaultSelectFields'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/select-field`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useGetSingleDefaultSelectFieldById = (id) => {
    return useQuery({
      queryKey: ['getAllDefaultSelectFields', id],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/select-field/${id}`, config)
          // console.log(response)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  const updateDefaultSelectFieldMutation = useMutation({
    mutationFn: async (id) => {
      // console.log(id)
      // Perform the PUT request using the `id`
      // console.log()
      return axios.put(`${BASE_URL}/api/select-field/${id.id}`, id, config).then((res) => res.data)
    },

    onSuccess: () => {
      toast.success('Select  Updated Successfully !!')
    },
    onSettled: async (_, error) => {
      if (error) {
        // toast.error('Error while updating Select:', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getAllDefaultSelectFields'],
        })
      }
    },
  })

  //  ------------------------------------- Student Issues Start here -------------------------------------------
  const createStudentNoteMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/student-notes`, data, config)
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
        queryKey: ['getStudentNotes'],
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
          queryKey: ['getStudentNotes'],
        })
      }
    },
  })

  const getStudentNotesListsQuery = useQuery({
    queryKey: ['getStudentNotes'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/student-notes`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useUpdateStudentNoteMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.put(`${BASE_URL}/api/student-notes/${data.id}`, data, config)
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
        queryKey: ['getStudentNotes'],
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
          queryKey: ['getStudentNotes'],
        })
      }
    },
  })

  const useDeleteStudentNoteMutation = useMutation({
    mutationFn: async (id) => {
      //console.log(data)
      return axios.delete(`${BASE_URL}/api/student-notes/${id}`, config)
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
        queryKey: ['getStudentNotes'],
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
          queryKey: ['getStudentNotes'],
        })
      }
    },
  })

  return (
    <CustomFormFieldDataContext.Provider
      value={{
        createCustomFromFieldValuesMutation,
        createCustomFromsFieldValuesMutation,
        handleSelectChange,
        handleCheckboxChange,
        handleOptionChange,
        handleInputChange,
        fieldValues,
        input,
        setInput,
        formData,
        setFormData,
        setFieldValues,
        handleRadioChange,
        getAllFormsFieldValue,
        deleteFormDataMutation,
        useSaveReorderedRows,
        useSaveReorderedColumns,
        getReorderedColumnData,
        getReorderedRowData,
        useGetSingleFormValueById,
        updateFormFieldMutation,
        deleteReorderedColumnsMutation,
        deleteSingleRowDataMutation,
        // default Select
        createDefaultSelectFieldMutation,
        getAllDefaultSelectFields,
        useGetSingleDefaultSelectFieldById,
        updateDefaultSelectFieldMutation,
        // Student Notes
        createStudentNoteMutation,
        getStudentNotesListsQuery,
        useDeleteStudentNoteMutation,
        useUpdateStudentNoteMutation,
      }}
    >
      {children}
    </CustomFormFieldDataContext.Provider>
  )
}

export const useCustomFormFieldContext = () => {
  const context = useContext(CustomFormFieldDataContext)
  if (!context) {
    throw new Error(
      'useCustomFormFieldContext must be used within a CustomFormFieldDataContextProvider'
    )
  }
  return context
}
