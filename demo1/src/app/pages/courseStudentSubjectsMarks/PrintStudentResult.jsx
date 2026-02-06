import {useLocation} from 'react-router-dom'
import moment from 'moment'
import './PrintStudentMarksResult.css' // Assuming you have a CSS file for styling
import {useState} from 'react'

const BASE_URL = process.env.REACT_APP_BASE_URL

const PrintStudentResult = () => {
  const location = useLocation()
  const [studentMarksResultData, setStudentMarksResultData] = useState(
     JSON.parse(localStorage.getItem('print-student-result')) || JSON.parse(localStorage.getItem('student-result')) || {}
  )
   console.log('studentdata', studentMarksResultData.state)

  // console.log(location)

  const handlePrint = () => {
    var actContents = document.body.innerHTML
    document.body.innerHTML = actContents
    window.print()
  }

  const singleStudentId = studentMarksResultData.state?.data?.data[0]?.studentInfo?._id

  const singleStudentData = studentMarksResultData?.state?.studentData
 
  // const singleStudentData = studentMarksResultData?.state?.data?.filter(
  //   (stud) => stud?.studentInfo?._id === singleStudentId
  // )

   console.log('signlestudeta', singleStudentData)

  const filteredAndSortedSubjects =
    studentMarksResultData.state.data.data[0].subjects &&
    studentMarksResultData.state.data.data[0].subjects
      ?.filter((item) => {
        // Check if the subject is true in the subjects object
        //console.log('item',item)
        return (
          item?.isActive === true
        )
      })
      ?.sort((a, b) => {
        // Extract the numeric part of the subjectCode and sort accordingly
        //console.log("a",a)
        const codeA = parseInt(a?.subject?.subjectCode?.split('-')[1], 10)
        const codeB = parseInt(b?.subject?.subjectCode?.split('-')[1], 10)
        return codeA - codeB
      })
//console.log(filteredAndSortedSubjects)
  const calculateTotalMarks = filteredAndSortedSubjects?.reduce(
    (acc, cur) => {
      return {
        maxMarksTotals: Number(acc?.maxMarksTotals) + Number(cur?.subject?.fullMarks),
        passMarksTotals: Number(acc?.passMarksTotals) + Number(cur?.totalMarks),
      }
    },
    {
      maxMarksTotals: 0,
      passMarksTotals: 0,
    }
  )
 // console.log(calculateTotalMarks)

  return (
    <>
      <div className='bground'>
        {/* <img src='/letterhead.jpg' className='letterHeadImage' /> */}
        <div className='letterHeadImage'></div>
        <table width='800px' cellPadding='0' cellSpacing='0'>
          <tbody>
            <tr>
              <td>
                <table
                  width='98%'
                  cellPadding='0'
                  cellSpacing='0'
                  className='marks'
                  border='1'
                  style={{marginTop: '5%'}}
                >
                  <thead>
                    <tr>
                      <th>ROLL NO</th>
                      <th>EXAM TYPE</th>
                      <th>SEMESTER/YEAR</th>
                      <th>CERTIFICATE NO.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{borderRight: '1px solid black'}}>
                        RN-{singleStudentData?.rollNumber}
                      </td>
                      <td style={{borderRight: '1px solid black'}}>
                        {studentMarksResultData?.state?.courseType}
                      </td>
                      <td style={{borderRight: '1px solid black'}}>
                        {studentMarksResultData?.state?.courseType.split(' ')[0]}
                      </td>
                      <td>
                        CN-
                        {singleStudentData?.rollNumber}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{display: 'flex', alignItems: 'center'}}>
                <table width='100%' cellPadding='0' cellSpacing='0' className='stu-details'>
                  <tbody>
                    <tr>
                      <td width='25%'>&nbsp; </td>
                      <td width='75%'>&nbsp;</td>
                    </tr>
                    <tr>
                      <td width='25%'>This is to certify That</td>
                      <td width='75%'>{singleStudentData?.name}</td>
                    </tr>
                    <tr>
                      <td width='25%'>Course Name</td>
                      <td width='75%'>{studentMarksResultData.state.data.data[0].course.courseName}</td>
                    </tr>
                    <tr>
                      <td>
                        <small>Father's Name</small>
                      </td>
                      <td>{singleStudentData?.father_name}</td>
                    </tr>
                    <tr>
                      <td>
                        <small>Date of Birth</small>
                      </td>
                      <td>
                        {moment(singleStudentData?.date_of_birth).format(
                          'DD/MM/YYYY'
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <img
                  style={{marginRight: '30px', borderRadius: '10px'}}
                  width={100}
                  src={`${BASE_URL}/api/images/${singleStudentData?.image}`}
                  alt='student image'
                />
              </td>
            </tr>
            <tr>
              <td>
                <table className='marks' width='98%' cellPadding='0' cellSpacing='0' border='1'>
                  <thead>
                    <tr>
                      <th width='15%' rowSpan='2' align='center' className='line'>
                        <br />
                        SUB.
                        <br />
                        CODE
                      </th>
                      <th width='30%' rowSpan='2' align='center' className='line'>
                        <br />
                        SUBJECT
                      </th>
                      <th rowSpan='2' align='center' className='line'>
                        <br />
                        MAX MARKS
                      </th>
                      <th colSpan='4' align='center' className='line'>
                        MARKS OBTAINED
                      </th>
                    </tr>
                    <tr>
                      <th align='center' className='line'>
                        PRACTICAL
                      </th>
                      <th align='center' className='line'>
                        THEORY
                      </th>

                      <th align='center' className='line'>
                        TOTAL
                      </th>
                      {/* <th width='12%' align='center' className='line'>
                        <br />
                        POSITIONAL GRADE
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedSubjects &&
                      filteredAndSortedSubjects?.map((marksStudentData) => {
                        // console.log(marksStudentData)
                        return (
                          <tr key={marksStudentData._id} style={{borderBottom: '1px solid black'}}>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.subject.subjectCode}
                            </td>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.subject.subjectName}
                            </td>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.subject.fullMarks}
                            </td>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.practical}
                            </td>
                            <td style={{borderRight: '1px solid black'}} align='center'>
                              {marksStudentData.theory}
                            </td>

                            <td align='center'>{marksStudentData.totalMarks}</td>

                            {/* <td align='center'>A</td> */}
                          </tr>
                        )
                      })}
                    <tr>
                      <td align='center' colSpan='2'>
                        <strong>Total Marks</strong>
                      </td>
                      <td align='center'>{calculateTotalMarks.maxMarksTotals}</td>
                      <td align='center'>-</td>
                      <td align='center'>-</td>
                      <td align='center'>{calculateTotalMarks.passMarksTotals}</td>
                      <td align='center'>-</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table width='98%' cellPadding='0' cellSpacing='0' className='stu-details'>
                  <tbody>
                    <tr>
                      <td width='14%'>
                        <h1>Grade:</h1>
                      </td>
                      <td width='21%' className='division'>
                        <h1>B</h1>
                      </td>
                      <td width='35%'>&nbsp;</td>
                      <td width='30%' rowSpan='4' align='center' valign='bottom'>
                        <img
                          src='/signature (1).png'
                          width='30%'
                          alt='secretary-sign'
                          title='Secretary Sign'
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan='2' className='line'>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td colSpan='2' className='line'>
                        &nbsp;
                      </td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td className='line'>&nbsp;</td>
                      <td>
                        <span className='line'>&nbsp;</span>
                      </td>
                      <td rowSpan='2' align='center'>
                        <img src='/VMS.png' width='40%' alt='qr' title='Website QR' />
                      </td>
                    </tr>
                    <tr>
                      <td className='line'>Dated:</td>
                      <td>{moment(Date.now()).format('DD/MM/YYYY')}</td>
                      <td align='center'>Controller of Examination</td>
                    </tr>
                    {/* <input value='Print' type='button' onClick={handlePrint} /> */}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default PrintStudentResult
