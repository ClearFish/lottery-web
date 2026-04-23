<template>
	<div class="bg">
		<!-- 时间 -->
		<div class="game-betting">
			<div class="tab">
				<div class="box flex-sb">
					<div v-for="(item,key) in gameType" :key="key" class="flex-cc  itemInfo" :class=" current===key ? 'activeItem' : ''" @click="cutTime(key)">
						<img :src="ClockChosed" v-if="current===key"/>
						<img :src="Clock" v-else/>
						<span class="text" :class="current===key ? 'chosesd_text' :''">{{item.label}}{{$t('lottery.gameunit')}}</span>
					</div>
				</div>
			</div>
			<win 
				v-if="game_type==0" 
				:noThree="noThree" 
				:isFollow="false"
				ref="winRef"
				:game-id="params.game_id" 
				:currentTime="current" 
				@openRule="isRule=true" 
				@updata="getResultRecord" 
				@upDataLog="getBetRecord" 
				@cutAgent="cutAgent" 
				:balances="Balances" 
				:game_code="game_code"
				:text="text1"
				@music="setMusic"></win>
			<d5 
				v-if="game_type==1" 
				:game-id="params.game_id" 
				:isFollow="false" 
				@openRule="isRule=true" 
				@updata="getResultRecord" 
				@upDataLog="getBetRecord" 
				@cutAgent="cutAgent" 
				:balances="Balances"
				:currentTime="current" 
				
				ref="d5Ref"
				:text="text1"
				@music="setMusic"></d5>
			<k3 
				v-if="game_type==2" 
				:game-id="params.game_id" 
				:isFollow="false"
				@openRule="isRule=true" 
				@updata="getResultRecord" 
				@upDataLog="getBetRecord" 
				:currentTime="current"
				@cutAgent="cutAgent" 
				:balances="Balances"
				ref="k3Ref"
				:text="text1"
				@music="setMusic"></k3>
		</div>
		
		<div class="game-list">
			<div class="list_container">
				<div class="tab flex-sb">
					<div class="li" v-for="(i,index) in tab" :key="index" :class="tabAction===index ? 'action' : ''" @click="cutTab(index)">{{i}}</div>
				</div>
				
				<div class="u-table">
					<div class="tabBox flex" v-if="tabAction==1 &&game_type==1">
						<div class="tabItem" v-for="(i,index) in tabList" :key="index" :class="tabCurrent===index ? 'action' : ''" @click="changeMenu(index)">
							{{i}}
						</div>
					</div>
					<div class="t-tr flex head flex-item-col-center">
						<!-- 开奖历史 -->
						<template v-if="tabAction==0">
							<template v-if="game_type==0">
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth1')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth2')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth3')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth4')}}</div>
							</template>
							<template v-else-if="game_type==1">
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth1')}}</div>
								<div class="flex-item-2 flex-rcc">{{$t('lottery.table5dth2')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.table5dth3')}}</div>
							</template>
							
							<template v-else>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth1')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.table5dth3')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth3')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tablek3th4')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tablek3th5')}}</div>
							</template>
						</template>
						
						<template v-else-if="tabAction==1">
							<template v-if="[0,1].includes(game_type)">
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth1')}}</div>
								<div class="flex-item-2 flex-rcc">{{$t('lottery.popupcell3')}}</div>
							</template>
							<template v-else>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tableth1')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tablek3th5')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.tablek3th4')}}</div>
								<div class="flex-item-1 flex-rcc">{{$t('lottery.table5dth3')}}</div>
							</template>
						</template>
					</div>
					
					<!-- 列表 -->
					<template v-if="tabAction==0">
						<div class="t-tr tr flex flex-item-col-center" v-for="(item,key) in gameLog" :key="key">
							<template v-if="game_type==0">
								<div class="flex-item-1 flex-rcc">{{item.issue_no}}</div>
								<div class="flex-item-1 flex-rcc" :class="{'num_gcolor': [1,3,5,7,9].includes(Number(item.result[0])),'num_rcolor':[0,2,4,6,8].includes(Number(item.result[0]))}">{{item.result[0]}}</div>
								<div class="flex-item-1 flex-rcc">{{Number(item.result[0])>4? $t('lottery.winGobig'): $t('lottery.winGosmall')}}</div>
								<div class="flex-item-1 flex-rcc">
									<span class="redc circle" v-if="[0,2,4,6,8].includes(Number(item.result[0]))"></span>
									<span class="greenc circle" v-if="[1,3,5,7,9].includes(Number(item.result[0]))"></span>
									<span class="zi circle" v-if="[0,5].includes(Number(item.result[0]))"></span>
								</div>
							</template>
							
							<template v-else-if="game_type==1">
								<div class="flex-item-1 flex-rcc">{{item.period}}</div>
								<div class="flex-item-2 flex-rcc">
									<span class="border" v-for="(i,index) in item.result" :key="index">{{i}}</span>
								</div>
								<div class="flex-item-1 flex-rcc">
									<span class="border-r">{{sumWin(item.result)}}</span>
								</div>
							</template>
							
							<template v-else>
								<div class="flex-item-1 flex-rcc third">{{item.period}}</div>
								<div class="flex-item-1 flex-rcc third">{{sumWin(item.result)}}</div>
								<div class="flex-item-1 flex-rcc third">{{sumWin(item.result)>10? $t('lottery.winGobig'): $t('lottery.winGosmall')}}</div>
								<div class="flex-item-1 flex-rcc third">{{(sumWin(item.result)%2)===0? $t('lottery.k3even'): $t('lottery.k3odd')}}</div>
								<div class="flex-item-1 flex-rcc third">
									<div v-for="(i,index) in item.result" :key="index">
										<img :src="`/static/game/dice_show${i}.min.png`" class="icon-num"/>
									</div>
									
								</div>
							</template>
						</div>
					</template>
					<template v-else-if="tabAction==1">
						<div class="t-tr tr flex flex-item-col-center" v-for="(item,key) in gameLog" :key="key">
							<div class="flex-item-1 flex-rcc">{{item.period}}</div>
							<template v-if="game_type==0">
								<div class="flex-item-2 flex-rcc" style="position: relative;">
									<div v-for="(i,key) in 10" 
										:key="key" class="m-li" 
										:class="{
											'redc':Number(item.result[0])===key&&[2,4,6,8].includes(Number(item.result[0])),
											'greenc':Number(item.result[0])===key&&[1,3,5,7,9].includes(Number(item.result[0])),
											'color0':Number(item.result[0])===key&&Number(item.result[0])===0,
											'color5':Number(item.result[0])===key&&Number(item.result[0])===5
											}" 
										:style="{'color': Number(item.result[0])===key? '#fff': '#bbb'}"
									>{{key}}</div>
									<div class="m-li" 
										style="color: #fff;margin-left: 10px;"  
										:style="{'background':Number(item.result[0])>4? '#ffc511': '#5cba47'}"
									>{{Number(item.result[0])>4? 'B': 'S'}}</div>
									<div class="can-box" 
										v-if="key<9" 
										style="    
										position: absolute;
										width: 200px;
										height: 30px;
										top: 18px;
										left: 10px;
										z-index: 999;"
									>
										<canvas style="width: 100%; height: 100%;" :canvas-id="'firstCanvas'+key" :id="'firstCanvas'+key" @error="canvasIdErrorCallback"></canvas>
									</div>
								</div>
							</template>
							<template v-else-if="game_type==1">
								<div class="flex-item-2 flex-rcc" style="position: relative; font-size: 11px;">
									<div v-for="(i,key) in 10" 
										:key="key" class="m-li" 
										:class="{'redc':Number(item.result[tabCurrent])===key}" 
										:style="{'color': Number(item.result[tabCurrent])===key? '#fff': '#bbb'}"
									>{{key}}</div>
									<div class="m-li" 
										style="margin-left: 10px; border: 1px solid #5856d6;font-size: 10px;"  
										:style="{
											'background':Number(item.result[tabCurrent])>4? '#5856d6': '#fff',
											'color':Number(item.result[tabCurrent])>4? '#fff': '#5856d6'}"
										>{{Number(item.result[tabCurrent])>4? 'B': 'S'}}</div>
									<div class="m-li"
										style="margin-left: 5px; border: 1px solid #ff9500;font-size: 10px;"  
										:style="{
											'background':Number(item.result[tabCurrent])%2!==0? '#ff9500': '#fff',
											'color':Number(item.result[tabCurrent])%2!==0? '#fff': '#ff9500'}"
											>{{Number(item.result[tabCurrent])%2!==0? 'O': 'E'}}</div>
									<div class="can-box" 
										v-if="key<9" 
											style="
											left: 0px;
										    position: absolute;
											width: 200px;
											height: 30px;
											top: 18px;
											z-index: 999;"
									>
										<canvas style="width: 100%; height: 100%;" :canvas-id="'firstCanvas'+key" :id="'firstCanvas'+key" @error="canvasIdErrorCallback"></canvas>
									</div>
								</div>
							</template>
							<template v-else>
								<div class="flex-item-1 flex-rcc third">
									<div v-for="(i,index) in item.result" :key="index">
										<img :src="`/static/game/dice_show${i}.min.png`" class="icon-num"/>
									</div>
									
								</div>
								<div class="flex-item-1 flex-rcc third">{{(sumWin(item.result)%2)===0? $t('lottery.k3even'): $t('lottery.k3odd')}}</div>
								<div class="flex-item-1 flex-rcc third">{{sumWin(item.result)}}</div>
							</template>
						</div>
					</template>
					
					<template v-else>
						<div class="log-box" v-if="betRecordList.length>0">
							<div class="log-list flex flex-col">
								<van-collapse accordion v-model="activeCollapse" >
									<van-collapse-item :name="index" v-for="(item,index) in betRecordList" :key="index">
										<!-- 注单列表 -->
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

										<!-- 详情 -->
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

							</div>
						</div>
						<van-empty v-else  :description="$t('invite.nomore')" style="padding-top: 50px;" />
						
					</template>
					<div class="page_container">
                        <div class="icon_con" @click="prevPage">
                            <van-icon name="arrow-left" size="12" color="#fff" ></van-icon>
                        </div>
                        <!-- /{{Math.ceil(total/params.pageSize)}} -->
                        <div class="number">{{params.pageIndex}}</div>
                        <div class="icon_con"  @click="nextPage">
                            <van-icon name="arrow" size="12" color="#fff"></van-icon>
                        </div>
                    </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
// import Rule from "@/components/Dialog/rule.vue"
import Win from "@/components/Lottery/win.vue"
import d5 from "@/components/Lottery/lottery5d.vue"
import k3 from "@/components/Lottery/k3.vue"
import Clock from "@/assets/game/clock.png"
import ClockChosed from "@/assets/game/clock_chosed.png"
import Music1 from "@/assets/game/di1.mp3"
import Music2 from "@/assets/game/di2.mp3"
import { gameResultsRecord, betRecord } from '@/api/lottery'
import miment from 'miment'
import { ref, computed, onMounted, nextTick, onUnmounted,watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useSystemStore } from '@/store/modules/system' 
import { showToast } from 'vant'
import { $t } from '@/locales'

const iframeInfo = {
	game_code: 'Color10m',
	game_type: '0',
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const systemStore = useSystemStore() 

const noThree:any= ref(false)// 是否不展示三分彩
const isThree:any= ref(false)// 是否只展示三分彩
const isPlay:any= ref(true)// 是否播放音乐
const game_id:any= ref('')// 路由初始游戏id
const game_type:any= ref('0')// 游戏类型
const isRule:any= ref(false)
const tabCurrent:any= ref(0)
const current:any= ref(0)
const rate:any= ref(1)
const tabList:any= ref(['A','B','C','D','E'])
const text1:any= ref('')
const gameType:any= ref([{value: 1,label: '1'},{value: 3,label: '3'},{value: 5,label: '5'},{value: 10,label: '10'}])
const tabAction:any= ref(0)
const gameLog:any= ref([])
const betRecordList:any= ref([])
const params:any= ref({ game_code: iframeInfo.game_code,page: 1,pageSize: 20})// 开奖历史
const betParams:any= ref({game_id: 0,pageIndex: 1,pageSize: 10})
const audioAction:any= ref({method: 'pause'})
const Balances:any= ref([])
const total:any= ref(0)
const timmer:any= ref(null)
const timmerOut:any= ref(null)
const music1:any=ref(null)
const music2:any=ref(null)
const playing:any=ref(false)
const initNumber:any=ref(10)
const unread_total:any=ref(0)
const showLoading:any=ref(false)
const lang:any=ref('yuenan')
const tab:any=ref([$t('lottery.tab1'),$t('lottery.tab2'),$t('lottery.tab3')]);
const k3Ref:any = ref(null)
const winRef:any = ref(null)
const d5Ref:any = ref(null)
const activeCollapse = ref(null)
const game_code = ref('')

const time = ()=>{
    let num = 60000
    num = gameType.value[current.value].value * 60000
    return num
}
onMounted(()=>{
	console.log(systemStore.gameConfig,333)
    const option = route.query as any;
    game_type.value = Number(iframeInfo.game_type) || '0'//Number(option.type)
	// ?game_id=1&game_type=0&gameMin=1
    game_id.value = option.game_id  || '1'
	game_code.value = iframeInfo.game_code || 'Color1m'
    params.value.game_code = iframeInfo.game_code ||'Color1m'
    betParams.value.game_id = game_id.value || '1'
    getResultRecord()
    createMusic()
    if(option.min){
        current.value = Number(option.min) || '1'
        isThree.value = true
    }
    if(option.noThree){
        noThree.value = true
        gameType.value.splice(1,1)
    }
    if(option.gameMin) {
        let minIndex = gameType.value.findIndex(item=>item.value == option.gameMin);
        current.value = minIndex;
        cutTime(minIndex)
    }
    const userAgent = navigator.userAgent.toLowerCase();
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(userAgent)) {
        // 移动端
        initNumber.value = 10
    } else {
        // pc端
        initNumber.value = 70
    }
})
onUnmounted(()=>{
    resetMusic()
})

const prevPage = ()=>{
    if(params.value.pageIndex > 1) {
        params.value.pageIndex --;
        handlePageChange()
    }
}
const nextPage = ()=>{
    if(params.value.page <total.value) {
        params.value.page ++;
        handlePageChange()
    }
}
const handlePageChange =()=>{
    if(tabAction.value!==2){
        getResultRecord()
    }else{
        getBetRecord()
    }
}
// 切换代理
const cutAgent=(item:any)=>{
    params.value.game_id = item.game_id
    betParams.value.game_id = item.game_id
    getBetRecord()
    getResultRecord()
}
const createMusic =()=>{
    music1.value = new Audio();
    music1.value.src = Music1
    music2.value = new Audio();
    music2.value.src = Music2
}
const setMusic=(time:any)=>{
    playing.value = true
    if(isPlay.value){
        music1.value.play()
        timmer.value = setInterval(()=>{
            music1.value.play()
        },1000)
        timmerOut.value = setTimeout(()=>{
            clearInterval(timmer.value)
            music2.value.play()
            playing.value = false
            resetMusic()
        },time)
    }
    if(time===11){
        playing.value = true
        if(isPlay.value){
            music1.value.play()
            timmer.value = setInterval(()=>{
                music1.value.play()
            },1000)
            timmerOut.value = setTimeout(()=>{
                clearInterval(timmer.value)
                music2.value.play()
                playing.value = false
                resetMusic()
            },11000)
        }
    }
}
// 重置音乐
const resetMusic =()=>{
    if(timmer.value){
        clearInterval(timmer.value)
        timmer.value = null
    }
    if(timmerOut.value){
        clearInterval(timmerOut.value)
        timmerOut.value = null
    }
    playing.value = false
}
// 获取余额
const getUserInfo = async()=>{
    showLoading.value = true
    // await userStore.fetchUserInfo()
    showLoading.value = false
}
const draw =(arr:any,key:any)=>{
    nextTick(()=>{
		if(key) {
			arr.map((v,index)=>{
				let mn = initNumber.value + Number(v.result[key])*28
				if(index<9){
					let ln = initNumber.value + Number(arr[index+1].result[key])*28
					let canvas:any = document.getElementById(`firstCanvas${index}`)
					let ctx = canvas.getContext('2d')
					ctx.strokeStyle = '#fb4e4e'
					ctx.lineWidth  = 6
					console.log(mn,ln)
					ctx.moveTo(mn, 0)
					ctx.lineTo(ln, 128)
					ctx.stroke()
				}
				
			})
		}
    })
}
// 5d号码切换
const changeMenu=(index:any)=>{
    tabCurrent.value=index
    draw(gameLog.value,index)
}
const cutTab=(index:any)=>{
    betParams.value.pageIndex = 1
    params.value.pageIndex = 1
    tabAction.value=index
    tabCurrent.value = 0
    // this.$refs.pageRef && this.$refs.pageRef.setPageIndex(1)	
    if(index===2){
        getBetRecord()
    }else {
        getResultRecord()
    }		
}
const canvasIdErrorCallback=(err)=>{
    console.log('err',err)
}
// 时间切换游戏类型
const cutTime=(key:any)=>{
    betParams.value.pageIndex = 1
    params.value.pageIndex = 1
    current.value = key
    let game_id = 0
    // this.$refs.pageRef && this.$refs.pageRef.setPageIndex(1)	
    if(game_type.value===0){
        if(noThree.value){ // 不展示三分彩
            if(key===0){
                game_id = 1
            }else{
                game_id = key + 2
            }
        }else{
            game_id = key+1
        }
    }else if(game_type.value===1){
        game_id = 8 + key+1
    }else{
        game_id = 4 + key+1
    }
    params.value.game_id = game_id
    betParams.value.game_id = game_id
    if(tabAction.value!==2){
        getResultRecord(1)
    }else{
        getBetRecord()
    }
    getBetRecord()
}
// 游戏开奖记录
const getResultRecord = async(type?:any)=>{
	let param = {
		game_code:game_code.value,
		page:params.value.page,
		pageSize:params.value.pageSize,
	}
    gameResultsRecord(param).then((res:any)=>{
        gameLog.value = res.data
        total.value = res.meta.total
        getUserInfo();
        // 页面加在初始化中将结果数字  
        if(type == 1) {
        if(k3Ref.value) {
            k3Ref.value.setAnimation()
            k3Ref.value.getCurrentIssueWinNumber(res.rows[0].result)
            k3Ref.value.setRecentRes(res.rows[0]);
        }
        if(d5Ref.value) {
            d5Ref.value.start(res.rows[0].result)
        }
        if(winRef.value) {
            winRef.value.setRecentRes(res.rows[0]);
        }
        }
    })
}
//用户下注数据
const getBetRecord =()=>{
    // betRecord(betParams.value).then((res:any) =>{
    //     betRecordList.value = res.rows
    //     total.value = res.total
    //     getUserInfo()
    // })
}


// 求和
const sumWin=(value:any)=>{
    let arr =  []
    let sum = 0
    if(Array.isArray(value)){
        arr = value
    }else{
        arr = value.split(',')
    }
    arr.map(v=>{
        sum = sum + Number(v)
    })
    return sum
}
			

watch(
    () => gameLog.value, (nV:any, oV:any) => {
		if(nV){
			if(game_type.value===1 && tabAction.value===1){
				draw(nV,tabCurrent.value)
			}else{
				draw(nV,0)
			}
		}
				
    },
    {deep: true,immediate: true}
)
</script>

<style lang="less" scoped>
.bg {
	background-image: linear-gradient(180deg, #FCFDFF 0%, #E4EDFE 53%, #F4F7FE 100%) !important;
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
.can-box{
    position: absolute;
    width: 200px;
    height: 30px;
    top: 18px;
    left: 10px;
    z-index: 999;
}
	
	.game-betting{
		// margin-top: -56px;
		margin-top: 10px;
		.tab{
			margin: 0 15px;
			// background-color: #fff;
			border-radius: 15px;
			// box-shadow: 0 0 8px 1px rgba(187,191,205,.3);
			.box{
				position: relative;
				display: flex;
				flex-direction: row;
				
				.itemInfo{
					width: 80px;
					height: 80px;
					background: url("@/assets/game/time_bg.png") no-repeat center;
					background-size: 100% 100%;
					gap: 4px;
					img {
						width: 22px;
						height: 22px;
					}
					.text {
						color: #77819B;
					}
					.chosesd_text {
						color: #3E424D;
					}
				}
				.icon-top{
					width: 12px;
					height: 12px;
					border-radius: 10px;
					background: #6abe57;
					color: #fff;
					font-size: 12px;
					line-height: 12px;
					text-align: center;
					margin-bottom: 8px;
				}
				.image-icon{
					width: 21px;
					height: 21px;
				}
				.text{
					color: #6abe57;
					font-size: 14px;
				}
				.activeItem{
					// border-radius: 15px;
					// box-shadow: 0 0 8px 1px rgb(187 191 205 / 30%);
					background: url("@/assets/game/timebg_chosed.png") no-repeat center;
					background-size: 100% 100%;
					.text{
						color: #3E424D!important;
						opacity: 1 !important;
					}
					.icon-top{
						background: #fa4e46!important;
					}
				}
			}
		
		}
		
	}
	.game-list {
	    margin-top: 14px;
	    width: 100%;
	    padding-bottom: 19px;
		padding: 0 10px;
		box-sizing: border-box;
		.list_container {
			background: #fff;
			border-radius: 8px;
		}
		.tab{
			padding: 0 9px;
			box-sizing:border-box;
			height: 46px;
			line-height: 46px;
			.li{
				width: 32%;
				height: 37px;
				line-height: 37px;
				border-radius: 9px;
				color: #77819B;
				line-height: 37px;
				text-align: center;
				font-size: 12px;
				opacity: 0.5;
			}
			.action{
				// opacity: 1;
				// position: relative;
				// &::before {
				// 	content: '';
				// 	width: 13px;
				// 	height: 3px;
				// 	background: url("/static/game/new/tab_fak.svg") no-repeat center;
				// 	background-size: 100% 100%;
				// 	position: absolute;
				// 	left: 50%;
				// 	transform: translateX(-50%);
				// 	bottom: 2px;
				// }
				color: #fff;
				opacity: 1;
				position: relative;
				background:  url("@/assets/game/tab_chosed.png") no-repeat center;
				background-size: 100% 100%;
			}
		}
		.u-table {
			padding: 0 10px;
			box-sizing:border-box;
			.log-box {
				::v-deep {
					.van-cell {
						background: #F6F9FF !important;
						&:active {
							background: #F6F9FF !important;
						}
					}
					.van-collapse-item {
						background: #F6F9FF;
					}
					.cool_item {
						color: #77819B;
					}
					.d-title {
						color: #77819B;
					}
					.van-cell {
						.van-cell__body {
							color: #77819B;
							opacity: 0.8;
							.money {
								font-weight: 700;
							}
						}
						.van-cell__title-text {
							color: #77819B;
							opacity: 0.8;
						}
						.van-cell__value {
							color: #77819B;
							opacity: 0.8;
						}
					}
				}
			}
		}
	}
	

	.t-tr{
		padding: 15px 4px;
		box-sizing:border-box;
		font-weight: 600;
		color: #fff;
		.m-li{
			width: 16px;
			height: 16px;
			line-height: 16px;
			border: 0.5px solid #bbb;
			border-radius: 16px;
			margin-right: 4px;
			color: #bbb;
			font-size: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.tr{
		font-weight: 400;
		font-size: 12px;
		color: #77819B;
		// border-bottom: 1px solid #e2e2e2;
		&:last-child {
			border-radius: 0 0 10px 10px;
		}
		&:nth-child(even) {
			background: #fff;
		}
		&:nth-child(odd) {
			background: #F0F5FF;
		}
	}
	.head{
		background-color: #F0F5FF;
		color: #77819B;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		font-size: 12px;
	}
	.num_gcolor{
		color:#5cba47!important;
	}
	.num_rcolor{
		color: #d0322d!important;
	}
	.circle{
		height: 10px;
		width: 10px;
		border-radius: 50%;
	}
	.redc{
		background-color: #fb4e4e;
	}
	.greenc{
		background-color: #5cba47;
	}
	.color0{
		background-image: linear-gradient(to bottom right,#fb4e4e 50%,#eb43dd 0)!important
	}
	.color5{
		background-image: linear-gradient(to bottom right,#5cba47 50%,#eb43dd 0)!important;
	}
	.zi{
		margin-left: 5px;
		background-color: #eb43dd;
	}
	.list-fooder{
	    height: 20px;
	    background-color: #fbedf3;
	    border-bottom-right-radius: 20px;
	    border-bottom-left-radius: 20px;
	}
	.border{
		width: 16px!important;
		height: 16px;
		border-radius: 16px;
		margin-right: 4px;
		border: 1px solid #000;
		color: #000;
		background: #f4f4f4;
		text-align: center;
		line-height: 16px;
		font-size: 12px;
	}
	.border-r{
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		border: none;
		color: #fff;
		background-color: #fb4e4e;
		border-radius: 50%;
	}
	.third{
		font-size: 11px;
	}
	.icon-num{
		width: 20px;
		height: 20px;
		margin-right: 4px;
	}
	.tabBox{
		width: 100%;
		margin-top: 18px;
		margin-bottom: 9px;
		border-bottom: 1px solid #c7c7cc;
		.tabItem{
			width: 37px;
			height: 37px;
			line-height: 37px;
			background: #ceced8;
			font-size: 15px;
			font-weight: 700;
			color: #fff;
			border-radius: 17px 17px 0 0;
			position: relative;
			margin-right: 7px;
			text-align: center;
		}
		.action{
			background-color: #3487F6;
		}
		.action::after{
			background: radial-gradient(circle at 100% 0,rgba(204,0,0,0) 9px,#fa574a 10px);
			right: -9px;
			z-index: 9;
		}
	}
	.log-li{
		padding: 12px;
		box-sizing:border-box;
		font-size: 13px;
		color: rgb(96, 98, 102);
		border-bottom: 1px solid #e2e2e2;
		.period{
			font-size: 15px;
			padding-bottom: 5px;
		}
		.money{
			font-size: 15px;
		}
	}
	.state-r{
		background-color: #f3f1f1;
		padding: 3px 9px;
		box-sizing:border-box;
		// margin-left: 44px;
		border-radius: 18px;
		font-size: 11px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: #333;
	}
	.flex-end{
		display: flex;
		align-items: flex-end;
	}
</style>