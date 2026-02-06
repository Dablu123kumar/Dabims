import {Fragment} from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useNavigate} from 'react-router-dom'
import {useCompanyContext} from '../compay/CompanyContext'

const ShowStudentNotesNameDashboard = ({className}) => {
  const context = useCompanyContext()
  const {data: studentIssuesLists} = context.useGetAllStudentIssueStatusQuery
  const navigate = useNavigate()

  const filteredData = studentIssuesLists?.filter((s) => s?.showStudent === true)

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return (
    <div
      style={{
        overflowY: 'scroll',
        maxHeight: '220px', // Limit height to fit approximately 5 items; adjust as needed
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#fff', // Optional background color
        background: themeMode === 'dark' ? '#323338' : '#fff',
      }}
      className={` ${className}`}
    >
      <div className='card-body pt-5'>
        {filteredData?.length === 0 && <div>No Student Issue is right now</div>}
        {filteredData?.map((row, index) => (
          <Fragment key={`lw26-rows-${index}`}>
            <div className='d-flex flex-stack mb-2'>
              <a
                className='text-danger fw-semibold fs-6 me-2'
                onClick={() => navigate(`/profile/student/${row.studentId}`)}
                style={{cursor: 'pointer'}}
              >
                {row?.studentName}
              </a>
              <button
                onClick={() => navigate(`/profile/student/${row.studentId}`)}
                type='button'
                className='btn btn-icon btn-sm h-auto btn-color-gray-400 btn-active-color-primary justify-content-end'
              >
                <KTIcon iconName='flag' className='fs-2 text-danger' />
              </button>
            </div>
            {filteredData?.length - 1 > index && (
              <div className='separator separator-dashed my-3' />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ShowStudentNotesNameDashboard
