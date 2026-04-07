<template>
    <div class="big_box" v-if="show">
        <div class="container">
             <div class="top_header">
                <div class="empty"></div>
                <div class="word">{{$t('lottery.My_Order')}}</div>
                <div class="icon">
                     <van-icon name="cross" size="18" color="#77819b" @click="closeFollow"/>
                </div>
            </div>
            <div class="cont_box">
                <div class="title">
                     <div class="label">{{$t('lottery.Name')}}</div>
                    <div class="label">{{$t('lottery.Peroid')}}</div>
                    <div class="label add_color">{{$t('lottery.Type')}}</div>
                    <div class="label">{{$t('lottery.Amount_b')}}</div>
                    <div class="label add_color">{{$t('lottery.Win')}}</div>
                </div>
                <div class="con_bet">
                    <div class="content">
                        <div class="con_item" v-for="(item,index) in recordList" :key="index">
                            <div class="val">{{item.game_name}}</div>
                            <div class="val">{{item.period}}</div>
                            <div class="val add_color">{{$t(item.bet_play)}}</div>
                            <div class="val">{{numberFormat(item.bet_amount)}}</div>
                            <div class="val add_color amount" :class="item.net_amount >0 ? 'win_color' :'lost_color'">{{numberFormat(item.net_amount)}}</div>
                        </div>
                        <van-overlay
                            :show="showLoading"
                            :opacity="0.6"
                            class-name="flex-rcc"
                            z-index="99999999"
                            >
                            <van-loading color="#3498db"></van-loading>
                        </van-overlay>
                    </div>
                    <div class="bottom_total">
                        <div class="btm_con">
                            <div class=" label total">{{ $t('lottery.Historical_bonuses') }}:</div>
                            <div class="label value amount" :class="sumWin >0 ? 'win_color' :'lost_color'">{{ numberFormat(sumWin.toFixed(2)) }}</div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="page_box" v-if="showPage">
                <div class="page_container">
                    <van-icon name="arrow-left" size="18" color="#77819b" @click="prevPage"></van-icon>
                    <div class="number">{{pages.pageIndex}}/{{Math.ceil(total/pages.pageSize)}}</div>
                    <van-icon name="arrow" size="18" color="#77819b" @click="nextPage"></van-icon>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {getBetRecordNew} from "@/api/lottery"
import { ref,defineEmits } from "vue"
import { $t } from '@/locales'
const show = ref(false)
const recordList:any = ref([])
const pages:any = ref({pageIndex:1,pageSize:10})
const total = ref(0)
const showPage = ref(false)
const sumWin = ref(0)
const showLoading = ref(false)

const emit = defineEmits(["closeFollow"]);
const numberFormat=(number:any)=> {
    if(number%1000 == 0 && number != 0) {
        // 能被1000整除转为K
        if(number>0) {
            return (number/1000).toLocaleString()+'K'
        }else {
            return '-'+(Math.abs(number)/1000).toLocaleString()+'K'
        }
    }else{
        return number && number.toLocaleString()
    }
}
const closeFollow=()=> {
    show.value = false;
    emit('closeFollow')
}
const showFollowList=()=> {
    show.value = true;
    getList()
}
const getList = async()=> {
    showLoading.value = true
    let res:any = await getBetRecordNew({...pages.value});
    recordList.value = res.rows;
    total.value = res.total;
    let amount = 0
    sumWin.value = res.rows.reduce((amount:any,item:any)=>Number(amount)+Number(item.net_amount),amount)
    if(res.total > 10) {
        showPage.value = true
    };
    showLoading.value = false
}
const prevPage=()=> {
    if(pages.value.pageIndex == 1) {
        return
    }else {
        pages.value.pageIndex --;
        getList()
    }
}
const nextPage=()=> {
    if(Math.ceil(total.value/pages.value.pageSize) == pages.value.pageIndex) {
        return
    }else {
        pages.value.pageIndex ++;
        getList()
    }
}
defineExpose({
    showFollowList
})
</script>
<style lang="less" scoped>
.flex-rcc{
  display: flex;
  align-items: center;
  justify-content: center;
}
.big_box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
    .container {
        width: 96%;
        max-width: 480px;
        padding: 8px;
        background: #fff;
        border-radius: 8px;
        position: fixed;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        min-height: 420px;
        z-index: 10001;
        .top_header {
            display: flex;
            justify-content: space-between;
            color: #77819b;
            font-weight: 600;
            margin-bottom: 16px;
            .icon {
                width: 24px;
                height: 24px;
            }
        }
        .cont_box {
            color: #77819b;
            .title {
                display: flex;
                font-size: 14px;
                position: sticky;
                background: #f0f5ff;
                left: 0;
                top: 0;
                .label {
                    width: 20%;
                    text-align: center;
                    height: 30px;
                    line-height: 30px;
                }
                .add_color {
                    // background: #322e2e;
                }
            }
            .content {
                height: 358px;
                overflow-y: scroll;
                .con_item {
                    display: flex;
                    height: 36px;
                    .val {
                        width: 20%;
                        text-align: center;
                        font-size: 12px;
                        line-height: 36px;
                    }
                    .add_color {
                        // background: #322e2e;
                    }
                    
                }
            }
            .bottom_total {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                font-size: 14px;
                .btm_con {
                    height: 36px;
                    line-height: 36px;
                    width: 40%;
                    display: flex;
                    align-items: center;
                    .label {
                        width: 50%;
                        text-align: center;
                    }
                    .total {
                        text-align: end;
                    }
                }
            }
        }
        .page_box {
            display: flex;
            justify-content: center;
            height: 32px;
            .page_container {
                display: flex;
                gap: 6px;
                align-items: center;
                color: #77819b;
            }
        }
    }
    .win_color {
        color: #5cba47;
    }
    .lost_color {
        color: #d0322d;
    }
    .amount {
        font-weight: 800;
    }
}
</style>