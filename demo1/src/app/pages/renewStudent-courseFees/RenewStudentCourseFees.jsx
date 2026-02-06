import {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {useAdmissionContext} from '../../modules/auth/core/Addmission'
import {useNavigate} from 'react-router-dom'

const RenewStudentCourseFees = ({studentInfoData}) => {
  const studentCTX = useAdmissionContext()
  const navigate = useNavigate()
  //console.log(studentInfoData.companyName)
  const [renewStudentData, setRenewStudentData] = useState({
    extraFees: '',
    noOfInstallments: '',
    duration: new Date(),
  })

  const onSubmitHandler = (e) => {
    e.preventDefault()
    // Handle form submission here
    // console.log(renewStudentData)
    if (
      renewStudentData.extraFees === '' ||
      renewStudentData.noOfInstallments === '' ||
      renewStudentData.duration === new Date()
    ) {
      alert('Please fill all the required fields')
      return
    }

    studentCTX.updateStudentRenewCourseFeesMutation.mutate({
      ...renewStudentData,
      studentId: studentInfoData._id,
    })
    setRenewStudentData({
      extraFees: '',
      noOfInstallments: '',
      duration: new Date(),
    })
    navigate(`/profile/student/${studentInfoData._id}`)
  }

  return (
    <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
      <div className='px-7 py-5'>
        <div className='fs-5 text-dark fw-bolder'>Renew Course Fees</div>
      </div>
      <div className='separator border-gray-200'></div>
      <div className='px-7 py-5'>
        <div className='mb-2'>
          <label className='form-label fw-bold'>Add Renew Fees</label>
          <div>
            <input
              type='text'
              className='form-control'
              placeholder='e.g 5000'
              value={renewStudentData.extraFees}
              onChange={(e) =>
                setRenewStudentData((prev) => ({...prev, extraFees: e.target.value}))
              }
            />
          </div>
        </div>
        <div className='mb-2'>
          <label className='form-label fw-bold'>No Of Installments</label>
          <div>
            <input
              type='text'
              className='form-control'
              placeholder='e.g 1'
              value={renewStudentData.noOfInstallments}
              onChange={(e) =>
                setRenewStudentData((prev) => ({...prev, noOfInstallments: e.target.value}))
              }
            />
          </div>
        </div>
        <div className='mb-2' onClick={(e) => e.stopPropagation()}>
          <label className='form-label fw-bold'>Duration</label>
          <div>
            <DatePicker
              selected={renewStudentData.duration}
              onChange={(date) => setRenewStudentData((prev) => ({...prev, duration: date}))}
              dateFormat='dd/MM/yyyy'
              className='form-control form-control-lg form-control-solid'
              placeholderText='DD/MM/YYYY'
            />
          </div>
        </div>

        <div className='d-flex justify-content-end'>
          <button onClick={onSubmitHandler} type='submit' className='btn btn-sm btn-primary'>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default RenewStudentCourseFees
