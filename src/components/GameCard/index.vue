<template>
  <div class="game-card" @click="handleClick">
    <div class="game-image" :style="{ backgroundImage: `url(${game.icon})` }">
      <!-- 收藏按钮 -->
      <div 
        v-if="showFavoriteButton" 
        class="favorite-btn"
        @click.stop="toggleFavorite"
      >
        <van-icon 
          :name="game.collect ? 'star' : 'star-o'" 
          size="16" 
          :color="game.collect ? '#ffd700' : '#fff'"
        />
      </div>
    </div>
    <div class="game-title">{{ game.title }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { addFavoriteGame, removeFavoriteGame } from '@/api/game'
import { showToast } from 'vant'
import { $t } from '@/locales'

interface Game {
  id: number
  title: string
  icon: string
  provider?: string
  game_name?: string
  game_code?: string
  game_list_id?: number
  collect?: boolean,
  game_type?:string
}

interface Props {
  game: Game
  showFavorite?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFavorite: true
})

const emit = defineEmits<{
  click: [game: Game]
  favoriteChange: [game: Game, isFavorite: boolean]
}>()

const userStore = useUserStore()

// 是否显示收藏按钮
const showFavoriteButton = computed(() => {
  return props.showFavorite && userStore.isLoggedIn
})

const handleClick = () => {
  emit('click', props.game)
}

// 切换收藏状态
const toggleFavorite = async () => {
  if (!userStore.isLoggedIn) {
    showToast($t('gameHall.loginRequired'))
    return
  }

  try {
    const gameId = props.game.game_list_id || props.game.id
    
    if (props.game.collect) {
      // 取消收藏
      await removeFavoriteGame({ game_id: gameId })
      props.game.collect = false
      showToast($t('gameHall.unfavorited'))
    } else {
      // 添加收藏
      let params:any
      // 系统收藏添加新参数
      if(props.game.game_type == 'Lottery') {
          params = {
            game_id: gameId,
            is_self:true
          }
      }else {
        params = {
            game_id: gameId
          }
      }
      await addFavoriteGame(params)
      props.game.collect = true
      showToast($t('gameHall.favorited'))
    }
    
    emit('favoriteChange', props.game, props.game.collect)
  } catch (error) {
    console.error('Favorite operation failed:', error)
    showToast(error.msg || $t('common.retry'))
  }
}
</script>

<style scoped>
.game-card {
  background: white;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.game-card:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.game-image {
  position: relative;
  width: 100%;
  height: 125px;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
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
  line-height: 1.3;
  margin: 0;
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

.favorite-btn {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
}

.favorite-btn:hover {
  background: rgba(0, 0, 0, 0.5);
  transform: scale(1.1);
}

.favorite-btn:active {
  transform: scale(0.95);
}
</style>
