<template>
  <div class="article-detail-page">
    <van-nav-bar 
      :title="articleTitle" 
      left-arrow 
      @click-left="goBack" 
    />
    
    <div class="article-content" v-if="articleContent">
      <div class="article-header">
        <h1 class="article-title">{{ articleTitle }}</h1>
      </div>
      
      <div 
        class="article-body" 
        v-html="articleContent"
      ></div>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-state" v-if="loading">
      <van-loading type="spinner" />
      <p class="loading-text">{{ $t('common.loading') }}</p>
    </div>
    
    <!-- 错误状态 -->
    <div class="error-state" v-if="error">
      <van-icon name="warning-o" class="error-icon" />
      <p class="error-text">{{ $t('help.loadFailed') }}</p>
      <van-button type="primary" @click="loadArticle">{{ $t('help.reload') }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { getArticleInfo } from '@/api/help'
import { $t } from '@/locales'

const router = useRouter()
const route = useRoute()

// 响应式数据
const articleTitle = ref('')
const articleContent = ref('')
const loading = ref(false)
const error = ref(false)

// 加载文章详情
const loadArticle = async () => {
  try {
    loading.value = true
    error.value = false
    
    const articleId = Number(route.params.id)
    const article = await getArticleInfo({ article_id: articleId })
    
    if (article) {
      articleTitle.value = article.title
      articleContent.value = article.content
    }
  } catch (err) {
    console.error('获取文章详情失败:', err)
    error.value = true
    showToast($t('help.loadFailed'))
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  // 如果URL中有查询参数，直接使用
  if (route.query.title && route.query.content) {
    articleTitle.value = route.query.title as string
    articleContent.value = route.query.content as string
  } else {
    // 否则通过API获取
    loadArticle()
  }
})
</script>

<style scoped lang="less">
.article-detail-page {
  min-height: 100vh;
  background: #fff;
}

.article-content {
  padding: 20px;
}

.article-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.article-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
  margin: 0;
}

.article-body {
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
  
  :deep(p) {
    margin: 0 0 16px 0;
  }
  
  :deep(h1, h2, h3, h4, h5, h6) {
    font-weight: 600;
    color: #1f2937;
    margin: 24px 0 16px 0;
  }
  
  :deep(ul, ol) {
    margin: 0 0 16px 0;
    padding-left: 24px;
  }
  
  :deep(li) {
    margin: 8px 0;
  }
  
  :deep(blockquote) {
    border-left: 4px solid #6b5b95;
    padding-left: 16px;
    margin: 16px 0;
    color: #6b7280;
    font-style: italic;
  }
  
  :deep(code) {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
  }
  
  :deep(pre) {
    background: #f3f4f6;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
  }
  
  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  margin: 12px 0 0 0;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: #ef4444;
  margin-bottom: 16px;
}

.error-text {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 20px 0;
}
</style>
