import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { toast } from 'react-toastify'

const LeaveRequestModal = ({ request, isOpen, onClose, onSave, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (request) {
      setFormData({
        employeeId: request.employeeId || '',
        type: request.type || 'vacation',
        startDate: request.startDate || '',
        endDate: request.endDate || '',
        reason: request.reason || '',
        status: request.status || 'pending'
      })
    } else {
      setFormData({
        employeeId: '',
        type: 'vacation',
        startDate: '',
        endDate: '',
        reason: '',
        status: 'pending'
      })
    }
    setErrors({})
  }, [request, isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required'
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
      const requestData = {
        ...formData,
        Id: request?.Id || Date.now(),
        requestDate: request?.requestDate || new Date().toISOString().split('T')[0],
        approvedBy: request?.approvedBy || null
      }

      await onSave(requestData)
      toast.success(request ? 'Leave request updated successfully!' : 'Leave request created successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to save leave request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

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
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 font-display">
                {request ? 'Edit Leave Request' : 'New Leave Request'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <FormField
                  label="Employee"
                  type="select"
                  value={formData.employeeId}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  error={errors.employeeId}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.Id} value={emp.Id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Leave Type"
                  type="select"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal</option>
                  <option value="emergency">Emergency</option>
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    error={errors.startDate}
                  />
                  <FormField
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    error={errors.endDate}
                  />
                </div>

                <FormField
                  label="Status"
                  type="select"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </FormField>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Enter reason for leave request..."
                  />
                  {errors.reason && (
                    <p className="text-sm text-red-600">{errors.reason}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
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
                    request ? 'Update' : 'Create'
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

export default LeaveRequestModal