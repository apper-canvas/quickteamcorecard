import leaveRequestsData from '@/services/mockData/leaveRequests.json'

let leaveRequests = [...leaveRequestsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const leaveService = {
  async getAll() {
    await delay(300)
    return [...leaveRequests]
  },

  async getById(id) {
    await delay(200)
    const request = leaveRequests.find(req => req.Id === parseInt(id))
    if (!request) {
      throw new Error('Leave request not found')
    }
    return { ...request }
  },

  async create(requestData) {
    await delay(400)
    const newRequest = {
      ...requestData,
      Id: Math.max(...leaveRequests.map(r => r.Id)) + 1
    }
    leaveRequests.push(newRequest)
    return { ...newRequest }
  },

  async update(id, requestData) {
    await delay(400)
    const index = leaveRequests.findIndex(req => req.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Leave request not found')
    }
    leaveRequests[index] = { ...requestData, Id: parseInt(id) }
    return { ...leaveRequests[index] }
  },

  async delete(id) {
    await delay(300)
    const index = leaveRequests.findIndex(req => req.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Leave request not found')
    }
    leaveRequests.splice(index, 1)
    return true
  },

  async approve(id, approverId) {
    await delay(300)
    const index = leaveRequests.findIndex(req => req.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Leave request not found')
    }
    leaveRequests[index].status = 'approved'
    leaveRequests[index].approvedBy = approverId
    return { ...leaveRequests[index] }
  },

  async reject(id, approverId) {
    await delay(300)
    const index = leaveRequests.findIndex(req => req.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Leave request not found')
    }
    leaveRequests[index].status = 'rejected'
    leaveRequests[index].approvedBy = approverId
    return { ...leaveRequests[index] }
  }
}