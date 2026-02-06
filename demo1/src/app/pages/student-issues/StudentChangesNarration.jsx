import moment from 'moment'
import React from 'react'

const StudentChangesNarration = ({studentInfoData}) => {
  return (
     <div className={`card my-10`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Student Course Changes Narration</span>
            <span className='mt-1 fw-semibold fs-7'>{studentInfoData?.name}</span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold '>
                  <th className='w-25px'></th>
                  <th className='min-w-100px'> Date and Time</th>
                  <th className='min-w-120px'>Subject</th>
                  <th className='min-w-150px'>Updated By</th>
                </tr>
              </thead>
              <tbody>
                {!studentInfoData?.message  ? (
                  <tr>
                    <td colSpan={4} className='text-center'>
                      <h4>No student Mail data available</h4>
                    </td>
                  </tr>
                ) : (
                      <tr>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'></div>
                        </td>
                        <td>
                          
                            {moment(studentInfoData.updatedAt).format('DD/MM/YYYY hh:mm A')}
                       
                        </td>
                        <td className='text-danger'>
                         
                            {studentInfoData?.message}
                
                        </td>
                        <td>
                         
                            {studentInfoData?.updatedBy || 'Admin'}
                          
                        </td>
                      </tr>
                    )}
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}

export default StudentChangesNarration