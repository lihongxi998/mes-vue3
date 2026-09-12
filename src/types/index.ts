export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface Workorder {
  id: number
  no: string
  productId: number
  productName: string
  quantity: number
  completedQty: number
  workshopId: number
  workshopName: string
  startDate: string
  endDate: string
  status: 'pending' | 'producing' | 'completed' | 'paused'
}

export interface Feedback {
  id: number
  workorderId: number
  workorderNo: string
  operatorId: number
  operatorName: string
  quantity: number
  qualifiedQty: number
  unqualifiedQty: number
  feedbackTime: string
  remark: string
}

export interface Machinery {
  id: number
  code: string
  name: string
  model: string
  workshopId: number
  workshopName: string
  status: 'running' | 'idle' | 'maintenance' | 'fault'
  lastMaintenanceDate: string
}

export interface Repair {
  id: number
  machineryId: number
  machineryCode: string
  machineryName: string
  repairType: 'regular' | 'repair' | 'maintenance'
  faultDescription: string
  repairContent: string
  repairPerson: string
  repairTime: string
  status: 'pending' | 'completed'
}

export interface QcPending {
  id: number
  no: string
  workorderId: number
  workorderNo: string
  productId: number
  productName: string
  quantity: number
  inspectType: string
  status: 'pending' | 'pass' | 'fail'
  createTime: string
}

export interface MdItem {
  id: number
  code: string
  name: string
  type: string
  spec: string
  unit: string
  supplierId?: number
  remark?: string
}

export interface Vendor {
  id: number
  code: string
  name: string
  contact: string
  phone: string
  email: string
  address: string
  status: string
}
