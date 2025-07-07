import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet", 
  icon = "Users",
  actionLabel,
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={40} className="text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            {actionLabel}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty