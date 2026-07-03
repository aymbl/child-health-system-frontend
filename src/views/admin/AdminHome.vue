<template>
  <div class="page-container">
    <section class="hero-banner">
      <div class="hero-copy">
        <el-tag type="warning" effect="dark" round>管理中心</el-tag>
        <h2>全量业务概览</h2>
        <p>集中查看儿童档案、体检预约、疫苗申请与系统提醒，用于查询、统计和必要协调。</p>
      </div>
      <img class="hero-image" src="/admin-home-banner.png" alt="管理中心横幅" />
    </section>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-label">儿童总数</div>
          <div class="stat-value">{{ stats.childCount }}</div>
          <div class="stat-desc">系统内已建档儿童数量</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-label">今日体检预约</div>
          <div class="stat-value">{{ stats.todayAppointmentCount }}</div>
          <div class="stat-desc">当天新增或安排中的体检预约数量</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-label">体检记录</div>
          <div class="stat-value">{{ stats.checkRecordCount }}</div>
          <div class="stat-desc">系统累计体检记录数量</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :xs="24" :xl="12">
        <el-card class="section-card" shadow="hover">
          <template #header><div class="section-header"><span>近期体检预约</span></div></template>
          <el-empty v-if="recentAppointments.length === 0" :image="emptyServiceImage" :image-size="150" description="暂无近期体检预约" />
          <el-table v-else :data="recentAppointments" border stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="70" align="center" />
            <el-table-column prop="childName" label="儿童姓名" min-width="110" align="center" />
            <el-table-column prop="doctorName" label="医生姓名" min-width="110" align="center" />
            <el-table-column label="体检预约时间" min-width="170" align="center">
              <template #default="{ row }">{{ formatDateTime(row.appointmentTime || row.appointment_time) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getAppointmentStatusType(row.status)">{{ row.status || '未知' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="12">
        <el-card class="section-card" shadow="hover">
          <template #header>
            <div class="section-header">
              <div>
                <span>近期疫苗申请与提醒</span>
                <small>优先关注待确认、已确认和已过期记录</small>
              </div>
              <el-button type="primary" link @click="goVaccineReminderList">查看更多</el-button>
            </div>
          </template>
          <el-empty v-if="recentVaccineList.length === 0" :image="emptyServiceImage" :image-size="150" description="暂无近期疫苗提醒" />
          <el-table v-else :data="recentVaccineList" border stripe style="width: 100%">
            <el-table-column prop="childName" label="儿童姓名" min-width="110" align="center" />
            <el-table-column prop="vaccineName" label="疫苗名称" min-width="130" align="center" />
            <el-table-column label="应接种日期" width="130" align="center">
              <template #default="{ row }">{{ formatDate(row.scheduledDate) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getVaccineStatusType(row.status)">{{ row.status || '未知' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="section-card" shadow="hover">
      <template #header><div class="section-header"><span>最新通知</span></div></template>
      <el-empty v-if="latestNotices.length === 0" :image="emptyRecordsImage" :image-size="150" description="暂无系统通知" />
      <el-table v-else :data="latestNotices" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="title" label="通知标题" min-width="220" show-overflow-tooltip />
        <el-table-column label="发布时间" width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.createdAt || row.created_at) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getAdminHomeStats, getRecentAppointments, getLatestNotices } from '@/api/adminHome'
import { formatDateTime, formatDate } from '@/utils/format'
import { useRouter } from 'vue-router'
import request from '@/api/request'

const stats = reactive({ childCount: 0, todayAppointmentCount: 0, checkRecordCount: 0 })
const recentAppointments = ref([])
const latestNotices = ref([])
const recentVaccineList = ref([])
const router = useRouter()

const emptyServiceImage = '/empty-service.png'
const emptyRecordsImage = '/empty-records.png'
const vaccineStatusOrder = { 已过期: 1, 待确认: 2, 已确认: 3, 已拒绝: 4, 已接种: 5 }

const getAppointmentStatusType = status => {
  if (status === '待确认') return 'warning'
  if (status === '已确认' || status === '待就诊') return 'primary'
  if (status === '已拒绝') return 'danger'
  if (status === '已完成') return 'success'
  if (status === '已取消') return 'info'
  return 'info'
}

const getVaccineStatusType = status => {
  if (status === '待确认') return 'warning'
  if (status === '已确认') return 'primary'
  if (status === '已拒绝' || status === '已过期') return 'danger'
  if (status === '已接种') return 'success'
  return 'info'
}

const loadAdminHomeStats = async () => {
  try {
    const res = await getAdminHomeStats()
    const data = res.data || {}
    stats.childCount = data.childCount || 0
    stats.todayAppointmentCount = data.todayAppointmentCount || 0
    stats.checkRecordCount = data.checkRecordCount || 0
  } catch (error) {
    console.error('获取首页统计失败：', error)
  }
}

const loadRecentAppointments = async () => {
  try {
    const res = await getRecentAppointments()
    recentAppointments.value = res.data || []
  } catch (error) {
    console.error('获取近期体检预约失败：', error)
  }
}

const loadRecentVaccineList = async () => {
  try {
    const res = await request.get('/vaccineReminders')
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
    console.error('加载近期疫苗提醒失败：', error)
  }
}

const goVaccineReminderList = () => router.push('/admin/vaccineReminderList')

const loadLatestNotices = async () => {
  try {
    const res = await getLatestNotices()
    latestNotices.value = res.data || []
  } catch (error) {
    console.error('获取最新通知失败：', error)
  }
}

onMounted(() => {
  loadAdminHomeStats()
  loadRecentAppointments()
  loadLatestNotices()
  loadRecentVaccineList()
})
</script>

<style scoped>
.page-container { min-height: 100%; background: linear-gradient(180deg, rgba(255, 247, 238, 0.72), rgba(255, 255, 255, 0.96)), url('/dashboard-bg.png') center top/cover no-repeat; }
.hero-banner { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(280px, 420px); gap: 28px; align-items: center; margin-bottom: 22px; padding: 28px 32px; border-radius: 24px; background: linear-gradient(135deg, rgba(255, 244, 229, 0.96), rgba(255, 255, 255, 0.92)); box-shadow: 0 16px 38px rgba(31, 35, 41, 0.08); }
.hero-copy h2 { margin: 14px 0 12px; font-size: 34px; color: #2b2f36; }
.hero-copy p { margin: 0; max-width: 560px; font-size: 15px; line-height: 1.8; color: #6b7280; }
.hero-image { width: 100%; max-height: 260px; object-fit: contain; }
.stat-row, .content-row { margin-bottom: 20px; }
.stat-card, .section-card { border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.72); box-shadow: 0 12px 30px rgba(31, 35, 41, 0.06); }
.stat-label { font-size: 14px; color: #9aa1aa; margin-bottom: 12px; }
.stat-value { font-size: 38px; font-weight: 700; color: #2f3540; line-height: 1; margin-bottom: 10px; }
.stat-desc { font-size: 13px; color: #8e96a3; }
.section-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 18px; font-weight: 700; color: #2f3540; }
.section-header small { display: block; margin-top: 4px; font-size: 12px; font-weight: 400; color: #909399; }
@media (max-width: 1024px) { .hero-banner { grid-template-columns: 1fr; } .hero-image { max-height: 220px; } }
</style>
