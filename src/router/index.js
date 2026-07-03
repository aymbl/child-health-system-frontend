import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'

import AdminLayout from '@/layout/AdminLayout.vue'
import AdminHome from '@/views/admin/AdminHome.vue'
import AdminList from '@/views/admin/AdminList.vue'
import AdminAdd from '@/views/admin/AdminAdd.vue'
import AdminEdit from '@/views/admin/AdminEdit.vue'
import DoctorList from '@/views/admin/DoctorList.vue'
import DoctorAdd from '@/views/admin/DoctorAdd.vue'
import DoctorEdit from '@/views/admin/DoctorEdit.vue'
import ParentList from '@/views/admin/ParentList.vue'
import ParentAdd from '@/views/admin/ParentAdd.vue'
import ParentEdit from '@/views/admin/ParentEdit.vue'
import ChildList from '@/views/admin/ChildList.vue'
import AppointmentList from '@/views/admin/AppointmentList.vue'
import CheckRecordList from '@/views/admin/CheckRecordList.vue'
import GrowthRecordList from '@/views/admin/GrowthRecordList.vue'
import HealthProfile from '@/views/admin/HealthProfile.vue'
import VaccineReminderList from '@/views/admin/VaccineReminderList.vue'
import VaccinationRecordList from '@/views/admin/VaccinationRecordList.vue'
import NoticeList from '@/views/admin/NoticeList.vue'
import NoticeAdd from '@/views/admin/NoticeAdd.vue'
import NoticeEdit from '@/views/admin/NoticeEdit.vue'
import FeedbackList from '@/views/admin/FeedbackList.vue'

import DoctorLayout from '@/layout/DoctorLayout.vue'
import DoctorHome from '@/views/doctor/DoctorHome.vue'
import DoctorAppointmentList from '@/views/doctor/DoctorAppointmentList.vue'
import DoctorCheckRecordList from '@/views/doctor/DoctorCheckRecordList.vue'
import DoctorGrowthRecordList from '@/views/doctor/DoctorGrowthRecordList.vue'
import DoctorGrowthRecordAdd from '@/views/doctor/DoctorGrowthRecordAdd.vue'
import DoctorGrowthRecordEdit from '@/views/doctor/DoctorGrowthRecordEdit.vue'
import DoctorVaccinationRecord from '@/views/doctor/DoctorVaccinationRecord.vue'
import DoctorNoticeList from '@/views/doctor/DoctorNoticeList.vue'
import DoctorFeedbackList from '@/views/doctor/DoctorFeedbackList.vue'
import DoctorQuestionnaireList from '@/views/doctor/DoctorQuestionnaireList.vue'

import ParentLayout from '@/layout/ParentLayout.vue'
import ParentHome from '@/views/parent/ParentHome.vue'
import ParentChildList from '@/views/parent/ParentChildList.vue'
import ParentAppointmentList from '@/views/parent/ParentAppointmentList.vue'
import ParentAppointmentApply from '@/views/parent/ParentAppointmentApply.vue'
import ParentCheckRecordList from '@/views/parent/ParentCheckRecordList.vue'
import ParentNoticeList from '@/views/parent/ParentNoticeList.vue'
import ParentVaccineReminder from '@/views/parent/ParentVaccineReminder.vue'
import ParentVaccinationRecord from '@/views/parent/ParentVaccinationRecord.vue'
import ParentVaccineApply from '@/views/parent/ParentVaccineApply.vue'
import ParentHealthProfile from '@/views/parent/ParentHealthProfile.vue'
import ParentFeedbackList from '@/views/parent/ParentFeedbackList.vue'
import ParentFeedbackAdd from '@/views/parent/ParentFeedbackAdd.vue'
import ParentQuestionnaireList from '@/views/parent/ParentQuestionnaireList.vue'
import ParentQuestionnaireAdd from '@/views/parent/ParentQuestionnaireAdd.vue'
import ParentProfile from '@/views/parent/ParentProfile.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { title: '儿童健康管理系统 - 登录' } },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/register', component: Register },
  {
    path: '/doctor',
    component: DoctorLayout,
    children: [
      { path: 'home', component: DoctorHome, meta: { title: '儿童健康管理系统 - 医生端' } },
      { path: 'appointments', component: DoctorAppointmentList },
      { path: 'check-records', component: DoctorCheckRecordList },
      { path: 'growthRecordList', component: DoctorGrowthRecordList },
      { path: 'growthRecordAdd', component: DoctorGrowthRecordAdd },
      { path: 'growthRecordEdit/:id', component: DoctorGrowthRecordEdit },
      { path: 'doctorVaccinationRecord', component: DoctorVaccinationRecord },
      { path: 'questionnaires', component: DoctorQuestionnaireList },
      { path: 'notices', component: DoctorNoticeList },
      { path: 'feedback', component: DoctorFeedbackList }
    ]
  },
  {
    path: '/parent',
    component: ParentLayout,
    children: [
      { path: 'home', component: ParentHome, meta: { title: '儿童健康管理系统 - 家长端' } },
      { path: 'children', component: ParentChildList },
      { path: 'health-profile/:childId', component: ParentHealthProfile },
      { path: 'appointments', component: ParentAppointmentList },
      { path: 'appointment-apply', component: ParentAppointmentApply },
      { path: 'check-records', component: ParentCheckRecordList },
      { path: 'notices', component: ParentNoticeList },
      { path: 'parentVaccineReminder', component: ParentVaccineReminder },
      { path: 'vaccination-records', component: ParentVaccinationRecord },
      { path: 'vaccine-apply', component: ParentVaccineApply },
      { path: 'questionnaires', component: ParentQuestionnaireList },
      { path: 'questionnaire-add', component: ParentQuestionnaireAdd },
      { path: 'profile', component: ParentProfile },
      { path: 'feedback', component: ParentFeedbackList },
      { path: 'feedback-add', component: ParentFeedbackAdd }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'home', component: AdminHome, meta: { title: '儿童健康管理系统 - 管理端' } },
      { path: 'admin-list', component: AdminList },
      { path: 'admin-add', component: AdminAdd },
      { path: 'admin-edit/:id', component: AdminEdit },
      { path: 'doctor-list', component: DoctorList },
      { path: 'doctor-add', component: DoctorAdd },
      { path: 'doctor-edit/:id', component: DoctorEdit },
      { path: 'parent-list', component: ParentList },
      { path: 'parent-add', component: ParentAdd },
      { path: 'parent-edit/:id', component: ParentEdit },
      { path: 'child-list', component: ChildList, meta: { title: '儿童健康管理系统 - 儿童信息总览' } },
      { path: 'appointment-list', component: AppointmentList, meta: { title: '儿童健康管理系统 - 体检预约总览' } },
      { path: 'check-record-list', component: CheckRecordList, meta: { title: '儿童健康管理系统 - 体检记录查看' } },
      { path: 'growthRecordList', component: GrowthRecordList, meta: { title: '儿童健康管理系统 - 成长记录查看' } },
      { path: 'healthProfile/:childId', component: HealthProfile, meta: { title: '儿童健康管理系统 - 儿童健康档案' } },
      { path: 'vaccineReminderList', component: VaccineReminderList, meta: { title: '儿童健康管理系统 - 疫苗提醒总览' } },
      { path: 'vaccinationRecordList', component: VaccinationRecordList, meta: { title: '儿童健康管理系统 - 接种记录查看' } },
      { path: 'notice-list', component: NoticeList },
      { path: 'notice-add', component: NoticeAdd },
      { path: 'notice-edit/:id', component: NoticeEdit },
      { path: 'feedback-list', component: FeedbackList }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 统一设置浏览器标题，后续页面只需要继续补充 route.meta.title。
router.afterEach((to) => {
  document.title = to.meta?.title || '儿童健康管理系统'
})

router.beforeEach((to) => {
  const userInfoStr = localStorage.getItem('userInfo')
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null

  if (to.path === '/login' || to.path === '/register' || to.path === '/forgot-password') {
    return true
  }

  if (!userInfo) {
    return '/login'
  }

  // 三端按角色隔离访问，防止前端直接越权进入其它端页面。
  if (to.path.startsWith('/admin') && userInfo.role !== 'admin') {
    if (userInfo.role === 'doctor') return '/doctor/home'
    if (userInfo.role === 'parent') return '/parent/home'
    return '/login'
  }

  if (to.path.startsWith('/doctor') && userInfo.role !== 'doctor') {
    if (userInfo.role === 'admin') return '/admin/home'
    if (userInfo.role === 'parent') return '/parent/home'
    return '/login'
  }

  if (to.path.startsWith('/parent') && userInfo.role !== 'parent') {
    if (userInfo.role === 'admin') return '/admin/home'
    if (userInfo.role === 'doctor') return '/doctor/home'
    return '/login'
  }

  if ((to.path.startsWith('/doctor') || to.path.startsWith('/parent')) &&
    (to.path.includes('/notice-') || to.path.includes('/notice-add') || to.path.includes('/notice-edit'))) {
    return userInfo.role === 'doctor' ? '/doctor/notices' : '/parent/notices'
  }

  return true
})

export default router
