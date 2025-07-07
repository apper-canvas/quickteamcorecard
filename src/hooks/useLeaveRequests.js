import { useState, useEffect } from 'react'
import { leaveService } from '@/services/api/leaveService'
import { employeeService } from '@/services/api/employeeService'

export const useLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [requestData, employeeData] = await Promise.all([
        leaveService.getAll(),
        employeeService.getAll()
      ])
      setLeaveRequests(requestData)
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

  const getRequestWithDetails = (request) => {
    const employee = employees.find(e => e.Id === request.employeeId)
    return {
      ...request,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown'
    }
  }

  const enrichedRequests = leaveRequests.map(getRequestWithDetails)

  const createRequest = async (requestData) => {
    const newRequest = await leaveService.create(requestData)
    setLeaveRequests(prev => [...prev, newRequest])
    return newRequest
  }

  const updateRequest = async (id, requestData) => {
    const updatedRequest = await leaveService.update(id, requestData)
    setLeaveRequests(prev => prev.map(req => 
      req.Id === parseInt(id) ? updatedRequest : req
    ))
    return updatedRequest
  }

  const deleteRequest = async (id) => {
    await leaveService.delete(id)
    setLeaveRequests(prev => prev.filter(req => req.Id !== parseInt(id)))
  }

  const approveRequest = async (id, approverId = 1) => {
    const updatedRequest = await leaveService.approve(id, approverId)
    setLeaveRequests(prev => prev.map(req => 
      req.Id === parseInt(id) ? updatedRequest : req
    ))
    return updatedRequest
  }

  const rejectRequest = async (id, approverId = 1) => {
    const updatedRequest = await leaveService.reject(id, approverId)
    setLeaveRequests(prev => prev.map(req => 
      req.Id === parseInt(id) ? updatedRequest : req
    ))
    return updatedRequest
  }

  return {
    leaveRequests: enrichedRequests,
    employees,
    loading,
    error,
    retry: loadData,
    createRequest,
    updateRequest,
    deleteRequest,
    approveRequest,
    rejectRequest
  }
}