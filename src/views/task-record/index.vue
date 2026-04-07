<template>
  <div class="task-record-page">
    <van-tabs
      v-model:active="activeTab"
      class="record-tabs"
    >
      <van-tab :title="$t('taskRecord.taskCenter')" name="tasks" />
      <van-tab :title="$t('taskRecord.receiveRecord')" name="records" />
    </van-tabs>

    <div class="tab-content">
      <keep-alive>
        <component :is="currentComponent" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts" name="TaskRecord">
import { computed, defineAsyncComponent, ref } from 'vue'
import { $t } from '@/locales'

const TasksPage = defineAsyncComponent(() => import('@/views/tasks/index.vue'))
const MyTasksPage = defineAsyncComponent(() => import('@/views/my-tasks/index.vue'))

const activeTab = ref<'tasks' | 'records'>('tasks')

const componentsMap = {
  tasks: TasksPage,
  records: MyTasksPage
}

const currentComponent = computed(() => componentsMap[activeTab.value])
</script>

<style scoped>
.task-record-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.record-tabs {
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 5;
}

.tab-content {
  flex: 1;
  background: #fff;
}

::deep(.van-tabs__line) {
  background: #1890ff;
}

::deep(.van-tab--active) {
  color: #1890ff;
}
</style>