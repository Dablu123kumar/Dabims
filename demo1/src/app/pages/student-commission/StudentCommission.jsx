import {useEffect, useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useCompanyContext} from '../compay/CompanyContext'
import {usePaymentOptionContextContext} from '../payment_option/PaymentOption.Context'

const CourseSchema = Yup.object().shape({
  studentName: Yup.string().required('Student Name is required'),
  commissionPersonName: Yup.string().required('Commission Person Name is required'),
  voucherNumber: Yup.string(),
  commissionAmount: Yup.string().required('Commission amount  is required'),
  commissionPaid: Yup.string().required('Commission Paid  is required'),
  commissionRemaining: Yup.string().required('Commission Remaining  is required'),
  commissionDate: Yup.string().required('Commission Date is required'),
  commissionNaretion: Yup.string().required('Commission naretion is required!'),
})

const StudentCommission = () => {
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const location = useLocation()
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  //console.log(location.state)
  //console.log(params)
  const studentCTX = useCompanyContext()
  const {data} = studentCTX.useGetStudentsAccordingToCompanyQuery(params.companyId)
  const companyData = studentCTX.useGetSingleCompanyData(params.companyId)
  //console.log(companyData?.data?.companyName)
  const dayBookAccountCtx = usePaymentOptionContextContext()
  // const result = dayBookAccountCtx.getDayBookAccountsLists?.data?.filter(
  //   (cp) => cp.companyId === params.companyId && cp.accountType === 'Commission'
  // )
  // console.log(selectedAccountId)

  const {data: studentCommission, isLoading} = studentCTX.useGetStudentCommissionDataQuery(
    location?.state?.name
  )

  const dayBookDataId = dayBookAccountCtx.getDayBookAccountsLists?.data?.find(
    (cp) =>
      cp.companyId === params.companyId &&
      cp.accountType === 'Commission' &&
      cp.accountName === studentCommission?.[0]?.commissionPersonName
  )

  // console.log(studentCommission)

  useEffect(() => {
    if (dayBookDataId) {
      setSelectedAccountId(dayBookDataId?._id)
    }
  }, [dayBookDataId])

  // console.log(studentCommission)

  const handleCommissionPersonChange = (e) => {
    const selectedName = e.target.value
    const selectedAccount = dayBookAccountCtx.getDayBookAccountsLists?.data?.find(
      (cp) =>
        cp.companyId === params.companyId &&
        cp.accountType === 'Commission' &&
        cp.accountName === selectedName
    )
    const accountId = selectedAccount?._id || null
    setSelectedAccountId(accountId)
    formik.setFieldValue('dayBookAccountId', accountId)
  }

  // console.log(selectedAccountId)

  const navigate = useNavigate()
  let initialValues = {
    studentName: location?.state?.name ? location?.state?.name : '',
    commissionPersonName:
      studentCommission?.length > 0 &&
      studentCommission[studentCommission.length - 1]?.commissionRemaining > 0
        ? studentCommission?.[0]?.commissionPersonName
        : '',
    voucherNumber: '',
    commissionAmount:
      studentCommission?.length > 0 &&
      studentCommission[studentCommission.length - 1]?.commissionRemaining > 0
        ? studentCommission[studentCommission.length - 1]?.commissionRemaining
        : '',

    commissionPaid: '',
    commissionRemaining: '',
    commissionDate: '',
    commissionNaretion: '',
    dayBookAccountId: dayBookDataId?._id || '',
    companyId: params.companyId,
  }

  // console.log(location?.state)

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: CourseSchema,
    onSubmit: async (values) => {
      // console.log(values)
      try {
        setLoading(true)
        studentCTX.createStudentCommissionMutation.mutate(values)
        navigate(`/students/${params.companyId}`)
      } catch (error) {
        console.log(error)
      }
    },
  })

  // Helper function to render datalist options based on filter
  // console.log('data',studentCommission)
  // console.log('id',params.companyId)
  // const filteredStudents = studentCommission?.filter((student) => student.companyName === params.companyId)
  // console.log('filterstudent',filteredStudents)
  // const student = filteredStudents.filter((stu)=> stu.name === (location.state.name.split('-')[0].trim()))
  // function renderAccountNameOptions() {
  //   if (!filteredStudents || filteredStudents.length === 0) {
  //     return null
  //   }

  //   return (
  //     <datalist id='accountNameOptions'>
  //       {filteredStudents.map((student) => {
  //         return <option key={student._id} value={`${student.name}-${student.rollNumber}`}></option>
  //       })}
  //     </datalist>
  //   )
  // }
  //  console.log('stu',student)

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
            <h3 className='fw-bolder m-0'>{companyData?.data?.companyName}</h3>
          </div>
        </div>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Student Name{' '}
                  <div className='fv-row mt-5'>
                    <select
                      className='form-select'
                      {...formik.getFieldProps('studentName')}
                      placeholder='Enter Student Name'
                    >
                      <option value='' hidden>--Select Student Name--</option>
                      
                       
                           <option  value={`${location?.state?.name}`}>
                              {`${location?.state?.name}`}
                            </option>
                       
                   
                    </select>
                    {formik.touched.studentName && formik.errors.studentName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.studentName}</div>
                      </div>
                    )}
                  </div>
                </label>

                {/* ----------------------- Commission Person Name Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission Person Name{' '}
                  <div className='fv-row mt-5'>
                    <select
                      className='form-select form-select-lg form-select-solid mb-3 mb-lg-0'
                      {...formik.getFieldProps('commissionPersonName')}
                      onChange={(e) => {
                        formik.handleChange(e) // Update Formik state
                        handleCommissionPersonChange(e) // Update selected account ID state
                      }}
                    >
                      <option value='' hidden>--Select Commission Person--</option>
                      {dayBookAccountCtx.getDayBookAccountsLists?.data
                        ?.filter(
                          (cp) =>
                            cp.companyId === params.companyId && cp.accountType === 'Commission'
                        )
                        .map((item) => (
                          <option key={item._id} value={item.accountName}>
                            {item.accountName}
                          </option>
                        ))}
                    </select>
                    {formik.touched.commissionPersonName && formik.errors.commissionPersonName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.commissionPersonName}</div>
                      </div>
                    )}
                  </div>
                </label>

                {/* -----------------------  Commission Person Name End ----------------------------- */}

                {/* ----------------------- Commission Amount Field Start----------------------------- */}
                {studentCommission?.length > 0 && (
                  <>
                    {studentCommission[studentCommission.length - 1]?.commissionRemaining > 0 ? (
                      // If there is a remaining commission
                      <>
                        <label className='col-6 col-form-label fw-bold fs-6'>
                          Remaining Commission Amount
                          <div className='fv-row mt-5'>
                            <input
                              type='number'
                              min={0}
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Enter Commission Amount'
                              {...formik.getFieldProps('commissionAmount')}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0
                                formik.setFieldValue('commissionAmount', value)
                                const commissionPaid = Number(formik.values.commissionPaid) || 0
                                formik.setFieldValue('commissionRemaining', value - commissionPaid)
                              }}
                            />
                            {formik.touched.commissionAmount && formik.errors.commissionAmount && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  {formik.errors.commissionAmount}
                                </div>
                              </div>
                            )}
                          </div>
                        </label>

                        <label className='col-6 col-form-label fw-bold fs-6'>
                          Pay Remaining Commission
                          <div className='fv-row mt-5'>
                            <input
                              type='number'
                              min={0}
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Enter Commission Paid'
                              {...formik.getFieldProps('commissionPaid')}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0
                                formik.setFieldValue('commissionPaid', value)
                                const commissionAmount = Number(formik.values.commissionAmount) || 0
                                formik.setFieldValue(
                                  'commissionRemaining',
                                  commissionAmount - value
                                )
                              }}
                            />
                            {formik.touched.commissionPaid && formik.errors.commissionPaid && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>{formik.errors.commissionPaid}</div>
                              </div>
                            )}
                          </div>
                        </label>

                        <label className='col-6 col-form-label fw-bold fs-6'>
                          Remaining Commission
                          <div className='fv-row mt-5'>
                            <input
                              type='number'
                              min={0}
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Remaining Commission'
                              value={formik.values.commissionRemaining || 0}
                              readOnly
                            />
                          </div>
                        </label>
                      </>
                    ) : (
                      // If there is no remaining commission
                      <>
                        <label className='col-6 col-form-label fw-bold fs-6'>
                          Commission Amount
                          <div className='fv-row mt-5'>
                            <input
                              type='number'
                              min={0}
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Enter Commission Amount'
                              {...formik.getFieldProps('commissionAmount')}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0
                                formik.setFieldValue('commissionAmount', value)
                                const commissionPaid = Number(formik.values.commissionPaid) || 0
                                formik.setFieldValue('commissionRemaining', value - commissionPaid)
                              }}
                            />
                            {formik.touched.commissionAmount && formik.errors.commissionAmount && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  {formik.errors.commissionAmount}
                                </div>
                              </div>
                            )}
                          </div>
                        </label>

                        <label className='col-6 col-form-label fw-bold fs-6'>
                          {studentCommission?.length > 0 &&
                            (studentCommission[studentCommission.length - 1]?.commissionRemaining >
                            0
                              ? 'Pay Remaining Commission'
                              : 'Commission Paid')}
                          <div className='fv-row mt-5 '>
                            <input
                              type='number'
                              min={0}
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Enter Commission Paid'
                              {...formik.getFieldProps('commissionPaid')}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0
                                formik.setFieldValue('commissionPaid', value)
                                const commissionAmount = Number(formik.values.commissionAmount) || 0
                                formik.setFieldValue(
                                  'commissionRemaining',
                                  commissionAmount - value
                                )
                              }}
                            />
                            {formik.touched.commissionPaid && formik.errors.commissionPaid && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>{formik.errors?.commissionPaid}</div>
                              </div>
                            )}
                          </div>
                        </label>

                        {/* <label className='col-6 col-form-label fw-bold fs-6'>
                          Commission Paid
                          <div className='fv-row mt-5'>
                            <input
                              type='number'
                              min={0}
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Enter Commission Paid'
                              {...formik.getFieldProps('commissionPaid')}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0
                                formik.setFieldValue('commissionPaid', value)
                                const commissionAmount = Number(formik.values.commissionAmount) || 0
                                formik.setFieldValue(
                                  'commissionRemaining',
                                  commissionAmount - value
                                )
                              }}
                            />
                            {formik.touched.commissionPaid && formik.errors.commissionPaid && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>{formik.errors.commissionPaid}</div>
                              </div>
                            )}
                          </div>
                        </label> */}
                      </>
                    )}
                  </>
                )}

                {studentCommission?.length > 0 && (
                  <>
                    {studentCommission[studentCommission.length - 1]?.commissionRemaining > 0 ? (
                      <>
                        <label className='col-6 col-form-label fw-bold fs-6'>
                          Remaining Commission{' '}
                          <div className='fv-row mt-5 '>
                            <input
                              type='number'
                              min={0}
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Remaining Commission'
                              value={formik.values.commissionRemaining || 0}
                              readOnly
                            />
                            {formik.touched.commissionRemaining &&
                              formik.errors.commissionRemaining && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    {formik.errors?.commissionRemaining}
                                  </div>
                                </div>
                              )}
                          </div>
                        </label>
                      </>
                    ) : (
                      <>
                        <label className='col-6 col-form-label fw-bold fs-6'>
                          Remaining Commission{' '}
                          <div className='fv-row mt-5 '>
                            <input
                              type='number'
                              min={0}
                              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                              placeholder='Remaining Commission'
                              value={formik.values.commissionRemaining || 0}
                              readOnly
                            />
                            {formik.touched.commissionRemaining &&
                              formik.errors.commissionRemaining && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    {formik.errors?.commissionRemaining}
                                  </div>
                                </div>
                              )}
                          </div>
                        </label>
                      </>
                    )}
                  </>
                )}
                {studentCommission?.length === 0 && (
                  <>
                    <label className='col-6 col-form-label fw-bold fs-6'>
                      Commission Amount
                      <div className='fv-row mt-5'>
                        <input
                          type='number'
                          min={0}
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          placeholder='Enter Commission Amount'
                          {...formik.getFieldProps('commissionAmount')}
                          onChange={(e) => {
                            const value = Number(e.target.value) || 0
                            formik.setFieldValue('commissionAmount', value)
                            const commissionPaid = Number(formik.values.commissionPaid) || 0
                            formik.setFieldValue('commissionRemaining', value - commissionPaid)
                          }}
                        />
                        {formik.touched.commissionAmount && formik.errors.commissionAmount && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.commissionAmount}</div>
                          </div>
                        )}
                      </div>
                    </label>
                    <label className='col-6 col-form-label fw-bold fs-6'>
                      Commission Paid
                      <div className='fv-row mt-5 '>
                        <input
                          type='number'
                          min={0}
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          placeholder='Enter Commission Paid'
                          {...formik.getFieldProps('commissionPaid')}
                          onChange={(e) => {
                            const value = Number(e.target.value) || 0
                            formik.setFieldValue('commissionPaid', value)
                            const commissionAmount = Number(formik.values.commissionAmount) || 0
                            formik.setFieldValue('commissionRemaining', commissionAmount - value)
                          }}
                        />
                        {formik.touched.commissionPaid && formik.errors.commissionPaid && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors?.commissionPaid}</div>
                          </div>
                        )}
                      </div>
                    </label>
                    <label className='col-6 col-form-label fw-bold fs-6'>
                      Remaining Commission{' '}
                      <div className='fv-row mt-5 '>
                        <input
                          type='number'
                          min={0}
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          placeholder='Remaining Commission'
                          value={formik.values.commissionRemaining || 0}
                          readOnly
                        />
                        {formik.touched.commissionRemaining && formik.errors.commissionRemaining && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>{formik.errors.commissionRemaining}</div>
                          </div>
                        )}
                      </div>
                    </label>
                  </>
                )}

                {/* ----------------------- Commission Amount Field End ----------------------------- */}

                {/* ----------------------- Commission Voucher number Field Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission voucher number{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Commission voucher number'
                      {...formik.getFieldProps('voucherNumber')}
                    />
                    {formik.touched.voucherNumber && formik.errors.voucherNumber && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.voucherNumber}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ----------------------- Commission Voucher number Field End ----------------------------- */}

                {/* ============================ Commission Naretion Start here ==================== */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission Narration{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Commission Naretion'
                      {...formik.getFieldProps('commissionNaretion')}
                    />
                    {formik.touched.commissionNaretion && formik.errors.commissionNaretion && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.commissionNaretion}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ============================ Commission Naretion End here ==================== */}

                {/* ============================ Commission Date End here ==================== */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Commission Date
                  <div className='fv-row mt-5 '>
                    <DatePicker
                      selected={formik.values.commissionDate}
                      onChange={(date) => formik.setFieldValue('commissionDate', date)}
                      dateFormat='dd/MM/yyyy'
                      className='form-control form-control-lg form-control-solid'
                      placeholderText='DD/MM/YYYY'
                    />
                    {formik.touched.commissionDate && formik.errors.commissionDate && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors?.commissionDate}</div>
                      </div>
                    )}
                  </div>
                </label>
                {/* ============================ Commission Date End here ==================== */}
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading}>
                {!loading && 'Save Changes'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Added
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
export default StudentCommission
