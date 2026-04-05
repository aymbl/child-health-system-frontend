<template>
	<div class="page-container">
		<h2 class="page-title">新增儿童</h2>

		<el-card>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="110px" style="max-width: 700px">
				<el-form-item label="儿童姓名" prop="name">
					<el-input v-model="form.name" placeholder="请输入儿童姓名" />
				</el-form-item>

				<el-form-item label="性别" prop="gender">
					<el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
						<el-option label="男" value="男" />
						<el-option label="女" value="女" />
					</el-select>
				</el-form-item>

				<el-form-item label="出生日期" prop="birthDate">
					<el-date-picker v-model="form.birthDate" type="date" placeholder="请选择出生日期" value-format="YYYY-MM-DD"
						style="width: 100%" />
				</el-form-item>

				<el-form-item label="家长ID" prop="parentId">
					<el-input v-model="form.parentId" placeholder="请输入家长用户ID" />
				</el-form-item>

				<el-form-item label="血型" prop="bloodType">
					<el-select v-model="form.bloodType" placeholder="请选择血型" style="width: 100%">
						<el-option label="A" value="A" />
						<el-option label="B" value="B" />
						<el-option label="AB" value="AB" />
						<el-option label="O" value="O" />
					</el-select>
				</el-form-item>

				<el-form-item label="过敏史" prop="allergyHistory">
					<el-input v-model="form.allergyHistory" placeholder="请输入过敏史，没有可填无" />
				</el-form-item>

				<el-form-item label="出生身高(cm)" prop="birthHeight">
					<el-input v-model="form.birthHeight" placeholder="请输入出生身高" />
				</el-form-item>

				<el-form-item label="出生体重(kg)" prop="birthWeight">
					<el-input v-model="form.birthWeight" placeholder="请输入出生体重" />
				</el-form-item>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="handleSubmit">提交</el-button>
					<el-button @click="handleReset">重置</el-button>
					<el-button @click="goBack">返回列表</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue'
	import {
		ElMessage
	} from 'element-plus'
	import {
		useRouter
	} from 'vue-router'
	import {
		addChild
	} from '@/api/child'

	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		name: '',
		gender: '',
		birthDate: '',
		parentId: '',
		bloodType: '',
		allergyHistory: '',
		birthHeight: '',
		birthWeight: '',
		remark: ''
	})

	const rules = {
		name: [{
			required: true,
			message: '请输入儿童姓名',
			trigger: 'blur'
		}],
		gender: [{
			required: true,
			message: '请选择性别',
			trigger: 'change'
		}],
		birthDate: [{
			required: true,
			message: '请选择出生日期',
			trigger: 'change'
		}],
		parentId: [{
			required: true,
			message: '请输入家长ID',
			trigger: 'blur'
		}]
	}

	const handleSubmit = () => {
		formRef.value.validate(async (valid) => {
			if (!valid) {
				return
			}

			try {
				await addChild({
					...form,
					parentId: Number(form.parentId),
					birthHeight: form.birthHeight ? Number(form.birthHeight) : null,
					birthWeight: form.birthWeight ? Number(form.birthWeight) : null
				})

				ElMessage.success('新增成功')
				router.push('/admin/child-list')
			} catch (error) {
				console.error('新增儿童失败：', error)
			}
		})
	}

	const handleReset = () => {
		formRef.value.resetFields()
	}

	const goBack = () => {
		router.push('/admin/child-list')
	}
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-title {
		margin: 0 0 20px 0;
	}
</style>