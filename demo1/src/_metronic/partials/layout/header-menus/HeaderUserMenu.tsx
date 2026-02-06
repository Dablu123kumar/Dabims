import {FC} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../../../app/modules/auth'
import {toAbsoluteUrl} from '../../../helpers'
import {useAdmissionContext} from '../../../../app/modules/auth/core/Addmission'
import {Languages} from './Languages' // Uncomment if implemented

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const HeaderUserMenu: FC<{
  currentStudent: any
}> = ({currentStudent}) => {
  const {currentUser, logout} = useAuth()
  const navigate = useNavigate()
  // const studentCTX = useAdmissionContext(); // Uncomment if used

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img
              alt='Logo'
              src={
                currentStudent?.image ? BASE_URL_Image + '/' + currentStudent?.image : '/300-1.jpg'
              }
            />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {currentUser?.first_name}
              {/* <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span> */}
            </div>
            <a className='fw-bold text-muted text-hover-primary fs-7'>{currentUser?.email}</a>
          </div>
        </div>
      </div>

      {currentStudent && (
        <>
          <div className='separator my-2'></div>
          <div className='menu-item px-5'>
            <button
              onClick={() => navigate(`/student/${currentStudent?._id}`, {state: currentStudent})}
              className='btn menu-link btn-block'
            >
              My Profile
            </button>
          </div>
        </>
      )}

      {/* Uncomment additional menu items as needed */}
      {/* <div className='menu-item px-5'>
        <a href='#' className='menu-link px-5'>
          My Projects
        </a>
      </div>

      <div className='menu-item px-5'>
        <a href='#' className='menu-link px-5'>
          My Subscription
        </a>
      </div>

      <div className='menu-item px-5'>
        <a href='#' className='menu-link px-5'>
          My Statements
        </a>
      </div>

      <div className='separator my-2'></div>

      <Languages /> // Uncomment if implemented

      <div className='menu-item px-5 my-1'>
        <Link to='/crafted/account/settings' className='menu-link px-5'>
          Account Settings
        </Link>
      </div> */}

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
