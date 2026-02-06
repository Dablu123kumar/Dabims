import React, {useEffect, useMemo, useState} from 'react'
import {useStudentCourseFeesContext} from '../courseFees/StudentCourseFeesContext'
import {useParams} from 'react-router-dom'

const TotalAmountOfOldAndNewStudent = () => {
  const [page, setPage] = useState(1)
  const [newTotalCollection, setNewTotalCollection] = useState(0)
  const [totalCollection, setTotalCollection] = useState(0)
  // const [totalStudents, setTotalStudents] = useState(0)
  // const [allData, setAllData] = useState([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [toDate] = useState(new Date())
  const paramsData = useParams()
  const ctx = useStudentCourseFeesContext()
  const {data, isLoading} = ctx.getAllStudentsCourseFees

  useEffect(() => {
    if (data) {
      // Filter data to get relevant monthly installment collections
      const filteredData = data.filter((item) => {
        const companyId = item?.companyName
        const amountDate = new Date(item?.amountDate) // Date when installment was created
        const studentCreationDate = new Date(item?.studentInfo?.createdAt) // Date when student was created

        return (
          item?.amountPaid &&
          companyId === paramsData?.id &&
          item?.studentInfo?.dropOutStudent === false &&
          amountDate.getMonth() === toDate.getMonth() &&
          amountDate.getFullYear() === toDate.getFullYear() &&
          (studentCreationDate.getMonth() < toDate.getMonth() ||
            studentCreationDate.getFullYear() < toDate.getFullYear())
        )
      })

      const topData = filteredData.slice(0, page * 100)
      // setAllData(topData)
      //   console.log(topData)
      setTotalCollection(
        filteredData.reduce((total, collection) => total + (collection?.amountPaid || 0), 0)
      )
      // setTotalStudents(filteredData.length)
    }
  }, [data, page, toDate])

  useEffect(() => {
    if (data) {
      const filteredData = data.filter((item) => {
        const companyId = item?.companyName

        const studentCreationDate = new Date(item?.studentInfo?.createdAt)
        const amountPaidDate = new Date(item?.amountDate)

        // Check if the student was created in the current month and year
        const isNewStudent =
          studentCreationDate.getMonth() === toDate.getMonth() &&
          studentCreationDate.getFullYear() === toDate.getFullYear()

        // Check if the installment was paid in the current month and year
        const isCurrentMonthPayment =
          amountPaidDate.getMonth() === toDate.getMonth() &&
          amountPaidDate.getFullYear() === toDate.getFullYear()

        return (
          isNewStudent &&
          isCurrentMonthPayment &&
          companyId === paramsData?.id &&
          item?.amountPaid &&
          item?.studentInfo?.dropOutStudent === false
        )
      })

      if (filteredData.length > 0) {
        const topData = filteredData.slice(0, page * 100)
        // setAllData(topData)

        // Calculate total collection based on amountPaid
        const total = filteredData.reduce(
          (total, collection) => total + (collection?.amountPaid || 0),
          0
        )
        setNewTotalCollection(total)
        // setTotalStudents(filteredData.length)
      } else {
        // If no data found, reset totals and clear data
        setNewTotalCollection(0)
        // setTotalStudents(0)
        // setAllData([])
      }
    }
  }, [data, page, toDate])

  useEffect(() => {
    const totalAmountCollection = totalCollection + newTotalCollection
    setMonthlyTotal(totalAmountCollection)
  }, [totalCollection, newTotalCollection])

  return <h3>{`Total Collection => ${monthlyTotal.toFixed(2)}`}</h3>
}

export default TotalAmountOfOldAndNewStudent
