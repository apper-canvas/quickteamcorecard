import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
    { name: 'Employees', icon: 'Users', path: '/employees' },
    { name: 'Attendance', icon: 'Clock', path: '/attendance' },
    { name: 'Leave Requests', icon: 'Calendar', path: '/leave' },
    { name: 'Departments', icon: 'Building', path: '/departments' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-display">TeamCore</h2>
              <p className="text-sm text-gray-600">Employee Management</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <ApperIcon name={item.icon} size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-display">TeamCore</h2>
                <p className="text-sm text-gray-600">Employee Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <ApperIcon name={item.icon} size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar