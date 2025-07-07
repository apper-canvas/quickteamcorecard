import Badge from '@/components/atoms/Badge'

const StatusBadge = ({ status, type = 'employee' }) => {
  const getStatusConfig = () => {
    if (type === 'employee') {
      switch (status) {
        case 'active':
          return { variant: 'success', text: 'Active' }
        case 'inactive':
          return { variant: 'error', text: 'Inactive' }
        case 'on_leave':
          return { variant: 'warning', text: 'On Leave' }
        default:
          return { variant: 'default', text: 'Unknown' }
      }
    }
    
    if (type === 'leave') {
      switch (status) {
        case 'pending':
          return { variant: 'warning', text: 'Pending' }
        case 'approved':
          return { variant: 'success', text: 'Approved' }
        case 'rejected':
          return { variant: 'error', text: 'Rejected' }
        default:
          return { variant: 'default', text: 'Unknown' }
      }
    }

    if (type === 'attendance') {
      switch (status) {
        case 'present':
          return { variant: 'success', text: 'Present' }
        case 'absent':
          return { variant: 'error', text: 'Absent' }
        case 'late':
          return { variant: 'warning', text: 'Late' }
        default:
          return { variant: 'default', text: 'Unknown' }
      }
    }

    return { variant: 'default', text: status }
  }

  const { variant, text } = getStatusConfig()

  return (
    <Badge variant={variant}>
      {text}
    </Badge>
  )
}

export default StatusBadge