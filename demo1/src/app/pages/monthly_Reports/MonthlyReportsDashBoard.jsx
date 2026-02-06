import {MixedWidget8, TablesWidget5} from '../../../_metronic/partials/widgets'
import NewStudentAdmissionPaidCollection from './NewStudentAdmissionPaidCollection'
import OldStudentMonthlyInstallmentCollection from './OldStudentMonthlyInstallmentCollection'
import TotalAmountOfOldAndNewStudent from './TotalAmountOfOldAndNewStudent'

const MonthlyReportsDashBoard = () => {
  return (
    <div className='row g-5 gx-xxl-8'>
      <div className='text-center'>
        <TotalAmountOfOldAndNewStudent />
      </div>
      <div className='col-xxl-6'>
        <NewStudentAdmissionPaidCollection className='card-xxl-stretch mb-xl-3' />
      </div>
      <div className='col-xxl-6'>
        <OldStudentMonthlyInstallmentCollection className='card-xxl-stretch mb-xl-3' />
      </div>
    </div>
  )
}
export default MonthlyReportsDashBoard
