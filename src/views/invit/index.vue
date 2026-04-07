<template>
    <div class="bg_box">
        <van-nav-bar :title="titleName" fixed left-text="" z-index="99" left-arrow @click-left="onClickLeft">
            <template #right>
                <van-icon name="orders-o" size="20" @click="toRecord" v-if="activeTab == 'Mission'"/>
            </template>
        </van-nav-bar>
        <div class="container_top">
           <van-tabs v-model:active="activeTab" @change="handleTabChange" >
                <van-tab :title="$t('invite.Overivew')" name="InviteInfo">
                    <InviteInfo/>
                </van-tab>
                <van-tab :title="$t('invite.Rewords')" name="Mission">
                    <Mission/>
                </van-tab>
                <van-tab :title="$t('invite.Report')" name="Bonous">
                    <Bonous/>
                </van-tab>
                <van-tab :title="$t('invite.Invitee_List')" name="Team">
                    <Team/>
                </van-tab>
           </van-tabs>
        </div>
        <FloatingService/>
    </div>
</template>
<script lang="ts" setup>
import Mission from './components/mission.vue'
import Team from './components/team.vue'
import InviteInfo from "./components/inviteinfo.vue"
import Bonous from "./inviteinfo-report.vue"
import {ref,onMounted,nextTick,computed} from "vue"
import { useRouter,useRoute } from 'vue-router'
import FloatingService from '@/components/FloatingService/index.vue'
import { $t } from '@/locales'
const router = useRouter()
const route = useRoute()
const activeTab:any = ref('InviteInfo')
const titleName = ref('')
let nameNum:any = {
    "InviteInfo":$t('invite.Overivew'),
    "Mission":$t('invite.Rewords'),
    "Bonous":$t('invite.Report'),
    "Team":$t('invite.Invitee_List'),
    
}
onMounted(()=>{
    let type:any = route.query.type;
    activeTab.value = type;
    titleName.value = nameNum[type]
})
const handleTabChange=(val:any)=> {
    console.log(val,"123123");
    nextTick(()=>{
        activeTab.value = val;
        titleName.value = nameNum[val]
    })
}
const toRecord=()=>{
   router.push('/promotion-activity/receiverecords')
}
const onClickLeft = ()=>{
    router.go(-1)
}
</script>
<style lang="less" scoped>
.bg_box {
    background: #fff;
    min-height: 100vh;
    padding-top: 50px;
    .container_top {
        border-bottom: 1px solid #ddd;
        :deep(.van-tabs__wrap) {
             overflow: auto;
             border-bottom: 1px solid #ddd;
            .van-tabs__nav {
                width: 100%;
                overflow-x: auto;
                gap: 10px;
                box-sizing: border-box;
                padding-bottom: 0;
            }
            .van-tabs__line {
                bottom: 0;
            }
            .van-tab {
                min-width:fit-content !important;
                flex: auto;
                .van-tab__text  {
                    display: block;
                    width: 100%;
                }
            }
        }
    }
    .u-tabs {
        background: #fff;
    }
}
</style>