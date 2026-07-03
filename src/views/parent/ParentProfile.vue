<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">个人信息</h2>
        <p class="page-subtitle">查看并维护当前账号的基础资料</p>
      </div>
    </div>

    <el-card class="profile-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <div class="avatar-circle">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="header-meta">
              <div class="header-name">{{ profile.realName || profile.username || '家长' }}</div>
              <el-tag type="success" effect="light">家长</el-tag>
            </div>
          </div>
          <el-tooltip content="编辑资料" placement="top">
            <el-button circle type="primary" plain @click="startEdit">
              <el-icon><Edit /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="profile-form">
        <el-form-item label="用户名">
          <el-input :model-value="profile.username" disabled />
        </el-form-item>

        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" :disabled="!editing" placeholder="请输入真实姓名" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" :disabled="!editing" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" :disabled="!editing" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" :disabled="!editing" placeholder="请选择性别" style="width: 100%">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="editing">
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" :loading="saving" @click="submitEdit">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, UserFilled } from '@element-plus/icons-vue'
import { getMyProfile, updateMyProfile } from '@/api/user'

const formRef = ref()
const saving = ref(false)
const editing = ref(false)
const profile = reactive({
  id: null,
  username: '',
  realName: '',
  phone: '',
  email: '',
  gender: '',
  role: '',
  status: 1
})

const form = reactive({
  realName: '',
  phone: '',
  email: '',
  gender: ''
})

const rules = {
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

const syncLocalUserInfo = (data) => {
  localStorage.setItem('userInfo', JSON.stringify(data))
}

const applyProfile = (data) => {
  profile.id = data.id
  profile.username = data.username
  profile.realName = data.realName
  profile.phone = data.phone
  profile.email = data.email
  profile.gender = data.gender
  profile.role = data.role
  profile.status = data.status

  form.realName = data.realName || ''
  form.phone = data.phone || ''
  form.email = data.email || ''
  form.gender = data.gender || ''
}

const loadProfile = async () => {
  try {
    const res = await getMyProfile()
    const data = res.data || {}
    applyProfile(data)
    syncLocalUserInfo(data)
  } catch (error) {
    console.error('加载个人信息失败：', error)
  }
}

const startEdit = () => {
  editing.value = true
}

const cancelEdit = () => {
  editing.value = false
  form.realName = profile.realName || ''
  form.phone = profile.phone || ''
  form.email = profile.email || ''
  form.gender = profile.gender || ''
  formRef.value?.clearValidate()
}

const submitEdit = async () => {
  await formRef.value.validate()
  saving.value = true
  try {
    const res = await updateMyProfile({
      realName: form.realName,
      phone: form.phone,
      email: form.email,
      gender: form.gender
    })
    const data = res.data || {}
    applyProfile(data)
    syncLocalUserInfo(data)
    editing.value = false
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    console.error('更新个人信息失败：', error)
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.profile-card { max-width: 860px; border-radius: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.header-left { display: flex; align-items: center; gap: 14px; }
.avatar-circle { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #dcfce7; color: #166534; font-size: 24px; }
.header-meta { display: flex; flex-direction: column; gap: 6px; }
.header-name { font-size: 18px; font-weight: 700; color: #303133; }
.profile-form { padding-top: 8px; }
</style>
