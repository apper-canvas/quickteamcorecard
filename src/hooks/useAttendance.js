import { useState, useEffect } from 'react'
import { attendanceService } from '@/services/api/attendanceService'
import { employeeService } from '@/services/api/employeeService'

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [attendanceData, employeeData] = await Promise.all([
        attendanceService.getAll(),
        employeeService.getAll()
      ])
      setAttendance(attendanceData)
      setEmployees(employeeData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getAttendanceWithDetails = (record) => {
    const employee = employees.find(e => e.Id === record.employeeId)
    return {
      ...record,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown'
    }
  }

  const enrichedAttendance = attendance.map(getAttendanceWithDetails)

  const createRecord = async (recordData) => {
    const newRecord = await attendanceService.create(recordData)
    setAttendance(prev => [...prev, newRecord])
    return newRecord
  }

  const updateRecord = async (id, recordData) => {
    const updatedRecord = await attendanceService.update(id, recordData)
    setAttendance(prev => prev.map(rec => 
      rec.Id === parseInt(id) ? updatedRecord : rec
    ))
    return updatedRecord
  }

  const deleteRecord = async (id) => {
    await attendanceService.delete(id)
    setAttendance(prev => prev.filter(rec => rec.Id !== parseInt(id)))
  }

  const getEmployeeAttendance = async (employeeId) => {
    const records = await attendanceService.getByEmployee(employeeId)
    return records.map(getAttendanceWithDetails)
  }

  const getDateRangeAttendance = async (startDate, endDate) => {
    const records = await attendanceService.getByDateRange(startDate, endDate)
    return records.map(getAttendanceWithDetails)
  }

  return {
    attendance: enrichedAttendance,
    employees,
    loading,
    error,
    retry: loadData,
    createRecord,
    updateRecord,
    deleteRecord,
    getEmployeeAttendance,
    getDateRangeAttendance
  }
}