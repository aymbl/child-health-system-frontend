<template>
  <div>
    <h2>体检申请</h2>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="选择孩子" prop="childId">
        <el-select v-model="form.childId" placeholder="请选择孩子">
          <el-option v-for="child in children" :key="child.id" :label="child.name" :value="child.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期" prop="checkDate">
        <el-date-picker v-model="form.checkDate" type="date" placeholder="选择体检日期" />
      </el-form-item>
      <el-form-item label="症状备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="描述孩子当前症状或需求" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleApply">提交申请</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getChildrenByParentId } from '@/api/child'
import { applyCheckRecord } from '@/api/checkRecord'

const formRef = ref()
const children = ref([])

const form = reactive({
  childId: null,
  checkDate: '',
  remark: ''
})

const rules = {
  childId: [{ required: true, message: '请选择孩子' }],
  checkDate: [{ required: true, message: '请选择日期' }]
}

onMounted(async () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const res = await getChildrenByParentId(userInfo.id)
  children.value = res.data || []
})

const handleApply = async () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    try {
      await applyCheckRecord(form)
      ElMessage.success('申请提交成功，等待安排')
    } catch (error) {
      ElMessage.error('申请失败')
    }
  })
}
</script>
