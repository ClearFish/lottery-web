
import { ref } from 'vue'
import { defineStore } from 'pinia'
const banneList:any = ref([])
const siteInfo:any = ref(null)
const deviceId:any = ref(localStorage.getItem('deviceId') || '')
const setBannerList = (list:[])=>{
    banneList.value = list
}
const setSiteInfo = (info:{})=>{
    siteInfo.value = info
}
const setDeviceId = (id:string)=>{
    deviceId.value = id
}
export const useSiteStore = defineStore('site',()=>{
  return {
    banneList,
    siteInfo,
    deviceId,
    setBannerList,
    setSiteInfo,
    setDeviceId
  }
})