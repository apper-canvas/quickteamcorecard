import employeesData from '@/services/mockData/employees.json'

let employees = [...employeesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const employeeService = {
  async getAll() {
    await delay(300)
    return [...employees]
  },

  async getById(id) {
    await delay(200)
    const employee = employees.find(emp => emp.Id === parseInt(id))
    if (!employee) {
      throw new Error('Employee not found')
    }
    return { ...employee }
  },

  async create(employeeData) {
    await delay(400)
    const newEmployee = {
      ...employeeData,
      Id: Math.max(...employees.map(e => e.Id)) + 1
    }
    employees.push(newEmployee)
    return { ...newEmployee }
  },

  async update(id, employeeData) {
    await delay(400)
    const index = employees.findIndex(emp => emp.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Employee not found')
    }
    employees[index] = { ...employeeData, Id: parseInt(id) }
    return { ...employees[index] }
  },

  async delete(id) {
    await delay(300)
    const index = employees.findIndex(emp => emp.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Employee not found')
    }
    employees.splice(index, 1)
    return true
  },

  async search(query) {
    await delay(250)
    const searchTerm = query.toLowerCase()
    return employees.filter(emp => 
      emp.firstName.toLowerCase().includes(searchTerm) ||
      emp.lastName.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm)
    )
  }
}