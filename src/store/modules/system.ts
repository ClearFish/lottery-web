import { defineStore } from "pinia";
import {getTime,getSystemInfo,getGameConfig,getUserBalance} from '@/api/system'
import { ref, computed } from 'vue'

export const useSystemStore = defineStore('system', ()=>{
    const time = ref<any>({})
    const systemInfo = ref<any>({})
    const gameConfig = ref<any>([])
    const balance = ref<any>({})
    const loading = ref(false)
    
    const getSysTime = async()=>{
        try {
            loading.value = true
            let res = await getTime()
            console.log(res,"123")
            time.value = res.data
        } catch (error) {
            console.error('获取时间失败:', error)
        } finally {
            loading.value = false
        }
    }

    const getInfo = async()=>{
        try {
            loading.value = true
            let res = await getSystemInfo()
            console.log(res,"123")
            systemInfo.value = res.data
        } catch (error) {
            console.error('获取系统信息失败:', error)
        } finally {
            loading.value = false
        }
    }

    const getGame = async()=>{
        try {
            loading.value = true
            let res = await getGameConfig()
            console.log(res,"123")
            gameConfig.value = res.data
        } catch (error) {
            console.error('获取游戏配置失败:', error)
        } finally {
            loading.value = false
        }
    }

    const getBalance = async()=>{
        try {
            loading.value = true
            let res = await getUserBalance()
            balance.value = res.data
        } catch (error) {
            console.error('获取余额失败:', error)
        } finally {
            loading.value = false
        }
    }

    return {
        loading: computed(()=>  loading.value),
        time: computed(()=>  time.value),
        systemInfo: computed(()=>  systemInfo.value),
        gameConfig: computed(()=>  gameConfig.value),
        balance: computed(()=>  balance.value),

        getSysTime,
        getInfo,
        getGame,
        getBalance,
    }
})
/**
 * 
 *  async getTime(){
        let res = await getTime()
        console.log(res,"123")
        this.time = res.data
    },
    async getSystemInfo() {
        let res = await getSystemInfo()
        this.systemInfo = res.data
    },
    async getGameConfig() {
        let res = await getGameConfig()
        this.gameConfig = res.data
    },
 */