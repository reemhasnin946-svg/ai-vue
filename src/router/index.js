import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/Frontendlayout.vue'
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        component: () => import('@/views/consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component:AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册',
        }
      }
    ]
  }
]

const frontendRoutes=[
{
  path: '/',
  component: FrontendLayout,
  children: [
    {
      path: '',
      component: () => import('@/views/home.vue')
    },{
        path: 'consultation',
        component: () => import('@/views/consultation.vue'),
      },{
        path: 'emotion-diary',
        component: () => import('@/views/emotionDiary.vue'),
      },{
        path: 'frontendKnowledge',
        component: () => import('@/views/frontendKnowledge.vue'),
      },{
        path:'knowledge/article/:id',
        component: () => import('@/views/articleDetail.vue'),
        props:true
      }
  ]
}
]


const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes,...frontendRoutes]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if(token){
    try {
      const userInfo=JSON.parse(localStorage.getItem('userInfo'))
      if(userInfo.userType==2){
        if(to.path.startsWith('/back')){
          next()
        }else{ 
          next('/back/dashboard')
        }
      }else if(userInfo.userType==1){
        // 普通用户可以访问的路由
        if(to.path.startsWith('/back')||to.path.startsWith('/auth')){
          next('/')
        }else{
          next()
        }
      }
      else{
        if(to.path.startsWith('/back')){
          next('/auth/login')
        }else{
          next()
        }
      }
    } catch (error) {
      // 解析 userInfo 失败，清除 token 并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      next('/auth/login')
    }
  } else {
    // 没有 token，跳转到登录页
    if(to.path.startsWith('/back')){
      next('/auth/login')
    }else{
      next()
    }
  }
})

export default router