<template>
  <router-view v-if="ready" />
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import { useSystemStore } from '@/store/modules/system'
import { useRouter, useRoute } from 'vue-router'
import { setLocale } from "@/locales";
const router = useRouter()
const route = useRoute()
const systemStore = useSystemStore()
const ready = ref(false)

const normalizeQueryString = (val: unknown) => {
  if (typeof val === 'string') return val
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0]
  return undefined
}

const persistIfPresent = (key: string, value: string | undefined) => {
  if (!value) return
  if (value === 'undefined' || value === 'null') return
  localStorage.setItem(key, value)
}

onBeforeMount(() => {
  const existingToken = localStorage.getItem('token')
  if (existingToken === 'undefined' || existingToken === 'null') {
    localStorage.removeItem('token')
  }

  const token = normalizeQueryString(route.query.token)
  const gameCode = normalizeQueryString(route.query.game_code)
  const lang = normalizeQueryString(route.query.lang)

  persistIfPresent('token', token)
  persistIfPresent('game_code', gameCode)
  persistIfPresent('language', lang)

  if (lang) setLocale(lang)
  if (gameCode) systemStore.setGameCode(gameCode)
})
onMounted(async () => {
  console.log(route)
 
  await Promise.all([
    systemStore.getSysTime(),
    systemStore.getInfo(),
    systemStore.getGame(),
    systemStore.getBalance()
  ])
  ready.value = true
})
</script>
<style></style>
