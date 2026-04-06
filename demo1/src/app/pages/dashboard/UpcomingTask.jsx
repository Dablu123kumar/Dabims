import React from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useCustomFormFieldContext} from '../enquiry-related/dynamicForms/CustomFormFieldDataContext'
import {useCompanyContext} from '../compay/CompanyContext'
import {useAuth} from '../../modules/auth'
import moment from 'moment'

const UpcomingTask = ({className}) => {
  const studentNotesCTX = useCustomFormFieldContext()
  const {selectedCompany} = useCompanyContext()
  const {currentUser} = useAuth()
  const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

  const today = moment().startOf('day')

  const upcomingTasks = studentData?.filter((task) => {
    if (!moment(task.startTime).isAfter(today, 'day')) return false
    if (!selectedCompany?._id) return true
    if (currentUser?.role === 'SuperAdmin') return !task?.companyId || task.companyId === selectedCompany._id
    return task?.companyId === selectedCompany._id
  })

  return (
    <div className={`card card-xl-stretch mb-5 mb-xl-8 ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Upcoming Tasks</h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div
        className='card-body pt-0'
        style={{
          maxHeight: '380px', // Set max height for the card body
          overflowY: 'auto', // Enable scrolling when content exceeds height
          overflowX: 'hidden', // Prevent horizontal scrolling
        }}
      >
        {upcomingTasks?.length === 0 ? (
          <div>No upcoming tasks</div>
        ) : (
          upcomingTasks?.map((task) => {
            const taskDate = moment(task.startTime)
            const dueInDays = taskDate.diff(today, 'days') // Calculate days until the task

            return (
              <div
                className='d-flex align-items-center bg-light-warning rounded p-5 mb-7'
                key={task?._id}
              >
                {/* begin::Icon */}
                <span className='text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
                </span>
                {/* end::Icon */}

                {/* begin::Title */}
                <div className='flex-grow-1 me-2'>
                  <a
                    href={`/reminder-task/${task?.companyId}`}
                    target='_blank'
                    className='fw-bold text-gray-800 text-hover-primary fs-6'
                  >
                    <strong>{task?.particulars}</strong>
                  </a>
                  <span className='text-muted fw-semibold d-block'>
                    {`Added By: ${task?.addedBy}`}
                  </span>
                </div>
                {/* end::Title */}

                {/* begin::Label */}
                <span className='fw-bold text-warning py-1'>
                  {moment(task.startTime).format('DD-MM-YYYY')}
                </span>
                {/* end::Label */}
              </div>
            )
          })
        )}
      </div>
      {/* end::Body */}
    </div>
  )
}

export default UpcomingTask
