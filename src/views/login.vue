<template>
    <div class="container">
        <div class="title">
            <div class="back-home">
                <el-icon><Back /></el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登陆您的帐户</h2>
                <p>请输入您的登录信息</p>
            </div>
        </div>
        <div class="form-container">
            <el-form
            ref="ruleFormRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            >
            <el-form-item label="用户名或邮箱" prop="username">
                <el-input v-model="formData.username" size="large" placeholder="请输入用户名或邮箱" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password />
            </el-form-item>
            <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">
                登录
            </el-button>
            </el-form>
            <div class="footer">
                <p>还没有帐户？<router-link type="primary" to="/auth/register">去注册</router-link></p>
            </div>
        </div>
    </div>
   </template>
<script setup>
import { login } from '@/api/admin'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const ruleFormRef = ref()
const formData = reactive({
    username: '',
    password: ''
})

//登录
const submitForm = async (formEl) => {
    if (!formEl) {
        return
    }
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log(formData ,'formData') 
            login(formData).then(data => {
                //判断token是否存在
                if(!data.token){
                    return console.error('登录失败，请检查用户名和密码')
                }
                //登录成功，将token和用户信息存储到localStorage
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
                //登录成功，跳转到首页
                if(data.userInfo.userType === 2){
                    router.push('/back/dashboard')
                }else{
                    router.push('/')
                }
            })
        }
    })
}
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})
</script>

<style lang="scss" scoped>
    .container {
        width: 384px;
        .title{
            .back-home{
                margin-bottom: 60px;
            }
            .title-text{
                text-align: center;
                h2{
                    font-size: 36px;
                    margin-bottom: 10px;
                }
                p{
                    font-size: 18px;
                    color: #6b7280;
                }
            }
        }
        .form-container{
           margin-top: 30px;
        .btn{
            margin-top: 40px;
            width: 100%;
        }
        .footer{
            text-align: center;
            padding: 30px;
        }
    }
    }
</style>
