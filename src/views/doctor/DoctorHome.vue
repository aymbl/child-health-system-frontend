<template>
  <div class="page-container">
    <section class="hero-banner">
      <div class="hero-copy">
        <el-tag type="primary" effect="dark" round>我的业务</el-tag>
        <h2>我的业务首页</h2>
        <p>当前登录医生：{{ currentUser.realName || currentUser.username || '医生' }}。集中查看我负责的预约、体检、成长记录、疫苗申请与接种记录。</p>
      </div>
      <img class="hero-image" src="/doctor-home-banner.png" alt="医生业务横幅" />
    </section>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="stat-card" shadow="hover"><div class="stat-label">我负责的预约</div><div class="stat-value">{{ appointmentCount }}</div><div class="stat-desc">当前与我关联的预约总数</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="stat-card" shadow="hover"><div class="stat-label">待确认体检预约</div><div class="stat-value">{{ pendingAppointmentCount }}</div><div class="stat-desc">等待处理的体检预约数量</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="stat-card" shadow="hover"><div class="stat-label">我负责的体检记录</div><div class="stat-value">{{ checkRecordCount }}</div><div class="stat-desc">当前可查看的体检记录数量</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="stat-card" shadow="hover"><div class="stat-label">最新通知</div><div class="stat-value">{{ noticeList.length }}</div><div class="stat-desc">首页展示最近 5 条通知</div></el-card></el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :xl="14">
        <el-card class="section-card" shadow="hover">
          <template #header><div class="section-header"><span>最新通知</span><el-button type="primary" link @click="router.push('/doctor/notices')">查看更多</el-button></div></template>
          <el-empty v-if="noticeList.length === 0" :image="emptyRecordsImage" :image-size="150" description="暂无通知" />
          <div v-else class="notice-list">
            <div v-for="item in noticeList" :key="item.id" class="notice-item" @click="router.push('/doctor/notices')">
              <div class="notice-main">
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-content-preview">{{ item.content }}</div>
              </div>
              <div class="notice-time">{{ formatDateTime(item.createdAt || item.created_at) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="10">
        <el-card class="section-card" shadow="hover">
          <template #header><div class="section-header"><span>快捷入口</span></div></template>
          <div class="quick-list">
            <div class="quick-item" @click="router.push('/doctor/appointments')"><div class="quick-title">体检预约处理</div><div class="quick-desc">查看并推进我负责的体检预约状态。</div></div>
            <div class="quick-item" @click="router.push('/doctor/check-records')"><div class="quick-title">我负责的体检记录</div><div class="quick-desc">查看我负责的体检记录和处理建议。</div></div>
            <div class="quick-item" @click="router.push('/doctor/growthRecordList')"><div class="quick-title">我负责的成长记录</div><div class="quick-desc">查看儿童成长变化和近期趋势。</div></div>
            <div class="quick-item" @click="router.push('/doctor/doctorVaccinationRecord')"><div class="quick-title">疫苗申请与接种</div><div class="quick-desc">处理疫苗申请，并在接种完成后录入记录。</div></div>
            <div class="quick-item" @click="router.push('/doctor/questionnaires')"><div class="quick-title">随访问卷结果</div><div class="quick-desc">查看与我相关的家长随访问卷结果。</div></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAppointmentsByDoctorId } from '@/api/appointment'
import { getCheckRecordsByDoctorId } from '@/api/checkRecord'
import { getNoticeList } from '@/api/notice'
import { formatDateTime } from '@/utils/format'

const router = useRouter()
const currentUser = computed(() => {
  const str = localStorage.getItem('userInfo')
  return str ? JSON.parse(str) : {}
})

const appointmentCount = ref(0)
const pendingAppointmentCount = ref(0)
const checkRecordCount = ref(0)
const noticeList = ref([])
const emptyRecordsImage = '/empty-records.png'

const loadAppointmentCount = async () => {
  try {
    const res = await getAppointmentsByDoctorId(currentUser.value.id)
    const list = res.data || []
    appointmentCount.value = list.length
    pendingAppointmentCount.value = list.filter(item => item.status === '待确认').length
  } catch (error) {
    console.error('加载体检预约数量失败：', error)
    appointmentCount.value = 0
    pendingAppointmentCount.value = 0
  }
}

const loadCheckRecordCount = async () => {
  try {
    const res = await getCheckRecordsByDoctorId(currentUser.value.id)
    checkRecordCount.value = (res.data || []).length
  } catch (error) {
    console.error('加载体检记录数量失败：', error)
    checkRecordCount.value = 0
  }
}

const loadNoticeList = async () => {
  try {
    const res = await getNoticeList()
    noticeList.value = (res.data || []).slice(0, 5)
  } catch (error) {
    console.error('加载通知失败：', error)
  }
}

onMounted(() => {
  loadAppointmentCount()
  loadCheckRecordCount()
  loadNoticeList()
})
</script>

<style scoped>
.page-container { min-height: 100%; background: linear-gradient(180deg, rgba(239, 247, 255, 0.72), rgba(255, 255, 255, 0.98)), url('/dashboard-bg.png') center top/cover no-repeat; }
.hero-banner { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(280px, 420px); gap: 28px; align-items: center; margin-bottom: 22px; padding: 28px 32px; border-radius: 24px; background: linear-gradient(135deg, rgba(232, 244, 255, 0.96), rgba(255, 255, 255, 0.92)); box-shadow: 0 16px 38px rgba(31, 35, 41, 0.08); }
.hero-copy h2 { margin: 14px 0 12px; font-size: 34px; color: #2b2f36; }
.hero-copy p { margin: 0; max-width: 560px; font-size: 15px; line-height: 1.8; color: #6b7280; }
.hero-image { width: 100%; max-height: 260px; object-fit: contain; }
.stat-row { margin-bottom: 20px; }
.stat-card, .section-card { border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.72); box-shadow: 0 12px 30px rgba(31, 35, 41, 0.06); }
.stat-label { font-size: 14px; color: #9aa1aa; margin-bottom: 12px; }
.stat-value { font-size: 36px; font-weight: 700; color: #2f3540; line-height: 1; margin-bottom: 10px; }
.stat-desc { font-size: 13px; color: #8e96a3; }
.section-header { display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700; color: #2f3540; }
.notice-list { display: flex; flex-direction: column; gap: 10px; }
.notice-item { display: flex; justify-content: space-between; gap: 14px; padding: 14px 16px; border-radius: 14px; background: #f8fbff; cursor: pointer; transition: 0.2s ease; }
.notice-item:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(64, 158, 255, 0.08); }
.notice-main { min-width: 0; flex: 1; }
.notice-title { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 6px; }
.notice-content-preview { font-size: 13px; color: #909399; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notice-time { flex-shrink: 0; font-size: 12px; color: #909399; }
.quick-list { display: flex; flex-direction: column; gap: 12px; }
.quick-item { padding: 16px; border-radius: 14px; background: linear-gradient(135deg, #f5faff, #ffffff); border: 1px solid #e3eefb; cursor: pointer; transition: 0.2s ease; }
.quick-item:hover { transform: translateY(-2px); border-color: #7cb2ff; box-shadow: 0 12px 24px rgba(64, 158, 255, 0.1); }
.quick-title { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 6px; }
.quick-desc { font-size: 13px; color: #7f8a98; line-height: 1.7; }
@media (max-width: 1024px) { .hero-banner { grid-template-columns: 1fr; } }
</style>
