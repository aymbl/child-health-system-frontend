<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="logo">医生工作台</div>

      <el-menu
        router
        :default-active="$route.path"
        class="menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/doctor/home"><span>首页</span></el-menu-item>
        <el-menu-item index="/doctor/appointments"><span>体检预约处理</span></el-menu-item>
        <el-menu-item index="/doctor/check-records"><span>我负责的体检记录</span></el-menu-item>
        <el-menu-item index="/doctor/growthRecordList"><span>我负责的成长记录</span></el-menu-item>
        <el-menu-item index="/doctor/doctorVaccinationRecord"><span>疫苗申请与接种</span></el-menu-item>
        <el-menu-item index="/doctor/questionnaires"><span>随访问卷结果</span></el-menu-item>
        <el-menu-item index="/doctor/notices"><span>我的通知</span></el-menu-item>
        <el-menu-item index="/doctor/feedback"><span>与我相关的反馈</span></el-menu-item>
      </el-menu>
    </aside>

    <div class="main-container">
      <header class="header">
        <div class="header-title">医生工作台</div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-panel doctor">
              <div class="avatar-wrap doctor">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="user-meta">
                <div class="user-name">{{ currentUser.realName || currentUser.username || '医生' }}</div>
                <el-tag size="small" effect="light" type="primary">医生</el-tag>
              </div>
              <el-icon class="caret"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>{{ currentUser.realName || currentUser.username || '医生' }}</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown, UserFilled } from '@element-plus/icons-vue'
import { logout } from '@/api/auth'

const router = useRouter()
const currentUser = computed(() => {
  const str = localStorage.getItem('userInfo')
  return str ? JSON.parse(str) : {}
})

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('退出登录失败：', error)
  }
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}
</script>

<style scoped>
.layout-container { display: flex; height: 100vh; overflow: hidden; background-color: #f5f7fa; }
.sidebar { width: 220px; min-width: 220px; max-width: 220px; flex: 0 0 220px; overflow-y: auto; overflow-x: hidden; background: #304156; }
.logo { height: 60px; line-height: 60px; text-align: center; font-size: 18px; font-weight: bold; color: #fff; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.menu { border-right: none; width: 100%; }
.main-container { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
.header { height: 60px; flex-shrink: 0; background-color: #fff; border-bottom: 1px solid #ebeef5; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; box-sizing: border-box; }
.header-title { font-size: 18px; font-weight: 700; color: #303133; }
.header-right { display: flex; align-items: center; }
.user-panel { display: inline-flex; align-items: center; gap: 14px; padding: 10px 14px; border-radius: 14px; cursor: pointer; border: 1px solid transparent; background: #fff; transition: all 0.2s ease; }
.user-panel:hover { box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08); transform: translateY(-1px); }
.user-panel.doctor { border-color: #93c5fd; background: linear-gradient(180deg, #f8fbff 0%, #eff6ff 100%); }
.avatar-wrap { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; }
.avatar-wrap.doctor { color: #1d4ed8; background: #dbeafe; }
.user-meta { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 6px; min-width: 84px; }
.user-name { font-size: 14px; font-weight: 700; color: #303133; line-height: 1.2; }
.caret { color: #909399; font-size: 14px; }
.content { flex: 1; min-width: 0; overflow: auto; padding: 20px; box-sizing: border-box; }
</style>
