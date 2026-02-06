/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
} from '../../../_metronic/partials/widgets'
import ListAlertPendingStudent from '../Alert_Pending_NewStudents/ListAlertPendingStudent'
import DialogAlertPendingStudent from '../Alert_Pending_NewStudents/DialogAlertPendingStudent'
import {useAuth} from '../../modules/auth'
import ShowStudentNotesNameDashboard from '../student-issues/ShowStudentNotesNameDashboard'
import CompleteCourseStudents from '../complete_course_students/CompleteCourseStudents'
import CollectionDashBoardBox from './CollectionDashBoardBox'
import AllStudentsAccordingToCourses from './AllStudentsAccordingToCourses'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import moment from 'moment'
import TodayTasks from './TodayTasks'
import PastTask from './PastTask'
import UpcomingTask from './UpcomingTask'
import TodayTasksNotification from './TodayTasksNotification'
import {useCustomFormFieldContext} from '../enquiry-related/dynamicForms/CustomFormFieldDataContext'
import SelectCompany from './SelectCompany'
import { useCompanyContext } from '../compay/CompanyContext'
import CompanyCollectionDashBoardBox from './CompanyCollectionDashboardBox'

const DashboardPage: FC = () => (
  <>
    {/* begin::Row */}
    <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
      {/* begin::Col */}
      {/* <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
        <CardsWidget20
          className='h-md-50 mb-5 mb-xl-10'
          description='Active Projects'
          color='#F1416C'
          img={toAbsoluteUrl('/media/patterns/vector-1.png')}
        />
        <CardsWidget7
          className='h-md-50 mb-5 mb-xl-10'
          description='Professionals'
          icon={false}
          stats={357}
          labelColor='dark'
          textColor='gray-300'
        />
      </div> */}
      {/* end::Col */}

      {/* begin::Col */}
      <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-4 mb-md-5 mb-xl-10'>
        <CollectionDashBoardBox className='h-md-50 mb-5 mb-xl-10' />
        <CompanyCollectionDashBoardBox className='mt-6' />
        {/* <ListsWidget26 className='h-lg-50' /> */}
        <div className='card card-header pt-5 h-lg-50'>
          <h3 className='card-title text-gray-800 fw-bold'>Flagged Students</h3>
          <div className='card-toolbar'></div>
          <ShowStudentNotesNameDashboard className={''} />
        </div>
      </div>
      {/* end::Col */}

      {/* begin::Col */}
      <div className='col-xxl-8'>
        <AllStudentsAccordingToCourses className='h-md-100' />
      </div>
      {/* end::Col */}
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row gx-5 gx-xl-10'>
      {/* begin::Col */}
      <div className='col-xxl-6 mb-5 mb-xl-10'>
        {/* <app-new-charts-widget8 cssclassName="h-xl-100" chartHeight="275px" [chartHeightNumber]="275"></app-new-charts-widget8> */}
      </div>
      {/* end::Col */}

      {/* begin::Col */}
      <div className='col-xxl-6 mb-5 mb-xl-10'>
        {/* <app-cards-widget18 cssclassName="h-xl-100" image="./assets/media/stock/600x600/img-65.jpg"></app-cards-widget18> */}
      </div>
      {/* end::Col */}
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row gy-5 gx-xl-8 mb-xl-10'>
      <div className='col-xxl-4'>
        {/* <ListsWidget3 className='card-xxl-stretch mb-xl-3' /> */}
        {/* --------------------------- Start here  Alert Pending Student Show here ------------------- */}
        <ListAlertPendingStudent />
        {/* --------------------------- End here  Alert Pending Student Show here ------------------- */}
      </div>
      <div className='col-xl-8'>
        {/* <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' /> */}
        <div className={`card card-xxl-stretch mb-5 mb-xl-8`}>
          <CompleteCourseStudents />
        </div>
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row gy-5 g-xl-8 mb-xl-10'>
      <div className='col-xl-4'>
        {/* <ListsWidget2 className='card-xl-stretch mb-xl-8' /> */}
        <PastTask className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        {/* <ListsWidget6 className='card-xl-stretch mb-xl-8' /> */}
        <TodayTasks className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        {/* <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} /> */}
        <UpcomingTask className='card-xl-stretch mb-xl-8' />

        {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
      </div>
    </div>
    {/* end::Row */}

    {/* <div className='row g-5 gx-xxl-8'>
      <div className='col-xxl-4'>
        <MixedWidget8
          className='card-xxl-stretch mb-xl-3'
          chartColor='success'
          chartHeight='150px'
        />
      </div>
      <div className='col-xxl-8'>
        <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
      </div>
    </div> */}
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  const {currentUser} = useAuth()
  const [showDialog, setShowDialog] = useState(false)
  const [showTask, setShowTask] = useState(false)
  const studentCTX = useAdmissionContext()
  const studentNotesCTX = useCustomFormFieldContext()
  const {selectedCompany} = useCompanyContext()

  useEffect(() => {
    const playAudio = async () => {
      try {
        const audio = new Audio('/audio.wav') // Ensure the correct path
        await audio.play()
      } catch (error) {
        console.log('Error playing audio:', error)
      }
    }

    const filteredStudentsAlertData =
      studentCTX.getAllStudentsAlertStudentPendingFeesQuery?.data?.filter(
        (s) =>
          s.Status === 'pending' && moment(s?.RemainderDateAndTime).diff(moment(), 'days') === 0
      )

    if (filteredStudentsAlertData?.length > 0) {
      setShowDialog(true)
      // Attempt to play the audio
      playAudio()

      // Fallback: Retry on user interaction if the audio didn't play
      // document.addEventListener('click', playAudio, {once: true})
    } else {
      // No pending students: Ensure no dialog or audio is triggered
      setShowDialog(false)
    }
  }, [studentCTX])

  useEffect(() => {
    const playAudio = async () => {
      try {
        const audio = new Audio('/audio.wav') // Ensure the correct path
        await audio.play()
      } catch (error) {
        console.log('Error playing audio:', error)
      }
    }

    const studentData = studentNotesCTX?.getStudentNotesListsQuery?.data?.allStudentNotes

    // Filter tasks for today
    const today = moment().startOf('day')
    const todaysTasks = studentData?.filter((task) => moment(task.startTime).isSame(today, 'day'))

    if (todaysTasks?.length > 0) {
      setShowTask(true)
      // Play audio only when there are tasks for today
      playAudio()
    } else {
      setShowTask(false)
    }
  }, [studentNotesCTX])

  // useEffect(() => {
  //   if (showDialog) {
  //     const timer = setTimeout(() => {
  //       setShowDialog(false)
  //     }, 5000)

  //     return () => clearTimeout(timer)
  //   }
  // }, [showDialog])

  return (
    <div style={{position: 'relative'}}>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>

            <div className='d-flex justify-content-end mb-5'>
        <SelectCompany />
      </div>

      {!selectedCompany ? (
        <div className='alert alert-warning'>
          Please select a company to view dashboard data
        </div>
      ) : (
        <DashboardPage />
      )}
      
      {currentUser?.role !== 'Student' && (
        <>
          {' '}
          <div
            style={{
              position: 'fixed',
              top: '40%',
              right: '0px',
              zIndex: '1',
            }}
          >
            {showDialog && <DialogAlertPendingStudent setShowDialog={setShowDialog} />}
            {/* <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
            style={{position: 'fixed', top: '60%', right: '0', zIndex: '1'}}
            onClick={() => setShowDialog((prev) => !prev)}
          >
            <img src='/whatsapp.png' alt='' className='img-thumbnail' />
          </button> */}
          </div>
          <div
            style={{
              position: 'fixed',
              top: '65%',
              right: '0px',
              zIndex: '1',
            }}
          >
            {showTask && <TodayTasksNotification setShowTask={setShowTask} />}
          </div>
        </>
      )}
    </div>
  )
}

export {DashboardWrapper}
