import {useEffect, useState} from 'react'
// import {useCompanyContext} from '../company/CompanyContext' // Correct the import path
import useUserRoleAccessContext from './UserRoleAccessContext'
import {useCompanyContext} from '../compay/CompanyContext'
import {useAuth} from '../../modules/auth'

const UserRoleAccessManagement = () => {
  const [selectedRole, setSelectedRole] = useState('SuperAdmin')
  const {currentUser} = useAuth()
  // console.log(currentUser)
  const [permissions, setPermissions] = useState({
    role: 'Student',
    companyPermissions: {},
    studentControlAccess: {},
    studentFeesAccess: {},
  })

  // console.log(permissions?.companyPermissions)

  const {postUserRoleAccessData, getAllUserAccessRoleData} = useUserRoleAccessContext()
  const {getCompanyLists} = useCompanyContext()
  const companyName = getCompanyLists?.data || []

  const [dataBasePermission, setDataBasePermission] = useState(
    getAllUserAccessRoleData?.data?.roleAccessData
  )

  const company = dataBasePermission?.map((company) => company)
  // const companyPermissions = company?.companyPermissions?.map((company) => company)
  // console.log(company)
  // Handle select change (role)
  const handleSelectChange = (e) => {
    const {value} = e.target
    setSelectedRole(value)
    setPermissions((prevState) => ({
      ...prevState,
      role: value,
    }))
  }

  useEffect(() => {
    // Find the permissions for the selected role from the fetched data
    if (getAllUserAccessRoleData?.data?.roleAccessData?.length > 0) {
      const roleAccessData = getAllUserAccessRoleData.data.roleAccessData
      const roleData = roleAccessData.find((role) => role.role === selectedRole)

      if (roleData) {
        setPermissions({
          companyPermissions: roleData.companyPermissions || {},
          studentControlAccess: roleData.studentControlAccess || {},
          studentFeesAccess: roleData.studentFeesAccess || {},
        })
      }
    }
  }, [getAllUserAccessRoleData, selectedRole])
  const userRoleAccessData = getAllUserAccessRoleData?.data?.roleAccessData

  // console.log(userRoleAccessData)

  // Handle checkbox change for different sections
  const handleCheckboxChange = (e, section) => {
    const {value, checked} = e.target

    // Update the permissions state based on checkbox change
    setPermissions((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [value]: checked,
      },
    }))
  }

  // Handle save action
  const handleSave = (e) => {
    e.preventDefault()
    const updatedPermissions = {
      ...permissions,
      role: selectedRole,
    }
    postUserRoleAccessData.mutate(updatedPermissions)
  }

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-header border-0 cursor-pointer'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0 w-5'>User Role Access Management</h3>
        </div>
        <div className='search-bar'>
          <select
            value={selectedRole}
            onChange={handleSelectChange}
            className='form-select form-select-solid form-select-lg'
          >
            {userRoleAccessData?.length > 0 ? (
              userRoleAccessData?.map((role) => (
                <>
                  <option value={role.role} key={role._id}>{role.role}</option>
                </>
              ))
            ) : (
              <>
                {currentUser?.role === 'SuperAdmin' && (
                  <option value='SuperAdmin'>Super Admin</option>
                )}
                <option value='Student'>Student</option>
                <option value='Telecaller'>Telecaller</option>
                <option value='Accounts'>Accounts</option>
                <option value='Counsellor'>Counsellor</option>
                <option value='Admin'>Admin</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Company Permissions */}
      <div className='card-body border-top p-5'>
        <fieldset
          style={{
            border: '1px solid #b6b8b9',
            padding: '15px',
            borderRadius: '5px',
            position: 'relative',
          }}
        >
          <legend style={fieldsetLegendStyle}>Company</legend>
          <div className='d-flex justify-content-between' style={{marginTop: '15px'}}>
            {(userRoleAccessData?.companyPermissions?.length > 0
              ? userRoleAccessData.companyPermissions
              : companyName
            )?.map((company) => (
              <div
                key={company._id}
                className='form-check form-check-sm form-check-custom form-check-solid d-flex align-items-center'
              >
                <input
                  className='form-check-input widget-9-check'
                  type='checkbox'
                  value={company.companyName}
                  id={`company-checkbox-${company._id}`}
                  onChange={(e) => handleCheckboxChange(e, 'companyPermissions')}
                  checked={permissions.companyPermissions[company.companyName] === true || false} // Control checked state
                />
                <label
                  className='form-check-label'
                  htmlFor={`company-checkbox-${company._id}`}
                  style={{
                    marginLeft: '10px',
                    color: 'black',
                    color: themeMode === 'dark' ? '#fff' : '',
                  }}
                >
                  {company.companyName}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Student Control Access */}
      <div className='card-body border-top p-5'>
        <fieldset
          style={{
            border: '1px solid #b6b8b9',
            padding: '15px',
            borderRadius: '5px',
            position: 'relative',
          }}
        >
          <legend style={fieldsetLegendStyle}>Student Control Access</legend>
          <div className='d-flex justify-content-between' style={{marginTop: '15px'}}>
            {['Add Student', 'Dropout Student', 'Edit Student', 'Delete Student'].map((action) => (
              <div
                key={action}
                className='form-check form-check-sm form-check-custom form-check-solid d-flex align-items-center'
              >
                <input
                  className='form-check-input widget-9-check'
                  type='checkbox'
                  value={action}
                  id={`student-${action.toLowerCase().replace(' ', '-')}`}
                  onChange={(e) => handleCheckboxChange(e, 'studentControlAccess')}
                  checked={permissions.studentControlAccess[action] || false} // Control checked state
                />
                <label
                  className='form-check-label'
                  htmlFor={`student-${action.toLowerCase().replace(' ', '-')}`}
                  style={{
                    marginLeft: '10px',
                    color: 'black',
                    color: themeMode === 'dark' ? '#fff' : '',
                  }}
                >
                  {action}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Student Fees Access */}
      <div className='card-body border-top p-5'>
        <fieldset
          style={{
            border: '1px solid #b6b8b9',
            padding: '15px',
            borderRadius: '5px',
            position: 'relative',
          }}
        >
          <legend style={fieldsetLegendStyle}>Student Fees Access</legend>
          <div className='d-flex justify-content-between' style={{marginTop: '15px'}}>
            {[
              'Add Student Fees',
              'Edit Student Fees',
              'Delete Student Fees',
              'Print Recipt',
              'Mail Button',
              'Whatsapp Button',
            ].map((action) => (
              <div
                key={action}
                className='form-check form-check-sm form-check-custom form-check-solid d-flex align-items-center'
              >
                <input
                  className='form-check-input widget-9-check'
                  type='checkbox'
                  value={action}
                  id={`fees-${action.toLowerCase().replace(' ', '-')}`}
                  onChange={(e) => handleCheckboxChange(e, 'studentFeesAccess')}
                  checked={permissions.studentFeesAccess[action] || false} // Control checked state
                />
                <label
                  className='form-check-label'
                  htmlFor={`fees-${action.toLowerCase().replace(' ', '-')}`}
                  style={{
                    marginLeft: '10px',
                    color: 'black',
                    color: themeMode === 'dark' ? '#fff' : '',
                  }}
                >
                  {action}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className='card-footer d-flex justify-content-end py-6 px-9'>
        <button type='button' onClick={handleSave} className='btn btn-primary'>
          Save
        </button>
      </div>
    </div>
  )
}

let themeMode = 'system'

if (localStorage.getItem('kt_theme_mode_value')) {
  themeMode = localStorage.getItem('kt_theme_mode_value')
}

if (themeMode === 'system') {
  themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const fieldsetLegendStyle = {
  fontWeight: 'bold',
  color: 'GrayText',
  fontSize: '18px',
  textAlign: 'center',
  padding: '0 10px',
  width: 'auto',
  margin: '0 auto',
  position: 'absolute',
  top: '-12px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#fff',
  background: themeMode === 'dark' ? '#323338' : '#fff',
}

export default UserRoleAccessManagement
