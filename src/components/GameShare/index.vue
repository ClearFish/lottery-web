<template>
  <van-popup 
    :show="show" 
    position="bottom" 
    round
    :style="{ height: '70%' }"
    @close="closeShare"
  >
    <div class="game-share-container">
      <div class="share-header">
        <div class="empty"></div>
        <div class="title">{{ $t('gameShare.selectGame') }}</div>
        <div class="close-btn" @click="closeShare">
          <van-icon name="cross" size="18" color="#333" />
        </div>
      </div>
      
      <div class="game-list">
        <div 
          class="game-item" 
          v-for="(item, index) in gameList" 
          :key="index" 
          @click="shareGame(item)"
        >
          <img :src="item.icon" :alt="item.title" class="game-icon" />
          <div class="game-name">{{ item.title }}</div>
        </div>
        
        <div class="load-more" v-if="hasMore" @click="loadMore">
          {{ $t('gameShare.loadMoreGames') }}
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getGameList } from '@/api/game'

// Props
interface Props {
  show: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  shareGame: [game: any]
}>()

// 响应式数据
const gameList = ref<any[]>([])
const hasMore = ref(true)
const loading = ref(false)
const pageParams = ref({
  pageIndex: 1,
  pageSize: 6
})



// 获取游戏列表
const getGameListData = async () => {
  if (loading.value) return
  
  console.log('开始获取游戏列表，参数:', pageParams.value)
  
  try {
    loading.value = true
    const res = await getGameList({
      pageIndex: pageParams.value.pageIndex,
      pageSize: pageParams.value.pageSize
    })
    
    console.log('游戏列表API响应:', res)
    
    if (res && res.rows) {
      if (pageParams.value.pageIndex === 1) {
        gameList.value = res.rows
      } else {
        gameList.value.push(...res.rows)
      }
      
      hasMore.value = res.rows.length === pageParams.value.pageSize
      console.log('游戏列表更新完成，数量:', gameList.value.length)
    }
  } catch (error) {
    console.error('获取游戏列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    pageParams.value.pageIndex++
    getGameListData()
  }
}

// 分享游戏
const shareGame = (game: any) => {
  emit('shareGame', game)
  closeShare()
}

// 关闭分享
const closeShare = () => {
  emit('close')
}

// 监听show变化，当弹窗显示时获取游戏列表
watch(() => props.show, (newShow) => {
  if (newShow && gameList.value.length === 0) {
    // 重置分页参数
    pageParams.value.pageIndex = 1
    getGameListData()
  }
}, { immediate: true })

// 初始化
onMounted(() => {
  if (props.show) {
    getGameListData()
  }
})
</script>

<style scoped>
.game-share-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.share-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.share-header .empty {
  width: 18px;
}

.share-header .title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.close-btn {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.game-list {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.game-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.game-item:hover {
  background: #e8e8e8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-bottom: 8px;
  object-fit: cover;
}

.game-name {
  font-size: 14px;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

.load-more {
  grid-column: 1 / -1;
  padding: 16px;
  background: #f0f0f0;
  border-radius: 12px;
  text-align: center;
  color: #666;
  cursor: pointer;
  transition: background 0.3s ease;
  border: 1px solid #e0e0e0;
}

.load-more:hover {
  background: #e0e0e0;
}
</style>
