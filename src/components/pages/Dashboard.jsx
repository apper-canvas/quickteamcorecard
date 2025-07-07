import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { useEmployees } from '@/hooks/useEmployees'
import { useLeaveRequests } from '@/hooks/useLeaveRequests'
import { useAttendance } from '@/hooks/useAttendance'
import StatusBadge from '@/components/molecules/StatusBadge'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const Dashboard = () => {
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees()
  const { leaveRequests, loading: leaveLoading, error: leaveError } = useLeaveRequests()
  const { attendance, loading: attendanceLoading, error: attendanceError } = useAttendance()

  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    todayAttendance: 0
  })

  const loading = employeesLoading || leaveLoading || attendanceLoading
  const error = employeesError || leaveError || attendanceError

  useEffect(() => {
    if (!loading && !error) {
      const activeEmployees = employees.filter(emp => emp.status === 'active').length
      const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').length
      const today = format(new Date(), 'yyyy-MM-dd')
      const todayAttendance = attendance.filter(att => att.date === today && att.status === 'present').length

      setMetrics({
        totalEmployees: employees.length,
        activeEmployees,
        pendingLeaves,
        todayAttendance
      })
    }
  }, [employees, leaveRequests, attendance, loading, error])

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} />

  const recentLeaveRequests = leaveRequests
    .filter(req => req.status === 'pending')
    .slice(0, 5)

  const recentAttendance = attendance
    .filter(att => att.date === format(new Date(), 'yyyy-MM-dd'))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your team today.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Employees"
          value={metrics.totalEmployees}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+2 this month"
        />
        <MetricCard
          title="Active Employees"
          value={metrics.activeEmployees}
          icon="UserCheck"
          color="success"
          trend="up"
          trendValue="98% active"
        />
        <MetricCard
          title="Pending Leaves"
          value={metrics.pendingLeaves}
          icon="Calendar"
          color="warning"
          trend="down"
          trendValue="-3 from last week"
        />
        <MetricCard
          title="Today's Attendance"
          value={metrics.todayAttendance}
          icon="Clock"
          color="info"
          trend="up"
          trendValue="95% present"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Pending Leave Requests
            </h3>
            <ApperIcon name="Calendar" size={20} className="text-gray-400" />
          </div>

          <div className="space-y-3">
            {recentLeaveRequests.length > 0 ? (
              recentLeaveRequests.map((request) => (
                <div key={request.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{request.employeeName}</h4>
                    <p className="text-sm text-gray-600">
                      {request.type} • {request.startDate} to {request.endDate}
                    </p>
                  </div>
                  <StatusBadge status={request.status} type="leave" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending leave requests</p>
            )}
          </div>
        </motion.div>

        {/* Today's Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Today's Attendance
            </h3>
            <ApperIcon name="Clock" size={20} className="text-gray-400" />
          </div>

          <div className="space-y-3">
            {recentAttendance.length > 0 ? (
              recentAttendance.map((record) => (
                <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{record.employeeName}</h4>
                    <p className="text-sm text-gray-600">
                      {record.checkIn ? `Check-in: ${record.checkIn}` : 'Not checked in'}
                    </p>
                  </div>
                  <StatusBadge status={record.status} type="attendance" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No attendance records for today</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-200">
            <ApperIcon name="UserPlus" size={20} />
            <span className="font-medium">Add Employee</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
            <ApperIcon name="Calendar" size={20} />
            <span className="font-medium">Approve Leaves</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
            <ApperIcon name="FileText" size={20} />
            <span className="font-medium">Generate Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard