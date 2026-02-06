import {useEffect, useState} from 'react'
import {useCompanyContext} from '../compay/CompanyContext'

const EmailTemplate = () => {
  const companyCTX = useCompanyContext()
  const {data: emailRemainderData} = companyCTX.getEmailRemainderTextMessage
  const {data: emailRemainderDays} = companyCTX.getEmailRemainderDays
  const [textEmailsData, setTextEmailsData] = useState({
    firstRemainder: emailRemainderData?.[0]?.firstRemainder || '',
    thirdRemainder: emailRemainderData?.[0]?.thirdRemainder || '',
  })

  const [remainderDays, setRemainderDays] = useState({
    firstDueDay: emailRemainderDays?.[0]?.firstDueDay || '',
    secondDueDay: emailRemainderDays?.[0]?.secondDueDay || '',
    thirdDueDay: emailRemainderDays?.[0]?.thirdDueDay || '',
  })

  useEffect(() => {
    setTextEmailsData({
      firstRemainder: emailRemainderData?.[0]?.firstRemainder || '',
      thirdRemainder: emailRemainderData?.[0]?.thirdRemainder || '',
    })

    setRemainderDays({
      firstDueDay: emailRemainderDays?.[0]?.firstDueDay || '',
      secondDueDay: emailRemainderDays?.[0]?.secondDueDay || '',
      thirdDueDay: emailRemainderDays?.[0]?.thirdDueDay || '',
    })
  }, [emailRemainderData, emailRemainderDays])

  const onChangeHandler = (e) => {
    setTextEmailsData({...textEmailsData, [e.target.name]: e.target.value})
  }

  const onChangeInputHandler = (e) => {
    setRemainderDays({...remainderDays, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      companyCTX.postEmailRemainderText.mutate(textEmailsData)
      companyCTX.postEmailRemainderDays.mutate(remainderDays)
    } catch (error) {
      console.log(error)
    } finally {
      setTextEmailsData({
        firstRemainder: '',
        thirdRemainder: '',
      })
      setRemainderDays({
        firstDueDate: '',
        thirdRemainderDay: '',
      })
    }
  }

  return (
    <div className='card p-10'>
      <h1>Email Reminder Text</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <h3 htmlFor='firstRemainder'>Before Over Due Reminder</h3>
          <textarea
            id='firstRemainder'
            rows={10}
            value={textEmailsData.firstRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='firstRemainder'
          />
          {/* <div class='d-flex align-items-center'> */}
          {/* <label class='form-label'> First Remainder Date</label>
          <input
            type='number'
            min={1}
            max={31}
            placeholder='First Remainder Date...'
            name='firstRemainderDay'
            value={remainderDays.firstRemainderDay}
            onChange={onChangeInputHandler}
            class='form-control me-2'
            style={{width: '200px'}}
          /> */}
          {/* </div> */}
        </div>
        {/* <div className='mb-3'>
          <label htmlFor='secondRemainder' className='form-label'>
            Second Reminder
          </label>
          <textarea
            id='secondRemainder'
            value={textEmailsData.secondRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='secondRemainder'
          />
          <label class='form-label'> Second Remainder Date</label>
          <input
            type='number'
            min={1}
            max={31}
            placeholder='Second Remainder Date...'
            value={remainderDays.secondRemainderDay}
            name='secondRemainderDay'
            onChange={onChangeInputHandler}
            class='form-control me-2'
            style={{width: '200px'}}
          />
        </div> */}
        <div className='mb-3'>
          <h3 htmlFor='thirdRemainder'>After Over Due Reminder</h3>
          <textarea
            id='thirdRemainder'
            rows={10}
            value={textEmailsData.thirdRemainder}
            onChange={onChangeHandler}
            type='text'
            className='form-control'
            name='thirdRemainder'
          />
          <label class='form-label'> First Due Day</label>
          <input
            type='number'
            min={1}
            max={31}
            value={remainderDays.firstDueDay}
            name='firstDueDay'
            placeholder='First Due Day...'
            class='form-control me-2'
            onChange={onChangeInputHandler}
            style={{width: '100px'}}
          />
          <label class='form-label'> Second Due Day</label>
          <input
            type='number'
            min={1}
            max={31}
            value={remainderDays.secondDueDay}
            name='secondDueDay'
            placeholder='Second Due Day...'
            class='form-control me-2'
            onChange={onChangeInputHandler}
            style={{width: '100px'}}
          />
          <label class='form-label'> Third Due Day</label>
          <input
            type='number'
            min={1}
            max={31}
            value={remainderDays.thirdDueDay}
            name='thirdDueDay'
            placeholder='Third Due Day...'
            class='form-control me-2'
            onChange={onChangeInputHandler}
            style={{width: '100px'}}
          />
        </div>
        <button
          disabled={companyCTX.postEmailRemainderText.isLoading === true}
          type='submit'
          className='btn btn-primary'
        >
          {companyCTX.postEmailRemainderText.isLoading === true ? 'Adding' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default EmailTemplate
