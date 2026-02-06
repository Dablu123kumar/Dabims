import {useEffect, useState} from 'react'
import {useAttendanceContext} from '../AttendanceContext'
import {useFormik} from 'formik'
import * as Yup from 'yup'

const EditLab = ({selectedLab, setOpenModal}) => {
  const {useGetSingleLabDataById, updateLabDataMutation} = useAttendanceContext()
  const {data} = useGetSingleLabDataById(selectedLab)
  const [initialValues, setInitialValues] = useState({
    labName: '',
  })

  useEffect(() => {
    if (data) {
      setInitialValues({
        labName: data.labName || '',
      })
    }
  }, [data])

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      labName: Yup.string().required('Lab Name is required'),
    }),
    onSubmit: (values) => {
      updateLabDataMutation.mutate({
        id: selectedLab,
        labName: values.labName,
      })
      setOpenModal(false)
    },
  })

  return (
    <form className='dynamic-form' onSubmit={formik.handleSubmit}>
      <label className='col-lg-4 col-form-label required fw-bold fs-6'>Lab Name</label>
      <input
        type='text'
        name='labName'
        value={formik.values.labName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className='form-control form-control-lg form-control-solid'
        placeholder='Lab Name'
      />
      {formik.touched.labName && formik.errors.labName ? (
        <div className='text-danger'>{formik.errors.labName}</div>
      ) : null}
      <div className='card-footer d-flex justify-content-end py-2'>
        <button type='submit' className='btn btn-primary d-flex justify-content-end top-5'>
          Update
        </button>
      </div>
    </form>
  )
}

export default EditLab
