import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAttendance } from '@/hooks/useAttendance'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import AttendanceCalendar from '@/components/organisms/AttendanceCalendar'
import StatusBadge from '@/components/molecules/StatusBadge'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const Attendance = () => {
  const { attendance, employees, loading, error, retry } = useAttendance()
  const [selectedDate, setSelectedDate] = useState(new Date())

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={retry} />

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const dayAttendance = attendance.filter(record => record.date === selectedDateStr)

  const attendanceStats = {
    present: dayAttendance.filter(r => r.status === 'present').length,
    late: dayAttendance.filter(r => r.status === 'late').length,
    absent: dayAttendance.filter(r => r.status === 'absent').length,
    total: employees.length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Attendance</h1>
        <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="XCircle" size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-primary">
                {attendanceStats.total > 0 ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <AttendanceCalendar
          attendance={attendance}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Daily Attendance Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
            Attendance for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>

          <div className="space-y-3">
            {dayAttendance.length > 0 ? (
              dayAttendance.map((record) => (
                <motion.div
                  key={record.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{record.employeeName}</h4>
                    <p className="text-sm text-gray-600">
                      {record.checkIn && record.checkOut ? (
                        `${record.checkIn} - ${record.checkOut}`
                      ) : record.checkIn ? (
                        `Check-in: ${record.checkIn}`
                      ) : (
                        'No check-in recorded'
                      )}
                    </p>
                  </div>
                  <StatusBadge status={record.status} type="attendance" />
                </motion.div>
              ))
            ) : (
              <Empty
                title="No attendance records"
                description="No attendance data found for this date"
                icon="Clock"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance