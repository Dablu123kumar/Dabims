import React, {useEffect, useState} from 'react'
import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from '../../modules/auth'
import {toast} from 'react-toastify'
import {KTIcon} from '../../../_metronic/helpers'
import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'
import EditAddOnSubjects from './EditAddOnSubjects'
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL

const AddOnCourseTable = ({
  handleCheckBoxChange,
  studentData,
  data,
  isLoading,
  error,
  selectedCourses,
  groupSubjectsBySemester,
  marksData,
  activeTab,
  handleInputChange,
  handleTabClick,
  handleClick,
  isSubmitting,
  handleSubmit,
  studentSubjectMarksData,
  YearandSemesterSets,
}) => {
  const courseSubjectsCtx = useCourseSubjectContext()
  const location = useLocation()
  const [subjects, setSubjects] = useState({})
  const navigate = useNavigate()
  const [semYear, setSemYear] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [editSubjectId, setEditSubjectId] = useState(null)
  const {auth} = useAuth()
  const [openModal, setOpenModal] = useState(false)

  // console.log(location)

  const handleDeleteSubject = (id) => {
    if (!window.confirm('Are you sure you want to delete this Additional Course !!')) {
      return
    }
    courseSubjectsCtx.deleteCourseSubjectMutation.mutate(id)
  }

  const handleEdit = (id, semYear, subjects) => {
    setEditSubjectId(id)
    setSemYear(semYear)
    setSubjects(subjects)
    setOpenModal(true)
  }

  const sendSubjectsEmail = async (subjectData, studentData) => {
    setIsSendingEmail(true)
    try {
      const res = await axios.post(`${BASE_URL}/api/subjects/subject-mail`, {
        subjectData,
        studentData,
      })

       console.log(res.data)
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            fontSize: '18px',
            color: 'white',
            background: 'black',
          },
        })
        setIsSendingEmail(false)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setIsSendingEmail(false) // Stop sending email
    }
  }

  const filteredData = data?.filter(
    (subject) =>
      subject?.semYear === YearandSemesterSets[activeTab - 1] &&
      subject?.AddOnSubjects === 'AddOnSubject' &&
      subject?.studentInfo === location?.state?._id
  )

  localStorage.setItem(
  'student-result',
  JSON.stringify({
    state: {
      courseType: YearandSemesterSets[activeTab - 1],
      data: studentSubjectMarksData,
      studentData: studentData,
    },
  })
)

localStorage.setItem(
  'print-student-result',
  JSON.stringify({
    state: {
      courseType: YearandSemesterSets[activeTab - 1],
      data: studentSubjectMarksData,
      studentData: studentData,
    },
  })
)

  // console.log(filteredData)
  // console.log(location)

  return (
    <>
      <div className='card'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Additional Course Subjects</span>
            <span className=' mt-1 fw-semibold fs-7'>Student Name : {location?.state?.name}</span>
          </h3>

          <div className='card-toolbar'>
            <ul className='nav p-5'>
              {YearandSemesterSets.length > 0 &&
                YearandSemesterSets.map((itemSubject, i) => (
                  <li key={i} style={{borderBottom: activeTab === i + 1 ? '2px solid red' : ''}}>
                    <NavLink
                      className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary ${
                        activeTab === i + 1 ? 'active bg-red' : ''
                      }`}
                      data-bs-toggle='tab'
                      to={`#kt_table_widget_5_tab_${i + 1}`}
                      onClick={() => handleTabClick(i + 1)}
                    >
                      {itemSubject}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className='card-body py-3'>
          <div className='table-responsive'>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error loading data</div>
            ) : (
              <>
                <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                  <thead>
                    <tr className='fw-bold '>
                      <th className='w-25px'>
                        <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                      </th>
                      <th className='min-w-100px'>Sr.No</th>
                      {/* <th className='min-w-100px'></th> */}
                      <th className='min-w-120px'>Subject Name</th>
                      <th className='min-w-120px'>Subject Code</th>
                      <th className='min-w-140px'>Full Marks</th>
                      <th className='min-w-140px'>Pass Marks</th>
                      <th className='min-w-140px'>Theory</th>
                      <th className='min-w-120px'>Practical</th>
                      <th className='min-w-120px'>Total Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      ?.filter(
                        (subject) =>
                          subject?.semYear === YearandSemesterSets[activeTab - 1] &&
                          subject?.AddOnSubjects === 'AddOnSubject' &&
                          subject?.studentInfo === location?.state?._id &&
                          subject?.course === location?.state?.courseName
                      )
                      ?.map((yearWiseSubject, indexValue) => {
                        // Find the student's marks data for this subject
                        const studentMarks = studentSubjectMarksData?.find(
                          (singleStudentMarksData) =>
                            singleStudentMarksData?.Subjects?._id === yearWiseSubject?._id
                        )
                        // console.log(studentMarks?.subjects[yearWiseSubject._id])
                        // Check if the subject ID exists in the `subjects` object and get its value (true/false)
                        // console.log(selectedCourses?.subjects?.[yearWiseSubject?._id])

                        return (
                          <tr key={yearWiseSubject._id}>
                            <td className='w-25px'>
                              <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input
                                  className='form-check-input'
                                  type='checkbox'
                                  onChange={(event) =>
                                    handleCheckBoxChange(yearWiseSubject._id, event)
                                  }
                                  value={yearWiseSubject?._id}
                                  checked={selectedCourses?.[yearWiseSubject?._id] || false}
                                  data-kt-check='true'
                                  data-kt-check-target='.widget-9-check'
                                />
                              </div>
                            </td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='symbol symbol-45px me-5'></div>
                                <div className='d-flex justify-content-start flex-column'>
                                  <span className='fw-semibold d-block fs-7'>{indexValue + 1}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <button className='btn text-dark fw-bold text-hover-primary d-block fs-6'>
                                {yearWiseSubject.subjectName}
                              </button>
                            </td>
                            <td className='text-end'>
                              <div className='d-flex flex-column w-100 me-2'>
                                <div className='d-flex flex-stack mb-2'>
                                  <span className='me-2 fs-7 fw-semibold'>
                                    {yearWiseSubject.subjectCode}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className='text-end'>
                              <div className='d-flex flex-column w-100 me-2'>
                                <div className='d-flex flex-stack mb-2'>
                                  <span className='me-2 fs-7 fw-semibold'>
                                    {yearWiseSubject.fullMarks}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className='text-end'>
                              <div className='d-flex flex-column w-100 me-2'>
                                <div className='d-flex flex-stack mb-2'>
                                  <span className='me-2 fs-7 fw-semibold'>
                                    {yearWiseSubject.passMarks}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className='text-end'>
                              <div className='d-flex flex-column w-100 me-2'>
                                <div className='d-flex flex-stack mb-2'>
                                  <span className='me-2 fs-7 fw-semibold'>
                                    <input
                                      type='text'
                                      name='theory'
                                      className='form-control w-auto'
                                      id={`theory_${yearWiseSubject._id}`}
                                      defaultValue={studentMarks?.theory}
                                      onChange={(e) =>
                                        handleInputChange(
                                          e,
                                          yearWiseSubject._id,
                                          Number(yearWiseSubject.fullMarks)
                                        )
                                      }
                                    />
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className='text-end'>
                              <div className='d-flex flex-column w-100 me-2'>
                                <div className='d-flex flex-stack mb-2'>
                                  <span className='me-2 fs-7 fw-semibold'>
                                    <input
                                      type='text'
                                      name='practical'
                                      className='form-control w-auto'
                                      id={`practical_${yearWiseSubject?._id}`}
                                      defaultValue={studentMarks?.practical}
                                      onChange={(e) =>
                                        handleInputChange(
                                          e,
                                          yearWiseSubject?._id,
                                          Number(yearWiseSubject?.fullMarks)
                                        )
                                      }
                                    />
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className='text-end'>
                              <div className='d-flex flex-column w-100 me-2'>
                                <div className='d-flex flex-stack mb-2'>
                                  <span className='me-2 fs-7 fw-semibold'>
                                    <input
                                      type='number'
                                      name='totalMarks'
                                      className='form-control w-auto'
                                      id={`totalMarks_${yearWiseSubject._id}`}
                                      value={
                                        marksData[yearWiseSubject?._id]?.totalMarks ||
                                        studentMarks?.totalMarks ||
                                        0
                                      }
                                      readOnly
                                    />
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className='text-center d-flex'>
                              <button
                                onClick={() =>
                                  handleEdit(
                                    yearWiseSubject?._id,
                                    yearWiseSubject?.semYear,
                                    yearWiseSubject
                                  )
                                }
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                              >
                                <KTIcon iconName='pencil' className='fs-3' />
                              </button>
                              <button
                                onClick={() => handleDeleteSubject(yearWiseSubject?._id)}
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
                <hr />
                <div className='d-flex align-items-center gap-5'>
                  {(auth.role === 'Admin' || auth.role === 'SuperAdmin') && (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className='btn btn-primary text-uppercase'
                    >
                      {isSubmitting ? 'Marks Added' : 'Submit Marks'}
                    </button>
                  )}
                  <Link
                    to={'/student-result'}
                    target='_blank'
                    className='btn btn-info text-uppercase'
                    // disabled={
                    //   groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]].length === 0
                    // }
                    onClick={(e) => {
                      if (
                        groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]].length === 0
                      ) {
                        toast.error(
                          YearandSemesterSets[activeTab - 1] +
                            ' Please add marks for all the subjects to Check Result'
                        )
                        e.preventDefault() // This will stop the navigation
                        return // This will stop the function execution here
                      }
                      localStorage.setItem(
                        'student-result',
                        JSON.stringify({
                          state: {
                            courseType: YearandSemesterSets[activeTab - 1],
                            data: groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]],
                            studentData: studentData,
                          },
                        })
                      )
                    }}
                  >
                    Result
                  </Link>
                  <Link
                    to={'/print-student-result'}
                    target='_blank'
                    className='btn btn-info text-uppercase'
                    onClick={(e) => {
                      if (
                        groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]].length === 0
                      ) {
                        toast.error(
                          YearandSemesterSets[activeTab - 1] +
                            ' Please add marks for all the subjects to Check Result'
                        )
                        e.preventDefault() // This will stop the navigation
                        return // This will stop the function execution here
                      }

                      localStorage.setItem(
                        'print-student-result',
                        JSON.stringify({
                          state: {
                            courseType: YearandSemesterSets[activeTab - 1],
                            data: groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]],
                            studentData: studentData,
                          },
                        })
                      )
                    }}
                  >
                    Print Result
                  </Link>
                  <button
                    className='btn btn-primary text-uppercase'
                    onClick={() => sendSubjectsEmail(studentSubjectMarksData, studentData)}
                    disabled={isSendingEmail === true}
                  >
                    {isSendingEmail ? 'Sending...' : 'Subject Email'}
                  </button>
                  <button className='btn btn-info text-uppercase' onClick={handleClick}>
                    Add Subject
                  </button>
                </div>
                <hr />
              </>
            )}
          </div>
        </div>
      </div>
      <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
        <div className='mt-9'>
          <EditAddOnSubjects
            semYear={semYear}
            activeTab={activeTab}
            editSubjectId={editSubjectId}
            setOpenModal={setOpenModal}
            subjects={subjects}
            setSubjects={setSubjects}
          />
        </div>
      </PopUpModal>
    </>
  )
}

export default AddOnCourseTable
