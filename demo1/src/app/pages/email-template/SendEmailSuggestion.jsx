import {useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'

const SendEmailSuggestion = () => {
  const companyCtx = useCompanyContext()

  // console.log(companyCtx.getEmailSuggestionStatus.data.emailSuggestions[0].emailSuggestionStatus)

  const handleCheckboxChange = (e) => {
    // console.log(e.target.checked)
    //console.log('Checkbox is now:', !isChecked)
    try {
      companyCtx.postEmailSuggestionStatus.mutate({
        emailSuggestionStatus: e.target.checked,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleWelcomeCheckboxChange = (e) => {
    // console.log(e.target.checked)
    //console.log('Checkbox is now:', !isChecked)
    try {
      companyCtx.postWelcomeEmailSuggestionStatus.mutate({welcomeemailsuggestion: e.target.checked})
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='card p-5 '>
      <h3 className='card-title'>Email Suggestions</h3>
      <p>Do you want to send an Email?</p>
      <div className='form-check '>
        <input
          className='form-check-input'
          type='checkbox'
          id='sendEmailCheckbox'
          onChange={handleCheckboxChange}
          checked={
            companyCtx.getEmailSuggestionStatus?.data?.emailSuggestions?.[0]?.emailSuggestionStatus
          }
        />
        <label className='form-check-label' htmlFor='sendEmailCheckbox'>
          Yes, send an email
        </label>
      </div>
      <div className='form-check '>
        <input
          className='form-check-input'
          type='checkbox'
          id='sendEmailWelcomeCheckbox'
          onChange={handleWelcomeCheckboxChange}
          checked={
            companyCtx.getWelcomeEmailSuggestionStatus?.data?.emailSuggestions?.[0]
              ?.welcomeemailsuggestion
          }
        />
        <label className='form-check-label' htmlFor='sendEmailCheckbox'>
          Yes, send a Welcome email
        </label>
      </div>
    </div>
  )
}

export default SendEmailSuggestion
