import {FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import {useAuth} from '../modules/auth'
import {useAdmissionContext} from '../modules/auth/core/Addmission'
import UpdateAddmission from '../pages/UpdateAddmission'
import WhatsappMessageSuggestion from '../pages/email-template/WhatsappMessageSuggestion'
import PendingFeesStudents from '../pages/student-with-feesClear-and-remaining/PendingFeesStudents'
import ClearFeesStudents from '../pages/student-with-feesClear-and-remaining/ClearFeesStudents'
import GstSuggesstion from '../pages/email-template/GstSuggesstion'
import ViewDayBookAccount from '../pages/dayBook/ViewDayBookAccount'
import EditDayBookAccount from '../pages/dayBook/EditDayBookAccount'
import StudentCommission from '../pages/student-commission/StudentCommission'
import ShowSingleAccountDayBookData from '../pages/dayBook/ShowSingleAccountDayBookData'
import ViewDayBook from '../pages/dayBook/ViewDayBook'
import AddAccountDayBook from '../pages/dayBook/AddAccountDayBook'
import UpdateCompany from '../pages/compay/UpdateCompany'
import AddCompany from '../pages/compay/AddCompany'
import Company from '../pages/compay/Company'
import ProfilePage from '../modules/profile/ProfilePage'
import WizardsPage from '../modules/wizards/WizardsPage'
import AccountPage from '../modules/accounts/AccountPage'
import WidgetsPage from '../modules/widgets/WidgetsPage'
import ChatPage from '../modules/apps/chat/ChatPage'
import UsersPage from '../modules/apps/user-management/UsersPage'
import AddMissionForm from '../pages/AddMissionForm'
import MyPage from '../pages/MyPage'
import StudentsList from '../pages/StudentsList'
// import StudentProfile from '../pages/student-profile/StudentProfile'
import CourseTypes from '../pages/course/course-type'
import CourseCategory from '../pages/course/category'
import NumberOfYearsCourse from '../pages/course/Number Of Years'
import AddCourse from '../pages/course'
import AddCourseEditAndAdd from '../pages/course/course-type/AddCourseEditAndAdd'
import AddCourseTypeEdit from '../pages/course/course-type/AddCourseTypeEdit'
import AddNumberYearCourse from '../pages/course/Number Of Years/AddNumberYearCourse'
import AddCourseCategory from '../pages/course/category/AddCategory'
import AddCourseUpdateAndAdd from '../pages/course/AddCourse'
import EditCourse from '../pages/course/EditCourse'
import ViewCourse from '../pages/course/ViewCourse'
import MonthlyCollectionFee from '../pages/payment_option/MonthlyCollectionFee'
import AddPaymentOption from '../pages/payment_option/AddPaymentOption'
import EmailTemplate from '../pages/email-template/EmailTemplate'
import SendEmailSuggestion from '../pages/email-template/SendEmailSuggestion'
import CourseStudentSubjectMarks from '../pages/courseStudentSubjectsMarks/CourseStudentSubjectMarks'
import StudentMarksResult from '../pages/courseStudentSubjectsMarks/StudentMarksResult'
import StudentProfileDetailsPage from '../pages/monthly_collection_fee/StudentProfileDetailsPage'
import DropOutStudents from '../pages/drop-out-students/DropOutStudents'
import AddForm from '../pages/enquiry-related/dynamicForms/AddForm'
import EditFormName from '../pages/enquiry-related/dynamicForms/EditFormName'
import UpdateFormData from '../pages/enquiry-related/dynamicForms/UpdateFormData'
import OnlyViewFormData from '../pages/enquiry-related/dynamicForms/OnlyViewFormData'
import ViewForms from '../pages/enquiry-related/dynamicForms/ViewForms'
import ViewAllEnquiryFormsData from '../pages/enquiry-related/viewEnquiryFormsData/ViewAllEnquiryFormsData'
import AddEnquiryForm from '../pages/enquiry-related/viewEnquiryFormsData/AddEnquiryForm'
import ProfileForm from '../pages/enquiry-related/dynamicForms/ProfileForm'
import TrainersList from '../pages/attendance-related/Trainers/TrainersList'
import TeachersList from '../pages/teachers/TeachersList'
import LabsList from '../pages/attendance-related/Labs/LabsList'
import BatchForm from '../pages/attendance-related/Batches/BatchForm'
import BatchManagement from '../pages/attendance-related/Batches/BatchManagement'
import TimingList from '../pages/attendance-related/Timings/TimingLists'
import MonthlyReportsDashBoard from '../pages/monthly_Reports/MonthlyReportsDashBoard'
import TodoCalendarRemainder from '../pages/enquiry-related/viewEnquiryFormsData/TodoCalendarRemainder'
import UserRoleAccessManagement from '../pages/userRoleAccessManagement/UserRoleAccessManagement'
import DynamicEmailTemplate from '../pages/email-template/DynamicEmailTemplate'
import PaymentApproval from '../pages/Payment_Approval/PaymentApproval'
import DayBookAccountTable from '../pages/dayBook/DayBookAccountTable'
import StudentCourseDataDownload from '../pages/monthly_Reports/StudentCourseDataDownload'
import StudentProfileView from '../pages/student-profile/StudentProfileView'
import ViewLinkAccount from '../pages/dayBook/ViewLinkAccount'
import ShowSingleLinkAccountData from '../pages/dayBook/ShowSingleLinkAccountData'
import AttendanceOfSingleStudent from '../pages/attendance-related/Batches/AttendanceOfSingleStudent'
// import DynamicEnquiryForm from '../pages/enquiry-related/DynamicEnquiryForm'
// import GeneralSettingForm from '../pages/general-setting-dynamic-form/GeneralSettingForm'
// import TopBarFormSelector from '../pages/general-setting-dynamic-form/TopBarFormSelector'

const PrivateRoutes = () => {
  const {currentUser} = useAuth()
  //console.log(currentUser)

  const studentCTX = useAdmissionContext()

  // Fetch current student data based on currentUser's email
  const currentStudent = studentCTX?.useGetSingleStudentUsingWithEmail(currentUser?.email)
  // console.log(currentStudent.data)

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />

        {currentUser?.role !== 'Student' ? (
          <>
            {/* ================================  DayBook Start Here ============================== */}{' '}
            <Route
              path='/daybook/viewDaybook/:id'
              element={
                <>
                  <ViewDayBook />
                </>
              }
            />
            <Route
              path='/daybook/addAccount/:id'
              element={
                <>
                  <AddAccountDayBook />
                </>
              }
            />
            <Route
              path='/daybook/singleAccount/:id'
              element={
                <>
                  <ShowSingleAccountDayBookData />
                </>
              }
            />
            <Route
              path='/daybook/singleLinkAccount/:id'
              element={
                <>
                  <ShowSingleLinkAccountData />
                </>
              }
            />
            <Route
              path='/daybook/editAccount/:id'
              element={
                <>
                  <EditDayBookAccount />
                </>
              }
            />
            <Route
              path='/daybook/viewAccount/:id'
              element={
                <>
                  <ViewDayBookAccount />
                </>
              }
            />
            <Route
              path='/daybook/viewLinkAccount/:id'
              element={
                <>
                  <ViewLinkAccount />
                </>
              }
            />
            {/* ================================  DayBook End Here ============================== */}
            {/* ====================Start Course Here ==================== */}
            <Route
              path='/course/course-type'
              element={
                <>
                  <CourseTypes className='' />
                </>
              }
            />
            <Route
              path='/course/course-type/editAdd/:id'
              element={
                <>
                  <AddCourseEditAndAdd />
                </>
              }
            />
            <Route
              path='/course/course-type/edit/:id'
              element={
                <>
                  <AddCourseTypeEdit />
                </>
              }
            />
            <Route
              path='/course/category'
              element={
                <>
                  <CourseCategory className='' />
                </>
              }
            />
            <Route
              path='/course/category/add'
              element={
                <>
                  <AddCourseCategory />
                </>
              }
            />
            <Route
              path='/student/commission/:companyId'
              element={
                <>
                  <StudentCommission />
                </>
              }
            />
            {/* ======================================Add Number Of Years Course Type Start ============================================= */}
            <Route
              path='/course/no_of_years_course'
              element={
                <>
                  <NumberOfYearsCourse className='' />
                </>
              }
            />
            <Route
              path='/course/no_of_years_course/add'
              element={
                <>
                  <AddNumberYearCourse />
                </>
              }
            />
            {/* ======================================Add Number Of Years Course Type End ============================================= */}
            <Route
              path='/course/addCourse'
              element={
                <>
                  <AddCourse className='' />
                </>
              }
            />
            <Route
              path='/course/viewCourses'
              element={
                <>
                  <ViewCourse />
                </>
              }
            />
            <Route
              path='/course/addCourse/add'
              element={
                <>
                  <AddCourseUpdateAndAdd />
                </>
              }
            />
            <Route
              path='/course/addCourse/update'
              element={
                <>
                  <EditCourse />
                </>
              }
            />
            {/* ====================End Course Here ==================== */}
            <Route
              path='/my-page'
              element={
                <>
                  <MyPage />
                </>
              }
            />
            <Route
              path='/addmission-form/:id'
              element={
                <>
                  <AddMissionForm />
                </>
              }
            />
            <Route
              path='/update-addmission-form/:id'
              element={
                <>
                  <UpdateAddmission />
                </>
              }
            />
            <Route
              path='/students/:id'
              element={
                <>
                  <StudentsList className='' />
                </>
              }
            />
            <Route
              path='/drop-out-students/:id'
              element={
                <>
                  <DropOutStudents />
                </>
              }
            />
            <Route
              path='/students-clearFee/:id'
              element={
                <>
                  <ClearFeesStudents />
                </>
              }
            />
            <Route
              path='/students-remainingFee/:id'
              element={
                <>
                  <PendingFeesStudents />
                </>
              }
            />
            <Route
              path='/reciepts-approval/:id'
              element={
                <>
                  <PaymentApproval />
                </>
              }
            />
            {/* <Route path='/enquiry-form/:id' element={<DynamicEnquiryForm companyName='' />} /> */}
            {/* <---------------------- Dynamic Form Routes Starts Here --------------------->*/}
            <Route path='/add-form/:id' element={<AddForm />} />
            <Route path='/update-form/:id' element={<EditFormName />} />
            <Route path='/reciept/:id' element={<DayBookAccountTable />} />
            <Route path='/profile-form/:id' element={<ProfileForm />} />
            <Route path='/view-form/:id' element={<ViewForms />} />
            {/* <---------------- View All Dynamic Form Routes Starts Here ------------------>*/}
            <Route path='/view-form-data/:id' element={<ViewAllEnquiryFormsData />} />
            <Route path='/reminder-task/:id' element={<TodoCalendarRemainder />} />
            <Route path='/add-enquiry/:id' element={<AddEnquiryForm />} />
            {/* <---------------- Student Profile Page Starts Here ------------------>*/}
            {/* <Route path='/student/:id' element={<StudentProfile />} /> */}
            <Route path='/profile/student/:id' element={<StudentProfileDetailsPage />} />
            {/* <Route path='/student/:id' element={<StudentProfileDetailsPage />} /> */}
            {/* <----------------- Attendance Related Routes Starts Here ------------------> */}
            <Route path='/add-trainer/:id' element={<TrainersList />} />
            <Route path='/add-teacher/:id' element={<TeachersList />} />
            <Route path='/add-lab/:id' element={<LabsList />} />
            <Route path='/add-batch/:id' element={<BatchManagement />} />
            <Route path='/add-timing/:id' element={<TimingList />} />
            <Route path='/attendance/student/:id' element={<AttendanceOfSingleStudent />} />
            {/* <------------------- Monthly Reports Routes Starts Here -------------------> */}  
            <Route
              path='/monthly-reports/:id'
              element={
                <>
                  <MonthlyReportsDashBoard />
                </>
              }
            />
            <Route
              path='/student-reports/:id'
              element={
                <>
                  <StudentCourseDataDownload />
                </>
              }
            />
            <Route
              path='/monthlyCollectionFees/:id'
              element={
                <>
                  <MonthlyCollectionFee />
                </>
              }
            />
            {/* *************************************** Monthly Collection fees End here.. ******************************************* */}
            {/* ******************************......... Manage Company start here.....***************************** */}
            <Route
              path='/company'
              element={
                <>
                  <Company />
                </>
              }
            />
            <Route
              path='/add-company'
              element={
                <>
                  <AddCompany />
                </>
              }
            />
            <Route
              path='/update-company'
              element={
                <>
                  <UpdateCompany />
                </>
              }
            />
            {/* ******************************................ Manage Company End here..............******************************************* */}
            {/* ------------------------------- Email Template Start ----------------------------------- */}
            <Route
              path='/general-settings'
              element={
                <>
                  <div className='d-flex flex-column gap-10'>
                    <SendEmailSuggestion />
                    <WhatsappMessageSuggestion />
                    <GstSuggesstion />
                    <AddPaymentOption />
                    {/* <EmailTemplate /> */}
                    {/* <DynamicEmailTemplate /> */}
                  </div>
                </>
              }
            />
            <Route
              path='/email-settings'
              element={
                <>
                  <div className='d-flex flex-column gap-10'>
                    <EmailTemplate />
                    <DynamicEmailTemplate />
                  </div>
                </>
              }
            />
            <Route
              path='/course-subjects-addMarks'
              element={
                <>
                  <CourseStudentSubjectMarks />
                </>
              }
            />
            {/* Pages */}
            <Route path='dashboard' element={<DashboardWrapper />} />
            <Route path='builder' element={<BuilderPageWrapper />} />
            <Route path='menu-test' element={<MenuTestPage />} />
            {/* Lazy Modules */}
            <Route
              path='crafted/pages/profile/*'
              element={
                <>
                  <ProfilePage />
                </>
              }
            />
            <Route
              path='crafted/pages/wizards/*'
              element={
                <>
                  <WizardsPage />
                </>
              }
            />
            <Route
              path='crafted/widgets/*'
              element={
                <>
                  <WidgetsPage />
                </>
              }
            />
            <Route
              path='crafted/account/*'
              element={
                <>
                  <AccountPage />
                </>
              }
            />
            <Route
              path='apps/chat/*'
              element={
                <>
                  <ChatPage />
                </>
              }
            />
            <Route
              path='apps/user-management/*'
              element={
                <>
                  <UsersPage />
                </>
              }
            />
            <Route
              path='apps/user-role/*'
              element={
                <>
                  <UserRoleAccessManagement />
                </>
              }
            />
            {/* <Route path='*' element={<Navigate to='/error/404' />} /> */}
          </>
        ) : (
          <>
            {/* <Route path='student/:id' element={<StudentProfileView />} /> */}
            <Route
              path='/student/:id'
              element={
                <>
                  <StudentProfileView />
                </>
              }
            />

            {/* Page Not Found */}
            <Route
              path='*'
              element={
                <Navigate to={`/student/${currentUser?.studentId}`} state={currentStudent?.data} />
              }
            />
          </>
        )}
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
