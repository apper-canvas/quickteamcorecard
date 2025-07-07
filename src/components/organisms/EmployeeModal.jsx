import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { toast } from 'react-toastify'

const EmployeeModal = ({ employee, isOpen, onClose, onSave, departments, roles }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    roleId: '',
    status: 'active',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        departmentId: employee.departmentId || '',
        roleId: employee.roleId || '',
        status: employee.status || 'active',
        address: employee.address || {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        }
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        departmentId: '',
        roleId: '',
        status: 'active',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        }
      })
    }
    setErrors({})
  }, [employee, isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required'
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const employeeData = {
        ...formData,
        Id: employee?.Id || Date.now(),
        joinDate: employee?.joinDate || new Date().toISOString().split('T')[0],
        photoUrl: employee?.photoUrl || null
      }

      await onSave(employeeData)
      toast.success(employee ? 'Employee updated successfully!' : 'Employee created successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to save employee')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 font-display">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    error={errors.firstName}
                    placeholder="Enter first name"
                  />
                  <FormField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    error={errors.lastName}
                    placeholder="Enter last name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="Enter email address"
                  />
                  <FormField
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Work Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Department"
                    type="select"
                    value={formData.departmentId}
                    onChange={(e) => handleChange('departmentId', e.target.value)}
                    error={errors.departmentId}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.Id} value={dept.Id}>{dept.name}</option>
                    ))}
                  </FormField>

                  <FormField
                    label="Role"
                    type="select"
                    value={formData.roleId}
                    onChange={(e) => handleChange('roleId', e.target.value)}
                    error={errors.roleId}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.Id} value={role.Id}>{role.name}</option>
                    ))}
                  </FormField>
                </div>

                <FormField
                  label="Status"
                  type="select"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </FormField>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  
                  <FormField
                    label="Street Address"
                    value={formData.address.street}
                    onChange={(e) => handleChange('address.street', e.target.value)}
                    placeholder="Enter street address"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      label="City"
                      value={formData.address.city}
                      onChange={(e) => handleChange('address.city', e.target.value)}
                      placeholder="Enter city"
                    />
                    <FormField
                      label="State"
                      value={formData.address.state}
                      onChange={(e) => handleChange('address.state', e.target.value)}
                      placeholder="Enter state"
                    />
                    <FormField
                      label="ZIP Code"
                      value={formData.address.zipCode}
                      onChange={(e) => handleChange('address.zipCode', e.target.value)}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-24"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    employee ? 'Update' : 'Create'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EmployeeModal