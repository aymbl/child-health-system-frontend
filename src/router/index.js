import {
	createRouter,
	createWebHistory
} from 'vue-router'

import AdminLayout from '@/layout/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'

import Login from '@/views/Login.vue'

import DoctorLayout from '@/layout/DoctorLayout.vue'

import DoctorCheckRecordList from '@/views/doctor/DoctorCheckRecordList.vue'
import DoctorCheckRecordAdd from '@/views/doctor/DoctorCheckRecordAdd.vue'
import DoctorCheckRecordEdit from '@/views/doctor/DoctorCheckRecordEdit.vue'

import DoctorNoticeList from '@/views/doctor/DoctorNoticeList.vue'

import DoctorHome from '@/views/doctor/DoctorHome.vue'
import DoctorAppointmentList from '@/views/doctor/DoctorAppointmentList.vue'

import ParentLayout from '@/layout/ParentLayout.vue'
import ParentHome from '@/views/parent/ParentHome.vue'
import ParentChildList from '@/views/parent/ParentChildList.vue'
import ParentAppointmentList from '@/views/parent/ParentAppointmentList.vue'
import ParentCheckRecordList from '@/views/parent/ParentCheckRecordList.vue'
import ParentNoticeList from '@/views/parent/ParentNoticeList.vue'

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
import ChildAdd from '@/views/admin/ChildAdd.vue'
import ChildEdit from '@/views/admin/ChildEdit.vue'

import AppointmentList from '@/views/admin/AppointmentList.vue'
import AppointmentAdd from '@/views/admin/AppointmentAdd.vue'
import AppointmentEdit from '@/views/admin/AppointmentEdit.vue'

import CheckRecordList from '@/views/admin/CheckRecordList.vue'
import CheckRecordAdd from '@/views/admin/CheckRecordAdd.vue'
import CheckRecordEdit from '@/views/admin/CheckRecordEdit.vue'

import NoticeList from '@/views/admin/NoticeList.vue'
import NoticeAdd from '@/views/admin/NoticeAdd.vue'
import NoticeEdit from '@/views/admin/NoticeEdit.vue'

const routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/doctor',
		component: DoctorLayout,
		children: [{
				path: 'home',
				component: DoctorHome
			},
			{
				path: 'appointments',
				component: DoctorAppointmentList
			},
			{
				path: 'check-records',
				component: DoctorCheckRecordList
			},
			{
				path: 'check-record-add',
				component: DoctorCheckRecordAdd
			},
			{
				path: 'check-record-edit/:id',
				component: DoctorCheckRecordEdit
			},
			{
				path: 'notices',
				component: DoctorNoticeList
			}
		]
	},
	{
		path: '/parent',
		component: ParentLayout,
		children: [{
				path: 'home',
				component: ParentHome
			},
			{
				path: 'children',
				component: ParentChildList
			},
			{
				path: 'appointments',
				component: ParentAppointmentList
			},
			{
				path: 'check-records',
				component: ParentCheckRecordList
			},
			{
				path: 'notices',
				component: ParentNoticeList
			}
		]
	},
	{
		path: '/admin',
		component: AdminLayout,
		children: [{
				path: 'dashboard',
				component: Dashboard
			},
			{
				path: 'admin-list',
				component: AdminList
			},
			{
				path: 'admin-add',
				component: AdminAdd
			},
			{
				path: 'admin-edit/:id',
				component: AdminEdit
			},
			{
				path: 'doctor-list',
				component: DoctorList
			},
			{
				path: 'doctor-add',
				component: DoctorAdd
			},
			{
				path: 'doctor-edit/:id',
				component: DoctorEdit
			},
			{
				path: 'parent-list',
				component: ParentList
			},
			{
				path: 'parent-add',
				component: ParentAdd
			},
			{
				path: 'parent-edit/:id',
				component: ParentEdit
			},
			{
				path: 'child-list',
				component: ChildList
			},
			{
				path: 'child-add',
				component: ChildAdd
			},
			{
				path: 'child-edit/:id',
				component: ChildEdit
			},
			{
				path: 'appointment-list',
				component: AppointmentList
			},
			{
				path: 'appointment-add',
				component: AppointmentAdd
			},
			{
				path: 'appointment-edit/:id',
				component: AppointmentEdit
			},
			{
				path: 'check-record-list',
				component: CheckRecordList
			},
			{
				path: 'check-record-add',
				component: CheckRecordAdd
			},
			{
				path: 'check-record-edit/:id',
				component: CheckRecordEdit
			},
			{
				path: 'notice-list',
				component: NoticeList
			},
			{
				path: 'notice-add',
				component: NoticeAdd
			},
			{
				path: 'notice-edit/:id',
				component: NoticeEdit
			}
		]
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from, next) => {
	const userInfoStr = localStorage.getItem('userInfo')
	const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null

	if (to.path === '/login') {
		next()
		return
	}

	if (!userInfo) {
		next('/login')
		return
	}

	if (to.path.startsWith('/admin') && userInfo.role !== 'admin') {
		if (userInfo.role === 'doctor') {
			next('/doctor/home')
		} else if (userInfo.role === 'parent') {
			next('/parent/home')
		} else {
			next('/login')
		}
		return
	}

	if (to.path.startsWith('/doctor') && userInfo.role !== 'doctor') {
		if (userInfo.role === 'admin') {
			next('/admin/dashboard')
		} else if (userInfo.role === 'parent') {
			next('/parent/home')
		} else {
			next('/login')
		}
		return
	}

	if (to.path.startsWith('/parent') && userInfo.role !== 'parent') {
		if (userInfo.role === 'admin') {
			next('/admin/dashboard')
		} else if (userInfo.role === 'doctor') {
			next('/doctor/home')
		} else {
			next('/login')
		}
		return
	}

	next()
})

export default router