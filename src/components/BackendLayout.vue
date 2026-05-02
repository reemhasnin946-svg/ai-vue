<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar></Sidebar>
      <el-container>
        <el-header><Navbar></Navbar></el-header>
        <el-main><router-view class="content-container"></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from './sidebar.vue'
import Navbar from './navbar.vue'
</script>

<style lang="scss">
.backend-layout {
  height: 100vh;
  .el-header{
    height: 74px !important;
  }
  .main-container{
    height: 100%;
    .content-container{
      padding: 20px;
      background-color:#fff;
      min-height: calc(100% - 74px);
    }
  }
}
</style>