import {useEffect, useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'
import {useDynamicFieldContext} from '../enquiry-related/DynamicFieldsContext'
import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'

const DynamicEmailTemplate = () => {
  const companyCTX = useCompanyContext()
  const [modalOpen, setModalOpen] = useState(null)

  const {data: emailTemplates} = companyCTX.getEmailTemplate
  const [emailTemplate, setEmailTemplate] = useState({
    customTemplate: '',
    cancellationTemplate: '',
    dynamicTemplate: '',
    courseSubjectTemplate: '',
    courseChangeTemplate: '',
  })

  // Define default templates
  const defaultTemplates = {
    customTemplate: 'This is the default custom template.',
    cancellationTemplate: 'This is the default cancellation template.',
    dynamicTemplate: 'This is the default dynamic template.',
    courseSubjectTemplate: 'This is the default course subject template.',
    courseChangeTemplate: 'This is the default course change template.',
  }

  // Update the email template when `emailTemplates` changes
  useEffect(() => {
    if (emailTemplates && emailTemplates[0]) {
      setEmailTemplate({
        customTemplate: emailTemplates[0]?.customTemplate || '',
        cancellationTemplate: emailTemplates[0]?.cancellationTemplate || '',
        dynamicTemplate: emailTemplates[0]?.dynamicTemplate || '',
        courseSubjectTemplate: emailTemplates[0]?.courseSubjectTemplate || '',
        courseChangeTemplate: emailTemplates[0]?.courseChangeTemplate || '',
      })
    }
  }, [emailTemplates])

  const handleStudent = () => {
    setModalOpen('student') // Open the student modal
  }

  const handleData = () => {
    setModalOpen('data') // Open the data modal
  }

  const onChangeHandler = (e) => {
    setEmailTemplate({...emailTemplate, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await companyCTX.postEmailTemplate.mutate(emailTemplate)
      console.log('res',res)
    } catch (error) {
      console.error('Failed to submit template:', error)
    } finally {
      setEmailTemplate({
        customTemplate: '',
        cancellationTemplate: '',
        // courseChangeTemplate: '',
        dynamicTemplate: '',
      })
    }
  }

  const handleDefaultTemplate = (templateKey) => {
    setEmailTemplate((prevTemplate) => ({
      ...prevTemplate,
      [templateKey]: defaultTemplates[templateKey],
    }))
  }

  return (
    <div className='card p-10'>
      <div className='d-flex justify-content-between'>
        <h1>Email Templates</h1>
        <button className='btn btn-primary btn-sm' onClick={handleStudent}>
          Student Details
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <div className='py-2'>
            <h3 htmlFor='customTemplate'>Warning Letter Template</h3>
          </div>
          <textarea
            id='customTemplate'
            rows={15}
            value={emailTemplate.customTemplate}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='customTemplate'
          />
          {/* <div className='py-2'>
            <button
              className='btn btn-info'
              onClick={() => handleDefaultTemplate('customTemplate')}
            >
              Default
            </button>
          </div> */}
          <div className='py-2'>
            <h3 htmlFor='cancellationTemplate'>Admission Cancellation Letter Template</h3>
          </div>
          <textarea
            id='cancellationTemplate'
            rows={15}
            value={emailTemplate.cancellationTemplate}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='cancellationTemplate'
          />
          {/* <div className='py-2'>
            <button
              className='btn btn-info'
              onClick={() => handleDefaultTemplate('cancellationTemplate')}
            >
              Default
            </button>
          </div> */}
          <div className='d-flex justify-content-between py-2'>
            <h3 htmlFor='dynamicTemplate'>All Student Email Template</h3>
            <button className='btn btn-primary btn-sm' onClick={handleData}>
              Data Details
            </button>
          </div>
          <textarea
            id='dynamicTemplate'
            rows={15}
            value={emailTemplate.dynamicTemplate}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='dynamicTemplate'
          />
          {/* <div className='py-2'>
            <button
              className='btn btn-info'
              onClick={() => handleDefaultTemplate('dynamicTemplate')}
            >
              Default
            </button>
          </div> */}
          <div className='d-flex justify-content-between py-2'>
            <h3 htmlFor='courseSubjectTemplate'>Course Subjects Email Template</h3>
          </div>
          <textarea
            id='courseSubjectTemplate'
            rows={15}
            value={emailTemplate.courseSubjectTemplate}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='courseSubjectTemplate'
          />


          <div className='d-flex justify-content-between py-2'>
            <h3 htmlFor='courseChangeTemplate'>Course Change Email Template</h3>
          </div>
          <textarea
            id='courseChangeTemplate'
            rows={15}
            value={emailTemplate.courseChangeTemplate}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='courseChangeTemplate'
          />
        </div>
        <div className='d-flex'>
          <button
            disabled={companyCTX.postEmailTemplate.isLoading}
            type='submit'
            className='btn btn-primary'
            style={{margin: '0 8px', padding: '8px 16px', fontSize: '16px'}}
          >
            {companyCTX.postEmailTemplate.isLoading ? 'Adding' : 'Submit'}
          </button>
          {/* <button
            className='btn btn-info'
            onClick={() => handleDefaultTemplate('courseSubjectTemplate')}
            style={{margin: '0 8px', padding: '8px 16px', fontSize: '16px'}}
          >
            Default
          </button> */}
        </div>
      </form>
      {modalOpen === 'student' && (
        <PopUpModal show={modalOpen === 'student'} handleClose={() => setModalOpen(null)}>
          <h2>Student Details</h2>
          <div className='mt-5 d-flex'>
            <ul className='px-10'>
              <strong>Student Name :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${studentInfo.name}'}</li>
              <strong>Student Father Name :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${studentInfo.father_name}'}</li>
              <strong>Student Mobile Number :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${studentInfo.mobile_number}'}</li>
              <strong>Student Present Address :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${studentInfo.present_address}'}</li>
              <strong>Student Roll Number :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${studentInfo.rollNumber}'}</li>
            </ul>
            <ul className='px-10'>
              <strong>Student Email:</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${studentInfo.email}'}</li>
              <strong>Student City :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${studentInfo.city}'}</li>
              <strong>Student Remaining Course Fees :</strong>
              <li style={{marginBottom: '10px'}}>{'${studentInfo.remainingCourseFees}'}</li>
              <strong>Course Name :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${courseName.courseName}'}</li>
              <strong>Course Fees :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${courseName.courseFees}'}</li>
            </ul>
            <ul className='px-10'>
              <strong>Company Name :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyName.companyName}'}</li>
              <strong>Company Email :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyName.email}'}</li>
              <strong>Company Phone :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyName.companyPhone}'}</li>
              <strong>Company Address :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyName.companyAddress}'}</li>
              <strong>Company Website :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyName.companyWebsite}'}</li>
            </ul>
          </div>
        </PopUpModal>
      )}
      {modalOpen === 'data' && (
        <PopUpModal show={modalOpen === 'data'} handleClose={() => setModalOpen(null)}>
          <h2>Company Details</h2>
          <div className='mt-5'>
            <ul className='px-10'>
              <strong>Company Name :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyName}'}</li>
              <strong>Company Email :</strong> <li style={{marginBottom: '10px'}}>{'${email}'}</li>
              <strong>Company Phone :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyPhone}'}</li>
              <strong>Company Address :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyAddress}'}</li>
              <strong>Company Website :</strong>{' '}
              <li style={{marginBottom: '10px'}}>{'${companyWebsite}'}</li>
            </ul>
          </div>
        </PopUpModal>
      )}
    </div>
  )
}

export default DynamicEmailTemplate
