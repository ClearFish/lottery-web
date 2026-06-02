<template>
  <router-view v-if="ready" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSystemStore } from '@/store/modules/system'
import { useRoute } from 'vue-router'
import { setLocale } from "@/locales";
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

const syncFromRouteQuery = () => {
  const existingToken = localStorage.getItem('token')
  if (existingToken === 'undefined' || existingToken === 'null') {
    localStorage.removeItem('token')
  }

  const token = normalizeQueryString(route.query.token)
  const gameCode = normalizeQueryString(route.query.game_code)
  const lang = normalizeQueryString(route.query.lang)

  const currentToken = localStorage.getItem('token') || undefined
  const currentGameCode = localStorage.getItem('game_code') || undefined
  const currentLang = localStorage.getItem('language') || undefined

  const tokenChanged = !!token && token !== currentToken
  const gameCodeChanged = !!gameCode && gameCode !== currentGameCode
  const langChanged = !!lang && lang !== currentLang

  persistIfPresent('token', token)
  persistIfPresent('game_code', gameCode)
  persistIfPresent('language', lang)

  if (lang) setLocale(lang)
  if (gameCode) systemStore.setGameCode(gameCode)

  if (ready.value && (tokenChanged || gameCodeChanged || langChanged)) {
    Promise.all([
      systemStore.getSysTime(),
      systemStore.getInfo(),
      systemStore.getGame(),
      systemStore.getBalance()
    ]).catch(() => {})
  }
}

watch(() => route.query, syncFromRouteQuery, { immediate: true, deep: true })
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
