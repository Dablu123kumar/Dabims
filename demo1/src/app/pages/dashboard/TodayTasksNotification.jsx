import React from 'react'
import {useCustomFormFieldContext} from '../enquiry-related/dynamicForms/CustomFormFieldDataContext'
import moment from 'moment'
import {useNavigate} from 'react-router-dom'
import {KTIcon} from '../../../_metronic/helpers'

const TodayTasksNotification = ({setShowTask}) => {
  const navigate = useNavigate()
  const studentNotesCTX = useCustomFormFieldContext()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

  // Get today's date (start of the day to ignore the time part)
  const today = moment().startOf('day')

  // Filter today's tasks: Compare task.date and today's date, ensuring day, month, and year are the same
  const todaysTasks = studentData?.filter(
    (task) =>
      moment(task.startTime).isSame(today, 'day') && // Ensure day, month, and year match
      moment(task.startTime).month() === today.month() && // Ensure the same month
      moment(task.startTime).year() === today.year() // Ensure the same year
  )

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  document.documentElement.setAttribute('data-bs-theme', themeMode)

  return (
    <div
      className='card'
      style={{backgroundColor: themeMode === 'light' ? '#f8f9fa' : 'InfoBackground'}}
    >
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Today Tasks</h3>
        <button
          className='modal-close'
          style={{top: '15px', right: '5px'}}
          onClick={() => setShowTask(false)}
        >
          &times;
        </button>
        <div className='card-toolbar'></div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div
        className='card-body pt-0'
        style={{
          maxHeight: todaysTasks?.length > 1 ? '180px' : '90px', // Adjust height based on the number of items
          overflowX: 'hidden',
          overflowY: todaysTasks?.length > 1 ? 'scroll' : 'hidden',
        }}
      >
        {todaysTasks?.length === 0 ? (
          <div>No tasks for today</div>
        ) : (
          todaysTasks?.map((task) => (
            <div
              className='d-flex align-items-center bg-light-success rounded p-5 mb-7'
              key={task._id}
            >
              {/* begin::Icon */}
              <span className='text-success me-5'>
                <KTIcon iconName='abstract-26' className='text-success fs-1 me-5' />
              </span>
              {/* end::Icon */}

              {/* begin::Title */}
              <div className='flex-grow-1 me-2'>
                <a
                  href={`/reminder-task/${task?.companyId}`}
                  target='blank'
                  className='fw-bold text-gray-800 text-hover-primary fs-6'
                >
                  <strong>{task.particulars}</strong> {/* Bold the particulars */}
                </a>
                <span className='text-muted fw-semibold d-block'>
                  <span className='text-muted'>{`Added by: ${task.addedBy}`}</span>
                </span>
              </div>
              {/* end::Title */}

              {/* begin::Label */}
              <span className='fw-bold text-success py-1'>
                {moment(task.startTime).format('DD-MM-YYYY')}
              </span>
              {/* end::Label */}
            </div>
          ))
        )}
      </div>

      {/* end::Body */}
    </div>
  )
}

export default TodayTasksNotification
