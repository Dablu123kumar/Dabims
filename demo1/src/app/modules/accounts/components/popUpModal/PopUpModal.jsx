import './CustomModal.css'

const PopUpModal = ({show, handleClose, children}) => {
  if (!show) {
    return null
  }

  let themeMode = 'system'

  if (localStorage.getItem('kt_theme_mode_value')) {
    themeMode = localStorage.getItem('kt_theme_mode_value')
  }

  if (themeMode === 'system') {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return (
    <div className='modal-overlay' style={{background: themeMode === 'dark' ? '' : ''}}>
      <div
        className='modal-content'
        style={{background: themeMode === 'dark' ? '#323333' : '#fff'}}
      >
        <button
          className='modal-close'
          onClick={handleClose}
          style={{background: themeMode === 'dark' ? '#323333' : '#fff'}}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

export default PopUpModal
