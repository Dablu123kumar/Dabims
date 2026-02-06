import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import {useCustomFormFieldContext} from '../dynamicForms/CustomFormFieldDataContext'
import {useParams} from 'react-router-dom'
import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import OnlyViewFormData from '../dynamicForms/OnlyViewFormData'
import {useDynamicFieldContext} from '../DynamicFieldsContext'
import {useState} from 'react'
import UpdateFormData from '../dynamicForms/UpdateFormData'

const localizer = momentLocalizer(moment)

const BigCalendarScheduler = () => {
  const {
    getAllCustomFormFieldDataQuery,
    openModal: contextOpenModal,
    setOpenModal: setcontextOpenModal,
    getAllAddedFormsName,
    deleteFieldMutation,
  } = useDynamicFieldContext()

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [modalMode, setModalMode] = useState('view')
  const params = useParams()
  const {getStudentNotesListsQuery} = useCustomFormFieldContext()
  const data = getStudentNotesListsQuery?.data?.allStudentNotes
    ?.filter((company) => company.companyId === params?.id)
    ?.map((data) => data)

  // console.log(data)

  const events =
    data?.map((item) => {
      const startDate = new Date(item.startTime)

      // Set the end date to the same day as the start date
      const endDate = new Date(startDate)
      endDate.setHours(23, 59, 59, 999) // Set time to the end of the day (11:59:59 PM)

      return {
        title: item.particulars,
        start: startDate,
        end: endDate,
        addedBy: item.addedBy,
        userId: item.userId,
      }
    }) || []

  const viewFormDataModal = (rowId) => {
    setModalMode('view')
    setSelectedId(rowId)
    setcontextOpenModal(true)
  }

  const openEditFormData = (rowId) => {
    // console.log(rowId)
    setModalMode('edit')
    setSelectedId(rowId)
    setcontextOpenModal(true)
  }

  // console.log(openEditFormData)

  // Handle event selection and open modal
  const handleEventSelect = (event) => {
    setSelectedEvent(event)
    setSelectedId(event.userId)
    openEditFormData(event.userId)
    viewFormDataModal(event.userId)
    setcontextOpenModal(true)
  }

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        defaultView='month'
        style={{height: '80vh', margin: '10px'}}
        onSelectEvent={handleEventSelect} // Add event select handler
      />

      <PopUpModal show={contextOpenModal} handleClose={() => setcontextOpenModal(false)}>
        {modalMode === 'view' && (
          <OnlyViewFormData
            setOpenModal={setcontextOpenModal}
            openEditFormData={openEditFormData}
            rowId={selectedId}
          />
        )}
        {modalMode === 'edit' && (
          <UpdateFormData setOpenModal={setcontextOpenModal} rowId={selectedId} />
        )}
      </PopUpModal>
    </>
  )
}

export default BigCalendarScheduler
