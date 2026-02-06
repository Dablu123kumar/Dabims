/* eslint-disable react/jsx-no-target-blank */
import React, {useEffect} from 'react'
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useCompanyContext} from '../../../../../app/pages/compay/CompanyContext'
import {useAuth} from '../../../../../app/modules/auth'
import useUserRoleAccessContext from '../../../../../app/pages/userRoleAccessManagement/UserRoleAccessContext'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const {getAllUserAccessRoleData} = useUserRoleAccessContext()
  const companyCTX = useCompanyContext()
  const {currentUser} = useAuth()
  const userRoleAccess = getAllUserAccessRoleData?.data?.roleAccessData
  const company = companyCTX.getCompanyLists
  const companyNames = company?.data?.map((company: any) => company.companyName) || []
  // console.log('Company Names:', companyNames)

  const matchedCompanies: {[key: string]: boolean} = {}

  // Check if userRoleAccess has data before using forEach
  if (userRoleAccess && Array.isArray(userRoleAccess)) {
    userRoleAccess.forEach((role: any) => {
      // Check if the current role matches the user's current role
      if (role.role === currentUser?.role) {
        // console.log(`Current role matched: ${role.role}`)

        // Get the company permissions for the current role
        const companyPermissions = role.companyPermissions || {}

        // Match companies between companyNames and companyPermissions
        Object.keys(companyPermissions).forEach((company) => {
          // Only consider companies that are in the provided companyNames list
          if (companyNames.includes(company)) {
            // Set matchedCompanies based on company permissions
            matchedCompanies[company] = companyPermissions[company]
          }
        })

        // Log matched companies for debugging
        // console.log(`Matched Companies for role ${role.role}:`, matchedCompanies)
      } else {
        // console.log(
        //   `Role ${role.role} does not match the current user role ${currentUser?.role}. Skipping...`
        // )
      }
    })
  } else {
    // console.error('userRoleAccess is undefined or not an array.')
  }

  // Filter to get only companies that are true for the current user
  const userVisibleCompanies = Object.keys(matchedCompanies).filter(
    (company) => matchedCompanies[company] === true
  )

  // Log the companies that the current user can see
  // console.log('Companies visible to current user:', userVisibleCompanies)

  return (
    <>
      {currentUser?.role !== 'Student' ? (
        <>
          <SidebarMenuItem
            to='/dashboard'
            icon='element-11'
            title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
            fontIcon='bi-app-indicator'
          />
          {/* ----------------------------- Company Menu Start Here ............................... */}
          {companyCTX.getCompanyLists?.data?.map((CompanyListData: any, index: number) => (
            <React.Fragment key={index}>
              {userRoleAccess?.some(
                (userAccess: any) =>
                  (userAccess.role === currentUser?.role &&
                    matchedCompanies[CompanyListData.companyName]) ||
                  currentUser?.role === 'SuperAdmin'
              ) && (
                <SidebarMenuItemWithSub
                  key={CompanyListData?._id}
                  to='/apps/chat'
                  title={CompanyListData.companyName}
                  fontIcon='bi-chat-left'
                  icon='message-text-2'
                >
                  <SidebarMenuItemWithSub
                    to=''
                    title={'Students'}
                    fontIcon='bi-chat-left'
                    icon='message-text-2'
                  >
                    <SidebarMenuItem
                      to={`/students/${CompanyListData?._id}`}
                      title='All Students'
                      hasBullet={true}
                    />
                    <SidebarMenuItem
                      to={`/drop-out-students/${CompanyListData?._id}`}
                      title='Drop Out Students'
                      hasBullet={true}
                    />
                    <SidebarMenuItem
                      to={`/students-remainingFee/${CompanyListData?._id}`}
                      title='Pending Students'
                      hasBullet={true}
                    />
                    <SidebarMenuItem
                      to={`/students-clearFee/${CompanyListData?._id}`}
                      title='Clear Students'
                      hasBullet={true}
                    />
                    {currentUser?.role === 'SuperAdmin' && (
                      <SidebarMenuItem
                        to={`/reciepts-approval/${CompanyListData?._id}`}
                        title='Approval Reciepts'
                        hasBullet={true}
                      />
                    )}
                  </SidebarMenuItemWithSub>

                  <SidebarMenuItemWithSub
                    to=''
                    title={'Enquiry'}
                    fontIcon='bi-chat-left'
                    icon='message-text-2'
                  >
                    <SidebarMenuItemWithSub
                      to='/apps/chat'
                      title={'Forms'}
                      fontIcon='bi-chat-left'
                      icon='message-text-2'
                    >
                      <SidebarMenuItem
                        to={`/add-form/${CompanyListData?._id}`}
                        title='Add Form'
                        hasBullet={true}
                      />
                      <SidebarMenuItem
                        to={`/view-form/${CompanyListData?._id}`}
                        title='View Forms'
                        hasBullet={true}
                      />
                    </SidebarMenuItemWithSub>

                    <SidebarMenuItemWithSub
                      to='/apps/chat'
                      title={'Manage Enquiry'}
                      fontIcon='bi-chat-left'
                      icon='message-text-2'
                    >
                      <SidebarMenuItem
                        to={`/add-enquiry/${CompanyListData?._id}`}
                        title='Add Enquiry'
                        hasBullet={true}
                      />
                      <SidebarMenuItem
                        to={`/view-form-data/${CompanyListData?._id}`}
                        title='View All Enquiry '
                        hasBullet={true}
                      />
                      <SidebarMenuItem
                        to={`/reminder-task/${CompanyListData?._id}`}
                        title='Reminder Task'
                        hasBullet={true}
                      />
                    </SidebarMenuItemWithSub>
                  </SidebarMenuItemWithSub>

                  {/* <SidebarMenuItemWithSub
                    to='/apps/chat'
                    title={'Attendance'}
                    fontIcon='bi-chat-left'
                    icon='message-text-2'
                  >
                    
                    <SidebarMenuItem
                      to={`/add-lab/${CompanyListData?._id}`}
                      title='Add Labs'
                      hasBullet={true}
                    />
                
                  </SidebarMenuItemWithSub> */}

                  <SidebarMenuItemWithSub
                    to='/apps/chat'
                    title={'Batch'}
                    fontIcon='bi-chat-left'
                    icon='message-text-2'
                  >
                    <SidebarMenuItem
                      to={`/add-trainer/${CompanyListData?._id}`}
                      title='Add Trainers'
                      hasBullet={true}
                    />
                  
                    <SidebarMenuItem
                      to={`/add-batch/${CompanyListData?._id}`}
                      title='Add Batches'
                      hasBullet={true}
                    />
                    {/* <SidebarMenuItem
                      to={`/add-teacher/${CompanyListData?._id}`}
                      title='Add Teachers'
                      hasBullet={true}
                    /> */}
                    <SidebarMenuItem
                      to={`/add-timing/${CompanyListData?._id}`}
                      title='Add Timings'
                      hasBullet={true}
                    />
                  </SidebarMenuItemWithSub>

                  <SidebarMenuItemWithSub
                    to='/apps/chat'
                    title={'Reports'}
                    fontIcon='bi-chat-left'
                    icon='message-text-2'
                  >
                    <SidebarMenuItem
                      to={`/monthly-reports/${CompanyListData?._id}`}
                      title='Monthly Reports'
                      hasBullet={true}
                    />
                    <SidebarMenuItem
                      to={`/monthlyCollectionFees/${CompanyListData?._id}`}
                      title='Monthly Collections'
                      hasBullet={true}
                    />
                    <SidebarMenuItem
                      to={`/student-reports/${CompanyListData?._id}`}
                      title='Student Reports'
                      hasBullet={true}
                    />
                  </SidebarMenuItemWithSub>

                  <SidebarMenuItem
                    to={`/student/commission/${CompanyListData?._id}`}
                    title='Commission'
                    hasBullet={true}
                  />
                  <SidebarMenuItem
                    to={`/addmission-form/${CompanyListData?._id}`}
                    title='Admission Form'
                    hasBullet={true}
                  />

                  {/* Day Book */}
                  <SidebarMenuItemWithSub
                    to='/apps/chat'
                    title='Day Book'
                    fontIcon='bi-chat-left'
                    icon='message-text-2'
                  >
                    <SidebarMenuItem
                      to={`/daybook/viewDaybook/${CompanyListData._id}`}
                      title='View DayBook'
                      hasBullet={true}
                    />
                    <SidebarMenuItem
                      to={`/daybook/addAccount/${CompanyListData._id}`}
                      title='Add Account'
                      hasBullet={true}
                    />
                    <SidebarMenuItem
                      to={`/daybook/viewAccount/${CompanyListData._id}`}
                      title='View Account'
                      hasBullet={true}
                    />
                    <SidebarMenuItem
                      to={`/daybook/viewLinkAccount/${CompanyListData._id}`}
                      title='View Link Account'
                      hasBullet={true}
                    />
                  </SidebarMenuItemWithSub>
                  {/* End Day Book */}
                </SidebarMenuItemWithSub>
              )}
            </React.Fragment>
          ))}

          {/* ----------------------------- Company Menu END Here ............................... */}

          {/* ************* Manage Courses Start   ****************** */}
          <SidebarMenuItemWithSub
            to='/apps/chat'
            title='Manage Courses'
            fontIcon='bi-chat-left'
            icon='message-text-2'
          >
            <SidebarMenuItem to='/course/course-type' title='Add Course Type' hasBullet={true} />
            <SidebarMenuItem to='/course/category' title='Add Course Category' hasBullet={true} />
            <SidebarMenuItem
              to='/course/no_of_years_course'
              title='Add Course Number Of Years'
              hasBullet={true}
            />
            <SidebarMenuItem to='/course/addCourse' title='Add Course' hasBullet={true} />
            <SidebarMenuItem to='/course/viewCourses' title='View All Courses' hasBullet={true} />
            {/* <SidebarMenuItem to='/addmission-form' title='Add Course Category' hasBullet={true} /> */}
          </SidebarMenuItemWithSub>
          {/* ************* Manage Courses END   ****************** */}

          {/* ************************************* Manage Company Start ******************************** */}
          {currentUser?.role !== 'Counsellor' ? (
            <SidebarMenuItemWithSub
              to='/apps/chat'
              title='Manage Company'
              fontIcon='bi-chat-left'
              icon='message-text-2'
            >
              <SidebarMenuItem to='/company' title='Company' hasBullet={true} />
              <SidebarMenuItem to='/add-company' title='Add Company' hasBullet={true} />
            </SidebarMenuItemWithSub>
          ) : (
            ''
          )}
          {/* *************************************  Manage Company End ******************************** */}

          {/* ------------------------------ Settings Page Start ----------------------------------------- */}
          {currentUser?.role !== 'Counsellor' ? (
            <SidebarMenuItemWithSub
              to='/apps/chat'
              title='Settings'
              fontIcon='bi-chat-left'
              icon='abstract-29'
            >
              <SidebarMenuItem to='/general-settings' title='General Settings' hasBullet={true} />
              <SidebarMenuItem to='/email-settings' title='Email Settings' hasBullet={true} />
            </SidebarMenuItemWithSub>
          ) : (
            ''
          )}
          {/* ------------------------------ Settings Page End ------------------------------------------- */}

          {currentUser?.role !== 'Counsellor' ? (
            <SidebarMenuItemWithSub
              to='/apps/chat'
              title='User management'
              fontIcon='bi-layers'
              icon='abstract-28'
            >
              <SidebarMenuItem
                to='/apps/user-management/users'
                title='User management'
                hasBullet={true}
              />
              {currentUser?.role === 'SuperAdmin' && (
                <SidebarMenuItem
                  to='/apps/user-role/management'
                  title='User Access'
                  hasBullet={true}
                />
              )}
            </SidebarMenuItemWithSub>
          ) : (
            ''
          )}
        </>
      ) : (
        <>
          <SidebarMenuItem
            to={`/student/${currentUser?.studentId}`}
            icon='abstract-28'
            title='Student Profile'
            fontIcon='bi-layers'
          />
        </>
      )}
    </>
  )
}

export {SidebarMenuMain}
