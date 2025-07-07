import rolesData from '@/services/mockData/roles.json'

let roles = [...rolesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const roleService = {
  async getAll() {
    await delay(200)
    return [...roles]
  },

  async getById(id) {
    await delay(150)
    const role = roles.find(r => r.Id === parseInt(id))
    if (!role) {
      throw new Error('Role not found')
    }
    return { ...role }
  },

  async create(roleData) {
    await delay(300)
    const newRole = {
      ...roleData,
      Id: Math.max(...roles.map(r => r.Id)) + 1
    }
    roles.push(newRole)
    return { ...newRole }
  },

  async update(id, roleData) {
    await delay(300)
    const index = roles.findIndex(r => r.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Role not found')
    }
    roles[index] = { ...roleData, Id: parseInt(id) }
    return { ...roles[index] }
  },

  async delete(id) {
    await delay(250)
    const index = roles.findIndex(r => r.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Role not found')
    }
    roles.splice(index, 1)
    return true
  }
}