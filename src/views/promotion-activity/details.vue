<template>
     <div class="promotion_box">
        <div class="container">
            <div class="list">
                <div class="title">
                    <img :src="detail.image" class="des-img flex-shrink"/>
                    <div class="tit-info">
                        <div class="">{{detail.title}}</div>
                        <div class="time">{{detail.createtime}}</div>
                    </div>
                </div>
                <div v-html="detail.content" @click="navigate"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { getActivity,gameApiLogin } from '@/api/promotions'
import {ref,onMounted} from "vue"
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { $t } from '@/locales'

const router = useRouter()
const route = useRoute()

const detail:any = ref({})

const getActivityDetail=(id:any)=>{
    getActivity({id:id}).then(res =>{
        detail.value = res
    })  
}
const navigate=async(e:any)=> {
    console.log(e.target,"222")
    const clickTrget = e.target
    if(clickTrget.getAttribute('link')) {
        try {
            await navigator.clipboard.writeText(clickTrget.getAttribute('link'))
            showToast($t('deposit.copiedToClipboard'))
        } catch (error) {
            showToast($t('deposit.copyFailed'))
        }
    }else if(clickTrget.getAttribute('game_list_id')) {
        router.push({
        name: 'Game',
        query: {
            game_name:clickTrget.getAttribute('game_name'),
            game_code:clickTrget.getAttribute('game_code'),
            game_list_id:clickTrget.getAttribute('game_list_id'),
            title:clickTrget.getAttribute('title')
        }
    })
    }
}

onMounted(()=>{
    console.log(route)
    const taskId = parseInt(route.query.id as string)
    getActivityDetail(taskId)
})
</script>
<style lang="less" scoped>
.promotion_box {
    // padding-top: 64px;
    background: #fff;
    min-height: 100vh;
    color: #666;
    .container {
        padding: 10px;
        .top_title {
            display: flex;
            gap:4px;
            font-size: 20px;
            font-weight: 700;
            align-items: center;
            img {
                width: 21px;
                height: 21px;
            }
        }
        .list_container {
            margin-top: 10px;
            .list_item {
                margin-bottom: 10px;
                img {
                    width: 100%;
                    height: auto;
                    border-radius: 4px;
                }
                .content_box {
                    padding-left: 10px;
                    .tiitle {
                        font-size: 16px;
                        color: #666;
                    }
                    .action {
                        display: flex;
                    }
                    .more_box {
                        padding: 5px 15px;
                        font-size: 12px;
                        color: #666;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #f12c4c;
                        border-radius: 4px;
                        flex-shrink: 0;
                        margin-top: 6px;
                        font-weight: 800;
                    }
                }
            }
        }
    }
    .list{
        // padding: 14px;
        .title{
            padding: 14px 0;
            padding-top: 0;
            border-bottom: 1px solid #f2f5f7;
            .des-img{
                width: 100%;
                height: auto;
                margin-right: 10px;
            }
            .tit-info{
                font-size: 16px;
                
                color: #666;
            }
            .time{
                margin-top: 4px;
                color: #666;
                font-size: 11px;
            }
        }
        .con {
            padding: 14px 0;
            font-size: 14px;
            line-height: 18px;
            color: #666;
        }
    }
}
</style>