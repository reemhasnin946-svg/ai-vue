<template>
    <el-dialog
        :title="isEdit?'编辑文章':'新增文章'"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose" 
    >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="文章标题" prop="title">
           <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable/>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择所属分类">
                <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary">
           <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" show-word-limit :rows="4" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
           <el-select v-model="formData.tagArray" placeholder="请输入文章标签(逗号分隔)" multiple filterable allow-create style="width: 100%" >
            <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
           </el-select>
        </el-form-item>
        <el-form-item label='封面图片' prop="coverImage">
           <div class="cover-upload">
            <el-upload
                class="avatar-uploader" 
                action="#"
                :before-upload="beforeUpload"
                :http-request="handleUploadRequest"
                :show-file-list="false"
                accept="image/*"
            >
                <div v-if="!imgUrl||formData.coverImage===''" class="cover-placeholder">
                    <p>点击上传封面</p> 
                </div>
                <img v-else :src="imgUrl" alt="封面图片" class="cover-image" />
            </el-upload>
            <div v-if="imgUrl&&formData.coverImage!==''" class="cover-remove">
                <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
            </div>
           </div>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
           <RichTextEditor 
           v-model="formData.content"
           placeholder="请输入文章内容,支持富文本格式\n\n可以用加粗、斜体、列表、标题等格式来丰富文章内容"
           :maxCharCount="5000"
           @change="handleContentChange"
           @created="handleEditorCreated"
           min-height="400px"
            />
        </el-form-item>
    </el-form>
    <div v-if="btnPreview">
        <h3>内容预览</h3>
        <div v-html="formData.content"></div>
    </div>
    <template #footer>
        <el-button @click="btnPreview=!btnPreview">{{btnPreview?'关闭预览':'预览效果'}}</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button  type="primary" @click="handleSubmit" :loading="loading">{{isEdit?'更新':'创建'}}文章</el-button>
    </template>
    </el-dialog>
</template>
 
<script setup> 
import{ref,reactive,computed,nextTick,watch} from 'vue'
import {ElMessage} from 'element-plus'
import {uploadFile,createArticle,updateArticle} from '@/api/admin'
import {fileBaseUrl} from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

const emit = defineEmits(['update:modelValue','success'])

const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        {  max: 200, message: '文章标题长度必须在200个字符之间', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择所属分类', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'change' },
        { max: 5000, message: '文章内容长度必须在5000个字符之间', trigger: 'blur' }
    ],
})

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () => []
    },
    article: {
        type: Object,
        default: null
    }
})

const dialogVisible = computed({
    get: () => {
        return props.modelValue
    },
    set: (val) => {
        emit('update:modelValue', val)
    }
})

const isEdit = computed(()=>!!props.article?.id)

watch(()=>props.article, (newVal, oldVal) => {
    if (newVal) {
        nextTick(()=>{
            Object.assign(formData,newVal)
            //使用现有ID，不生成新ID
        businessId.value = newVal.id
        //封面URL
        imgUrl.value = fileBaseUrl + newVal.coverImage
        })
        
    }
})



const handleClose = () => {
    //重置表单
    formRef.value.resetFields()
    //重置id
    businessId.value = null
    //重置封面URL
    handleRemove()
    //重置标签
    formData.tagArray = []
    emit('update:modelValue', false)
}

const formData = reactive({
    'title': '',
    'categoryId': null,
    'content': '',
    'coverImage': '',
    'summary': '',
    'tags': '',
    'tagArray': [],
    'id':''
})
const commonTags = [
  '情绪管理',
  '焦虑',
  '抑郁',
  '压力',
  '睡眠',
  '冥想',
  '正念',
  '放松',
  '心理健康',
  '自我成长',
  '人际关系',
  '工作压力',
  '学习方法',
  '生活技巧'
]
//上传
const beforeUpload=(file)=>{
    console.log(file);
    console.log('00000000');
    const isImage = file.type.startsWith('image/')
    const isLt5M = file.size / 1014 / 1014 < 5
    if(!isImage){
        ElMessage.error('请上传图片文件')
        return false
    }
    if(!isLt5M){
        ElMessage.error('图片大小不能超过5MB')
        return false
    }
    return true
}

const imgUrl=ref('')
//上传请求
const businessId=ref(null)
const handleUploadRequest=async ({file})=>{
    //UUID生成
    businessId.value = crypto.randomUUID()

    const fileRes = await uploadFile(file, {
        businessId: businessId.value
    })
    console.log(fileRes);
    //拼接完整的图片地址
    console.log(fileBaseUrl)
    imgUrl.value = fileBaseUrl + fileRes.filePath
    console.log(imgUrl.value);
    formData.coverImage = fileRes.filePath
}
//移除封面
const handleRemove=()=>{
    imgUrl.value = ''
    formData.coverImage = ''
}
//富文本
const handleContentChange=(data)=>{
    formData.content = data.html
}
const editorIstance=ref(null)
//富文本创建
const handleEditorCreated=(editor)=>{
    editorIstance.value = editor
    if(formData.content && editor){
        nextTick(()=>{
            editor.setHtml(formData.content)
        })
    }
}
const btnPreview=ref(false)
//提交
const loading=ref(false)
const formRef=ref(null)
const handleSubmit=()=>{
    formRef.value.validate((valid,fields) => {
        if(valid){
            loading.value = true
        }
        console.log(formData,'formData');
        const submitData = {
            ...formData,
            tags: formData.tagArray.join(',')
        }
        delete submitData.tagArray
        if(!isEdit.value){
            submitData.id = businessId.value
            //新增
            createArticle(submitData).then(res => {
                loading.value = false
                emit('success')
                })
        }else{
            //编辑
            updateArticle(props.article.id,submitData).then(res => {
                loading.value = false
                emit('success')
                })
        }
}
)}
</script>

<style scoped lang="scss">
.cover-placeholder{
width: 200px;
height:120px;
display:flex;
flex-direction: column;
align-items: center;
justify-content: center;
color:#8b949e;
background:#f6f8fa;
}

.cover-image{
width: 200px;
height:120px;
display: block;
}
</style>