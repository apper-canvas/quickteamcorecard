import attendanceData from '@/services/mockData/attendance.json'

let attendance = [...attendanceData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const attendanceService = {
  async getAll() {
    await delay(300)
    return [...attendance]
  },

  async getById(id) {
    await delay(200)
    const record = attendance.find(att => att.Id === parseInt(id))
    if (!record) {
      throw new Error('Attendance record not found')
    }
    return { ...record }
  },

  async getByEmployee(employeeId) {
    await delay(250)
    return attendance.filter(att => att.employeeId === parseInt(employeeId))
  },

  async getByDateRange(startDate, endDate) {
    await delay(250)
    return attendance.filter(att => 
      att.date >= startDate && att.date <= endDate
    )
  },

  async create(attendanceData) {
    await delay(400)
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(a => a.Id)) + 1
    }
    attendance.push(newRecord)
    return { ...newRecord }
  },

  async update(id, attendanceData) {
    await delay(400)
    const index = attendance.findIndex(att => att.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    attendance[index] = { ...attendanceData, Id: parseInt(id) }
    return { ...attendance[index] }
  },

  async delete(id) {
    await delay(300)
    const index = attendance.findIndex(att => att.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    attendance.splice(index, 1)
    return true
  }
}