import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns'

const AttendanceCalendar = ({ attendance, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [monthDays, setMonthDays] = useState([])

  useEffect(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })
    setMonthDays(days)
  }, [currentDate])

  const getAttendanceForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return attendance.find(record => record.date === dateStr)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 font-display">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, index) => {
          const attendanceRecord = getAttendanceForDate(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isDayToday = isToday(day)
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day)}
              className={`
                relative h-16 p-2 rounded-lg text-sm transition-all duration-200
                ${isSelected 
                  ? 'bg-primary text-white' 
                  : isDayToday 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : isCurrentMonth 
                  ? 'hover:bg-gray-50 text-gray-900' 
                  : 'text-gray-400'
                }
              `}
            >
              <div className="text-center">
                <div className="font-medium mb-1">
                  {format(day, 'd')}
                </div>
                
                {attendanceRecord && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className={`w-2 h-2 rounded-full ${
                      attendanceRecord.status === 'present' ? 'bg-green-500' :
                      attendanceRecord.status === 'late' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-gray-600">Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-gray-600">Absent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceCalendar