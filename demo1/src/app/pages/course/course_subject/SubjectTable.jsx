import {Fragment, useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import SubjectTableRead from './SubjectTableRead'
import AddSubjectForm from './AddSubjectForm'
import EditSubjectForm from './EditSubjectForm'
import {useCourseSubjectContext} from './CourseSubjectContext'

const SubjectTable = ({className, yearWiseAndSemster, activeTab, editCourse}) => {
  //console.log(yearWiseAndSemster.split(' ')[0] + ' ' + activeTab)
  const ctx = useCourseSubjectContext()
  const subjects = ctx.getCourseSubjectLists.data

  //console.log(editCourse?.courseName, ctx.getCourseSubjectLists.data[0].course.courseName)

  const [newSubject, setNewSubject] = useState({
    subjectName: '',
    subjectCode: '',
    fullMarks: 0,
    passMarks: 0,
  })

  //console.log(ctx.createCourseSubjectMutation)

  const [editSubjectId, setEditSubjectId] = useState(null)
  //console.log(editSubjectId)

  const [editSubject, setEditSubject] = useState({})
  //console.log(editSubject)

  const [AddSubjectFromToggle, setAddSubjectFormToggle] = useState(false)
  //console.log(newSubject)

  const handleAddNewSubject = (e) => {
    e.preventDefault()
    ctx.createCourseSubjectMutation.mutate({
      ...newSubject,
      course: JSON.parse(localStorage.getItem('AddedNewCourse'))?._id,
      courseType: JSON.parse(localStorage.getItem('AddedNewCourse'))?.courseType,
      semYear: yearWiseAndSemster.split(' ')[0] + ' ' + activeTab,
    })
    setAddSubjectFormToggle(false)
    setNewSubject({subjectName: '', subjectCode: '', fullMarks: 0, passMarks: 0})
  }

  const handleDeleteSubject = (id) => {
    ctx.deleteCourseSubjectMutation.mutate(id)
  }
  //console.log(editCourse)
  const handleEditSubject = (e) => {
    e.preventDefault()

    let updatedData = {
      _id: editSubjectId,
      subjectName: editSubject.subjectName,
      subjectCode: editSubject.subjectCode,
      fullMarks: editSubject.fullMarks,
      passMarks: editSubject.passMarks,
      course: editCourse?._id,
      courseType: editCourse?.courseType,
      semYear: yearWiseAndSemster.split(' ')[0] + ' ' + activeTab,
    }
    ctx.updateCourseCategoryMutation.mutate(updatedData)
    //console.log(updatedData)
    setEditSubjectId(null)
  }

  return (
    <>
      <div className='card'>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <button
              onClick={() => setAddSubjectFormToggle((prev) => !prev)}
              type='button'
              className='btn btn-sm btn-light-primary'
            >
              <KTIcon iconName='plus' className='fs-3' />
              Add Subjects
            </button>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            <form onSubmit={AddSubjectFromToggle ? handleAddNewSubject : handleEditSubject}>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bold text-muted'>
                    <th className='w-25px'>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                    </th>
                    <th className='min-w-150px'>SR.</th>
                    <th className='min-w-150px'>Subject Name</th>
                    <th className='min-w-140px'>Subject Code</th>
                    <th className='min-w-120px'>Full Marks</th>
                    <th className='min-w-120px'>Pass Marks</th>
                    <th className='min-w-120px'>Added By</th>
                    <th className='min-w-120px'>Date</th>
                    <th className='min-w-100px text-end'>Actions</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {AddSubjectFromToggle && (
                    <AddSubjectForm
                      setAddSubjectFormToggle={setAddSubjectFormToggle}
                      newSubject={newSubject}
                      setNewSubject={setNewSubject}
                    />
                  )}
                  {subjects
                    .filter((subject) => {
                      const semester = parseInt(subject?.semYear.split(' ')[1])
                      if (subject?.AddOnSubjects === 'AddOnSubject') {
                        return false
                      }
                      //console.log(editCourse?.courseName === subject.course.courseName)
                      // Check if the semester matches the activeTab
                      return (
                        subject?.semYear === yearWiseAndSemster.split(' ')[0] + ' ' + activeTab &&
                        (Object.keys(editCourse).length > 0
                          ? editCourse?.courseName
                          : JSON.parse(localStorage.getItem('AddedNewCourse'))?.courseName) ===
                          subject.course?.courseName
                      )
                    })
                    ?.map((subject, index) => (
                      <Fragment key={subject?._id}>
                        {editSubjectId === subject?._id ? (
                          <EditSubjectForm
                            editSubject={editSubject}
                            setEditSubject={setEditSubject}
                            setEditSubjectId={setEditSubjectId}
                          />
                        ) : (
                          <SubjectTableRead
                            index={index}
                            subject={subject}
                            key={subject?._id}
                            setEditSubjectId={setEditSubjectId}
                            setEditSubject={setEditSubject}
                            handleDeleteSubject={handleDeleteSubject}
                          />
                        )}
                      </Fragment>
                    ))}
                </tbody>
                {/* end::Table body */}
              </table>
            </form>
            {/* begin::Table */}
            {/* end::Table */}
          </div>
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
    </>
  )
}
export default SubjectTable
