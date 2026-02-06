import {createRoot} from 'react-dom/client'
// Axios
import axios from 'axios'
import {Chart, registerables} from 'chart.js'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
// Apps
import {MetronicI18nProvider} from './_metronic/i18n/Metronici18n'
import './_metronic/assets/fonticon/fonticon.css'
import './_metronic/assets/keenicons/duotone/style.css'
import './_metronic/assets/keenicons/outline/style.css'
import './_metronic/assets/keenicons/solid/style.css'
/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './_metronic/assets/css/style.rtl.css'
 **/
import './_metronic/assets/sass/style.scss'
import './_metronic/assets/sass/plugins.scss'
import './_metronic/assets/sass/style.react.scss'
import {AppRoutes} from './app/routing/AppRoutes'
import {AuthProvider, setupAxios} from './app/modules/auth'
import {AdmissionContextProvider} from './app/modules/auth/core/Addmission'
import {CourseTypesContextProvider} from './app/pages/course/course-type/CourseTypeContext'
import {NumberOfYearsCourseTypesContextProvider} from './app/pages/course/Number Of Years/NumberOfYearsContext'
import {CourseCategoryContextProvider} from './app/pages/course/category/CourseCategoryContext'
import {CourseContextProvider} from './app/pages/course/CourseContext'
import {CourseSubjectContextProvider} from './app/pages/course/course_subject/CourseSubjectContext'
import {StudentCourseFeesContextProvider} from './app/pages/courseFees/StudentCourseFeesContext'
import {PaymentOptionContextProvider} from './app/pages/payment_option/PaymentOption.Context'
import {CompanyContextProvider} from './app/pages/compay/CompanyContext'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {DynamicFieldContextProvider} from './app/pages/enquiry-related/DynamicFieldsContext'
import {CustomFormFieldDataContextProvider} from './app/pages/enquiry-related/dynamicForms/CustomFormFieldDataContext'
import {AttendanceContextProvider} from './app/pages/attendance-related/AttendanceContext'
import {UserRoleAccessProvider} from './app/pages/userRoleAccessManagement/UserRoleAccessContext'
import {TeacherProvider} from './app/pages/teachers/TeacherContext'
import { BatchProvider } from './app/pages/batch/BatchContext'

setupAxios(axios)
Chart.register(...registerables)

const queryClient = new QueryClient()
const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <MetronicI18nProvider>
        <AuthProvider>
          <CourseContextProvider>
            <AttendanceContextProvider>
              <DynamicFieldContextProvider>
                <CustomFormFieldDataContextProvider>
                  <UserRoleAccessProvider>
                    <CourseCategoryContextProvider>
                      <NumberOfYearsCourseTypesContextProvider>
                        <CourseTypesContextProvider>
                          <CourseSubjectContextProvider>
                            <AdmissionContextProvider>
                              <StudentCourseFeesContextProvider>
                                <PaymentOptionContextProvider>
                                  <CompanyContextProvider>
                                    <TeacherProvider>
                                      <BatchProvider>
                                        <AppRoutes />
                                      </BatchProvider>
                                    </TeacherProvider>
                                  </CompanyContextProvider>
                                </PaymentOptionContextProvider>
                              </StudentCourseFeesContextProvider>
                            </AdmissionContextProvider>
                          </CourseSubjectContextProvider>
                        </CourseTypesContextProvider>
                      </NumberOfYearsCourseTypesContextProvider>
                    </CourseCategoryContextProvider>
                  </UserRoleAccessProvider>
                </CustomFormFieldDataContextProvider>
              </DynamicFieldContextProvider>
            </AttendanceContextProvider>
          </CourseContextProvider>
        </AuthProvider>
      </MetronicI18nProvider>
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
