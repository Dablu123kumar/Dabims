import React, {useState, useEffect, useCallback, useMemo} from 'react'
import {toast} from 'react-toastify'
import {KTIcon} from '../../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'
import {useParams} from 'react-router-dom'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
// import { useCompanyContext } from '../../compay/CompanyContext'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import UpdateFormData from '../dynamicForms/UpdateFormData'
import OnlyViewFormData from '../dynamicForms/OnlyViewFormData'
import {useAuth} from '../../../modules/auth'
import {Modal} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const reorderRows = (rows, reorderedColumns) => {
  return rows.map((row) => {
    const reorderedFields = reorderedColumns.map((colName) =>
      row.fields.find((field) => field.name === colName)
    )
    return {
      ...row,
      fields: reorderedFields.filter(Boolean), // Filter out undefined fields
    }
  })
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'grey' : 'white',
  ...draggableStyle,
})

export default function ViewAllEnquiryFormsData() {
  // const navigate = useNavigate()
  const {currentUser} = useAuth()
  const {
    getAllFormsFieldValue,
    deleteFormDataMutation,
    useSaveReorderedColumns,
    useSaveReorderedRows,
    getReorderedColumnData,
    getReorderedRowData,
    deleteReorderedColumnsMutation,
    deleteSingleRowDataMutation,
    getAllDefaultSelectFields,
  } = useCustomFormFieldContext()
  const {
    getAllAddedFormsName,
    openModal: contextOpenModal,
    setOpenModal: setcontextOpenModal,
  } = useDynamicFieldContext()
  // const companyCTX = useCompanyContext()
  const params = useParams()
  const companyId = params?.id
  const selectField = getAllDefaultSelectFields?.data?.defaultSelects
  // const {data} = getAllFormsFieldValue

  // const singleFormFieldId = data?.formFieldValues
  // console.log(singleFormFieldId)

  // console.log(useReorderedRowData)
  // console.log(object)

  // const { data: companyInfo } = companyCTX?.useGetSingleCompanyData(companyId)
  const [selectedFormId, setSelectedFormId] = useState('')
  const [selectId, setSelectId] = useState(null)
  const [viewSelectId, setViewSelectId] = useState(null)
  const [modalMode, setModalMode] = useState('view')
  const [filteredData, setFilteredData] = useState([])
  const [formOptions, setFormOptions] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [uniqueFieldNames, setUniqueFieldNames] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFieldName, setSelectedFieldName] = useState(null)
  const [selectedLeadSource, setSelectedLeadSource] = useState('')
  const [selectedLeadStatus, setSelectedLeadStatus] = useState('')
  // const [citySearch, setCitySearch] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [uniqueCities, setUniqueCities] = useState([])
  // const [searchValue, setSearchValue] = useState('')
  const [selectedDateType, setSelectedDateType] = useState('createdAt') // Default to CreatedAt
  // console.log(selectedDateType)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc') // Default to ascending
  // console.log(toDate)
  const handleSortChange = (event) => {
    setSortOrder(event.target.value)
  }
  const handleArrowClick = (fieldName) => {
    setSelectedFieldName(fieldName) // Set the field name when the arrow button is clicked
    setIsModalOpen(true) // Open the modal
  }

  const closeModal = () => {
    setIsModalOpen(false) // Close the modal
  }
  // Hooks for saving reordered columns and rows
  const saveReorderedColumns = useSaveReorderedColumns()
  const saveReorderedRows = useSaveReorderedRows()

  useEffect(() => {
    const fetchData = async () => {
      const forms = getAllAddedFormsName?.data
        ?.filter((form) => form.companyName === companyId)
        .map((form) => ({
          id: form._id,
          name: form.formName,
        }))

      setFormOptions(forms || [])

      if (forms?.length > 0) {
        if (!selectedFormId) {
          setSelectedFormId(forms[0].id)
        }

        const filteredFormData = getAllFormsFieldValue?.data?.formFieldValues
          ?.filter((formData) => formData.companyId === companyId)
          .map((formData) => ({
            id: formData._id,
            fields: [
              ...formData.formFiledValue, // Existing dynamic fields
              {name: 'createdAt', value: moment(formData.createdAt).format('DD-MM-YYYY h:m')}, // Add createdAt as a field
              {name: 'updatedAt', value: moment(formData.updatedAt).format('DD-MM-YYYY h:m')}, // Add updatedAt as a field
            ],
            createdAt: formData.createdAt,
            updatedAt: formData.updatedAt,
            addedBy: formData.addedBy,
          }))

        setFilteredData(filteredFormData || [])

        if (filteredFormData?.length > 0) {
          const allFields = filteredFormData
            .map((entry) => entry.fields.filter((form) => form.name !== 'companyId'))
            .flat()

          const uniqueNames = Array.from(new Set(allFields?.map((field) => field.name)))

          // Include `createdAt` and `updatedAt` in unique field names if not already present
          if (!uniqueNames.includes('createdAt')) uniqueNames.push('createdAt')
          if (!uniqueNames.includes('updatedAt')) uniqueNames.push('updatedAt')

          setUniqueFieldNames(uniqueNames)
        } else {
          setUniqueFieldNames([])
        }
      } else {
        setSelectedFormId('')
        setFilteredData([])
        setUniqueFieldNames([])
      }
    }

    fetchData()
  }, [selectedFormId, getAllFormsFieldValue, getAllAddedFormsName, companyId])

  const viewFormDataModal = (rowId) => {
    setModalMode('view')
    setViewSelectId(rowId)
    setcontextOpenModal(true)
  }
  const openEditFormData = (rowId) => {
    // console.log(field)
    setModalMode('edit')
    setSelectId(rowId)
    setcontextOpenModal(true)
  }

  const fetchUpdatedData = useCallback(async () => {
    if (selectedFormId && companyId) {
      try {
        // Fetch all the rowData
        const allRowData = getReorderedRowData?.data?.rowData || []

        // Ensure that allRowData is an array
        if (!Array.isArray(allRowData)) {
          return
        }

        // Filter the rowData based on the selected formId, companyId, and role
        const filteredRowData = allRowData.filter(
          (form) =>
            form.formId === selectedFormId &&
            form.companyId === companyId &&
            form.role === currentUser.role // Filter by role
        )

        // If no data is found, log a warning and return early
        if (filteredRowData.length === 0) {
          return
        }

        // Map the filteredRowData to extract relevant fields
        const updatedFilteredFormData = filteredRowData.map((row) => ({
          id: row?._id,
          fields: [
            ...(row.rows
              ? row?.rows.flatMap((r) => r?.fields || []).sort((a, b) => a.order - b.order) // Sort fields by order (if applicable)
              : []),
            {name: 'createdAt', value: row?.createdAt || null}, // Add createdAt as a field
            {name: 'updatedAt', value: row?.updatedAt || null}, // Add updatedAt as a field
          ],
        }))

        // Extract all fields, filtering out the 'companyId' field
        const allFields = updatedFilteredFormData
          .flatMap((entry) => entry?.fields)
          .filter((field) => field?.name !== 'companyId') // Exclude 'companyId'

        // Create a set of unique field names
        const uniqueNames = Array.from(new Set(allFields.map((field) => field?.name)))

        // Update state with filtered and sorted data
        setUniqueFieldNames(uniqueNames)

        // Optionally, log the updated data for debugging
        // console.log('Updated Form Data:', updatedFilteredFormData)
      } catch (error) {
        // Show an error toast if something goes wrong
        toast.error(`Error fetching updated data: ${error.message}`)
      }
    }
  }, [selectedFormId, companyId, currentUser.role, getReorderedRowData])

  // Call fetchUpdatedData in useEffect
  useEffect(() => {
    fetchUpdatedData()
  }, [fetchUpdatedData])

  const allRowData = getReorderedRowData?.data?.rowData
    ?.filter((form) => form.formId === selectedFormId)
    ?.map((id) => id._id)
  // console.log(allRowData)

  let allRowsId
  if (allRowData && allRowData.length > 0) {
    allRowsId = allRowData[0]
  } else {
    // console.warn('allRowData is undefined or empty')
    // allRowsId = null // or set a default value
  }

  // console.log(allRowsId)

  const allColumnsData = getReorderedColumnData?.data?.columnData
    ?.filter((form) => form.formId === selectedFormId)
    ?.map((id) => id._id)
  // Store the first element in a variable if it exists
  let firstColumnData

  if (allColumnsData && allColumnsData.length > 0) {
    firstColumnData = allColumnsData[0]
  } else {
    // console.warn('allColumnsData is undefined or empty')
    firstColumnData = null // or set a default value
  }

  // console.log(firstColumnData)

  useEffect(() => {
    fetchUpdatedData()
  }, [fetchUpdatedData])

  const formDataDeleteHandler = (formDataId) => {
    // if (!window.confirm('Are you sure you want to delete this Form Data?')) {
    //   return
    // }

    deleteFormDataMutation.mutate(formDataId, {
      onSuccess: () => {
        toast.success('Form Data deleted successfully!')

        // Remove the deleted data from the filtered data
        const updatedFilteredData = filteredData.filter((item) => item.id !== formDataId)
        setFilteredData(updatedFilteredData)

        // If no data is left for the selected form, you can either keep it or switch forms
        if (updatedFilteredData.length === 0) {
          // Option 1: Keep the selected form even if it's empty
          setSelectedFormId(selectedFormId)
          setFilteredData([])

          // Option 2: Switch to another form if no data is left (uncomment below to use this)
          // const remainingForms = formOptions.filter((form) => form.id !== selectedFormId)
          // if (remainingForms.length > 0) {
          //   setSelectedFormId(remainingForms[0].id)
          // } else {
          //   setSelectedFormId('')
          // }
        }
      },
      onError: (error) => {
        // toast.error(`Error deleting Data: ${error.message}`)
      },
    })
  }

  // const [searchValue, setSearchValue] = useState('');
  // const [filteredData, setFilteredData] = useState([]); // Populate this with actual filtered data

  // Function to handle Lead Source change
  const handleLeadSourceChange = (e) => {
    setSelectedLeadSource(e.target.value)
  }

  // Function to handle Lead Status change
  const handleLeadStatusChange = (e) => {
    setSelectedLeadStatus(e.target.value)
  }
  // console.log(sortOrder)
  // Updated filteredGroupedData logic to include Lead Source and Lead Status filtering
  const filteredGroupedData = useMemo(() => {
    return filteredData
      ?.map((entry) => ({
        id: entry.id,
        fields: entry.fields.filter((field) => field.name !== 'companyId'),
        addedBy: entry.addedBy,
        leadSource: entry.fields.find((field) => field.name === 'Lead Source')?.value,
        leadStatus: entry.fields.find((field) => field.name === 'Lead Status')?.value,
        city: entry.fields.find((field) => field.name === 'City')?.value,
        name: entry.fields.find((field) => field.name === 'Name')?.value || '',
        email: entry.fields.find((field) => field.name === 'Email')?.value || '',
        createdAt: entry.createdAt, // ISO 8601 format
        updatedAt: entry.updatedAt, // ISO 8601 format
      }))
      ?.filter((rowData) => {
        const noFiltersApplied =
          !selectedLeadSource &&
          !selectedLeadStatus &&
          !searchValue.trim() &&
          !selectedCity &&
          !fromDate &&
          !toDate

        // Lead Source Filtering
        const matchesLeadSource = !selectedLeadSource || rowData.leadSource === selectedLeadSource

        // Lead Status Filtering
        const matchesLeadStatus = !selectedLeadStatus || rowData.leadStatus === selectedLeadStatus

        // Search Filtering
        const matchesSearch = rowData.fields.some(
          (field) =>
            searchValue.trim() === '' ||
            (typeof field.value === 'string' &&
              field.value.toLowerCase().includes(searchValue.toLowerCase()))
        )

        // City Filtering
        const matchesCity = !selectedCity || rowData.city === selectedCity

        // Date Filtering Logic
        const matchesDateRange = (() => {
          if (!fromDate && !toDate) return true // No date filter applied

          const dateToCheck =
            selectedDateType === 'createdAt' ? rowData.createdAt : rowData.updatedAt

          if (!dateToCheck) return false

          const entryDate = new Date(dateToCheck)
          const fromTimestamp = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null
          const toTimestamp = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null

          if (fromTimestamp && toTimestamp) {
            return entryDate >= fromTimestamp && entryDate <= toTimestamp
          } else if (fromTimestamp) {
            return entryDate >= fromTimestamp
          } else if (toTimestamp) {
            return entryDate <= toTimestamp
          }

          return true
        })()

        return (
          matchesLeadSource && matchesLeadStatus && matchesSearch && matchesCity && matchesDateRange
        )
      })
      ?.sort((a, b) => {
        if (!selectedFieldName || selectedFieldName.trim() === '') {
          // Default sort by updatedAt in descending order when no filters are applied
          const dateA = new Date(a.updatedAt || a.createdAt)
          const dateB = new Date(b.updatedAt || b.createdAt)
          return dateB - dateA
        }

        if (selectedFieldName === 'Name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else if (selectedFieldName === 'Email') {
          return sortOrder === 'asc'
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email)
        }
        return 0
      })
  }, [
    filteredData,
    selectedLeadSource,
    selectedLeadStatus,
    searchValue,
    selectedCity,
    selectedFieldName,
    sortOrder,
    fromDate,
    toDate,
    selectedDateType, // Added to ensure re-evaluation when this state changes
  ])

  useEffect(() => {
    // Extract unique cities from your filtered data, regardless of the selected city
    const cities = [
      ...new Set(
        filteredGroupedData.map(
          (entry) => entry.fields.find((field) => field.name === 'City')?.value
        )
      ),
    ]

    // Update the unique cities state
    setUniqueCities(cities)
  }, [filteredGroupedData])

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value)
    // Additional filtering logic if needed
  }
  // console.log(filteredGroupedData)
  // console.log(filteredData)

  // const data = getAllFormsFieldValue?.data?.formFieldValues
  // const addedBy = data
  //   ?.filter((form) => form.formId === selectedFormId && form.companyId === companyId)
  //   .map((user) => user.addedBy)
  // // console.log(data)

  // const formRowDataBeforeDragging = filteredGroupedData?.map((rowData) => rowData.id)
  // console.log(formRowDataBeforeDragging)

  const rowsDeleteHandler = (rowsId, columnsId, formDataId) => {
    if (!window.confirm('Are you sure you want to delete All this Row Fields?')) {
      return
    }
    deleteSingleRowDataMutation.mutate(rowsId, {
      onSuccess: () => {
        toast.success('Field deleted successfully!')
      },
      onError: (error) => {
        // toast.error(`Error deleting form: ${error.message}`)
      },
    })

    deleteReorderedColumnsMutation.mutate(columnsId, {
      onSuccess: () => {
        // toast.success('Field deleted successfully!')
      },
      onError: (error) => {
        // toast.error(`Error deleting form: ${error.message}`)
      },
    })

    const formDataIds = filteredData.map((item) => item.id)

    formDataIds.forEach((formDataId) => {
      deleteFormDataMutation.mutate(formDataId, {
        onSuccess: () => {
          toast.success(`All Form Field Data Deleted SuccessFully !!`)

          // Remove the deleted data from the filtered data
          const updatedFilteredData = filteredData.filter((item) => item.id !== formDataId)
          setFilteredData(updatedFilteredData)

          // If no data is left for the selected form, update the state accordingly
          if (updatedFilteredData.length === 0) {
            setSelectedFormId('')
            setFilteredData([])
            setUniqueFieldNames([])
          }
        },
        onError: (error) => {
          // toast.error(`Error deleting Data: ${error.message}`)
        },
      })
    })
  }

  const onDragEnd = async (result) => {
    const {source, destination, type} = result

    if (!destination) return

    if (type === 'COLUMN') {
      // Reorder columns
      const reorderedColumns = reorder(uniqueFieldNames, source.index, destination.index)
      const reorderedRows = reorderRows(filteredGroupedData, reorderedColumns)

      try {
        // Save all rows with the new column order
        await saveReorderedRows.mutateAsync({
          formId: selectedFormId,
          companyId: companyId,
          reorderedRows: reorderedRows,
        })

        // Save reordered columns
        await saveReorderedColumns.mutateAsync({
          formId: selectedFormId,
          companyId: companyId,
          reorderedColumns,
        })

        // Refetch data to ensure the state is in sync with the backend
        await fetchUpdatedData()

        toast.success('Reordered columns and rows saved and updated successfully!')
      } catch (error) {
        // toast.error(`Error saving reordered columns and rows: ${error.message}`)
      }
    }
  }
  // console.log(filteredGroupedData)
  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // console.log(selectField)
  // console.log(selectField?.filter((field) => field.selectName === 'Lead Source'))

  return (
    <div className='card'>
      <div className='card-header border-0 pt-5'>
        <div className='d-flex justify-content-between align-items-center w-100'>
          {/* Title */}
          <h3 className='card-title align-items-start flex-column mb-0'>
            <span className='card-label fw-bold fs-3'>All Enquiry Forms</span>
          </h3>

          {/* Search Bar */}
          <div className='d-flex justify-content-center mt-3'>
            <div className='search-bar' style={{maxWidth: '500px', width: '100%'}}>
              <input
                type='text'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='form-control form-control-sm mx-auto'
                placeholder='Search'
                style={{height: '30px'}}
              />
            </div>
          </div>

          {/* Date Pickers */}
          {formOptions?.length > 0 && (
            <div className='d-flex gap-3'>
              <div className='d-flex gap-3'>
                <label className='d-flex align-items-center'>
                  From
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    dateFormat='dd/MM/yyyy'
                    className='form-control form-control-sm ms-2'
                    placeholderText='DD/MM/YYYY'
                  />
                </label>
                <label className='d-flex align-items-center'>
                  To
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    dateFormat='dd/MM/yyyy'
                    className='form-control form-control-sm ms-2'
                    placeholderText='DD/MM/YYYY'
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Select Dropdown for Created/Updated */}
        <div className='d-flex justify-content-end w-100'>
          <select
            className='form-select form-select-sm w-auto'
            value={selectedDateType}
            onChange={(e) => setSelectedDateType(e.target.value)}
          >
            <option value='createdAt'>Created At</option>
            <option value='updatedAt'>Updated At</option>
          </select>
        </div>
      </div>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <DragDropContext onDragEnd={filteredGroupedData.length > 0 ? onDragEnd : () => {}}>
            <Droppable droppableId='droppable-columns' direction='horizontal' type='COLUMN'>
              {(provided) => (
                <table
                  className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead>
                    {filteredGroupedData.length > 0 ? (
                      <div className='d-flex justify-content-start flex-shrink-0'>
                        <a
                          href={() => rowsDeleteHandler(allRowsId, firstColumnData)}
                          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                          onClick={() => rowsDeleteHandler(allRowsId, firstColumnData)}
                        >
                          <KTIcon iconName='trash' className='fs-2' />
                        </a>
                      </div>
                    ) : (
                      ''
                    )}
                    <tr className='fw-bold text-muted'>
                      <th>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                          <input
                            className='form-check-input widget-9-check'
                            type='checkbox'
                            value='1'
                            disabled={filteredGroupedData.length === 0} // Disable if no data
                          />
                        </div>
                      </th>
                      {uniqueFieldNames.length > 0 && (
                        <th className='min-w-100px text-start'>Actions</th>
                      )}
                      {uniqueFieldNames.map((fieldName, index) => (
                        <Draggable
                          key={fieldName}
                          draggableId={fieldName}
                          index={index}
                          isDragDisabled={filteredGroupedData.length === 0}
                        >
                          {(provided, snapshot) => {
                            const isFixedColumn =
                              fieldName === 'Name' || fieldName === 'Mobile Number'

                            const fixedStyles = isFixedColumn
                              ? {
                                  left: fieldName === 'Name' ? 0 : '100px',
                                  zIndex: 2,
                                  position: 'sticky',
                                  background: themeMode === 'dark' ? '#1b1a1d' : 'white',
                                }
                              : {}

                            const mergedStyles = {
                              ...getItemStyle(snapshot.isDragging, provided.draggableProps.style),
                              ...fixedStyles,
                              background: themeMode === 'dark' ? '#1b1a1d' : 'white',
                            }

                            const handleClick = (fieldName) => {
                              // Only show the popup for specific fields
                              const popupFields = [
                                'Lead Source',
                                'Lead Status',
                                'City',
                                'Name',
                                'Email',
                              ]
                              if (popupFields.includes(fieldName)) {
                                // Trigger the popup for these fields
                                handleArrowClick(fieldName)
                              }
                            }

                            return (
                              <>
                                <th
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={mergedStyles}
                                  className={`min-w-140px ${isFixedColumn ? 'fixed-column' : ''}`}
                                >
                                  <div className='d-flex align-items-center'>
                                    <span>{fieldName}</span>
                                    <button
                                      className='btn btn-icon ms-1'
                                      onClick={() => handleClick(fieldName)} // Use the updated handleClick function
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <KTIcon iconName='arrow-up' className='fs-3' />
                                    </button>
                                  </div>
                                </th>
                              </>
                            )
                          }}
                        </Draggable>
                      ))}

                      {/* Modal Component */}
                      {/* Modal Component */}
                      <Modal
                        show={isModalOpen}
                        onHide={closeModal}
                        style={{backgroundColor: themeMode === 'dark' ? '' : ''}}
                      >
                        <Modal.Header
                          closeButton
                          style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}
                        >
                          <Modal.Title
                            style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}
                          >
                            {selectedFieldName}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body
                          style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}
                        >
                          {selectedFieldName?.trim() === 'Lead Source' && (
                            <div style={{background: themeMode === 'dark' ? 'black' : '#f2f2ff'}}>
                              {selectField
                                ?.filter((field) => field.selectName === 'Lead Source')
                                .map((select) => (
                                  <div key={select._id}>
                                    <label htmlFor='leadSource'>{select.selectName}</label>
                                    <select
                                      value={selectedLeadSource}
                                      onChange={handleLeadSourceChange}
                                      className='form-select'
                                    >
                                      <option value=''>--Select Lead Source--</option>
                                      {select.options?.map((option) => (
                                        <option key={option._id} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                            </div>
                          )}

                          {selectedFieldName === 'Lead Status' && (
                            <div>
                              {selectField
                                ?.filter((field) => field.selectName === 'Lead Status')
                                .map((select) => (
                                  <div key={select._id}>
                                    <label htmlFor='leadStatus'>{select.selectName}</label>
                                    <select
                                      value={selectedLeadStatus}
                                      onChange={handleLeadStatusChange}
                                      className='form-select'
                                    >
                                      <option value=''>--Select Lead Status--</option>
                                      {select.options?.map((option) => (
                                        <option key={option._id} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                            </div>
                          )}

                          {/* Handle City filter */}
                          {selectedFieldName === 'City' && (
                            <div>
                              <label htmlFor='citySelect'>Filter by City</label>
                              <select
                                id='citySelect'
                                className='form-select'
                                value={selectedCity}
                                onChange={handleCityChange}
                              >
                                <option value=''>--Select City--</option>
                                {uniqueCities?.map((city, index) => (
                                  <option key={index} value={city}>
                                    {city}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Handle Name and Email sorting */}
                          {(selectedFieldName === 'Name' || selectedFieldName === 'Email') && (
                            <div>
                              <label htmlFor='sortSelect'>Sort {selectedFieldName}</label>
                              <select
                                id='sortSelect'
                                className='form-select'
                                value={sortOrder}
                                onChange={handleSortChange} // handleSortChange should update the sorting order
                              >
                                {/* <option value=''>--Select-an-Option</option> */}
                                <option value='asc'>Alphabetically (A-Z)</option>
                                <option value='desc'>Reverse Alphabetically (Z-A)</option>
                              </select>
                            </div>
                          )}
                        </Modal.Body>
                      </Modal>

                      {uniqueFieldNames.length > 0 && <th className='min-w-100px'>Added By</th>}
                    </tr>
                  </thead>
                  <tbody id='droppableId'>
                    {filteredGroupedData.length > 0 ? (
                      filteredGroupedData?.map((rowData) => (
                        <tr key={rowData?.id}>
                          <td>
                            <div className='form-check form-check-sm form-check-custom form-check-solid'>
                              <input
                                className='form-check-input widget-9-check'
                                type='checkbox'
                                value='1'
                              />
                            </div>
                          </td>
                          <td>
                            <div className='d-flex justify-content-start flex-shrink-0'>
                              <a
                                href={() => viewFormDataModal(rowData.id)}
                                className='btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1'
                                onClick={() => viewFormDataModal(rowData.id)}
                              >
                                <KTIcon iconName='eye' className='fs-3' />
                              </a>
                              <a
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                onClick={() => openEditFormData(rowData.id)}
                                href={() => openEditFormData(rowData.id)}
                              >
                                <KTIcon iconName='pencil' className='fs-3' />
                              </a>
                              <a
                                href={() => formDataDeleteHandler(rowData.id)}
                                className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                                onClick={() => formDataDeleteHandler(rowData.id)}
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </a>
                            </div>
                          </td>
                          {uniqueFieldNames.map((fieldName) => {
                            const fieldData = rowData.fields.find(
                              (field) => field.name === fieldName
                            )

                            const isFixedField =
                              fieldName === 'Name' || fieldName === 'Mobile Number'

                            const getBadgeStyles = (value) => {
                              switch (value) {
                                case 'Hot':
                                  return {backgroundColor: 'red', color: 'white'}
                                case 'Junk Lead':
                                  return {backgroundColor: '#800000', color: 'white'}
                                case 'Positive':
                                  return {backgroundColor: 'green', color: 'white'}
                                case 'Negative':
                                  return {backgroundColor: '#ff6347', color: 'white'}
                                case 'Progress':
                                  return {backgroundColor: '#ffcc00', color: 'black'}
                                case 'Converted':
                                  return {backgroundColor: 'blue', color: 'white'}
                                case 'Attempted To Contact':
                                  return {backgroundColor: '#8a2be2', color: 'white'}
                                case 'Not Contacted':
                                  return {backgroundColor: '#ff69b4', color: 'white'}
                                case 'not-picked':
                                  return {backgroundColor: '#d3d3d3', color: 'black'}
                                default:
                                  return {backgroundColor: 'white', color: 'black'}
                              }
                            }

                            return (
                              <td
                                onClick={() =>
                                  fieldData && fieldData.name === 'Name'
                                    ? openEditFormData(rowData.id)
                                    : ''
                                }
                                key={fieldName}
                                className={`cursor-pointer ${isFixedField ? 'fixed-column' : ''}`}
                                style={
                                  isFixedField
                                    ? {
                                        position: 'sticky',
                                        left: fieldName === 'Name' ? '0' : '100px',
                                        zIndex: 1,
                                        backgroundColor: 'white',
                                        background: themeMode === 'dark' ? '#1b1a1d' : 'white',
                                      }
                                    : {background: themeMode === 'dark' ? '#1b1a1d' : 'white'}
                                }
                              >
                                {fieldData ? (
                                  typeof fieldData?.value === 'object' ? (
                                    Object.keys(fieldData.value).map((key) => (
                                      <span key={key}>{fieldData?.value[key]} </span>
                                    ))
                                  ) : fieldName === 'Lead Status' ? (
                                    // Display as a badge with dynamic styles
                                    <span
                                      className='badge'
                                      style={{
                                        ...getBadgeStyles(fieldData?.value),
                                        padding: '0.5em 1em',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {fieldData?.value}
                                    </span>
                                  ) : (
                                    fieldData?.value
                                  )
                                ) : (
                                  ''
                                )}
                              </td>
                            )
                          })}
                          <td>{rowData.addedBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={uniqueFieldNames.length + 2} className='text-center'>
                          No Data Found
                        </td>
                      </tr>
                    )}

                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <PopUpModal show={contextOpenModal} handleClose={() => setcontextOpenModal(false)}>
        {modalMode === 'view' && (
          <OnlyViewFormData
            setOpenModal={setcontextOpenModal}
            openEditFormData={openEditFormData}
            rowId={viewSelectId}
          />
        )}
        {modalMode === 'edit' && (
          <UpdateFormData setOpenModal={setcontextOpenModal} rowId={selectId} />
        )}
      </PopUpModal>
    </div>
  )
}
