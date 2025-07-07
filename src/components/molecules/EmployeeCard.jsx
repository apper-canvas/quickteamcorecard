import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'

const EmployeeCard = ({ employee, onEdit, onView, onDelete }) => {
  const { firstName, lastName, email, department, role, status, photoUrl } = employee

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
          ) : (
            `${firstName[0]}${lastName[0]}`
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
        
        <StatusBadge status={status} type="employee" />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Building" size={16} className="mr-2" />
          {department}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="UserCheck" size={16} className="mr-2" />
          {role}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onView(employee)}
          className="flex-1"
        >
          <ApperIcon name="Eye" size={16} className="mr-1" />
          View
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(employee)}
        >
          <ApperIcon name="Edit" size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(employee)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </motion.div>
  )
}

export default EmployeeCard