import {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAttendanceContext} from '../AttendanceContext'
import {useFormik} from 'formik'
import * as Yup from 'yup'

const BASE_URL_IMAGE = `${process.env.REACT_APP_BASE_URL}/api/images`

const EditTrainer = ({trainer, setOpenModal}) => {
  const {useGetSingleTrainerDataById, updateTrainerDataMutation} = useAttendanceContext()
  const [preview, setPreview] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const {data} = useGetSingleTrainerDataById(trainer)

  const formik = useFormik({
    initialValues: {
      trainerName: '',
      trainerEmail: '',
      trainerDesignation: '',
      trainerImage: null,
    },
    validationSchema: Yup.object({
      trainerName: Yup.string().required('Trainer Name is required'),
      trainerEmail: Yup.string()
        .email('Invalid email address')
        .required('Trainer Email is required'),
      trainerDesignation: Yup.string().required('Trainer Designation is required'),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData()
        formData.append('trainerName', values.trainerName)
        formData.append('trainerEmail', values.trainerEmail)
        formData.append('trainerDesignation', values.trainerDesignation)
        formData.append('trainerImage', imageFile || values?.trainerImage)
        formData.append('CompanyId', values?.CompanyId)
        formData.append('id', trainer)

        await updateTrainerDataMutation.mutate(formData)
        setOpenModal(false)
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
  })

  useEffect(() => {
    if (data?.trainer) {
      formik.setValues({
        trainerName: data.trainer.trainerName,
        trainerEmail: data.trainer.trainerEmail,
        trainerDesignation: data.trainer.trainerDesignation,
        trainerImage: data.trainer.trainerImage,
      })
      setPreview(`${BASE_URL_IMAGE}/${data.trainer.trainerImage}`)
    }
  }, [data])

  useEffect(() => {
    if (imageFile) {
      setPreview(URL.createObjectURL(imageFile))
    }
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [imageFile])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
    formik.setFieldValue('trainerImage', file)
  }

  return (
    <form className='dynamic-form' onSubmit={formik.handleSubmit}>
      <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative d-flex justify-content-center'>
        <img src={preview || toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='Trainer Image' />
      </div>

      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Image</label>
      <input
        type='file'
        className='form-control form-control-lg form-control-solid'
        onChange={handleImageChange}
      />

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
      {formik.touched.trainerName && formik.errors.trainerName ? (
        <div className='text-danger'>{formik.errors.trainerName}</div>
      ) : null}

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
      {formik.touched.trainerEmail && formik.errors.trainerEmail ? (
        <div className='text-danger'>{formik.errors.trainerEmail}</div>
      ) : null}

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
      {formik.touched.trainerDesignation && formik.errors.trainerDesignation ? (
        <div className='text-danger'>{formik.errors.trainerDesignation}</div>
      ) : null}

      <div className='card-footer d-flex justify-content-end py-2'>
        <button type='submit' className='btn btn-primary d-flex justify-content-end top-5'>
          Update
        </button>
      </div>
    </form>
  )
}

export default EditTrainer
