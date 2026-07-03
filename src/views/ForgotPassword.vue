<template>
  <div class="forgot-page">
    <div class="forgot-wrapper">
      <el-card class="forgot-card" shadow="hover">
        <div class="page-header">
          <h2>忘记密码</h2>
          <p>请填写账号信息并完成验证码校验后重置密码</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" clearable />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入注册手机号" clearable />
          </el-form-item>

          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码" />
          </el-form-item>

          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
          </el-form-item>

          <el-form-item label="图形验证码" prop="captchaInput">
            <div class="captcha-row">
              <el-input v-model="form.captchaInput" placeholder="请输入验证码" clearable />
              <div class="captcha-box" @click="refreshCaptcha" :title="'点击刷新验证码'">
                {{ captchaCode }}
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button @click="router.push('/login')">返回登录</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">重置密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { forgotPassword } from '@/api/user'

const router = useRouter()
const formRef = ref()
const submitting = ref(false)

const createCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const captchaCode = ref(createCaptcha())
const form = reactive({
  username: '',
  phone: '',
  newPassword: '',
  confirmPassword: '',
  captchaInput: ''
})

const validateConfirmPassword = (_rule, value, callback) => {
  if (!value) return callback(new Error('请再次输入新密码'))
  if (value !== form.newPassword) return callback(new Error('两次输入的新密码不一致'))
  callback()
}

const validateCaptcha = (_rule, value, callback) => {
  if (!value) return callback(new Error('请输入验证码'))
  if (value.trim().toUpperCase() !== captchaCode.value) {
    return callback(new Error('验证码错误'))
  }
  callback()
}

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
  captchaInput: [{ validator: validateCaptcha, trigger: 'blur' }]
}

const refreshCaptcha = () => {
  captchaCode.value = createCaptcha()
  form.captchaInput = ''
  formRef.value?.clearValidate('captchaInput')
}

const handleSubmit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    await forgotPassword({
      username: form.username,
      phone: form.phone,
      newPassword: form.newPassword
    })
    ElMessage.success('密码重置成功，请使用新密码登录')
    router.push('/login')
  } catch (error) {
    refreshCaptcha()
    console.error('重置密码失败：', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.forgot-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #eef4ff 0%, #f7fbff 100%);
}
.forgot-wrapper { width: 100%; max-width: 620px; }
.forgot-card { border-radius: 18px; }
.page-header { margin-bottom: 24px; text-align: center; }
.page-header h2 { margin: 0 0 10px; font-size: 30px; color: #1f2937; }
.page-header p { margin: 0; color: #6b7280; font-size: 14px; }
.captcha-row { width: 100%; display: flex; gap: 12px; align-items: center; }
.captcha-box {
  width: 132px;
  height: 40px;
  border-radius: 10px;
  border: 1px dashed #93c5fd;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1d4ed8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 4px;
  cursor: pointer;
  user-select: none;
}
</style>
