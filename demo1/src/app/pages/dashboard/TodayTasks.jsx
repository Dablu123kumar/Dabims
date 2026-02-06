import React from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../enquiry-related/dynamicForms/CustomFormFieldDataContext'
import moment from 'moment'

const TodayTasks = ({className}) => {
  const studentNotesCTX = useCustomFormFieldContext()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

  // Get today's date (start of the day to ignore the time part)
  const today = moment().startOf('day')

  // Filter today's tasks: Ensure task date matches today's date
  const todaysTasks = studentData?.filter((task) => moment(task.startTime).isSame(today, 'day'))

  return (
    <div className={`card card-xl-stretch mb-5 mb-xl-8 ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Today Tasks</h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div
        className='card-body pt-0'
        style={{
          maxHeight: '380px', // Set the max height for the body
          overflowY: 'auto', // Always show scrollbar if content exceeds height
          overflowX: 'hidden', // Prevent horizontal scrolling
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
                  target='_blank'
                  className='fw-bold text-gray-800 text-hover-primary fs-6'
                >
                  <strong>{task.particulars}</strong>
                </a>
                <span className='text-muted fw-semibold d-block'>
                  {`Added by: ${task.addedBy}`}
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

export default TodayTasks
