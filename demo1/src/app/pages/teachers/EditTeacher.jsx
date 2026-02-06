import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTeacherContext } from '../teachers/TeacherContext'

const EditTeacher = ({ teacher, setOpenModal }) => {
  const { useGetTeacherById, useUpdateTeacher } = useTeacherContext()
  const { data: teacherData } = useGetTeacherById(teacher)
  const updateTeacherMutation = useUpdateTeacher()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Teacher name is required'),
    email: Yup.string().email('Invalid email').required('Teacher email is required'),
    phone: Yup.string().required('Phone number is required'),
    qualification: Yup.string().required('Qualification is required'),
    experience: Yup.number().min(0, 'Experience cannot be negative'),
    address: Yup.string().required('Address is required'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      qualification: '',
      experience: 0,
      address: '',
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateTeacherMutation.mutate({
          id: teacher,
          payload: values,
        })
        setOpenModal(false)
      } catch (error) {
        console.error('Error updating teacher:', error)
      }
    },
  })

  useEffect(() => {
    if (teacherData?.data) {
      formik.setValues({
        name: teacherData.data.name || '',
        email: teacherData.data.email || '',
        phone: teacherData.data.phone || '',
        qualification: teacherData.data.qualification || '',
        experience: teacherData.data.experience || 0,
        address: teacherData.data.address || '',
        isActive: teacherData.data.isActive !== undefined ? teacherData.data.isActive : true,
      })
    }
  }, [teacherData])

  return (
    <form className='dynamic-form' onSubmit={formik.handleSubmit}>
      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Teacher Name</label>
        <input
          type='text'
          name='name'
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Teacher Name'
        />
        {formik.touched.name && formik.errors.name ? (
          <div className='text-danger'>{formik.errors.name}</div>
        ) : null}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Email</label>
        <input
          type='email'
          name='email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Teacher Email'
        />
        {formik.touched.email && formik.errors.email ? (
          <div className='text-danger'>{formik.errors.email}</div>
        ) : null}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Phone</label>
        <input
          type='text'
          name='phone'
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Phone Number'
        />
        {formik.touched.phone && formik.errors.phone ? (
          <div className='text-danger'>{formik.errors.phone}</div>
        ) : null}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Qualification</label>
        <input
          type='text'
          name='qualification'
          value={formik.values.qualification}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='e.g., B.Tech, M.Ed'
        />
        {formik.touched.qualification && formik.errors.qualification ? (
          <div className='text-danger'>{formik.errors.qualification}</div>
        ) : null}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label fw-bold fs-6'>Experience (Years)</label>
        <input
          type='number'
          name='experience'
          value={formik.values.experience}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Years of experience'
          min='0'
        />
        {formik.touched.experience && formik.errors.experience ? (
          <div className='text-danger'>{formik.errors.experience}</div>
        ) : null}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label required fw-bold fs-6'>Address</label>
        <textarea
          name='address'
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='form-control form-control-lg form-control-solid'
          placeholder='Address'
          rows='3'
        />
        {formik.touched.address && formik.errors.address ? (
          <div className='text-danger'>{formik.errors.address}</div>
        ) : null}
      </div>

      <div className='mb-3'>
        <label className='col-lg-4 col-form-label fw-bold fs-6'>Active</label>
        <div className='form-check form-switch form-check-custom form-check-solid'>
          <input
            className='form-check-input'
            type='checkbox'
            name='isActive'
            checked={formik.values.isActive}
            onChange={formik.handleChange}
          />
          <label className='form-check-label'>Active</label>
        </div>
      </div>

      <div className='card-footer d-flex justify-content-end py-2'>
        <button type='submit' className='btn btn-primary d-flex justify-content-end top-5'>
          Update
        </button>
      </div>
    </form>
  )
}

export default EditTeacher
