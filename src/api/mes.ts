import request from '@/utils/request'

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

export const listMdItem = (params?: any) => {
  return request.post({ url: '/mes/md/mditem/list', data: params })
}

export const getMdItem = (id: number) => {
  return request.get({ url: `/mes/md/mditem/${id}` })
}

export const addMdItem = (data: any) => {
  return request.post({ url: '/mes/md/mditem', data })
}

export const updateMdItem = (data: any) => {
  return request.put({ url: '/mes/md/mditem', data })
}

export const delMdItem = (id: number) => {
  return request.delete({ url: `/mes/md/mditem/${id}` })
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

export const listVendor = (params?: any) => {
  return request.post({ url: '/mes/md/vendor/list', data: params })
}

export const listClient = (params?: any) => {
  return request.post({ url: '/mes/md/client/list', data: params })
}

export interface UnitMeasure {
  id: number
  code: string
  name: string
  status: string
}

export const listUnitMeasure = (params?: any) => {
  return request.post({ url: '/mes/md/unitmeasure/list', data: params })
}

export const listWorkshop = (params?: any) => {
  return request.post({ url: '/mes/md/workshop/list', data: params })
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
  status: string
}

export const listWorkorder = (params?: any) => {
  return request.get({ url: '/mes/pro/workorder/list', params })
}

export const getWorkorder = (id: number) => {
  return request.get({ url: `/mes/pro/workorder/${id}` })
}

export const addWorkorder = (data: any) => {
  return request.post({ url: '/mes/pro/workorder', data })
}

export const updateWorkorder = (data: any) => {
  return request.put({ url: '/mes/pro/workorder', data })
}

export const delWorkorder = (id: number) => {
  return request.delete({ url: `/mes/pro/workorder/${id}` })
}

export const dofinish = (id: number) => {
  return request.put({ url: `/mes/pro/workorder/dofinish/${id}` })
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

export const listFeedback = (params?: any) => {
  return request.post({ url: '/mes/pro/feedback/list', data: params })
}

export interface Machinery {
  id: number
  code: string
  name: string
  model: string
  workshopId: number
  workshopName: string
  status: string
  lastMaintenanceDate: string
}

export const listMachinery = (params?: any) => {
  return request.get({ url: '/mes/dv/machinery/list', params })
}

export const listMachineryType = (params?: any) => {
  return request.get({ url: '/mes/dv/machinery/type/list', params })
}

export interface Repair {
  id: number
  machineryId: number
  machineryCode: string
  machineryName: string
  repairType: string
  faultDescription: string
  repairContent: string
  repairPerson: string
  repairTime: string
  status: string
}

export const listRepair = (params?: any) => {
  return request.get({ url: '/mes/dv/repair/list', params })
}

export interface CheckPlan {
  id: number
  name: string
  cycle: string
  nextCheckTime: string
  status: string
}

export const listCheckPlan = (params?: any) => {
  return request.get({ url: '/mes/dv/checkplan/list', params })
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
  status: string
  createTime: string
}

export const listQcPending = (params?: any) => {
  return request.get({ url: '/mes/qc/pendinginspect/list', params })
}

export interface QcTemplate {
  id: number
  name: string
  description: string
  status: string
}

export const listQcTemplate = (params?: any) => {
  return request.get({ url: '/mes/qc/qctemplate/list', params })
}

export interface Calendar {
  id: number
  name: string
  date: string
  isHoliday: boolean
  remark: string
}

export const listCalendar = (params?: any) => {
  return request.get({ url: '/mes/cal/calendar/list', params })
}

export interface Team {
  id: number
  name: string
  leader: string
  members: string[]
  status: string
}

export const listTeam = (params?: any) => {
  return request.post({ url: '/mes/cal/team/list', data: params })
}
