<template>
  <div class="task-card" @click="handleClick">
    <div class="task-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <span class="task-reward">₫{{ task.bonus }}</span>
    </div>
    <div class="task-content">
      <p class="task-description" v-html="task.required"></p>
      <div class="task-tags">
        <span v-for="(value, key) in task.keywords" :key="key" class="task-tag">
          {{ value }}
        </span>
      </div>
    </div>
    <div class="task-footer">
      <div class="task-info">
        <span class="task-count">{{ $t('taskCard.remaining') }}: {{ task.left_counts }}</span>
        <!-- <span class="task-difficulty" :class="`difficulty-${getDifficultyLevel()}`">
          {{ difficultyText }}
        </span> -->
      </div>
      <div class="task-actions">
        <van-button 
          :type="taskStatus === 'claimed' ? 'default' : 'primary'"
          :disabled="task.left_counts === 0 || taskStatus === 'claimed'"
          size="small"
          @click.stop="handleClaim"
        >
          {{ getButtonText() }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/store/modules/task'
import { $t } from '@/locales'

interface Props {
  task: Task
  taskStatus?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  claim: [taskId: number]
  click: [taskId: number]
}>()

const getDifficultyLevel = () => {
  // 根据level字段判断难度
  if (props.task.level === 0) return 'easy'
  if (props.task.level <= 2) return 'medium'
  return 'hard'
}

const difficultyText = computed(() => {
  const difficultyMap = {
    easy: $t('taskCard.easy'),
    medium: $t('taskCard.medium'),
    hard: $t('taskCard.hard')
  }
  return difficultyMap[getDifficultyLevel()]
})

const handleClick = () => {
  emit('click', props.task.id)
}

const handleClaim = () => {
  if (props.task.left_counts > 0 && props.taskStatus !== 'claimed') {
    emit('claim', props.task.id)
  }
}

const getButtonText = () => {
  if (props.task.left_counts === 0) return $t('taskCard.soldOut')
  if (props.taskStatus === 'claimed') return $t('taskCard.claimed')
  return $t('taskCard.claimNow')
}
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.task-reward {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b35;
}

.task-content {
  margin-bottom: 16px;
}

.task-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.task-tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-count {
  font-size: 12px;
  color: #999;
}

.task-difficulty {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.difficulty-easy {
  background: #e8f5e8;
  color: #52c41a;
}

.difficulty-medium {
  background: #fff7e6;
  color: #fa8c16;
}

.difficulty-hard {
  background: #fff2f0;
  color: #ff4d4f;
}
</style>
