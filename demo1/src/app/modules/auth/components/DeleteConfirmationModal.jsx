import { Modal, Button } from 'react-bootstrap'

const DeleteConfirmationModal = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDangerous = true
}) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      className='delete-confirmation-modal'
    >
      <Modal.Header closeButton>
        <Modal.Title className={isDangerous ? 'text-danger' : ''}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='mb-0'>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={isDangerous ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className='spinner-border spinner-border-sm me-2'
                role='status'
                aria-hidden='true'
              ></span>
              {confirmText}...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteConfirmationModal
