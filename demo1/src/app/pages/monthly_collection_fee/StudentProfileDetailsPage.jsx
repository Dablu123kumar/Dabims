import {useNavigate, useParams} from 'react-router-dom'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {useAuth} from '../../modules/auth'
import {useCompanyContext} from '../compay/CompanyContext'
import AlertPendingFeesNewStudents from '../Alert_Pending_NewStudents/AlertPendingNewStudents'
import StudentCommissionLists from '../student-commission/StudentCommissionLists'
import {KTIcon} from '../../../_metronic/helpers'
import {useCourseContext} from '../course/CourseContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import StudentCourseFee from '../student-profile/StudentCourseFee'
import StudentIssue from '../student-issues/StudentIssue'
import RenewStudentCourseFees from '../renewStudent-courseFees/RenewStudentCourseFees'
import {useEffect, useMemo} from 'react'
import StudentEmailsTable from '../student-issues/StudentEmailsTable'
import StudentChangesNarration from '../student-issues/StudentChangesNarration'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const StudentProfileDetailsPage = () => {
  const params = useParams()
  const companyCTX = useCompanyContext()
  const studentCTX = useAdmissionContext()
  const navigate = useNavigate()
  // console.log(params)
  const {currentUser} = useAuth()
  // console.log(params)
  const {data: studentInfoData} = studentCTX.useGetSingleStudentUsingById(params.id)
  //console.log(studentCTX.useGetSingleStudentUsingById())
  const {data: singleComapnyData} = companyCTX?.useGetSingleCompanyData(
    studentInfoData?.companyName?._id
  )

  console.log('studentInfoData', studentInfoData)
  let cutWithGSTAmount =
    singleComapnyData?.isGstBased === 'Yes'
      ? (Number(studentInfoData?.totalPaid) /
          (companyCTX.getStudentGSTSuggestionStatus.data[0]?.gst_percentage + 100)) *
        100
      : Number(studentInfoData?.totalPaid)
  const courseCtx = useCourseContext()

  const navigateCourseSubjectsHandler = () => {
    //console.log('data of subjects based on course', data)
    // console.log('navigating to the course subject page !!!', updateUserId)
    navigate('/course-subjects-addMarks', {state: studentInfoData})
  }
  const navigateAttendanceHandler = () => {
    //console.log('data of subjects based on course', data)
    // console.log('navigating to the course subject page !!!', updateUserId)
    navigate(`/attendance/student/${studentInfoData?._id}`)
  }

  const installmentHandler = () => {
    let value = studentInfoData?.remainingCourseFees % studentInfoData?.no_of_installments
    return value.toFixed(2)
  }
  //console.log('singlecompanydata',singleComapnyData)

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_details'
          aria-expanded='true'
          aria-controls='kt_account_profile_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>
              {/* {updateUserId ? 'Edit Student Information' : 'Student Information'} */}
              {` ${singleComapnyData?.companyName} => Student Profile`}
            </h3>
          </div>
        </div>
        <div className='card mb-5 mb-xl-10'>
          <div className='card-body pt-9 pb-0'>
            <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
              <div className='me-7 mb-4'>
                <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
                  <img src={BASE_URL_Image + `/${studentInfoData?.image}`} alt='Metronic' />
                  <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
                </div>
              </div>

              <div className='flex-grow-1'>
                <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center mb-2'>
                      <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                        {studentInfoData?.name}
                      </a>
                      <a href='#'>
                        <KTIcon iconName='verify' className='fs-1 text-primary' />
                      </a>
                      {/* <a
                        href='#'
                        className='btn btn-sm btn-light-success fw-bolder ms-2 fs-8 py-1 px-3'
                        data-bs-toggle='modal'
                        data-bs-target='#kt_modal_upgrade_plan'
                      >
                        Upgrade to Pro
                      </a> */}

                      <button
                        id='#student-notes'
                        className='btn btn-light-youtube '
                        onClick={() => {
                          const studentNotesSection =
                            document.getElementById('student-notes-section')
                          if (studentNotesSection) {
                            studentNotesSection.scrollIntoView({behavior: 'smooth'})
                          }
                        }}
                      >
                        Student Flag <i className='fa-regular fa-flag'></i>
                      </button>
                    </div>

                    <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                      >
                        <KTIcon iconName='profile-circle' className='fs-4 me-1' />
                        +91 {studentInfoData?.mobile_number}
                      </a>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                      >
                        {/* <KTIcon iconName='geolocation' className='fs-4 me-1' /> */}
                        {studentInfoData?.select_course}
                      </a>
                      <a className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'>
                        <KTIcon iconName='sms' className='fs-4 me-1' />
                        {studentInfoData?.email}
                      </a>
                    </div>
                  
                  </div>

                  <div className='d-flex my-4'>
                    {/* <a href='#' className='btn btn-sm btn-light me-2' id='kt_user_follow_button'>
                      <KTIcon iconName='check' className='fs-3 d-none' />

                      <span className='indicator-label'>Follow</span>
                      <span className='indicator-progress'>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    </a>
                    <a
                      href='#'
                      className='btn btn-sm btn-primary me-3'
                      data-bs-toggle='modal'
                      data-bs-target='#kt_modal_offer_a_deal'
                    >
                      Hire Me
                    </a> */}
                    {currentUser?.role !== 'Student' && (
                      <div className='me-0 d-flex'>
                        <button
                          onClick={navigateCourseSubjectsHandler}
                          className='btn  btn-bg-light btn-active-color-primary'
                          data-kt-menu-trigger='click'
                          data-kt-menu-placement='bottom-end'
                          data-kt-menu-flip='top-end'
                        >
                          Course Subjects
                        </button>
                        <button
                          onClick={navigateAttendanceHandler}
                          className='btn  btn-bg-light btn-active-color-primary ms-3'
                          data-kt-menu-trigger='click'
                          data-kt-menu-placement='bottom-end'
                          data-kt-menu-flip='top-end'
                        >
                          Attendance
                        </button>
                        {/* <Dropdown1 /> */}
                      </div>
                    )}
                  </div>
                </div>

                <div className='d-flex flex-wrap flex-stack'>
                  <div className='d-flex flex-column flex-grow-1 pe-8'>
                    <div className='d-flex flex-wrap'>
                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <KTIcon iconName='arrow-up' className='fs-3 text-success me-2' />
                          <div className='fs-2 fw-bolder'>Rs.{studentInfoData?.netCourseFees}</div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-400'>Total Fee</div>
                      </div>

                      {singleComapnyData?.isGstBased === 'Yes' ? (
                        <>
                          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                              <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                              <div className='fs-2 fw-bolder'>
                                Rs.
                                {cutWithGSTAmount?.toFixed(2)}
                              </div>
                            </div>

                            <div className='fw-bold fs-6 text-gray-400'>Gross Paid</div>
                          </div>
                          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                              <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                              <div className='fs-2 fw-bolder'>
                                Rs.
                                {(Number(studentInfoData?.totalPaid) - cutWithGSTAmount).toFixed(2)}
                              </div>
                            </div>

                            <div className='fw-bold fs-6 text-gray-400'>GST Paid</div>
                          </div>
                          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                              <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                              <div className='fs-2 fw-bolder'>
                                Rs.
                                {(
                                  cutWithGSTAmount +
                                  (Number(studentInfoData?.totalPaid) - cutWithGSTAmount)
                                ).toFixed(2)}
                              </div>
                            </div>

                            <div className='fw-bold fs-6 text-gray-400'>Net Paid</div>
                          </div>
                        </>
                      ) : (
                        <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                          <div className='d-flex align-items-center'>
                            <KTIcon iconName='arrow-down' className='fs-3 text-danger me-2' />
                            <div className='fs-2 fw-bolder'>
                              Rs.
                              {Number(studentInfoData?.totalPaid).toFixed(2)}
                            </div>
                          </div>

                          <div className='fw-bold fs-6 text-gray-400'>Total Paid</div>
                        </div>
                      )}

                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <KTIcon iconName='arrow-up' className='fs-3 text-success me-2' />
                          <div className='fs-2 fw-bolder'>
                            Rs.
                            {isNaN(Number(studentInfoData?.remainingCourseFees))
                              ? 0.0
                              : Number(studentInfoData?.remainingCourseFees).toFixed(2)}
                          </div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-400'>Remaining Fee</div>
                      </div>
                    </div>
                  </div>

                  {/* <div className='d-flex align-items-center w-200px w-sm-300px flex-column mt-3'>
                    <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                      <span className='fw-bold fs-6 text-gray-400'>Profile Compleation</span>
                      <span className='fw-bolder fs-6'>50%</span>
                    </div>
                    <div className='h-5px mx-3 w-100 bg-light mb-3'>
                      <div
                        className='bg-success rounded h-5px'
                        role='progressbar'
                        style={{width: '50%'}}
                      ></div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form noValidate className='form'>
            <div className='card-body border-top p-9'>
              {/* ============================= Start Name here ======================== */}
              {/*========================== profile =================================== */}
              <div className='row mt-5 '>
                {/* <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Image</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        disabled
                        type='file'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Image'
                        //onChange={(e) => setProfile(e)}
                        readOnly
                      />
                    </div>
                  </div>
                </div> */}

                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Roll Number </label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        readOnly
                        type='number'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Enter Roll Number..'
                        value={studentInfoData?.rollNumber}
                        // {...formik.getFieldProps('rollNumber')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                {/* ================================------Name----================================== */}
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Name</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        readOnly
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Name'
                        // {...formik.getFieldProps('name')}
                        value={studentInfoData?.name}
                      />
                    </div>
                  </div>
                </div>
                {/* ================================------Name----================================== */}
                {/* ================================------Father Name----================================== */}
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Father Name</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Father Name'
                        // {...formik.getFieldProps('father_name')}
                        value={studentInfoData?.father_name}
                      />
                    </div>
                  </div>
                </div>
                {/* ================================------Father Name----================================== */}
              </div>

              {/* ========================  Contact Number ============================= */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Mobile Number</label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Mobile Number'
                        // {...formik.getFieldProps('mobile_number')}
                        value={studentInfoData?.mobile_number}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Parent Number</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='tel'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Phone number'
                        // {...formik.getFieldProps('phone_number')}
                        value={studentInfoData?.phone_number}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================  Contact Number ============================= */}

              {/* =================================Address Information==================================== */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Present Address</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Present Address'
                        // {...formik.getFieldProps('present_address')}
                        value={studentInfoData?.present_address}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================Address Information==================================== */}

              {/* ============================== Email and City ==================================== */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>City</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        readOnly
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='City'
                        // {...formik.getFieldProps('city')}
                        value={studentInfoData?.city}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Email</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='email'
                        readOnly
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Email'
                        // {...formik.getFieldProps('email')}
                        value={studentInfoData?.email}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* ============================== Email and City ==================================== */}
              {/* ============================== DOB and Student Status ==================================== */}
              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>DOB</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <DatePicker
                        readOnly
                        selected={studentInfoData?.date_of_birth}
                        //onChange={(date) => formik.setFieldValue('date_of_birth', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* ============================== DOB and Student Status ==================================== */}

              {/* -----------------QUALIFICATION START HERE ------------------ */}
              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>Qualification</h3>
                  </div>
                </div>
                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                      Education Qualification
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        //  {...formik.getFieldProps('education_qualification')}
                        value={studentInfoData?.education_qualification}
                      >
                        <option value=''>-select-</option>
                        <option value='10th'>10th</option>
                        <option value='10+2'>10+2</option>
                        <option value='graduate'>Graduate</option>
                        <option value='diploma'>Diploma</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Company Name</label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        //{...formik.getFieldProps('companyName')}
                        value={studentInfoData?.companyName}
                      >
                        <option value=''>-select-</option>
                        {companyCTX.getCompanyLists?.data?.map((companyData) => (
                          <option key={companyData?._id} value={companyData?._id}>
                            {companyData?.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* ---------------------------QUALIFICATION END HERE ----------------------- */}

              {/* ---------------------------COURSE START HERE ----------------------- */}
              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>Course</h3>
                  </div>
                </div>

                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>Select Course</label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        disabled
                        className='form-select form-select-solid form-select-lg'
                        //{...formik.getFieldProps('select_course')}
                        value={studentInfoData?.select_course}
                      >
                        <option value=''>-select-</option>
                        {courseCtx.getCourseLists?.data?.map((c) => (
                          <option key={c._id} value={c.courseName}>
                            {c.courseName}-({c?.category?.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Course Remainder Duration</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <DatePicker
                        readOnly
                        selected={studentInfoData?.courseduration}
                        //onChange={(date) => formik.setFieldValue('courseRemainderDuration', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------COURSE END HERE ----------------------- */}
              {/* ---------------------------Commision Start HERE ----------------------- */}

              {/* ---------------------------Commision End HERE ----------------------- */}

              <div className='row'>
                <div
                  className='card-header border-1 cursor-pointer'
                  role='button'
                  // data-bs-toggle='collapse'
                  // data-bs-target='#kt_account_profile_details'
                  aria-expanded='true'
                  aria-controls='kt_account_profile_details'
                >
                  <div className='card-title m-0'>
                    <h3 className='fw-bolder m-0'>For Office Use Only</h3>
                  </div>
                </div>
              </div>

              <>
                <div className='row mt-5'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>Course Fees</span>
                        {/* <p>(including 14% service Tax)</p> */}
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Course Fees'
                          //  {...formik.getFieldProps('course_fees')}
                          value={studentInfoData?.course_fees}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>Course Fees Discount</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          min={0}
                          max={20}
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Course Fees Discount'
                          readOnly
                          value={studentInfoData?.discount}
                          // {...formik.getFieldProps('discount')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>Net Course Fees</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Net Course Fees'
                          // {...formik.getFieldProps('netCourseFees')}
                          value={studentInfoData?.netCourseFees}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>D.O.J</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <DatePicker
                          readOnly
                          selected={studentInfoData?.date_of_joining}
                          //onChange={(date) => formik.setFieldValue('date_of_joining', date)}
                          dateFormat='dd/MM/yyyy'
                          className='form-control form-control-lg form-control-solid'
                          placeholderText='DD/MM/YYYY'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className=''>Remaining Fee</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          readOnly
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Remaining Fees'
                          //{...formik.getFieldProps('remainingCourseFees')}
                          value={studentInfoData?.remainingCourseFees}
                        />
                        {/* {formik.touched?.remainingCourseFees && formik.errors?.remainingCourseFees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              {formik.errors?.remainingCourseFees}
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                        No. of Installments
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <select
                          disabled
                          className='form-select form-select-solid form-select-lg'
                          value={studentInfoData?.no_of_installments}
                          // onChange={(e) => {
                          //   formik.getFieldProps('no_of_installments').onChange(e)
                          //   //numberOfInstallmentAmountHandler(e)
                          // }}
                        >
                          <option value=''>-select-</option>
                          {Array.from({length: 60}, (_, index) => (
                            <option key={index} value={index}>
                              {index}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </>

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                      No. of Installments Amount
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control w-50 '
                        readOnly
                        value={
                          studentInfoData?.remainingCourseFees === undefined
                            ? (
                                studentInfoData?.netCourseFees / studentInfoData?.no_of_installments
                              ).toFixed(2)
                            : (
                                studentInfoData?.remainingCourseFees /
                                studentInfoData?.no_of_installments
                              ).toFixed(2)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Installment Due Date</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <DatePicker
                        readOnly
                        selected={studentInfoData?.installment_duration}
                        //onChange={(date) => formik.setFieldValue('date_of_joining', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------FOR OFFICE USE ONLY END HERE ----------------------- */}
            </div>
          </form>
        </div>
      </div>

      {currentUser?.role !== 'Student' && (
        <div className='card-toolbar mb-3'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn  btn-color-white btn-active-dark-danger bg-danger '
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-start'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='plus' className='fs-2' /> Renew Fees
          </button>
          <RenewStudentCourseFees studentInfoData={studentInfoData} />
          {/* end::Menu */}
        </div>
      )}

      <StudentCourseFee className={''} studentInfoData={studentInfoData} />
      {currentUser?.role !== 'Student' && (
        <div className='d-flex flex-column gap-10 mt-4'>
          <AlertPendingFeesNewStudents studentInfoData={studentInfoData} />
          <StudentCommissionLists studentInfoData={studentInfoData} />
          <StudentIssue studentInfoData={studentInfoData} />
          <StudentChangesNarration studentInfoData={studentInfoData}/>
          <StudentEmailsTable studentInfoData={studentInfoData} />
        </div>
      )}
    </>
  )
}
export default StudentProfileDetailsPage
