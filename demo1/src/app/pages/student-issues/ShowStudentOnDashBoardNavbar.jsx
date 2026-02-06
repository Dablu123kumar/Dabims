import {Fragment} from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {useNavigate} from 'react-router-dom'
import {useCompanyContext} from '../compay/CompanyContext'

const ShowStudentOnDashBoardNavbar = ({className}) => {
  const context = useCompanyContext()
  const {data: studentIssuesLists} = context.useGetAllStudentIssueStatusQuery
  const navigate = useNavigate()

  // Filter the data for students with `showStudent` as true
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
        overflowY: 'auto', // Enables scrolling for overflowing content
        overflowX: 'hidden',
        width: '200px',
        maxHeight: '240px', // Adjust to fit approximately 5 students
        padding: '10px',
        background: themeMode === 'dark' ? 'black' : '#fff',
      }}
      className={` ${className}`}
    >
      {filteredData?.length === 0 && <div>No Student Issue is right now</div>}
      {filteredData?.map((row, index) => (
        <Fragment key={`lw26-rows-${index}`}>
          <div
            className='d-flex flex-stack'
            style={{
              marginBottom: '10px', // Space between items
              paddingBottom: '5px', // Padding for better spacing
            }}
          >
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
          {filteredData?.length - 1 > index && <div className='separator separator-dashed my-3' />}
        </Fragment>
      ))}
    </div>
  )
}

export default ShowStudentOnDashBoardNavbar
