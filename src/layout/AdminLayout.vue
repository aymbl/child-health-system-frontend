<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="logo">儿童健康管理系统</div>

      <el-menu
        router
        :default-active="$route.path"
        class="menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/admin/home"><span>首页</span></el-menu-item>

        <el-sub-menu index="user-manage">
          <template #title><span>用户管理</span></template>
          <el-menu-item index="/admin/admin-list">管理员</el-menu-item>
          <el-menu-item index="/admin/doctor-list">医生</el-menu-item>
          <el-menu-item index="/admin/parent-list">家长</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="business-overview">
          <template #title><span>儿童与业务总览</span></template>
          <el-menu-item index="/admin/child-list">儿童信息总览</el-menu-item>
          <el-menu-item index="/admin/appointment-list">体检预约总览</el-menu-item>
          <el-menu-item index="/admin/check-record-list">体检记录查看</el-menu-item>
          <el-menu-item index="/admin/growthRecordList">成长记录查看</el-menu-item>
          <el-menu-item index="/admin/vaccinationRecordList">接种记录查看</el-menu-item>
          <el-menu-item index="/admin/vaccineReminderList">疫苗提醒总览</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="system-service">
          <template #title><span>系统服务</span></template>
          <el-menu-item index="/admin/notice-list">通知管理</el-menu-item>
          <el-menu-item index="/admin/feedback-list">反馈管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <div class="main-container">
      <header class="header">
        <div class="header-title">管理中心</div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-panel admin">
              <div class="avatar-wrap admin">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="user-meta">
                <div class="user-name">{{ currentUser.realName || currentUser.username || '管理员' }}</div>
                <el-tag size="small" effect="light" type="warning">管理员</el-tag>
              </div>
              <el-icon class="caret"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <span>{{ currentUser.realName || currentUser.username || '管理员' }}</span>
                </el-dropdown-item>
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
.logo { height: 60px; line-height: 60px; text-align: center; font-size: 18px; font-weight: bold; color: #fff; border-bottom: 1px solid rgba(255, 255, 255, 0.1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 10px; box-sizing: border-box; }
.menu { border-right: none; width: 100%; }
.main-container { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box; }
.header { height: 60px; flex-shrink: 0; background-color: #fff; border-bottom: 1px solid #ebeef5; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; box-sizing: border-box; }
.header-title { font-size: 18px; font-weight: 700; color: #303133; }
.header-right { display: flex; align-items: center; }
.user-panel { display: inline-flex; align-items: center; gap: 14px; padding: 10px 14px; border-radius: 14px; cursor: pointer; border: 1px solid transparent; background: #fff; transition: all 0.2s ease; }
.user-panel:hover { box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08); transform: translateY(-1px); }
.user-panel.admin { border-color: #fdba74; background: linear-gradient(180deg, #fffaf5 0%, #fff7ed 100%); }
.avatar-wrap { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; }
.avatar-wrap.admin { color: #9a3412; background: #fed7aa; }
.user-meta { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 6px; min-width: 84px; }
.user-name { font-size: 14px; font-weight: 700; color: #303133; line-height: 1.2; }
.caret { color: #909399; font-size: 14px; }
.content { flex: 1; min-width: 0; overflow: auto; padding: 20px; box-sizing: border-box; }
</style>
