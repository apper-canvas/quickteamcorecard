import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEmployees } from '@/hooks/useEmployees'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Departments = () => {
  const { departments, employees, loading, error, retry } = useEmployees()
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={retry} />

  const getDepartmentEmployees = (departmentId) => {
    return employees.filter(emp => emp.departmentId === departmentId)
  }

  const getDepartmentManager = (managerId) => {
    return employees.find(emp => emp.Id === managerId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Departments</h1>
          <p className="text-gray-600 mt-1">Manage organizational structure and departments</p>
        </div>
        
        <Button className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Department
        </Button>
      </div>

      {/* Department Cards */}
      {departments.length === 0 ? (
        <Empty
          title="No departments found"
          description="Get started by creating your first department"
          icon="Building"
          actionLabel="Add Department"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => {
            const departmentEmployees = getDepartmentEmployees(department.Id)
            const manager = getDepartmentManager(department.managerId)

            return (
              <motion.div
                key={department.Id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedDepartment(department)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Building" size={24} className="text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {departmentEmployees.length}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 font-display mb-2">
                  {department.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {department.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="UserCheck" size={16} className="mr-2" />
                    <span>
                      Manager: {manager ? `${manager.firstName} ${manager.lastName}` : 'Not assigned'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Users" size={16} className="mr-2" />
                    <span>{departmentEmployees.length} employees</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Active employees</span>
                    <span className="text-sm font-medium text-green-600">
                      {departmentEmployees.filter(emp => emp.status === 'active').length}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Department Detail Panel */}
      {selectedDepartment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-display">
              {selectedDepartment.name} Department
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDepartment(null)}
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-600">{selectedDepartment.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Manager</label>
                  <p className="text-gray-600">
                    {getDepartmentManager(selectedDepartment.managerId)?.firstName} {getDepartmentManager(selectedDepartment.managerId)?.lastName || 'Not assigned'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employees</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getDepartmentEmployees(selectedDepartment.Id).map((employee) => (
                  <div key={employee.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{employee.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Departments