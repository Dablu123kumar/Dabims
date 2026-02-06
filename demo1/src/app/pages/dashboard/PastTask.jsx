import React from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../enquiry-related/dynamicForms/CustomFormFieldDataContext'
import moment from 'moment'

const PastTask = ({className}) => {
  const studentNotesCTX = useCustomFormFieldContext()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

  // Get today's date, and set it to the start of the day
  const today = moment().startOf('day')

  // Filter past tasks: Tasks before today's date
  const pastTasks = studentData?.filter((task) => {
    const taskDate = moment(task.startTime)
    return taskDate.isBefore(today, 'day')
  })

  return (
    <div className={`card card-xl-stretch mb-5 mb-xl-8 ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Past Tasks</h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div
        className='card-body pt-0'
        style={{
          maxHeight: '380px', // Adjust the view height minus header or padding
          overflowY: pastTasks?.length > 4 ? 'auto' : 'hidden', // Show scrollbar only for more than 4 tasks
          overflowX: 'hidden',
        }}
      >
        {pastTasks?.length === 0 ? (
          <div>No past tasks available</div>
        ) : (
          pastTasks?.map((task) => (
            <div
              className='d-flex align-items-center bg-light-danger rounded p-5 mb-7'
              key={task._id}
            >
              {/* begin::Icon */}
              <span className='text-danger me-5'>
                <KTIcon iconName='abstract-26' className='text-danger fs-1 me-5' />
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
              <span className='fw-bold text-danger py-1'>
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

export default PastTask
