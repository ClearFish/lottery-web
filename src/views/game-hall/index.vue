<template>
    <div class="game-hall">
        <div class="content">
            <!-- 左侧分类列表 -->
            <div class="sidebar">
                <div class="category-list">
                    <!-- 特殊分类 -->
                    <div
                        v-for="category in specialCategories"
                        :key="category.game_type"
                        class="category-item"
                        :class="{ active: selectedCategory === category.game_type }"
                        @click="selectCategory(category.game_type)"
                    >
                        <div class="category-icon">
                            <img :src="category.icon" :alt="$t(category.titleKey as any)" />
                        </div>
                        <span class="category-name">{{ $t(category.titleKey as any) }}</span>
                    </div>
                    
                    <!-- 普通分类 -->
                    <div
                        v-for="category in categories"
                        :key="category.game_type"
                        class="category-item"
                        :class="{ active: selectedCategory === category.game_type }"
                        @click="selectCategory(category.game_type)"
                    >
                        <div class="category-icon">
                            <img :src="category.icon" :alt="category.title" />
                        </div>
                        <span class="category-name">{{ category.title }}</span>
                    </div>
                </div>
            </div>

            <!-- 右侧游戏网格 -->
            <div class="main-content">
                <!-- 搜索框 -->
                <div class="search-section">
                    <van-search
                        v-model="searchValue"
                        :placeholder="$t('gameHall.searchPlaceholder' as any)"
                        @search="handleSearch"
                        @clear="handleClearSearch"
                        @input="handleSearchInput"
                        show-action
                        action-text=""
                        shape="round"
                        background="#f8fafc"
                    />
                </div>

                <!-- 游戏厂商分类（搜索时隐藏，非搜索时显示） -->
                <div v-if="filteredProviders.length > 0 && !isSearching" class="provider-section">
                    <div class="provider-scroll-container" ref="providerScrollContainer">
                        <div class="provider-list" ref="providerList">
                            <!-- 全部选项 -->
                            <div
                                class="provider-item"
                                :class="{ active: selectedProvider === null }"
                                @click="selectProvider(null)"
                            >
                                <div class="provider-icon">
                                    <van-icon name="apps-o" size="16" />
                                </div>
                                <span class="provider-title">{{ $t('gameHall.all') }}</span>
                            </div>
                            <!-- 厂商选项 -->
                            <div
                                v-for="provider in filteredProviders"
                                :key="provider.group_id"
                                class="provider-item"
                                :class="{ active: selectedProvider === provider.group_id }"
                                @click="selectProvider(provider.group_id)"
                            >
                                <div class="provider-icon">
                                    <img :src="provider.icon" :alt="provider.title" />
                                </div>
                                <span class="provider-title">{{ provider.title }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="games-grid">
                    <GameCard
                        v-for="game in filteredGames"
                        :key="game.id"
                        :game="game"
                        @click="playGame"
                        @favorite-change="handleFavoriteChange"
                    />
                </div>

                <!-- 加载更多 -->
                <div class="load-more" v-if="hasMore" @click="loadMore">
                    <van-loading v-if="loading" type="spinner" size="20" />
                    <span v-else>{{ $t('common.loadMore') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getGameCategories, getGameList, getHotGames, getMyFavoriteGames, addFavoriteGame, removeFavoriteGame, getGameProviders, type GameCategory, type GameProvider } from '@/api/game'
import GameCard from '@/components/GameCard/index.vue'
import { useUserStore } from '@/store/modules/user'
import { showToast } from 'vant'
import { $t } from '@/locales'

import favorites from '@/assets/favorites.png'
import hot from '@/assets/hot.png'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const selectedCategory = ref('')
const selectedProvider = ref<number | null>(null)
const games = ref<any[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = ref(20)
const searchValue = ref('')
const isSearching = ref(false)

// 滚动容器引用
const providerScrollContainer = ref<HTMLElement>()
const providerList = ref<HTMLElement>()

// 游戏分类
const categories = ref<GameCategory[]>([])
// 游戏厂商列表
const gameProviders = ref<GameProvider[]>([])



// 特殊分类
const specialCategories = [
  { game_type: 'hot', titleKey: 'gameHall.hotGames', icon: hot },
  { game_type: 'favorite', titleKey: 'gameHall.myFavorites', icon: favorites }
]

// 计算属性 - 过滤游戏
const filteredGames = computed(() => {
    return games.value
})

// 选择分类
const selectCategory = (gameType: string) => {
    selectedCategory.value = gameType
    selectedProvider.value = null // 重置厂商选择
    searchValue.value = '' // 清空搜索
    isSearching.value = false // 重置搜索状态
    page.value = 1
    games.value = []
    
    // 直接加载游戏，不需要重新请求厂商数据
    loadGames()
    
    // 切换分类时滚动到最左边（全部选项）
    nextTick(() => {
        if (providerScrollContainer.value) {
            providerScrollContainer.value.scrollTo({
                left: 0,
                behavior: 'smooth'
            })
        }
    })
}

// 选择厂商
const selectProvider = (providerId: number) => {
    selectedProvider.value = providerId
    searchValue.value = '' // 清空搜索
    isSearching.value = false // 重置搜索状态
    page.value = 1
    games.value = []
    loadGames()
    
    // 滚动到选中的厂商项
    nextTick(() => {
        scrollToSelectedProvider()
    })
}

// 滚动到选中的厂商项（参考game-h5实现）
const scrollToSelectedProvider = () => {
    if (!providerScrollContainer.value || !providerList.value) return
    
    const container = providerScrollContainer.value
    const activeItem = providerList.value.querySelector('.provider-item.active')
    
    if (!activeItem) return
    
    const itemElement = activeItem as HTMLElement
    const itemIndex = Array.from(providerList.value.children).indexOf(activeItem)
    
    // 参考game-h5的实现：每个项目宽度约80px，滚动到对应位置
    const itemWidth = 80
    let targetScrollLeft = itemIndex * itemWidth
    
    // 如果是第一个（全部选项），滚动到最左边
    if (itemIndex === 0) {
        targetScrollLeft = 0
    }
    // 如果是最后一个，滚动到最右边
    else if (itemIndex === providerList.value.children.length - 1) {
        targetScrollLeft = container.scrollWidth - container.clientWidth
    }
    // 其他情况，滚动到让选中项居中
    else {
        const containerWidth = container.clientWidth
        const itemCenter = itemIndex * itemWidth + itemWidth / 2
        targetScrollLeft = itemCenter - containerWidth / 2
    }
    
    // 确保滚动位置在有效范围内
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft))
    
    // 平滑滚动到目标位置
    container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
    })
}

// 搜索处理方法
const handleSearch = (value: any) => {
    // 确保 value 是字符串类型
    const searchText = String(value || '').trim()
    searchValue.value = searchText
    isSearching.value = searchText.length > 0
    page.value = 1
    games.value = []
    loadGames()
}

// 清除搜索
const handleClearSearch = () => {
    searchValue.value = ''
    isSearching.value = false
    page.value = 1
    games.value = []
    loadGames()
}

// 搜索输入处理
const handleSearchInput = (value: any) => {
    // 确保 value 是字符串类型
    const searchText = String(value || '')
    
    // 更新搜索状态
    isSearching.value = searchText.trim().length > 0
    
    // 可以在这里添加防抖逻辑
    if (searchText.trim() === '') {
        page.value = 1
        games.value = []
        loadGames()
    }
}

// 加载游戏厂商列表（只在初始化时调用一次）
const loadGameProviders = async () => {
    try {
        const response = await getGameProviders()
        // 保存所有厂商数据，不进行过滤
        gameProviders.value = response.rows || []
    } catch (error) {
        console.error('加载游戏厂商失败:', error)
    }
}

// 根据当前分类过滤厂商（计算属性）
const filteredProviders = computed(() => {
    if (!selectedCategory.value || selectedCategory.value === 'hot' || selectedCategory.value === 'favorite') {
        return []
    }
    return gameProviders.value.filter(provider => provider.game_type === selectedCategory.value)
})

// 加载游戏列表
const loadGames = async () => {
    try {
        loading.value = true
        let response
        
        // 如果有搜索关键词，进行全局搜索，不判断分类
        if (searchValue.value.trim()) {
            response = await getGameList({
                pageIndex: page.value,
                pageSize: pageSize.value,
                title: searchValue.value.trim()
            })
        } else if (selectedCategory.value === 'hot') {
            // 热门游戏
            response = await getHotGames({
                pageIndex: page.value,
                pageSize: pageSize.value
            })
        } else if (selectedCategory.value === 'favorite') {
            // 我的收藏
            if (!userStore.isLoggedIn) {
                showToast($t('auth.loginRequired'))
                return
            }
            response = await getMyFavoriteGames({
                pageIndex: page.value,
                pageSize: pageSize.value
            })
        } else {
            // 普通分类
            const params: any = {
                pageIndex: page.value,
                pageSize: pageSize.value,
                game_type: selectedCategory.value
            }
            
            // 如果有选择厂商，添加厂商筛选
            if (selectedProvider.value) {
                params.group_id = selectedProvider.value
            }
            
            response = await getGameList(params)
        }
        
        let gameList = response.rows || []
        
        // 如果是我的收藏分类，为所有游戏添加collect字段
        if (selectedCategory.value === 'favorite') {
            gameList = gameList.map((game: any) => ({
                ...game,
                collect: true
            }))
        }
        
        if (page.value === 1) {
            games.value = gameList
        } else {
            games.value.push(...gameList)
        }
        
        hasMore.value = (response.rows || []).length === pageSize.value
    } catch (error) {
        console.error('加载游戏列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 加载更多
const loadMore = () => {
    if (!loading.value && hasMore.value) {
        page.value++
        loadGames()
    }
}

// 定义 emits
const emit = defineEmits<{
    playGame: [game: any]
}>()

// 开始游戏
const playGame = (game: any) => {
    // 检查当前路由路径，如果是 /game-hall 说明是页面模式
    const currentPath = router.currentRoute.value.path
    const isPageMode = currentPath === '/game-hall'
    
    if (isPageMode) {
        // 如果作为页面使用，直接路由跳转
        router.push({
            name: 'Game',
            query: {
                game_name: game.game_name,
                game_code: game.game_code,
                game_list_id: game.game_list_id,
                title: game.title
            }
        })
    } else {
        // 如果在弹窗中，发出事件
        emit('playGame', game)
    }
}

// 返回上一页
const goBack = () => {
    router.go(-1)
}

// 处理收藏状态变化
const handleFavoriteChange = async (game: any, isFavorite: boolean) => {
    // 如果当前在收藏页面，取消收藏后需要重新请求收藏列表
    if (selectedCategory.value === 'favorite' && !isFavorite) {
        // 重新请求收藏列表
        await loadGames()
    }
}

// 加载分类列表
const loadCategories = async () => {
    try {
        const response = await getGameCategories()
        categories.value = response.rows || []

        // 默认选择热门游戏
        selectedCategory.value = 'hot'
        loadGames()
    } catch (error) {
        console.error('加载分类列表失败:', error)
    }
}

// 初始化
onMounted(async () => {
    // 并行加载分类和厂商数据
    await Promise.all([
        loadCategories(),
        loadGameProviders()
    ])
})
</script>

<style scoped>
.game-hall {
    height: 100vh;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
}

.header {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.content {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.sidebar {
    width: 80px;
    background: white;
    border-right: 1px solid #e2e8f0;
    overflow-y: auto;
}

.category-list {
    padding: 8px 0;
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px;
    margin: 2px 4px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
}

.category-item:hover {
    background: #f1f5f9;
}

.category-item.active {
    background: #dbeafe;
    color: #1e40af;
}

.category-icon {
    width: 34px;
    height: 34px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.category-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.category-name {
    font-size: 10px;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
}

.main-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
}

/* 搜索框样式 */
.search-section {
    margin-bottom: 12px;
    background: white;
    border-radius: 8px;
    padding: 8px 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.search-section .van-search {
    padding: 0;
}

.search-section .van-search__content {
    background: #f8fafc;
    border-radius: 20px;
}

/* 游戏厂商分类样式 */
.provider-section {
    margin-bottom: 12px;
    background: white;
    border-radius: 8px;
    padding: 8px 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.provider-scroll-container {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.provider-scroll-container::-webkit-scrollbar {
    display: none;
}

.provider-list {
    display: flex;
    gap: 8px;
    padding-bottom: 2px;
    min-width: max-content;
}

.provider-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 10px;
    background: #f8fafc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    min-width: 60px;
    flex-shrink: 0;
}

.provider-item:hover {
    background: #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.provider-item.active {
    background: #dbeafe;
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.provider-icon {
    width: 28px;
    height: 28px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.provider-icon img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    border-radius: 3px;
}

.provider-title {
    font-size: 10px;
    font-weight: 500;
    color: #64748b;
    text-align: center;
    line-height: 1.2;
    max-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.provider-item.active .provider-title {
    color: #1e40af;
    font-weight: 600;
}

/* 全部选项图标样式 */
.provider-icon .van-icon {
    color: #64748b;
}

.provider-item.active .provider-icon .van-icon {
    color: #1e40af;
}

.games-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.game-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
}

.game-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.game-image {
    position: relative;
    width: 100%;
    height: 160px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f8fafc;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s ease;
}

.game-card:hover .game-image {
    transform: scale(1.02);
}

.game-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: all 0.3s ease;
    z-index: 1;
}

.game-overlay .van-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    padding: 8px;
    backdrop-filter: blur(4px);
}

.game-card:active .game-overlay .van-icon {
    transform: scale(0.95);
}

.game-title-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    padding: 8px 12px;
}

.game-title {
    color: #333;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    margin: 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    padding: 8px 12px;
}

.game-provider {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
    z-index: 2;
}


.load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
}

.load-more:hover {
    background: #f8fafc;
    color: #475569;
}
</style>
