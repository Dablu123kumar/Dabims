import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom'
import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'
import {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'
import AddSubjects from './AddSubjects'
import AddOnCourseTable from './AddOnCourseTable'
import { useCourseContext } from '../course/CourseContext'

const CourseStudentSubjectMarks = () => {
  /* =======================
     HOOKS (ALWAYS ON TOP)
  ======================= */
  const navigate = useNavigate()
  const location = useLocation()
  const courseSubjectsCtx = useCourseSubjectContext()

  const [activeTab, setActiveTab] = useState(1)
  const [marksData, setMarksData] = useState({})
  const [selectedCourses, setSelectedCourses] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
   const courseCtx = useCourseContext()

  /* =======================
     SAFE REDIRECT
  ======================= */
  //console.log('location',location?.state)
  const hasState = Boolean(location?.state)
  useEffect(() => {
    if (!hasState) {
      navigate('/students')
    }
  }, [hasState, navigate])

    // console.log('allcourse', courseCtx?.getCourseLists?.data)
  // if (!location?.state) return null

  /* =======================
     DATA
  ======================= */
  const studentId = hasState ? location.state._id : null
  const courseId = hasState ? location?.state?.courseName : null
   const selectedCourse = courseCtx?.getCourseLists?.data?.find((course)=> course?._id === courseId)
   //console.log('selecorse', selectedCourse)
   const selectedCourseCategory = selectedCourse?.category?._id
  /* =======================
     API CALLS
  ======================= */
  const {
    data: courseSubjects,
    isLoading,
    error,
  } = courseSubjectsCtx.useSubjectsBasedOnCourse(courseId)

  const {
    data: studentSubjectsData,
    isLoading: studentLoading,
  } = courseSubjectsCtx.useGetStudentSubjects(studentId, courseId)

  /* =======================
     PREPARE STATE
  ======================= */
  useEffect(() => {
    if (!courseSubjects || !studentSubjectsData) return

    const marks = {}
    const selected = {}

    courseSubjects.forEach((subject) => {
      const id = subject._id?.toString()
      selected[id] = false
      marks[id] = {
        theory: 0,
        practical: 0,
        totalMarks: 0,
      }
    })

//  console.log('subjectdata',studentSubjectsData)
    /// overwrite if student already has marks
    studentSubjectsData?.data?.[0]?.subjects?.forEach((item)=>{
      //console.log('id',item.subject._id)
      const id  = item?.subject?._id?.toString() || item.subject?.toString()
      // const id = typeof item.subject === 'object' ? item.subject._id : item.subject
      if(!id) return;
      selected[id] = true
      marks[id] = {
        theory : item.theory ||  0,
        practical : item.practical || 0,
        totalMarks : (item.theory + item.practical) || 0,
      }
     
    })

    setMarksData(marks)
    setSelectedCourses(selected)
  }, [ courseSubjects , studentSubjectsData])

  /* =======================
     SEMESTER GROUPING
  ======================= */
  const YearandSemesterSets = Array.from(
    new Set(courseSubjects?.map((s) => s.semYear) || [])
  )

  const groupSubjectsBySemester = YearandSemesterSets.reduce((acc, sem) => {
    acc[sem] = courseSubjects?.filter((s) => s.semYear === sem) || []
    return acc
  }, {})

  /* =======================
     HANDLERS
  ======================= */
    const handleClick = () => {
    setOpenModal(true)
  }

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  const handleCheckBoxChange = (idOrE, eOrId) => {
   let id, checked
   if(typeof idOrE === 'string'){
    id = idOrE
    checked = eOrId.target.checked
   }
   else{
    id = eOrId
    checked = idOrE.target.checked
   }
    setSelectedCourses((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  const handleInputChange = (e, id) => {
    const {name, value} = e.target
    const val = parseInt(value) || 0

    setMarksData((prev) => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          [name]: val,
        },
      }
      updated[id].totalMarks =
        (updated[id].theory || 0) + (updated[id].practical || 0)

      return updated
    })
  }

  const handleSubmit = () => {
   const payload = Object.entries(marksData)
  .filter(([id]) => selectedCourses[id])
  .map(([id, data]) => ({
    subjectId: id,
    ...data,
  }))

    if (!payload.length) {
      toast.error('Select at least one subject')
      return
    }

    setIsSubmitting(true)
     const subjectIds = payload.map((item)=> item.subjectId)
     const hasMarks = payload.some((item)=> item.theory > 0 || item.practical > 0)
      if(!hasMarks){
        courseSubjectsCtx.addSubjectsToStudentMutation.mutate(
          {
          studentId,courseId,subjectIds,courseCategoryId:selectedCourseCategory, companyName:location?.state?.companyName?._id
        },
        {
        
        onSettled: () => setIsSubmitting(false),
      }
      )
      }
      else{
            courseSubjectsCtx.updateStudentBulkSubjectMarksMutation.mutate(
      {
        studentId,
        courseId,
        subjects: payload,
      },
      {
        onSettled: () => setIsSubmitting(false),
      }
    )
      }
   
    

  
  }
  if(!hasState) return null;
  //console.log('coursedata',courseSubjects)
  //console.log('studentdata',studentSubjectsData)


  /* =======================
     UI
  ======================= */
  return (

        <>
      <div className='card'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Course Subjects Results</span>
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
                      onClick={() => setActiveTab(i + 1)}
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
                    {
                    
                    // data
                    //   ?.filter((subject) => {
                    //     // Exclude subjects where AddOnSubjects === "AddOnSubject"
                    //     if (subject?.AddOnSubjects === 'AddOnSubject') {
                    //       return false
                    //     }
                    //     // Check if semYear matches the active tab's YearandSemesterSets
                    //     return subject.semYear === YearandSemesterSets[activeTab - 1]
                    //   })
                    //   ?.map((yearWiseSubject, indexValue) => {
                    //     // Find the student's marks data for this subject
                    //     const studentMarks = studentSubjectMarksData?.find(
                    //       (singleStudentMarksData) =>
                    //         singleStudentMarksData?.Subjects?._id === yearWiseSubject?._id
                    //     )

                        groupSubjectsBySemester[
                    YearandSemesterSets[activeTab - 1]
                  ]?.map((yearWiseSubject,indexValue)=>{
                        // console.log(studentMarks)
                        // console.log(studentMarks?.subjects[yearWiseSubject._id])
                        // Check if the subject ID exists in the `subjects` object and get its value (true/false)
                        // console.log(selectedCourses?.subjects?.[yearWiseSubject?._id])
                        
                         

                        return (
                          <tr key={yearWiseSubject._id.toString()}>
                            <td className='w-25px'>
                              <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input
                                  className='form-check-input'
                                  type='checkbox'
                                  onChange={(event) =>
                                    handleCheckBoxChange(yearWiseSubject?._id, event)
                                  }
                                  value={yearWiseSubject?._id}
                                  checked={!!selectedCourses[yearWiseSubject?._id] || false}
                                  // data-kt-check='true'
                                  // data-kt-check-target='.widget-9-check'
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
                                      value={marksData[yearWiseSubject._id]?.theory }
                                      // defaultValue={marksData[yearWiseSubject?._id]?.theory}
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
                                      id={`practical_${yearWiseSubject._id}`}
                                      value={marksData[yearWiseSubject._id]?.practical}
                                      // defaultValue={marksData[yearWiseSubject._id]?.practical }
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
                                      type='number'
                                      name='totalMarks'
                                      className='form-control w-auto'
                                      id={`totalMarks_${yearWiseSubject._id}`}
                                      value={
                                        marksData[yearWiseSubject._id]?.totalMarks ||
                                        yearWiseSubject?.totalMarks ||
                                        0
                                      }
                                      readOnly
                                    />
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
                
                {/* <hr />
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
                          },
                        })
                      )
                    }}
                  >
                    Print Result
                  </Link>
                  <button className='btn btn-primary text-uppercase'>Send Email</button>
                  <button className='btn btn-info text-uppercase' onClick={handleClick}>
                    Add Subject
                  </button>
                </div>
                <hr /> */}

              </>
            )}
          </div>
        </div>
      </div>
      <div className='mt-10'>
        <AddOnCourseTable
          handleCheckBoxChange={handleCheckBoxChange}
          selectedCourses={selectedCourses}
           handleClick={handleClick}
          handleSubmit={handleSubmit}
           data={courseSubjects}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          error={error}
          groupSubjectsBySemester={groupSubjectsBySemester}
          marksData={marksData}
          activeTab={activeTab}
          setOpenModal={setOpenModal}
          YearandSemesterSets={YearandSemesterSets}
          studentSubjectMarksData={studentSubjectsData}
          handleTabClick={handleTabClick}
          handleInputChange={handleInputChange}
          studentData={location?.state}
        />
      </div>
      {
        <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
          <div className='mt-9'>
            <AddSubjects
              setOpenModal={setOpenModal}
              studentId={location?.state?._id}
              semYear={[YearandSemesterSets[activeTab - 1]]}
            />
          </div>
        </PopUpModal>
      }
    </>
    // <>
    //   <div className='card'>
    //     <div className='card-header'>
    //       <h3>
    //         Student: {location.state.name}
    //       </h3>
    //     </div>

    //     <div className='card-body'>
    //       {isLoading || studentLoading ? (
    //         <div>Loading...</div>
    //       ) : error ? (
    //         <div>Error loading subjects</div>
    //       ) : (
    //         <>
    //           <ul className='nav mb-4'>
    //             {YearandSemesterSets.map((sem, i) => (
    //               <li key={sem}>
    //                 <NavLink
    //                   className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary ${
    //                     activeTab === i + 1 ? 'active bg-red' : ''
    //                   }`}
    //                   data-bs-toggle='tab'
    //                   to={`#kt_table_widget_5_tab_${i + 1}`}
    //                   onClick={() => setActiveTab(i + 1)}
    //                 >
    //                   {sem}
    //                 </NavLink>
    //               </li>
    //             ))}
    //           </ul>

    //           <table className='table'>
    //             <thead>
    //               <tr>
    //                 <th></th>
    //                 <th>Subject</th>
    //                 <th>Theory</th>
    //                 <th>Practical</th>
    //                 <th>Total</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {groupSubjectsBySemester[
    //                 YearandSemesterSets[activeTab - 1]
    //               ]?.map((subject) => (
    //                 <tr key={subject._id}>
    //                   <td>
    //                     <input
    //                       type='checkbox'
    //                       checked={selectedCourses[subject._id] || false}
    //                       onChange={(e) =>
    //                         handleCheckBoxChange(subject._id, e)
    //                       }
    //                     />
    //                   </td>
    //                   <td>{subject.subjectName}</td>
    //                   <td>
    //                     <input
    //                       type='number'
    //                       value={marksData[subject._id]?.theory || 0}
    //                       onChange={(e) =>
    //                         handleInputChange(e, subject._id)
    //                       }
    //                     />
    //                   </td>
    //                   <td>
    //                     <input
    //                       type='number'
    //                       value={marksData[subject._id]?.practical || 0}
    //                       onChange={(e) =>
    //                         handleInputChange(e, subject._id)
    //                       }
    //                     />
    //                   </td>
    //                   <td>
    //                     {marksData[subject._id]?.totalMarks || 0}
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>

    //           {(auth.role === 'Admin' || auth.role === 'SuperAdmin') && (
    //             <button
    //               className='btn btn-primary'
    //               onClick={handleSubmit}
    //               disabled={isSubmitting}
    //             >
    //               Submit Marks
    //             </button>
    //           )}
    //         </>
    //       )}
    //     </div>
    //   </div>

    //   <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
    //     <AddSubjects
    //       studentId={studentId}
    //       courseId={courseId}
    //       setOpenModal={setOpenModal}
    //     />
    //   </PopUpModal>
    // </>
  )
}

export default CourseStudentSubjectMarks

// import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom'
// import {useCourseSubjectContext} from '../course/course_subject/CourseSubjectContext'
// import {useState, useEffect} from 'react'
// import {useAuth} from '../../modules/auth'
// import {toast} from 'react-toastify'
// import PopUpModal from '../../modules/accounts/components/popUpModal/PopUpModal'
// import AddSubjects from './AddSubjects'
// import AddOnCourseTable from './AddOnCourseTable'
// import StudentMarksResult from './StudentMarksResult'
// import PrintStudentResult from './PrintStudentResult'

// const CourseStudentSubjectMarks = () => {
//   const courseSubjectsCtx = useCourseSubjectContext()
//   const [activeTab, setActiveTab] = useState(1)
//   const [marksData, setMarksData] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [openModal, setOpenModal] = useState(false)
//   const location = useLocation()
//   const navigate = useNavigate()
//   const {auth} = useAuth()

//   const [selectedCourses, setSelectedCourses] = useState({})
//   //console.log(location?.state?.courseName._id === undefined)
//   // console.log(location?.state)
//   // console.log(marksData)
//   // console.log(selectedCourses)

//   const {data, error, isLoading} = courseSubjectsCtx.useSubjectsBasedOnCourse(
//     location?.state?.courseName?._id === undefined
//       ? location?.state?.courseName
//       : location?.state?.courseName?._id
//   )

//   // console.log(data)

//   // console.log(location?.state?.updateUserId)

//   const {
//     data: studentSubjectMarksData,
//     error: studentSubjectMarksError,
//     isLoading: studentSubjectMarksIsLoading,
//   } = courseSubjectsCtx.useGetStudentSubjectsMarksBasedOnCourse(location?.state?._id)

//   // console.log(studentSubjectMarksData)

//   useEffect(() => {
//     if (studentSubjectMarksData) {
//       const initialMarksData = studentSubjectMarksData.reduce((acc, marksData) => {
//         acc[marksData?.Subjects?._id] = {
//           theory: marksData.theory,
//           practical: marksData.practical,
//           totalMarks: marksData.theory + marksData.practical,
//         }
//         return acc
//       }, {})

//       const studentSubjectSuggestion = studentSubjectMarksData
//         ?.filter((stud) => stud?.studentInfo?._id === location?.state?._id)
//         .map((data) => data)

//       // console.log(studentSubjectSuggestion)

//       setSelectedCourses({
//         ...studentSubjectSuggestion?.[0]?.subjects,
//       })
//       setMarksData(initialMarksData)
//     }
//   }, [studentSubjectMarksData, studentSubjectMarksData?.studentInfo?._id])

//   if (location?.state === undefined) {
//     navigate(-1)
//     return null
//   }

//   const YearandSemesterSets = Array.from(new Set(data?.map((item) => item?.semYear) || []))

//   const handleClick = () => {
//     setOpenModal(true)
//   }

//   const handleTabClick = (index) => {
//     setActiveTab(index)
//   }

//   const handleInputChange = (e, id, fullMarks) => {
//     const {name, value} = e.target
//     const parsedValue = parseInt(value) || 0
//     // console.log(id)

//     setMarksData((prev) => {
//       const updatedData = {
//         ...prev,
//         [id]: {
//           ...prev[id],
//           [name]: parsedValue,
//         },
//       }
//       const theory = updatedData[id]?.theory || 0
//       const practical = updatedData[id]?.practical || 0

//       updatedData[id].totalMarks = theory + practical

//       return updatedData
//     })
//   }

//   // console.log(marksData)

//   const handleCheckBoxChange = (id, event) => {
//     const isChecked = event.target.checked // Determine if the checkbox is checked

//     setSelectedCourses((prevState) => {
//       // Update the selectedCourses state by toggling the value for the clicked checkbox
//       const updatedState = {
//         ...prevState,
//         [id]: isChecked, // Set the checkbox value (true/false)
//       }

//       // Return the updated state object
//       return updatedState
//     })
//   }

//   // console.log(marksData)

//   const filterData =
//     data?.filter((data) => {
//       // Ensure the filter logic includes the required conditions
//       return data.studentInfo && data.AddOnSubjects !== 'AddOnSubject'
//     }).length > 0

//   const handleSubmit = async () => {
//     try {
//       setIsSubmitting(true)
//       Object.keys(marksData)
//         .filter((id) => selectedCourses[id] === true)
//         .map((id) =>
//           courseSubjectsCtx.updateCourseSubjectMarksMutation.mutate({
//             subjectId: id,
//             ...marksData[id],
//             subjects: selectedCourses,
//             courseId:
//               location?.state?.courseName._id === undefined
//                 ? location?.state?.courseName
//                 : location?.state?.courseName._id,
//             studentId: location.state._id,
//             companyName: location.state.companyName,
//           })
//         )

//       toast.success('Added marks successfully!', {
//         style: {
//           fontSize: '16px',
//         },
//       })
//     } catch (error) {
//       //console.log(error)
//       toast.error('Error adding marks', {
//         style: {
//           fontSize: '16px',
//         },
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const groupSubjectsBySemester = YearandSemesterSets.reduce((acc, semYear) => {
//     // console.log(semYear)
//     acc[semYear] =
//       studentSubjectMarksData?.filter((subject) => subject?.Subjects?.semYear === semYear) || []
//     return acc
//   }, {})

//   // console.log()
//   // console.log(
//   //   YearandSemesterSets[activeTab - 1],
//   //   groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]].length
//   // )
//   //console.log(studentSubjectMarksData)

//   const checkStudentMarksFillHandler = () => {
//     if (groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]].length === 0) {
//       window.alert(YearandSemesterSets[activeTab - 1] + ' Please add marks for all the subjects')
//       return false
//     }
//   }

//   return (
//     <>
//       <div className='card'>
//         <div className='card-header border-0 pt-5'>
//           <h3 className='card-title align-items-start flex-column'>
//             <span className='card-label fw-bold fs-3 mb-1'>Course Subjects Results</span>
//             <span className=' mt-1 fw-semibold fs-7'>Student Name : {location?.state?.name}</span>
//           </h3>

//           <div className='card-toolbar'>
//             <ul className='nav p-5'>
//               {YearandSemesterSets.length > 0 &&
//                 YearandSemesterSets.map((itemSubject, i) => (
//                   <li key={i} style={{borderBottom: activeTab === i + 1 ? '2px solid red' : ''}}>
//                     <NavLink
//                       className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary ${
//                         activeTab === i + 1 ? 'active bg-red' : ''
//                       }`}
//                       data-bs-toggle='tab'
//                       to={`#kt_table_widget_5_tab_${i + 1}`}
//                       onClick={() => handleTabClick(i + 1)}
//                     >
//                       {itemSubject}
//                     </NavLink>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </div>

//         <div className='card-body py-3'>
//           <div className='table-responsive'>
//             {isLoading ? (
//               <div>Loading...</div>
//             ) : error ? (
//               <div>Error loading data</div>
//             ) : (
//               <>
//                 <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
//                   <thead>
//                     <tr className='fw-bold '>
//                       <th className='w-25px'>
//                         <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
//                       </th>
//                       <th className='min-w-100px'>Sr.No</th>
//                       {/* <th className='min-w-100px'></th> */}
//                       <th className='min-w-120px'>Subject Name</th>
//                       <th className='min-w-120px'>Subject Code</th>
//                       <th className='min-w-140px'>Full Marks</th>
//                       <th className='min-w-140px'>Pass Marks</th>
//                       <th className='min-w-140px'>Theory</th>
//                       <th className='min-w-120px'>Practical</th>
//                       <th className='min-w-120px'>Total Marks</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data
//                       ?.filter((subject) => {
//                         // Exclude subjects where AddOnSubjects === "AddOnSubject"
//                         if (subject?.AddOnSubjects === 'AddOnSubject') {
//                           return false
//                         }
//                         // Check if semYear matches the active tab's YearandSemesterSets
//                         return subject.semYear === YearandSemesterSets[activeTab - 1]
//                       })
//                       ?.map((yearWiseSubject, indexValue) => {
//                         // Find the student's marks data for this subject
//                         const studentMarks = studentSubjectMarksData?.find(
//                           (singleStudentMarksData) =>
//                             singleStudentMarksData?.Subjects?._id === yearWiseSubject?._id
//                         )
//                         // console.log(studentMarks)
//                         // console.log(studentMarks?.subjects[yearWiseSubject._id])
//                         // Check if the subject ID exists in the `subjects` object and get its value (true/false)
//                         // console.log(selectedCourses?.subjects?.[yearWiseSubject?._id])

//                         return (
//                           <tr key={yearWiseSubject._id}>
//                             <td className='w-25px'>
//                               <div className='form-check form-check-sm form-check-custom form-check-solid'>
//                                 <input
//                                   className='form-check-input'
//                                   type='checkbox'
//                                   onChange={(event) =>
//                                     handleCheckBoxChange(yearWiseSubject?._id, event)
//                                   }
//                                   value={yearWiseSubject?._id}
//                                   checked={selectedCourses?.[yearWiseSubject?._id] || false}
//                                   data-kt-check='true'
//                                   data-kt-check-target='.widget-9-check'
//                                 />
//                               </div>
//                             </td>
//                             <td>
//                               <div className='d-flex align-items-center'>
//                                 <div className='symbol symbol-45px me-5'></div>
//                                 <div className='d-flex justify-content-start flex-column'>
//                                   <span className='fw-semibold d-block fs-7'>{indexValue + 1}</span>
//                                 </div>
//                               </div>
//                             </td>

//                             <td>
//                               <button className='btn text-dark fw-bold text-hover-primary d-block fs-6'>
//                                 {yearWiseSubject.subjectName}
//                               </button>
//                             </td>
//                             <td className='text-end'>
//                               <div className='d-flex flex-column w-100 me-2'>
//                                 <div className='d-flex flex-stack mb-2'>
//                                   <span className='me-2 fs-7 fw-semibold'>
//                                     {yearWiseSubject.subjectCode}
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className='text-end'>
//                               <div className='d-flex flex-column w-100 me-2'>
//                                 <div className='d-flex flex-stack mb-2'>
//                                   <span className='me-2 fs-7 fw-semibold'>
//                                     {yearWiseSubject.fullMarks}
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className='text-end'>
//                               <div className='d-flex flex-column w-100 me-2'>
//                                 <div className='d-flex flex-stack mb-2'>
//                                   <span className='me-2 fs-7 fw-semibold'>
//                                     {yearWiseSubject.passMarks}
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className='text-end'>
//                               <div className='d-flex flex-column w-100 me-2'>
//                                 <div className='d-flex flex-stack mb-2'>
//                                   <span className='me-2 fs-7 fw-semibold'>
//                                     <input
//                                       type='text'
//                                       name='theory'
//                                       className='form-control w-auto'
//                                       id={`theory_${yearWiseSubject._id}`}
//                                       defaultValue={studentMarks?.theory || 0}
//                                       onChange={(e) =>
//                                         handleInputChange(
//                                           e,
//                                           yearWiseSubject._id,
//                                           Number(yearWiseSubject.fullMarks)
//                                         )
//                                       }
//                                     />
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className='text-end'>
//                               <div className='d-flex flex-column w-100 me-2'>
//                                 <div className='d-flex flex-stack mb-2'>
//                                   <span className='me-2 fs-7 fw-semibold'>
//                                     <input
//                                       type='text'
//                                       name='practical'
//                                       className='form-control w-auto'
//                                       id={`practical_${yearWiseSubject._id}`}
//                                       defaultValue={studentMarks?.practical || 0}
//                                       onChange={(e) =>
//                                         handleInputChange(
//                                           e,
//                                           yearWiseSubject._id,
//                                           Number(yearWiseSubject.fullMarks)
//                                         )
//                                       }
//                                     />
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className='text-end'>
//                               <div className='d-flex flex-column w-100 me-2'>
//                                 <div className='d-flex flex-stack mb-2'>
//                                   <span className='me-2 fs-7 fw-semibold'>
//                                     <input
//                                       type='number'
//                                       name='totalMarks'
//                                       className='form-control w-auto'
//                                       id={`totalMarks_${yearWiseSubject._id}`}
//                                       value={
//                                         marksData[yearWiseSubject._id]?.totalMarks ||
//                                         studentMarks?.totalMarks ||
//                                         0
//                                       }
//                                       readOnly
//                                     />
//                                   </span>
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         )
//                       })}
//                   </tbody>
//                 </table>
//                 {/*
//                 <hr />
//                 <div className='d-flex align-items-center gap-5'>
//                   {(auth.role === 'Admin' || auth.role === 'SuperAdmin') && (
//                     <button
//                       onClick={handleSubmit}
//                       disabled={isSubmitting}
//                       className='btn btn-primary text-uppercase'
//                     >
//                       {isSubmitting ? 'Marks Added' : 'Submit Marks'}
//                     </button>
//                   )}
//                   <Link
//                     to={'/student-result'}
//                     target='_blank'
//                     className='btn btn-info text-uppercase'
//                     // disabled={
//                     //   groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]].length === 0
//                     // }
//                     onClick={(e) => {
//                       if (
//                         groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]].length === 0
//                       ) {
//                         toast.error(
//                           YearandSemesterSets[activeTab - 1] +
//                             ' Please add marks for all the subjects to Check Result'
//                         )
//                         e.preventDefault() // This will stop the navigation
//                         return // This will stop the function execution here
//                       }
//                       localStorage.setItem(
//                         'student-result',
//                         JSON.stringify({
//                           state: {
//                             courseType: YearandSemesterSets[activeTab - 1],
//                             data: groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]],
//                           },
//                         })
//                       )
//                     }}
//                   >
//                     Result
//                   </Link>
//                   <Link
//                     to={'/print-student-result'}
//                     target='_blank'
//                     className='btn btn-info text-uppercase'
//                     onClick={(e) => {
//                       if (
//                         groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]].length === 0
//                       ) {
//                         toast.error(
//                           YearandSemesterSets[activeTab - 1] +
//                             ' Please add marks for all the subjects to Check Result'
//                         )
//                         e.preventDefault() // This will stop the navigation
//                         return // This will stop the function execution here
//                       }

//                       localStorage.setItem(
//                         'print-student-result',
//                         JSON.stringify({
//                           state: {
//                             courseType: YearandSemesterSets[activeTab - 1],
//                             data: groupSubjectsBySemester[YearandSemesterSets[activeTab - 1]],
//                           },
//                         })
//                       )
//                     }}
//                   >
//                     Print Result
//                   </Link>
//                   <button className='btn btn-primary text-uppercase'>Send Email</button>
//                   <button className='btn btn-info text-uppercase' onClick={handleClick}>
//                     Add Subject
//                   </button>
//                 </div>
//                 <hr /> */}

//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className='mt-10'>
//         <AddOnCourseTable
//           handleCheckBoxChange={handleCheckBoxChange}
//           selectedCourses={selectedCourses}
//           handleClick={handleClick}
//           handleSubmit={handleSubmit}
//           data={data}
//           isSubmitting={isSubmitting}
//           isLoading={isLoading}
//           error={error}
//           groupSubjectsBySemester={groupSubjectsBySemester}
//           marksData={marksData}
//           activeTab={activeTab}
//           setOpenModal={setOpenModal}
//           YearandSemesterSets={YearandSemesterSets}
//           studentSubjectMarksData={studentSubjectMarksData}
//           handleTabClick={handleTabClick}
//           handleInputChange={handleInputChange}
//           studentData={location?.state}
//         />
//       </div>
//       {
//         <PopUpModal show={openModal} handleClose={() => setOpenModal(false)}>
//           <div className='mt-9'>
//             <AddSubjects
//               setOpenModal={setOpenModal}
//               studentId={location?.state?._id}
//               semYear={[YearandSemesterSets[activeTab - 1]]}
//             />
//           </div>
//         </PopUpModal>
//       }
//     </>
//   )
// }

// export default CourseStudentSubjectMarks
