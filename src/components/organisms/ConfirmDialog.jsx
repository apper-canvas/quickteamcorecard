import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
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
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                <ApperIcon 
                  name={variant === 'danger' ? 'AlertTriangle' : 'AlertCircle'} 
                  size={24} 
                  className={variant === 'danger' ? 'text-red-600' : 'text-yellow-600'} 
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                {title}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                {cancelText}
              </Button>
              <Button
                variant={variant}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog