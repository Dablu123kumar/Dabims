import React, { useState } from 'react'
// import { KTIcon } from '../../../../_metronic/helpers'
// import PopUpModal from '../../../modules/accounts/components/popUpModal/PopUpModal'
import TeacherFormField from './TeacherFormField'
import { useTeacherContext } from '../teachers/TeacherContext'
// import { useCompanyContext } from '../../compay/CompanyContext'
import { useNavigate, useParams } from 'react-router-dom'
import EditTeacher from './EditTeacher'
import { useCompanyContext } from '../compay/CompanyContext'
import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'
import { KTIcon } from '../../../_metronic/helpers'

const BASE_URL_IMAGE = `${process.env.REACT_APP_BASE_URL}/api/images/default-image.jpg`

const TeachersList = () => {
  const [openModal, setOpenModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { useGetAllTeachers, useDeleteTeacher } = useTeacherContext()
  const companyCTX = useCompanyContext()
  const navigate = useNavigate()
  const params = useParams()
  const companyId = params?.id

  const { data: teachersData } = useGetAllTeachers()
  const deleteTeacherMutation = useDeleteTeacher()

  const { data: companyInfo } = companyCTX?.useGetSingleCompanyData(companyId)

  const filteredTeachers = teachersData?.data?.filter(
    (teacher) =>
      searchTerm.trim() === '' ||
      teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteHandler = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteTeacherMutation.mutate(teacherId)
    }
  }

  const openAddTeacherModal = () => {
    setModalMode('add')
    setSelectedTeacher(null)
    setOpenModal(true)
  }

  const openEditTeacherModal = (teacher) => {
    setModalMode('edit')
    setSelectedTeacher(teacher)
    setOpenModal(true)
  }

  return (
    <>
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Teachers</span>
          </h3>
          <div className='search-bar'>
            <input
              type='text'
              className='form-control'
              placeholder='Search Teacher'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='card-toolbar'>
            <button
              className='btn btn-sm btn-light-primary'
              onClick={openAddTeacherModal}
            >
              <KTIcon iconName='plus' className='fs-3' />
              Add New Teacher
            </button>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='w-25px'></th>
                  <th className='min-w-150px'>Teacher Name</th>
                  <th className='min-w-140px'>Email</th>
                  <th className='min-w-140px'>Phone</th>
                  <th className='min-w-140px'>Qualification</th>
                  <th className='min-w-100px'>Experience</th>
                  <th className='min-w-100px text-end'>Actions</th>
                </tr>
              </thead>
              {filteredTeachers && filteredTeachers.length > 0 ? (
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher?._id}>
                      <td>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex justify-content-start flex-column'>
                            <div
                              style={{ cursor: 'pointer' }}
                              className='text-dark fw-bold text-hover-primary fs-6'
                            >
                              {teacher?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{ cursor: 'pointer' }}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {teacher?.email}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{ cursor: 'pointer' }}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {teacher?.phone}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{ cursor: 'pointer' }}
                          className='text-dark fw-bold text-hover-primary d-block fs-6'
                        >
                          {teacher?.qualification}
                        </div>
                      </td>
                      <td>
                        <div className='text-end'>
                          <span className='text-muted  fs-7 fw-semibold'>{teacher?.experience || 0} years</span>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          <button
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            onClick={() => openEditTeacherModal(teacher)}
                          >
                            <KTIcon iconName='pencil' className='fs-3' />
                          </button>
                          <button
                            onClick={() => deleteHandler(teacher?._id)}
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                          >
                            <KTIcon iconName='trash' className='fs-3' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tr>
                  <td colSpan='7' className='text-center fw-bold text-muted'>
                    No Teacher Data Found !!
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>
      </div>
      <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
        {modalMode === 'add' ? (
          <TeacherFormField setOpenModal={setOpenModal} companyId={companyId} />
        ) : (
          <EditTeacher setOpenModal={setOpenModal} teacher={selectedTeacher?._id} />
        )}
      </PopUpModal>
    </>
  )
}

export default TeachersList
