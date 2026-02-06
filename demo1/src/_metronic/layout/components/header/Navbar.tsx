import {useState} from 'react'
import clsx from 'clsx'
import {KTIcon} from '../../../helpers'
import {HeaderUserMenu, ThemeModeSwitcher} from '../../../partials'
import {useLayout} from '../../core'
import {useAuth} from '../../../../app/modules/auth'
import {useAdmissionContext} from '../../../../app/modules/auth/core/Addmission'
import {useCompanyContext} from '../../../../app/pages/compay/CompanyContext'
import ShowStudentOnDashBoardNavbar from '../../../../app/pages/student-issues/ShowStudentOnDashBoardNavbar'
import NotificationOfAlertStudentOnNavbar from '../../../../app/pages/Alert_Pending_NewStudents/NotificationOfAlertStudentOnNavbar'

const itemClass = 'ms-1 ms-md-4'
const userAvatarClass = 'symbol-35px'
const btnIconClass = 'fs-2'

const Navbar = () => {
  const {config} = useLayout()
  const {currentUser} = useAuth()
  const context = useCompanyContext()
  const {data: studentIssuesLists} = context.useGetAllStudentIssueStatusQuery
  const studentCTX = useAdmissionContext()
  const filteredStudentsAlertData =
    studentCTX.getAllStudentsAlertStudentPendingFeesQuery?.data?.filter(
      (s) => s.Status === 'pending'
    )
  const [isNotificationOpen, setNotificationOpen] = useState(false)
  const [isAlertNotificationOpen, setAlertNotificationOpen] = useState(false)

  const filteredData = studentIssuesLists?.filter((s) => s?.showStudent === true)
  const currentStudent = studentCTX?.useGetSingleStudentUsingWithEmail(currentUser?.email)

  let themeMode: string = 'light'

  const storedThemeMode = localStorage.getItem('kt_theme_mode_value')
  if (storedThemeMode) {
    themeMode = storedThemeMode // storedThemeMode is always a string here
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return (
    <div className='app-navbar flex-shrink-0'>
      {/* Notification Section */}
      <div className={clsx('app-navbar-item', itemClass)} style={{position: 'relative'}}>
        {currentUser?.role !== 'Student' && (
          <button
            type='button'
            className='btn btn-icon btn-md h-auto btn-color-gray-400 btn-active-color-primary justify-content-end'
            style={{position: 'relative'}}
            onClick={() => setAlertNotificationOpen(!isAlertNotificationOpen)}
          >
            <KTIcon iconName='notification' className='fs-1 text-warning' />
            {filteredStudentsAlertData?.length === 0 ? (
              ''
            ) : (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-1px',
                  backgroundColor: 'red',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '14px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                {filteredStudentsAlertData?.length}
              </span>
            )}
          </button>
        )}
        {currentUser?.role !== 'Student' && (
          <button
            type='button'
            className='btn btn-icon btn-sm h-auto btn-color-gray-400 btn-active-color-primary justify-content-end'
            style={{position: 'relative'}}
            onClick={() => setNotificationOpen(!isNotificationOpen)}
          >
            <KTIcon iconName='flag' className='fs-1 text-danger' />
            {filteredData?.length === 0 ? (
              ''
            ) : (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-1px',
                  backgroundColor: 'red',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '14px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                {filteredData?.length}
              </span>
            )}
          </button>
        )}
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
        {isNotificationOpen && (
          <div
            style={{
              position: 'absolute',
              top: '80px',
              right: '0',
              backgroundColor: 'white',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              zIndex: '9999',
              width: '210px',
              maxHeight: '400px',
              // overflowY: 'auto',
              background: themeMode === 'dark' ? 'black' : '#fff',
              overflow: 'hidden',
            }}
            onMouseLeave={() => setNotificationOpen(false)}
          >
            <h5 className='p-3 border-bottom'>Flagged Students</h5>
            {/* Render the student component */}
            <ShowStudentOnDashBoardNavbar className={''} />
          </div>
        )}
        {isAlertNotificationOpen && (
          <div
            style={{
              position: 'absolute',
              top: '80px',
              right: '0',
              backgroundColor: 'white',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              zIndex: '9999',
              width: '210px',
              maxHeight: '400px',
              background: themeMode === 'dark' ? 'black' : '#fff',
              // overflowY: 'auto',
              overflow: 'hidden',
            }}
            onMouseLeave={() => setAlertNotificationOpen(false)}
          >
            <h6 className='p-3 border-bottom'>Alert Student Pending Fees</h6>
            {/* Render the student component */}
            <NotificationOfAlertStudentOnNavbar />
          </div>
        )}
      </div>

      {/* User Avatar Section */}
      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img src={currentStudent?.data?.image || '/300-1.jpg'} alt='' />
        </div>
        {currentStudent && <HeaderUserMenu currentStudent={currentStudent?.data} />}
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTIcon iconName='text-align-left' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export {Navbar}
