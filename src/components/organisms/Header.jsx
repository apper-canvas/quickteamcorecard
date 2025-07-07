import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'

const Header = ({ title, subtitle, onSearch, searchValue, onMenuToggle, showMobileMenu }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name={showMobileMenu ? "X" : "Menu"} size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {onSearch && (
            <SearchBar
              placeholder="Search employees..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="hidden md:block w-64"
            />
          )}
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={20} />
          </Button>
          
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={20} className="text-white" />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header