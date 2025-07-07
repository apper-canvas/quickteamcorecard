import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEmployees } from '@/hooks/useEmployees'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import EmployeeCard from '@/components/molecules/EmployeeCard'
import EmployeeModal from '@/components/organisms/EmployeeModal'
import ConfirmDialog from '@/components/organisms/ConfirmDialog'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const Employees = () => {
  const { 
    employees, 
    departments, 
    roles, 
    loading, 
    error, 
    retry, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee,
    searchEmployees
  } = useEmployees()

  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = await searchEmployees(query)
      setFilteredEmployees(results)
    } else {
      setFilteredEmployees([])
    }
  }

  const displayEmployees = searchQuery.trim() ? filteredEmployees : employees

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setShowModal(true)
  }

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee)
    setShowModal(true)
  }

  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee)
    setShowDeleteConfirm(true)
  }

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.Id, employeeData)
      } else {
        await createEmployee(employeeData)
      }
      setShowModal(false)
    } catch (error) {
      throw error
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete.Id)
      toast.success('Employee deleted successfully!')
      setShowDeleteConfirm(false)
      setEmployeeToDelete(null)
    } catch (error) {
      toast.error('Failed to delete employee')
    }
  }

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={retry} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members and their information</p>
        </div>
        
        <Button onClick={handleAddEmployee} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full sm:w-80"
        />
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <ApperIcon name="Grid3X3" size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ApperIcon name="List" size={16} />
          </Button>
        </div>
      </div>

      {/* Employee List */}
      {displayEmployees.length === 0 ? (
        <Empty
          title="No employees found"
          description={searchQuery ? `No employees match "${searchQuery}"` : "Get started by adding your first employee"}
          icon="Users"
          actionLabel="Add Employee"
          onAction={handleAddEmployee}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
        >
          {displayEmployees.map((employee) => (
            <EmployeeCard
              key={employee.Id}
              employee={employee}
              onEdit={handleEditEmployee}
              onView={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </motion.div>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        employee={selectedEmployee}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveEmployee}
        departments={departments}
        roles={roles}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.firstName} ${employeeToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default Employees