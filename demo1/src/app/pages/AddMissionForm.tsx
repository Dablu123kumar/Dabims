import React, {useEffect, useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-calendar/dist/Calendar.css'

import * as Yup from 'yup'
import {useFormik} from 'formik'
import {
  AddMissionFormInterface,
  addMissionFormInitialValues as initialValues,
} from '../modules/accounts/components/settings/SettingsModel'
import {useAdmissionContext} from '../modules/auth/core/Addmission'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import {toAbsoluteUrl} from '../../_metronic/helpers'
import {useCourseContext} from './course/CourseContext'
import {useCompanyContext} from './compay/CompanyContext'
import {toast} from 'react-toastify'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const addmissionFormSchema = Yup.object().shape({
  rollNumber: Yup.number(),
  // image: Yup.object(),
  _id: Yup.string(),
  companyName: Yup.string(),
  name: Yup.string().required('Name is required!'),
  father_name: Yup.string().required('Father Name is required!'),
  mobile_number: Yup.string().required('Mobile Number is required!'),
  phone_number: Yup.string().required('Father Phone Number is required!'),
  present_address: Yup.string().required('Present Address is required!'),
  //permanent_address: Yup.string().required('Permanent Address is required!'),
  date_of_birth: Yup.string().required('Date of birth is required!'),
  city: Yup.string().required('city is required!'),
  email: Yup.string().required('email is required!'),
  // student_status: Yup.string().required('Student status is required!'),
  education_qualification: Yup.string().required('Education qualification is required!'),
  //professional_qualification: Yup.string().required('Professional Qualification is required!'),
  select_course: Yup.string().required('select course is required!'),
  //document_attached: Yup.string().required('document attached is required!'),
  //select_software: Yup.string().required('select software  is required!'),
  // name_of_person_for_commision: Yup.string(),
  // commision_paid: Yup.string(),
  // commision_date: Yup.string(),
  // commision_voucher_number: Yup.string(),
  course_fees: Yup.string().required('Course fees is required!'),
  //down_payment: Yup.string().required('Down Payment is required!'),
  discount: Yup.string().required('Discount is required!'),
  netCourseFees: Yup.string().required('Net CourseFees is required!'),
  //remainingCourseFees: Yup.string().required('Remaining CourseFees is required!'),

  date_of_joining: Yup.string().required('Date of joining is required!'),
  installment_duration: Yup.string().required('Installment Duration is required!'),
  no_of_installments: Yup.string().required('Number of installments  is required!'),
  no_of_installments_amount: Yup.string(),
  courseRemainderDuration: Yup.string(),
})

const AddMissionForm: React.FC = () => {
  const [preview, setPreview] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const location = useLocation()

  const [selectedCourseNameData, setSelectedCourseNameData] = useState<any>({})
  const [updateUserId, setUpdateUserId] = useState<any>(location.state)
  // console.log(updateUserId)

  const courseCtx = useCourseContext()
  const companyCTX = useCompanyContext()

  const params = useParams()
  //console.log(params)
  const {data} = companyCTX?.useGetSingleCompanyData(
    updateUserId === null ? params?.id : updateUserId?.companyName
  )
  // console.log(data)
  //console.log(companyCTX.getCompanyLists.data)
  // console.log(selectedCourseNameData)

  // const setProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     //console.log(e.target.files[0])
  //     setImage(e.target.files[0])
  //   }
  // }

  useEffect(() => {
    if (updateUserId) {
      formik.setFieldValue('netCourseFees', formik?.values?.remainingCourseFees)
    }
    formik.setFieldValue('companyName', params.id)
  }, [])

  const studentStatusHandler = (e) => {
    if (e.target.value === 'NOGST') {
      formik.setFieldValue('netCourseFees', formik.values.course_fees)
      formik.setFieldValue('discount', 0)
    }
  }

  const handleSelectChange = (event) => {
    const selectedCourse = event.target.value
    const selectedCourseData = courseCtx.getCourseLists.data.find(
      (c) => c.courseName === selectedCourse
    )
    //console.log('selected course data ', selectedCourseData)
    setSelectedCourseNameData(selectedCourseData)
    //console.log('course Id', selectedCourseData?._id)
    formik.setFieldValue('select_course', selectedCourse)

    formik.setFieldValue('course_fees', selectedCourseData?.courseFees)
  }

  const handleCourseFeesDiscount = (e) => {
    formik.setFieldValue('netCourseFees', 0)
    const amount = updateUserId
      ? Number(formik.values.course_fees)
      : selectedCourseNameData?.courseFees
    const discount = Number(e.target.value)
    //console.log(amount)
    const discountAmount = Number(amount) - discount
    //console.log(discountAmount)
    formik.setFieldValue('netCourseFees', discountAmount)
  }

  const downPaymentHandler = (e) => {
    //console.log(formik.values.down_payment)
    const downPayment = Number(e.target.value)
    const remainingAmount = Number(formik.values.netCourseFees) - downPayment
    formik.setFieldValue('remainingCourseFees', remainingAmount)
  }

  const setProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Only PNG, JPG, and JPEG images are allowed')
        setImage(null)
        setPreview('')
      } else {
        setImage(selectedFile)
        // Optionally, setPreview(selectedFile); if you want to show a preview
      }
    }

    // if (e.target.files && e.target.files.length > 0) {
    //   setImage(e.target.files[0])
    // }
  }

  //console.log(updateUserId)

  // let updateStudentId = updateUserId?._id

  let updateStudentInitialValues: AddMissionFormInterface = updateUserId
    ? updateUserId
    : initialValues
  //console.log(updateStudentInitialValues)
  useEffect(() => {
    if (image) {
      // setPreview(URL.createObjectURL(image))
      setPreview(URL.createObjectURL(image))
    }
  }, [image])

  const numberOfInstallmentAmountHandler = (e) => {
    const numberOfInstallmentAmount: number =
      Number(formik.values.netCourseFees) / Number(e.target.value)
    formik.setFieldValue('no_of_installments_amount', numberOfInstallmentAmount.toFixed(2))
    formik.setFieldValue('no_of_installments', e.target.value)
  }

  const navigate = useNavigate()
  const context = useAdmissionContext()

  const formik = useFormik<AddMissionFormInterface>({
    initialValues: updateStudentInitialValues,
    validationSchema: addmissionFormSchema,
    onSubmit: async (values) => {
      let formData = new FormData()

      if (values.companyName === '') {
        toast.error('Please provide company name')
        return
      }

      // Append each field of values to formData
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string) // Ensure value is a string, adjust if needed
      })

      if (image === null) {
        toast.error('Please select a profile picture', {
          autoClose: 5000,
          className: 'toast-custom',
          style: {
            fontSize: '18px',
          },
        })
        return
      }

      // Append the image to formData
      if (image) {
        formData.append('image', image)
      }

      formData.append('courseName', selectedCourseNameData?._id)
      context.createStudentMutation.mutate(formData)
      setLoading(true)

      navigate(`/students/${values?.companyName}`)
    },
  })

  //console.log(courseCtx.getCourseLists.data)

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
              {updateUserId
                ? `${data?.companyName} -> Edit Student Information`
                : `${data?.companyName} ->  Student Information`}
            </h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              {/* ============================= Start Name here ======================== */}
              {/*========================== profile =================================== */}
              <div className='d-flex justify-content-center'>
                <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
                  {updateUserId ? (
                    <img
                      src={preview ? preview : BASE_URL_Image + `/${updateUserId?.image}`}
                      alt='Metornic'
                    />
                  ) : (
                    <img
                      src={preview ? preview : toAbsoluteUrl('/media/avatars/300-1.jpg')}
                      alt='Metornic'
                    />
                  )}
                  <div className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
                </div>
              </div>
              <div className='row mt-5 '>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>Image</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='file'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Image'
                        onChange={(e) => setProfile(e)}
                      />
                    </div>
                  </div>
                </div>

                {updateUserId && (
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                        Roll Number{' '}
                      </label>
                      <div className='col-lg-6 fv-row'>
                        <input
                          type='number'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          placeholder='Enter Roll Number..'
                          {...formik.getFieldProps('rollNumber')}
                          readOnly
                        />
                        {formik.touched.rollNumber && formik.errors.rollNumber && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors?.rollNumber}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='row'>
                {/* ================================------Name----================================== */}
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>Name</label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='Name'
                        {...formik.getFieldProps('name')}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors?.name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ================================------Name----================================== */}
                {/* ================================------Father Name----================================== */}
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Father Name
                    </label>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Father Name'
                        {...formik.getFieldProps('father_name')}
                      />
                      {formik.touched.father_name && formik.errors.father_name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.father_name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ================================------Father Name----================================== */}
              </div>

              {/* ========================  Contact Number ============================= */}

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Mobile Number
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Mobile Number'
                        {...formik.getFieldProps('mobile_number')}
                      />
                      {formik.touched.mobile_number && formik.errors.mobile_number && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.mobile_number}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Parent Number</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='tel'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Phone number'
                        {...formik.getFieldProps('phone_number')}
                      />
                      {formik.touched.phone_number && formik.errors.phone_number && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.phone_number}</div>
                        </div>
                      )}
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
                      <span className='required'>Present Address</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Present Address'
                        {...formik.getFieldProps('present_address')}
                      />
                      {formik.touched.present_address && formik.errors.present_address && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.present_address}</div>
                        </div>
                      )}
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
                      <span className='required'>City</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='City'
                        {...formik.getFieldProps('city')}
                      />
                      {formik.touched.city && formik.errors.city && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.city}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Email</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='email'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Email'
                        {...formik.getFieldProps('email')}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.email}</div>
                        </div>
                      )}
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
                      <span className='required'>DOB</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <DatePicker
                        selected={formik.values.date_of_birth}
                        onChange={(date) => formik.setFieldValue('date_of_birth', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />

                      {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                        <div className='fv-plugins-message-container'>
                          {/* <div className='fv-help-block'>{formik.errors.date_of_birth}</div> */}
                        </div>
                      )}
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
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Education Qualification
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        className='form-select form-select-solid form-select-lg'
                        {...formik.getFieldProps('education_qualification')}
                      >
                        <option value=''>-select-</option>
                        {/* <option value='10th'>10th</option> */}
                        <option value='10th'>10th</option>
                        <option value='10+2'>10+2</option>
                        <option value='graduate'>Graduate</option>
                        <option value='diploma'>Diploma</option>
                      </select>
                      {formik.touched.education_qualification &&
                        formik.errors.education_qualification && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              {formik.errors.education_qualification}
                            </div>
                          </div>
                        )}
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
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Select Course
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        className='form-select form-select-solid form-select-lg'
                        onChange={(e) => {
                          formik.getFieldProps('select_course').onChange(e)
                          handleSelectChange(e)
                        }}
                        defaultValue={updateUserId && updateUserId.select_course}
                        name='select_course'
                        id='select_course'
                      >
                        <option value=''>-select-</option>
                        {courseCtx?.getCourseLists?.data?.map((c: any) => (
                          <option key={c?._id} value={c?.courseName}>
                            {c?.courseName}-<b>({c?.category?.category})</b>
                          </option>
                        ))}
                      </select>
                      {formik.touched.select_course && formik.errors.select_course && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.select_course}</div>
                        </div>
                      )}
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
                        selected={formik.values.courseRemainderDuration}
                        onChange={(date) => formik.setFieldValue('courseRemainderDuration', date)}
                        dateFormat='dd/MM/yyyy'
                        className='form-control form-control-lg form-control-solid'
                        placeholderText='DD/MM/YYYY'
                      />
                    </div>
                  </div>
                </div>

                {/* <div className='col-6 mt-5'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      Student Status
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        className='form-select form-select-solid form-select-lg'
                        onChange={(e) => {
                          formik.getFieldProps('student_status').onChange(e)
                          // studentStatusHandler(e)
                        }}
                        value={formik.values.student_status}
                        id='student_status'
                        name='student_status'
                      >
                        <option value=''>--select--</option>
                        <option value='GST'>GST</option>
                        <option value='NOGST'>NO GST</option>
                      </select>
                      {formik.touched.student_status && formik.errors.student_status && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.student_status}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}
              </div>

              {/* ---------------------------COURSE END HERE ----------------------- */}

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
                        <span className='required'>Course Fees</span>
                        {/* <p>(including 14% service Tax)</p> */}
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Course Fees'
                          {...formik.getFieldProps('course_fees')}
                          readOnly
                        />
                        {formik.touched.course_fees && formik.errors.course_fees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.course_fees}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='required'>Course Fees Discount</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          min={0}
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Course Fees'
                          name='discount' // Add name attribute
                          onChange={(e) => {
                            formik.getFieldProps('discount').onChange(e)
                            handleCourseFeesDiscount(e)
                          }}
                          value={formik.values.discount}
                        />

                        {formik.touched.discount && formik.errors.discount && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.discount}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='required'>Net Course Fees</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <input
                          type='number'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Net Course Fees'
                          {...formik.getFieldProps('netCourseFees')}
                          readOnly
                        />
                        {formik.touched.netCourseFees && formik.errors.netCourseFees && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.netCourseFees}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='col-6'>
                    <div className='row mb-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='required'>D.O.J</span>
                      </label>

                      <div className='col-lg-8 fv-row'>
                        <DatePicker
                          selected={formik.values.date_of_joining}
                          onChange={(date) => formik.setFieldValue('date_of_joining', date)}
                          dateFormat='dd/MM/yyyy'
                          className='form-control form-control-lg form-control-solid'
                          placeholderText='DD/MM/YYYY'
                        />
                        {/* <Calendar
                          onChange={(date) => formik.setFieldValue('date_of_joining', date)}
                          value={formik.values.date_of_joining}
                        /> */}
                        {formik.touched.date_of_joining && formik.errors.date_of_joining && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.date_of_joining}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>

              <div className='row'>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                      No. of Installments
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        className='form-select form-select-solid form-select-lg'
                        onChange={(e) => {
                          formik.getFieldProps('no_of_installments').onChange(e)
                          numberOfInstallmentAmountHandler(e)
                        }}
                        id='no_of_installments'
                        name='no_of_installments'
                      >
                        <option value=''>-select-</option>
                        {Array.from({length: 60}, (_, index) => (
                          <option key={index} value={index}>
                            {index}
                          </option>
                        ))}
                      </select>
                      {formik.touched.no_of_installments && formik.errors.no_of_installments && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.no_of_installments}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label  fw-bold fs-6'>
                      No. of Installments Amount
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='number'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Net Course Fees'
                        {...formik.getFieldProps('no_of_installments_amount')}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-6'>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span className='required'>Installment Due Date</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <DatePicker
                      selected={formik.values.installment_duration}
                      onChange={(date) => formik.setFieldValue('installment_duration', date)}
                      dateFormat='dd/MM/yyyy'
                      className='form-control form-control-lg form-control-solid'
                      placeholderText='DD/MM/YYYY'
                    />
                    {formik.touched.installment_duration && formik.errors.installment_duration && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.installment_duration}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* ---------------------------FOR OFFICE USE ONLY END HERE ----------------------- */}
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!context.createStudentMutation.isLoading &&
                  (updateUserId ? 'Save Changes' : 'Submit')}
                {context.createStudentMutation.loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddMissionForm
