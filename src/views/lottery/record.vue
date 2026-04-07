<template>
	<view class="bg">		
		<view class="tabsBox">
            <van-tabs v-model:active="game_type" @click-tab="clickTab">
                <van-tab v-for="(item,index) in list1" :key="index" :title="item.name" :name="item.game_id" />
            </van-tabs>
            <van-tabs v-model:active="game_time" @click-tab="clickTime">
                <van-tab v-for="(item,index) in list2" :key="index" :title="item.name" :name="item.time"/>
            </van-tabs>
		</view>
		
		<view class="list flex flex-col" v-if="infoList.length>0">
            <van-collapse accordion v-model="activeCollapse" >
				<van-collapse-item :name="index" v-for="(item,index) in infoList" :key="index">
                    <template #title>
                        <div class="flex-sb coll_header">
                            <div class="flex flex-col cool_item">
                                <div class="period" style="padding-bottom: 10px;">{{item.period}}</div>
                                <div>{{item.createtime}}</div>
                            </div>
                            <div class="flex flex-col cool_item">
                                <template v-if="Number(item.status)===0">
                                    <div class="flex-col flex-end">
                                    <div class="money state-r">{{ $t('lottery.gamerecordstatus0') }}</div>
                                    <div>
                                        <span style="padding-right: 10px;box-sizing:border-box;">{{ $t(item.bet_play) }}</span>
                                        <span style="padding-right: 10px;box-sizing:border-box;">{{item.currency_symbol}}</span>
                                        <span class="money" >{{Number(item.bet_amount)}}</span>
                                    </div>
                                </div>
                                </template>
                                <template v-else>
                                    <div class="flex-col flex-end">
                                        <div class="money state-r" :style="{'color': [1,3].includes(Number(item.settle)) ? 'green':'red'}">
                                            {{[1,3].includes(Number(item.settle))? $t('lottery.gamerecordwintit') : Number(item.settle)===5? $t('lottery.gamerecorddraw') :$t('lottery.gamerecordfailtit')}}
                                        </div>
                                        <div>	
                                            <span style="padding-right: 10px;box-sizing:border-box;">{{ $t(item.bet_play) }}</span>
                                            <span style="padding-right: 10px;box-sizing:border-box;" :style="{'color': [1,3].includes(Number(item.settle))? 'green':'red'}">{{item.currency_symbol}}</span>
                                            <span class="money" :style="{'color': [1,3].includes(Number(item.settle))? 'green':'red'}"><span v-if="Number(item.net_amount)>0 &&[1,3].includes(Number(item.settle))">+</span>{{Number(item.net_amount)>0&&[1,3].includes(Number(item.settle))?Number(item.net_amount):Number(item.bet_amount)}}</span>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>

                    <div class="van-collapse-content">
                        <div class="d-title">{{ $t('lottery.gamerecorddestit') }}</div>
                        <van-cell :title="$t('lottery.tradingrecordorderNum')" :value="item.order_number"></van-cell>
                        <van-cell :title="$t('lottery.gamerecordnumtit')" :value="item.period"></van-cell>
                        <van-cell :title="$t('lottery.gamerecordgivemoney')" :value="item.currency_symbol+' '+Number(item.bet_amount)">
                        </van-cell>
                        <van-cell :title="$t('lottery.gamerecordgivefee')" :value="item.currency_symbol+' '+Number(item.fee_amount)">
                        </van-cell>
                        <van-cell :title="$t('lottery.gamerecordbettit')" :value="$t(item.bet_play)"></van-cell>
                        <van-cell :title="$t('lottery.gamerecordresulttit')">
                            <div  class="money result" :style="{'color': [1,3].includes(Number(item.settle))? 'green':'red'}">
                                <template v-if="Number(item.status)===0">
                                    {{ $t('lottery.gamerecordstatus0') }}
                                </template>
                                <template v-else>
                                    {{[1,3].includes(Number(item.settle))? $t('lottery.gamerecordwintit') :Number(item.settle)===5? $t('lottery.gamerecorddraw') : $t('lottery.gamerecordfailtit')}}
                                </template>
                                
                            </div>
                        </van-cell>
                        <van-cell :title="$t('lottery.gamerecordwinmoney')">
                            <div class="money" :style="{'color': [1,3].includes(Number(item.settle))? 'green':'red'}">{{item.currency_symbol}} 
                                <span v-if="Number(item.net_amount)>0 && [1,3].includes(Number(item.settle))" style="padding-left: 5px;box-sizing:border-box;">+</span>{{item.net_amount}}</div>
                        </van-cell>
                        <van-cell :title="$t('lottery.gamerecordtimetit')" :value="item.createtime"></van-cell>
                    </div>
                </van-collapse-item>
            </van-collapse>
		</view>
        <van-empty v-else  :description="$t('common.No_Data')"/>
        <div class="page_container">
            <div class="icon_con" @click="prevPage">
                <van-icon name="arrow-left" size="12" color="#fff" ></van-icon>
            </div>
            <div class="number">{{params.pageIndex}}</div>
            <div class="icon_con"  @click="nextPage">
                <van-icon name="arrow" size="12" color="#fff"></van-icon>
            </div>
        </div>
	</view>
</template>

<script lang="ts" setup>
import {betRecord} from "@/api/lottery";
import { ref,onMounted } from "vue"
import { $t } from '@/locales'
const list2:any = ref([
        {name: $t('fllowup.min1_win_go'),timeVal:0},
        {name: $t('fllowup.min3_win_go'),timeVal:1}, 
        {name: $t('fllowup.min_5'),timeVal:2},
        {name: $t('fllowup.min_10'),timeVal:3}
])
const list1 = ref([
    {name: 'Win go',game_id:1},
    {name: '5D',game_id:9}, 
    {name: 'K3',game_id:5}
])
const params:any = ref({game_id: 1,pageIndex:1,pageSize: 10})
const game_type:any = ref(1);
const game_time:any= ref(0)
const infoList:any = ref([])
const total:any = ref(0)
const activeCollapse = ref(null)
onMounted(()=>{
    loadMyBetRecord()
})
// 切换游戏
const clickTab =(value:any)=>{
    console.log(value,"222")
    infoList.value = []
    params.value.pageIndex = 1
    game_type.value = value.name
    game_time.value = 0;
    params.value.game_id = value.name;
    loadMyBetRecord()
}
			
// 切换时间
const clickTime=(value:any)=>{
    infoList.value = []
    params.value.pageIndex = 1
    game_time.value = value.name
    let game_id = 0
    if(game_type.value === 1){
        game_id = value.name + 1
    }else if(game_type.value===5){
        game_id = value.name + 5
    }else{
        game_id = 9 + value.name
    }
    params.value.game_id = game_id
    loadMyBetRecord()
}
const prevPage = ()=>{
    if(params.value.pageIndex > 1) {
        params.value.pageIndex --;
        loadMyBetRecord()
    }
}
const nextPage = ()=>{
    if(params.value.pageIndex <total.value) {
        params.value.pageIndex ++;
        loadMyBetRecord()
    }
}
const loadMyBetRecord = async()=>{
    let res:any = await betRecord(params.value);
    total.value = res.total
    infoList.value = res.rows
}
</script>

<style lang="less" scoped>
.tabsBox{
    width: 100%;
}
.itemBox{
    padding: 9px 20px;
    font-size: 13px;
    border-bottom: 1px solid #efeeee;
}
.redt{
        color: #fb4e4e;
        font-size: 10px;
        font-weight: bold;
    }
    .greent{
        color: #5cba47;
        font-size: 10px;
        font-weight: bold;
    }
    .list {
        margin-top: 10px;
    }
.page_container {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    box-sizing: border-box;
    color: #77819b;
    .icon_con {
        height: 37px;
        width: 37px;
        border-radius: 4px;
        background-image: linear-gradient(180deg, #5eafef, #3487f6);
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>