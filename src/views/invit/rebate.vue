<template>
    <div class="big_box">
        <div class="container_box">
            <div class="classfy_list" :scroll-x="true" :scroll-y="false" :scroll-left="0">
                <div 
                    class="classty_item" 
                    @click="choseTypes(item,index)" 
                    :class="activeClassfy == index ? 'active_item':''" 
                    v-for="(item,index) in topList" :key="index"
                    >
                    <img :src="item.img" alt="">
                    <text>{{item.name}}</text>
                </div>
            </div>
            <div class="list_box">
                <div class="list_item" v-for="(item,index) in lists" :key="index">
                    <div class="top_title">
                        <div class="title">{{$t('invite.Rebate_level')}} </div>
                        <div class="lv_val">{{item.level}}</div>
                    </div>
                    <div class="item_lv" v-for="(ite,inx) in item.odds_json" :key="inx">
                        <div class="left">
                            <div class="top_circle">
                                <div class="ball"></div>
                            </div>
                            <div class="word">{{ite.level}} {{$t('invite.level_lower_level_commission_rebate')}}</div>
                        </div>
                        <div class="right">{{ite[choseType]}}%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref,onMounted} from "vue"
import {getLevel } from '@/api/promotions'
import { $t } from '@/locales'
import Icon1 from "@/assets/game/lottery_bg.png"
import Icon2 from "@/assets/game/live-chat.png"
import Icon3 from "@/assets/game/sporticon_bg.png"
import Icon4 from "@/assets/game/cards.jpg"
import Icon5 from "@/assets/game/slot-machine.png"
const topList:any = ref([
    {name:'Lottery',img:Icon1,type:'lottery_odds'},
    {name:'Casino',img:Icon2,type:'live_odds'},
    {name:'Sports',img:Icon3,type:'sports_odds'},
    {name:'Cards',img:Icon4,type:'card_odds'},
    {name:'Slots',img:Icon4,type:'slots_odds'}
])
const activeClassfy:any = ref(0)
const lists:any = ref([])
const choseType:any = ref('lottery_odds')
onMounted(()=>{
    getData()
})
const getData=async()=> {
    let res:any = await getLevel();
    lists.value = res.rows
}
const choseTypes=(item:any,index:any)=> {
    activeClassfy.value = index,
    choseType.value = item.type
}
</script>
<style lang="less" scoped>
.big_box {
    width: 100%;
    min-height: 100vh;
    background: #F7F8FF;
    .container_box {
        
        box-sizing: border-box;
        padding-top: 0;
        background: #F7F8FF;
        .classfy_list {
            padding:  4px 0;
            padding: 10px;
            position: sticky;
            top: 43px;
            padding-top: 10px;
            left: 0;
            z-index: 9;
            width: 100%;
            background: #F7F8FF;
            display: flex;
            gap: 4px;
            overflow-x: auto;
            .classty_item {
                margin-left: 8px;
                height: 52px;
                flex-shrink: 0;
                background: #fff;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #768096;
                font-size: 14px;
                row-gap: 4px;
                min-width: 100px;
                font-weight: 600;
                border-radius: 4px;
                position: relative;
                img {
                    width: 18px;
                    height: auto;
                }
                &:last-child{
                    &::after {
                        width: 0;
                    }
                }
            }
            .active_item {
                background-image: linear-gradient(90deg, #f95959 0%, #ff9a8e 100%);
                color: #fff;
            }
        }
        .list_box {
            padding: 10px;
            .list_item {
                width: 100%;
                padding: 10px 6px;
                box-sizing: border-box;
                background: #fff;
                border-radius: 4px;
                margin-bottom: 10px;
                .top_title {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    .title {
                        color: #1E2637;
                    }
                    .lv_val {
                        font-size: 20px;
                        color: #f95959;
                        font-style: italic;
                        font-weight: 600;
                    }
                }
                .item_lv {
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    font-size: 12px;
                    margin-top: 10px;
                    .left {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        .top_circle {
                            padding: 2px;
                            border-radius: 10px;
                            border: 1px solid #f95959;
                            position: relative;
                            .ball {
                                background: #f95959;
                                width: 6px;
                                height: 6px;
                                border-radius: 6px;
                            }
                            &::after {
                                content: "";
                                height: 8px;
                                border-left: 1px dashed #f95959;
                                position: absolute;
                                bottom: -12px;
                                left: 50%;
                                transform: translateX(-50%);
                            }
                        }
                    }
                    &:last-child {
                        .left {
                            .top_circle {
                                &::after {
                                    display: none;
                                }
                            }
                        }
                    }
                }
                .cancle {
                    .left {
                        .top_circle {
                            &::after {
                                height: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>