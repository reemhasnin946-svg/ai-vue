<template>
    <div class="page-head">
        <p class="page-title">{{title}}</p>
        <div class="action-btn">
            <slot name="btn"></slot>
        </div>
    </div>
</template>
<script setup>
defineProps({
    title: {
        type: String,
        default: '知识文章'
    }
})
</script>
<style lang="scss" scoped>
.page-head{
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .page-title{
        font-size: 24px;
        color: #2d3748;
    }
}
</style>
