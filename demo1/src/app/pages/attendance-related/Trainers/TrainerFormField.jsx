import {useState, useEffect} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAttendanceContext} from '../AttendanceContext'
import {useLocation, useParams} from 'react-router-dom'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL_Image = `${BASE_URL}/api/images`

const TrainerFormField = ({setOpenModal}) => {
  const location = useLocation()
  const params = useParams()
  const companyId = params?.id
  const {createTrainerData} = useAttendanceContext()

  const [preview, setPreview] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [updateUserId, setUpdateUserId] = useState(location.state)

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    trainerName: Yup.string().required('Trainer name is required'),
    trainerEmail: Yup.string().email('Invalid email').required('Trainer email is required'),
    trainerDesignation: Yup.string().required('Trainer designation is required'),
  })

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      trainerName: '',
      trainerEmail: '',
      trainerDesignation: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const data = new FormData()
      data.append('trainerName', values.trainerName)
      data.append('trainerEmail', values.trainerEmail)
      data.append('trainerDesignation', values.trainerDesignation)
      data.append('companyId', companyId)
      if (imageFile) {
        data.append('trainerImage', imageFile)
      }

      // Send the form data and image to the backend
      createTrainerData.mutate(data, {
        onSuccess: () => {
          setOpenModal(false)
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || 'Failed to create') 
          console.error('Error saving trainer data:', error)
        },
      })
    },
  })

  useEffect(() => {
    if (imageFile) {
      setPreview(URL.createObjectURL(imageFile))
    } else {
      setPreview('')
    }
    // Clean up URL object when component unmounts or imageFile changes
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [imageFile])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file) // Store the selected image file
  }

  return (
    <form className='dynamic-form' onSubmit={formik.handleSubmit}>
      <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative d-flex justify-content-center'>
        {updateUserId ? (
          <img src={preview ? preview : `${BASE_URL_Image}/${updateUserId?.image}`} alt='Trainer' />
        ) : (
          <img src={preview ? preview : toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='Trainer' />
        )}
      </div>
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Image</label>
      <input
        type='file'
        className='form-control form-control-lg form-control-solid'
        onChange={handleImageChange}
        placeholder='Image'
      />

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Name</label>
        <input
          type='text'
          name='trainerName'
          value={formik.values.trainerName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Trainer Name'
        />
        {formik.touched.trainerName && formik.errors.trainerName && (
          <div className='text-danger'>{formik.errors.trainerName}</div>
        )}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Email</label>
        <input
          type='email'
          name='trainerEmail'
          value={formik.values.trainerEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Trainer Email'
        />
        {formik.touched.trainerEmail && formik.errors.trainerEmail && (
          <div className='text-danger'>{formik.errors.trainerEmail}</div>
        )}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Trainer Designation</label>
        <input
          type='text'
          name='trainerDesignation'
          value={formik.values.trainerDesignation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Trainer Designation'
        />
        {formik.touched.trainerDesignation && formik.errors.trainerDesignation && (
          <div className='text-danger'>{formik.errors.trainerDesignation}</div>
        )}
      </div>

      <div className='card-footer d-flex justify-content-end py-2'>
        <button type='submit' className='btn btn-primary d-flex justify-content-end top-5'>
          Save
        </button>
      </div>
    </form>
  )
}

export default TrainerFormField
