import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLeaveRequests } from '@/hooks/useLeaveRequests'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import StatusBadge from '@/components/molecules/StatusBadge'
import LeaveRequestModal from '@/components/organisms/LeaveRequestModal'
import ConfirmDialog from '@/components/organisms/ConfirmDialog'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const LeaveRequests = () => {
  const { 
    leaveRequests, 
    employees, 
    loading, 
    error, 
    retry, 
    createRequest, 
    updateRequest, 
    deleteRequest,
    approveRequest,
    rejectRequest
  } = useLeaveRequests()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleAddRequest = () => {
    setSelectedRequest(null)
    setShowModal(true)
  }

  const handleEditRequest = (request) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  const handleDeleteRequest = (request) => {
    setRequestToDelete(request)
    setShowDeleteConfirm(true)
  }

const handleSaveRequest = async (requestData) => {
    if (selectedRequest) {
      await updateRequest(selectedRequest.Id, requestData)
    } else {
      await createRequest(requestData)
    }
    setShowModal(false)
  }

  const confirmDelete = async () => {
    try {
      await deleteRequest(requestToDelete.Id)
      toast.success('Leave request deleted successfully!')
      setShowDeleteConfirm(false)
      setRequestToDelete(null)
    } catch (error) {
      toast.error('Failed to delete leave request')
    }
  }

  const handleApprove = async (requestId) => {
    try {
      await approveRequest(requestId)
      toast.success('Leave request approved!')
    } catch (error) {
      toast.error('Failed to approve leave request')
    }
  }

  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId)
      toast.success('Leave request rejected!')
    } catch (error) {
      toast.error('Failed to reject leave request')
    }
  }

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={retry} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Leave Requests</h1>
          <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
        </div>
        
        <Button onClick={handleAddRequest} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          New Request
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar
          placeholder="Search leave requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80"
        />
        
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Leave Requests List */}
      {filteredRequests.length === 0 ? (
        <Empty
          title="No leave requests found"
          description={searchQuery ? `No requests match "${searchQuery}"` : "No leave requests have been submitted yet"}
          icon="Calendar"
          actionLabel="New Request"
          onAction={handleAddRequest}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <motion.tr
                    key={request.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.employeeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.startDate} to {request.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} type="leave" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApprove(request.Id)}
                          >
                            <ApperIcon name="Check" size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(request.Id)}
                          >
                            <ApperIcon name="X" size={16} />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRequest(request)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRequest(request)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Request Modal */}
      <LeaveRequestModal
        request={selectedRequest}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveRequest}
        employees={employees}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Leave Request"
        message={`Are you sure you want to delete this leave request? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default LeaveRequests