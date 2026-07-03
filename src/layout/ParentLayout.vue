<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="logo">家长服务平台</div>

      <el-menu
        router
        :default-active="$route.path"
        class="menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/parent/home"><span>首页</span></el-menu-item>
        <el-menu-item index="/parent/children"><span>我的孩子</span></el-menu-item>
        <el-menu-item index="/parent/appointments"><span>我的体检预约</span></el-menu-item>
        <el-menu-item index="/parent/check-records"><span>体检记录查看</span></el-menu-item>
        <el-menu-item index="/parent/parentVaccineReminder"><span>疫苗申请与提醒</span></el-menu-item>
        <el-menu-item index="/parent/vaccination-records"><span>接种记录查看</span></el-menu-item>

        <el-sub-menu index="parent-service">
          <template #title><span>我的服务</span></template>
          <el-menu-item index="/parent/appointment-apply">体检预约申请</el-menu-item>
          <el-menu-item index="/parent/vaccine-apply">疫苗申请</el-menu-item>
          <el-menu-item index="/parent/questionnaires">随访问卷</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/parent/notices"><span>通知查看</span></el-menu-item>
        <el-menu-item index="/parent/feedback"><span>我的反馈</span></el-menu-item>
      </el-menu>
    </aside>

    <div class="main-container">
      <header class="header">
        <div class="header-title">家长服务平台</div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-panel parent">
              <div class="avatar-wrap parent">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="user-meta">
                <div class="user-name">{{ currentUser.realName || currentUser.username || '家长' }}</div>
                <el-tag size="small" effect="light" type="success">家长</el-tag>
              </div>
              <el-icon class="caret"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/parent/profile')">个人信息</el-dropdown-item>
                <el-dropdown-item @click="passwordDialogVisible = true">修改密码</el-dropdown-item>
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

    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="460px" @close="resetPasswordForm">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="90px">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="changingPassword" @click="submitPasswordChange">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { logout } from '@/api/auth'
import { changePassword } from '@/api/user'

const router = useRouter()
const passwordDialogVisible = ref(false)
const passwordFormRef = ref()
const changingPassword = ref(false)

const currentUser = computed(() => {
  const str = localStorage.getItem('userInfo')
  return str ? JSON.parse(str) : {}
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule, value, callback) => {
  if (!value) return callback(new Error('请再次输入新密码'))
  if (value !== passwordForm.newPassword) return callback(new Error('两次输入的新密码不一致'))
  callback()
}

const passwordRules = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
}

const resetPasswordForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
}

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

const submitPasswordChange = () => {
  passwordFormRef.value.validate(async (valid) => {
    if (!valid) return
    changingPassword.value = true
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      ElMessage.success('密码修改成功，请重新登录')
      passwordDialogVisible.value = false
      await handleLogout()
    } catch (error) {
      ElMessage.error(error?.message || error?.response?.data?.message || '修改密码失败')
    } finally {
      changingPassword.value = false
    }
  })
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
.user-panel.parent { border-color: #86efac; background: linear-gradient(180deg, #f7fef9 0%, #ecfdf5 100%); }
.avatar-wrap { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; }
.avatar-wrap.parent { color: #166534; background: #dcfce7; }
.user-meta { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 6px; min-width: 84px; }
.user-name { font-size: 14px; font-weight: 700; color: #303133; line-height: 1.2; }
.caret { color: #909399; font-size: 14px; }
.content { flex: 1; min-width: 0; overflow: auto; padding: 20px; box-sizing: border-box; }
</style>
