import { useState, useEffect } from 'react'
import { employeeService } from '@/services/api/employeeService'
import { departmentService } from '@/services/api/departmentService'
import { roleService } from '@/services/api/roleService'

export const useEmployees = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [employeeData, departmentData, roleData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        roleService.getAll()
      ])
      setEmployees(employeeData)
      setDepartments(departmentData)
      setRoles(roleData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getEmployeeWithDetails = (employee) => {
    const department = departments.find(d => d.Id === employee.departmentId)
    const role = roles.find(r => r.Id === employee.roleId)
    return {
      ...employee,
      department: department?.name || 'Unknown',
      role: role?.name || 'Unknown'
    }
  }

  const enrichedEmployees = employees.map(getEmployeeWithDetails)

  const createEmployee = async (employeeData) => {
    const newEmployee = await employeeService.create(employeeData)
    setEmployees(prev => [...prev, newEmployee])
    return newEmployee
  }

  const updateEmployee = async (id, employeeData) => {
    const updatedEmployee = await employeeService.update(id, employeeData)
    setEmployees(prev => prev.map(emp => 
      emp.Id === parseInt(id) ? updatedEmployee : emp
    ))
    return updatedEmployee
  }

  const deleteEmployee = async (id) => {
    await employeeService.delete(id)
    setEmployees(prev => prev.filter(emp => emp.Id !== parseInt(id)))
  }

  const searchEmployees = async (query) => {
    if (!query.trim()) {
      return enrichedEmployees
    }
    const results = await employeeService.search(query)
    return results.map(getEmployeeWithDetails)
  }

  return {
    employees: enrichedEmployees,
    departments,
    roles,
    loading,
    error,
    retry: loadData,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees
  }
}