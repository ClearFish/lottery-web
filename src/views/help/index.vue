<template>
  <div class="help-page">
    <!-- 搜索框 -->
    <!-- <div class="search-section">
      <van-search
        v-model="searchKeyword"
        :placeholder="$t('help.searchPlaceholder')"
        @search="handleSearch"
        @clear="handleClear"
      />
    </div> -->

    <!-- 分类导航 -->
    <div class="category-section">
      <h3 class="section-title">{{ $t('help.faq') }}</h3>
      <div class="category-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          @click="goToCategory(category.id)"
        >
          <div class="category-icon">
            <van-icon :name="category.icon || 'question-o'" size="24" />
          </div>
          <div class="category-name">{{ category.title }}</div>
          <div class="category-count">{{ category.article_num }}{{ $t('help.questions') }}</div>
        </div>
      </div>
    </div>

    <!-- 分类文章列表 -->
    <div v-if="showCategoryList" class="category-articles">
      <div class="category-header">
        <van-icon name="arrow-left" @click="backToCategories" />
        <h3 class="section-title">{{ currentCategoryName }}{{ $t('help.articles') }}</h3>
        <span class="article-count">{{ categoryArticles.length }}{{ $t('help.articlesCount') }}</span>
      </div>
      <div class="articles-list">
        <van-cell 
          v-for="article in categoryArticles" 
          :key="article.id"
          :title="article.title"
          is-link
          @click="showQuestion(article)"
        />
      </div>
    </div>

    <!-- 热门问题 -->
    <div v-else class="hot-questions">
      <h3 class="section-title">{{ $t('help.hotQuestions') }}</h3>
      <div class="questions-list">
        <van-cell 
          v-for="question in hotQuestions" 
          :key="question.id"
          :title="question.title"
          is-link
          @click="showQuestion(question)"
        />
      </div>
    </div>

    <!-- 联系客服 -->
    <div class="contact-section">
      <van-cell-group inset>
        <van-cell 
          :title="$t('help.onlineService')" 
          icon="service-o" 
          is-link 
          @click="openServicePopup"
        />
        <van-cell 
          :title="$t('help.feedback')" 
          icon="comment-o" 
          is-link 
          @click="submitFeedback"
        />
        
      </van-cell-group>
    </div>

    <!-- 客服弹窗组件 -->
    <FloatingService ref="floatingServiceRef" />

    <!-- 问题详情弹窗 -->
    <van-popup v-model:show="showQuestionDetail" position="bottom" :style="{ height: '70%' }">
      <div class="question-detail">
        <div class="detail-header">
          <h3>{{ currentQuestion?.title }}</h3>
          <van-icon name="cross" @click="showQuestionDetail = false" />
        </div>
        <div class="detail-content">
          <div v-html="currentQuestion?.content"></div>
        </div>
        <div class="detail-actions">
          <van-button type="primary" block @click="showQuestionDetail = false">
            {{ $t('common.understood') }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast, showDialog } from 'vant'
import { getArticleCategory, getArticleList, getArticleInfo, type ArticleCategory, type ArticleItem, type ArticleDetail } from '@/api/help'
import FloatingService from '@/components/FloatingService/index.vue'
import { $t } from '@/locales'

const searchKeyword = ref('')
const showQuestionDetail = ref(false)
const currentQuestion = ref<ArticleDetail | null>(null)
const loading = ref(false)

// FloatingService组件引用
const floatingServiceRef = ref()

// 文章分类列表
const categories = ref<ArticleCategory[]>([])

// 热门问题列表
const hotQuestions = ref<ArticleItem[]>([])

// 分类文章列表相关
const showCategoryList = ref(false)
const categoryArticles = ref<ArticleItem[]>([])
const currentCategoryName = ref('')

// 获取文章分类列表
const fetchCategories = async () => {
  try {
    loading.value = true
    const res = await getArticleCategory()
    categories.value = (res as ArticleCategory[]) || []
  } catch (error) {
    console.error('获取分类失败:', error)
    showToast(error.msg || $t('help.getCategoryFailed'))
  } finally {
    loading.value = false
  }
}

// 获取热门问题
const fetchHotQuestions = async () => {
  try {
    const res = await getArticleList({
      pageIndex: 1,
      category_id: -1, // 全部分类
      hot: 1 // 热门文章
    })
    hotQuestions.value = (res as ArticleItem[]) || []
  } catch (error) {
    console.error('获取热门问题失败:', error)
    showToast(error.msg || $t('help.getHotQuestionsFailed'))
  }
}

// 获取文章详情
const fetchArticleDetail = async (articleId: number) => {
  try {
    const res = await getArticleInfo({ article_id: articleId })
    return res as ArticleDetail
  } catch (error) {
    console.error('获取文章详情失败:', error)
    showToast(error.msg || $t('help.getArticleDetailFailed'))
    return null
  }
}

const handleSearch = (keyword: string) => {
  if (!keyword.trim()) {
    showToast($t('help.enterSearchKeyword'))
    return
  }
  showToast($t('help.searchDeveloping'))
}

const handleClear = () => {
  searchKeyword.value = ''
}

const goToCategory = async (categoryId: number) => {
  try {
    loading.value = true
    const res = await getArticleList({
      pageIndex: 1,
      category_id: categoryId,
      hot: -1 // 不限制热门
    })
    const articles = (res as ArticleItem[]) || []
    
    if (articles.length === 0) {
      showToast($t('help.noArticlesInCategory'))
      return
    }
    
    // 显示分类文章列表
    const category = categories.value.find(cat => cat.id === categoryId)
    currentCategoryName.value = category?.title || $t('help.category')
    categoryArticles.value = articles
    showCategoryList.value = true
  } catch (error) {
    console.error('获取分类文章失败:', error)
    showToast(error.msg || $t('help.getCategoryArticlesFailed'))
  } finally {
    loading.value = false
  }
}

// 返回分类列表
const backToCategories = () => {
  showCategoryList.value = false
  categoryArticles.value = []
  currentCategoryName.value = ''
}

const showQuestion = async (question: ArticleItem) => {
  try {
    loading.value = true
    const detail = await fetchArticleDetail(question.id)
    if (detail) {
      currentQuestion.value = detail
      showQuestionDetail.value = true
    }
  } catch (error) {
    console.error('获取问题详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 打开客服弹窗
const openServicePopup = () => {
  if (floatingServiceRef.value) {
    floatingServiceRef.value.togglePopup()
  }
}

const submitFeedback = () => {
  showDialog({
    title: $t('help.feedback'),
    message: $t('help.feedbackMessage'),
    showCancelButton: true,
    confirmButtonText: $t('common.submit'),
    cancelButtonText: $t('common.cancel')
  }).then(() => {
    showToast($t('help.feedbackSubmitted'))
  }).catch(() => {
    // 用户取消
  })
}

const callService = () => {
  showDialog({
    title: $t('help.customerServicePhone'),
    message: $t('help.customerServicePhoneNumber'),
    confirmButtonText: $t('help.call'),
    cancelButtonText: $t('common.cancel')
  }).then(() => {
    showToast($t('help.callFunctionDeveloping'))
  }).catch(() => {
    // 用户取消
  })
}

// 页面初始化
onMounted(() => {
  fetchCategories()
  fetchHotQuestions()
})
</script>

<style scoped>
.help-page {
  padding-bottom: 60px;
}

.search-section {
  padding: 16px;
  background: white;
}

.category-section {
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.category-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-icon {
  margin-bottom: 12px;
  color: #1890ff;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.category-count {
  font-size: 12px;
  color: #666;
}

.category-articles {
  padding: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.category-header .van-icon {
  font-size: 20px;
  color: #1890ff;
  cursor: pointer;
}

.category-header .section-title {
  flex: 1;
  margin: 0;
}

.article-count {
  font-size: 14px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 12px;
}

.articles-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hot-questions {
  padding: 16px;
}

.questions-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contact-section {
  padding: 16px;
}

.question-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.detail-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.detail-content p {
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.detail-actions {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

:deep(.van-cell) {
  padding: 16px;
}

:deep(.van-cell__title) {
  font-weight: 500;
}

:deep(.van-cell__left-icon) {
  margin-right: 12px;
  color: #1890ff;
}

/* 隐藏FloatingService的悬浮球，只保留弹窗功能 */
:deep(.floating-service .floating-ball) {
  display: none;
}
</style>
