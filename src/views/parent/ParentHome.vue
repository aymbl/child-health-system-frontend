<template>
  <div class="page-container">
    <section class="hero-banner">
      <div class="hero-copy">
        <el-tag type="success" effect="dark" round>我的服务</el-tag>
        <h2>我的服务首页</h2>
        <p>欢迎回来，{{ currentUser.realName || currentUser.username || '家长' }}。在这里查看孩子信息、体检预约、疫苗申请与最近通知。</p>
      </div>
      <img class="hero-image" src="/parent-home-banner.png" alt="家长服务横幅" />
    </section>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="stat-card" shadow="hover"><div class="stat-label">我的孩子</div><div class="stat-value">{{ childCount }}</div><div class="stat-desc">已关联儿童数量</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="stat-card" shadow="hover"><div class="stat-label">体检预约</div><div class="stat-value">{{ appointmentCount }}</div><div class="stat-desc">当前可查看体检预约数量</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="stat-card" shadow="hover"><div class="stat-label">体检记录</div><div class="stat-value">{{ checkRecordCount }}</div><div class="stat-desc">当前可查看体检记录数量</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="stat-card" shadow="hover"><div class="stat-label">通知查看</div><div class="stat-value">{{ noticeList.length }}</div><div class="stat-desc">首页展示最近 5 条通知</div></el-card></el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :xl="14">
        <el-card class="section-card" shadow="hover">
          <template #header><div class="section-header"><span>通知查看</span><el-button type="primary" link @click="goNoticePage">查看更多</el-button></div></template>
          <el-empty v-if="noticeList.length === 0" :image="emptyRecordsImage" :image-size="150" description="暂无通知数据" />
          <div v-else class="notice-list">
            <div v-for="item in noticeList" :key="item.id" class="notice-item" @click="goNoticePage">
              <div class="notice-main">
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-content-preview">{{ item.content }}</div>
              </div>
              <div class="notice-time">{{ formatDateTime(item.created_at || item.createdAt) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="10">
        <el-card class="section-card" shadow="hover">
          <template #header><div class="section-header"><span>快捷服务</span></div></template>
          <div class="quick-list">
            <div class="quick-item" @click="router.push('/parent/children')"><div class="quick-title">我的孩子</div><div class="quick-desc">查看孩子基础信息和健康档案。</div></div>
            <div class="quick-item" @click="router.push('/parent/appointments')"><div class="quick-title">我的体检预约</div><div class="quick-desc">查看体检预约安排和处理状态。</div></div>
            <div class="quick-item" @click="router.push('/parent/appointment-apply')"><div class="quick-title">体检预约申请</div><div class="quick-desc">为孩子提交新的体检预约申请。</div></div>
            <div class="quick-item" @click="router.push('/parent/vaccine-apply')"><div class="quick-title">疫苗申请</div><div class="quick-desc">提交新的疫苗接种申请。</div></div>
            <div class="quick-item" @click="router.push('/parent/questionnaires')"><div class="quick-title">随访问卷</div><div class="quick-desc">填写并查看孩子近期随访问卷。</div></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="section-card vaccine-card" shadow="hover">
      <template #header>
        <div class="section-header">
          <div>
            <span>近期疫苗申请与提醒</span>
            <small>请及时关注待确认、已确认和已过期的接种安排</small>
          </div>
          <el-button type="primary" link @click="goParentVaccineReminder">查看更多</el-button>
        </div>
      </template>
      <el-empty v-if="recentVaccineList.length === 0" :image="emptyServiceImage" :image-size="150" description="暂无疫苗提醒数据" />
      <el-table v-else :data="recentVaccineList" border stripe style="width: 100%">
        <el-table-column prop="childName" label="儿童姓名" width="120" align="center" />
        <el-table-column prop="vaccineName" label="疫苗名称" min-width="150" align="center" />
        <el-table-column label="应接种日期" width="130" align="center"><template #default="{ row }">{{ formatDate(row.scheduledDate) }}</template></el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getVaccineStatusType(row.status)">{{ row.status || '未知' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNoticeList } from '@/api/notice'
import { getChildrenByParentId } from '@/api/child'
import { getAppointmentsByParentId } from '@/api/appointment'
import { getCheckRecordsByParentId } from '@/api/checkRecord'
import { getVaccineRemindersByParentId } from '@/api/vaccineReminder'
import { formatDateTime, formatDate } from '@/utils/format'

const router = useRouter()
const recentVaccineList = ref([])
const currentUser = computed(() => {
  const str = localStorage.getItem('userInfo')
  return str ? JSON.parse(str) : {}
})
const noticeList = ref([])
const childCount = ref(0)
const appointmentCount = ref(0)
const checkRecordCount = ref(0)
const emptyRecordsImage = '/empty-records.png'
const emptyServiceImage = '/empty-service.png'
const vaccineStatusOrder = { 已过期: 1, 待确认: 2, 已确认: 3, 已拒绝: 4, 已接种: 5 }

const getVaccineStatusType = status => {
  if (status === '待确认') return 'warning'
  if (status === '已确认') return 'primary'
  if (status === '已拒绝' || status === '已过期') return 'danger'
  if (status === '已接种') return 'success'
  return 'info'
}

const loadRecentVaccineList = async () => {
  try {
    const parentId = currentUser.value.id
    if (!parentId) return
    const res = await getVaccineRemindersByParentId(parentId)
    const list = res.data || []
    recentVaccineList.value = list
      .filter(item => ['待确认', '已确认', '已过期'].includes(item.status))
      .sort((a, b) => {
        const orderA = vaccineStatusOrder[a.status] || 99
        const orderB = vaccineStatusOrder[b.status] || 99
        if (orderA !== orderB) return orderA - orderB
        return new Date(a.scheduledDate) - new Date(b.scheduledDate)
      })
      .slice(0, 5)
  } catch (error) {
    console.error('加载疫苗提醒失败：', error)
  }
}

const goParentVaccineReminder = () => router.push('/parent/parentVaccineReminder')
const loadNoticeList = async () => {
  try {
    const res = await getNoticeList()
    noticeList.value = (res.data || []).slice(0, 5)
  } catch (error) {
    console.error('加载通知失败：', error)
  }
}
const loadChildCount = async () => {
  try {
    const res = await getChildrenByParentId(currentUser.value.id)
    childCount.value = (res.data || []).length
  } catch (error) {
    console.error('加载孩子数量失败：', error)
    childCount.value = 0
  }
}
const loadAppointmentCount = async () => {
  try {
    const res = await getAppointmentsByParentId(currentUser.value.id)
    appointmentCount.value = (res.data || []).length
  } catch (error) {
    console.error('加载体检预约数量失败：', error)
    appointmentCount.value = 0
  }
}
const loadCheckRecordCount = async () => {
  try {
    const res = await getCheckRecordsByParentId(currentUser.value.id)
    checkRecordCount.value = (res.data || []).length
  } catch (error) {
    console.error('加载体检记录数量失败：', error)
    checkRecordCount.value = 0
  }
}
const goNoticePage = () => router.push('/parent/notices')

onMounted(() => {
  loadNoticeList()
  loadChildCount()
  loadAppointmentCount()
  loadCheckRecordCount()
  loadRecentVaccineList()
})
</script>

<style scoped>
.page-container { min-height: 100%; background: linear-gradient(180deg, rgba(241, 250, 244, 0.72), rgba(255, 255, 255, 0.98)), url('/dashboard-bg.png') center top/cover no-repeat; }
.hero-banner { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(280px, 420px); gap: 28px; align-items: center; margin-bottom: 22px; padding: 28px 32px; border-radius: 24px; background: linear-gradient(135deg, rgba(235, 250, 241, 0.96), rgba(255, 255, 255, 0.92)); box-shadow: 0 16px 38px rgba(31, 35, 41, 0.08); }
.hero-copy h2 { margin: 14px 0 12px; font-size: 34px; color: #2b2f36; }
.hero-copy p { margin: 0; max-width: 560px; font-size: 15px; line-height: 1.8; color: #6b7280; }
.hero-image { width: 100%; max-height: 260px; object-fit: contain; }
.stat-row { margin-bottom: 20px; }
.stat-card, .section-card { border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.72); box-shadow: 0 12px 30px rgba(31, 35, 41, 0.06); }
.stat-label { font-size: 14px; color: #9aa1aa; margin-bottom: 12px; }
.stat-value { font-size: 36px; font-weight: 700; color: #2f3540; line-height: 1; margin-bottom: 10px; }
.stat-desc { font-size: 13px; color: #8e96a3; }
.section-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 18px; font-weight: 700; color: #2f3540; }
.section-header small { display: block; margin-top: 4px; font-size: 12px; font-weight: 400; color: #909399; }
.notice-list { display: flex; flex-direction: column; gap: 10px; }
.notice-item { display: flex; justify-content: space-between; gap: 14px; padding: 14px 16px; border-radius: 14px; background: #f8fdf9; cursor: pointer; transition: 0.2s ease; }
.notice-item:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(103, 194, 58, 0.08); }
.notice-main { min-width: 0; flex: 1; }
.notice-title { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 6px; }
.notice-content-preview { font-size: 13px; color: #909399; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notice-time { flex-shrink: 0; font-size: 12px; color: #909399; }
.quick-list { display: flex; flex-direction: column; gap: 12px; }
.quick-item { padding: 16px; border-radius: 14px; background: linear-gradient(135deg, #f4fcf6, #ffffff); border: 1px solid #ddf1e3; cursor: pointer; transition: 0.2s ease; }
.quick-item:hover { transform: translateY(-2px); border-color: #88cf95; box-shadow: 0 12px 24px rgba(103, 194, 58, 0.1); }
.quick-title { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 6px; }
.quick-desc { font-size: 13px; color: #7f8a98; line-height: 1.7; }
.vaccine-card { margin-top: 20px; }
@media (max-width: 1024px) { .hero-banner { grid-template-columns: 1fr; } }
</style>
