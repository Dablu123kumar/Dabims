import {useParams} from 'react-router-dom'
import {useAttendanceContext} from '../AttendanceContext'

const BatchForm = () => {
  const {getAllLabsData, getAllTrainersData, getAllBatchTimings} = useAttendanceContext()
  const params = useParams()
  // console.log(getAllLabsData?.data)

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
            <h3 className='fw-bolder m-0'>Add Batch</h3>
          </div>
        </div>
        <div id='kt_account_profile_details' className='collapse show'>
          <form className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Batch Name{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Batch Name..'
                    />
                  </div>
                </label>

                {/* ----------------------- Company Email Field Start----------------------------- */}
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Select Trainer
                  <div className='fv-row mt-5 '>
                    <select className='form-select form-select-solid form-select-lg'>
                      <option value=''>--select-trainer--</option>
                      {getAllTrainersData?.data?.map((trainer) => (
                        <option key={trainer?._id} value={trainer?.trainerName}>
                          {trainer?.trainerName}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
                {/* ----------------------- Company Email Field End ----------------------------- */}

                {/* ----------------------- Company Phone Field Start----------------------------- */}
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Select Lab
                  <div className='fv-row mt-5 '>
                    <select className='form-select form-select-solid form-select-lg'>
                      <option value=''>--select-lab--</option>
                      {getAllLabsData?.data
                        ?.filter((company) => company.companyId === params?.id)
                        .map((lab) => (
                          <option key={lab?._id} value={lab?.labName}>
                            {lab?.labName}
                          </option>
                        ))}
                    </select>
                  </div>
                </label>
                {/* ----------------------- Company Phone Field End ----------------------------- */}

                {/* ----------------------- Company Website Field Start----------------------------- */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Starting Date{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='date'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Company website'
                    />

                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'></div>
                    </div>
                  </div>
                </label>
                {/* ----------------------- Company Website Field End ----------------------------- */}

                {/* ============================ Start course fees==================== */}
                <label className='col-6 col-form-label fw-bold fs-6'>
                  Ending Date{' '}
                  <div className='fv-row mt-5 '>
                    <input
                      type='date'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Company Address'
                    />
                  </div>
                </label>
                <label className='col-6 col-form-label required fw-bold fs-6'>
                  Batch Time{' '}
                  <div className='fv-row mt-5 '>
                    <select className='form-select form-select-solid form-select-lg'>
                      <option value=''>--select-batch-time--</option>
                      {getAllBatchTimings?.data?.map((time) => (
                        <option
                          value={`${time?.startTime}-${time?.endTime}`}
                          key={time?._id}
                        >{`${time?.startTime}-${time?.endTime}`}</option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
            </div>
            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary'>
                Add Batch
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default BatchForm
