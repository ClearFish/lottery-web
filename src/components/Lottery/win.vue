<template>
	<div class="content">
		<div class="recently">
			<div class="container" v-if="recentReuslt &&  recentReuslt.result &&  recentReuslt.result.length">
				<div class="peroid">
					<div>{{recentReuslt.period}}</div>
					<div class="showMore" @click="showLotteryResult" v-if="isFollow">{{$t("fllowup.More")}}</div>
					<div class="showMore trend" @click="showTrend">
						<img :src="trendIcon" alt="">
					</div>
				</div>
				<div
					class="flex-item-1 flex-rcc"
					:class="{
						num_gcolor: [1, 3, 5, 7, 9].includes(Number(recentReuslt.result[0])),
						num_rcolor: [0, 2, 4, 6, 8].includes(Number(recentReuslt.result[0])),
					}"
					>{{ recentReuslt.result[0] }}</div>
				<div class="result_word">{{Number(recentReuslt.result[0]) > 4? $t("lottery.winGobig"): $t("lottery.winGosmall")}}</div>
				<div class="flex-item-1 flex-rcc">
					<span
					class="redc circle"
					v-if="[0, 2, 4, 6, 8].includes(Number(recentReuslt.result[0]))"
					></span>
					<span
					class="greenc circle"
					v-if="[1, 3, 5, 7, 9].includes(Number(recentReuslt.result[0]))"
					></span>
					<span
					class="zi circle"
					v-if="[0, 5].includes(Number(recentReuslt.result[0]))"
					></span>
				</div>
			</div>
		</div>
		<div class="time-box">
			<div class="info flex flex-col">
				<div class="txt">{{gameType[currentTime].label}}{{$t("lottery.gameunit")}}</div>
				<div class="num">{{gameTime.period}}</div>
			</div>
			<div class="out flex flex-col">
				<div class="txt">{{
					showMask ? 
					$t("lottery.timeText2"): $t("lottery.timeText1")}}
				</div>
				<van-count-down 
					:time="time" 
					ref="countDownBet" 
					format="mm:ss"
					@change="onChange"
					@finish="finish"
				>
				<template #default>
					<div class="time flex flex-item-col-center">
							<span class="time__custom__item time__custom__item1">0</span>
							<span class="time__custom__item">{{ timeData.minutes }}</span>
							<span class="time__custom__item">:</span>
							<span class="time__custom__item">{{ timeData.seconds1 }}</span>
							<span class="time__custom__item time__custom__item2">{{ timeData.seconds2 }}</span>
					</div>
				</template>
				</van-count-down>
			</div>
		</div>
		<div class="box">
			<div class="con-box flex flex-sb">
				<van-button class="btn green" :class="lang == 'yuenan' ? 'green_v' :''" @click="select('ColorPlay', 'Green',11)"></van-button>
				<van-button class="btn violet" :class="lang == 'yuenan' ? 'violet_v' :''" @click="select('ColorPlay', 'Violet',12)"></van-button>
				<van-button class="btn red" :class="lang == 'yuenan' ? 'red_v' :''" @click="select('ColorPlay', 'Red',13)"></van-button>
			</div>
			<div class="btn-box flex-rcc">
				<div class="item big flex-rcc" :class="lang == 'yuenan' ? 'big_v' :''" @click="select('BignessPlay','Big',22)"></div>
				<div class="item small flex-rcc" :class="lang == 'yuenan' ? 'small_v' :''" @click="select('BignessPlay','Small',21)"></div>
			</div>
			<div class="number-box flex-sb flex-warp">
				<div class="item flex-rcc" v-for="(i,index) in 10" :key="index" @click="select('NumberPlay',index,index)">
					<div class="number flex-rcc" :class="{'randomNum': randomNum === index}">
						<!-- <span class="txt">{{index}}</span> -->
					</div>
				</div>
			</div>
			
			<div class="random-box flex-sb">
				<div class="random flex-rcc" @click="randomNumber">
					<img :src="randomIcon" alt="">
				</div>
				<div class="flex-rcc">
					<div class="rateItem" v-for="(item,index) in rateList" :key="index" :class="{'action':rate===item}" @click="rate=item">X{{item}}</div>
				</div>
			</div>
			
			
			
			<!-- 代理游戏 -->
			<div class="flex" style="margin-top: 20px;" v-if="agentGameList.length>1">
				<div class="agent-item" :class="{'red-agent-item': Number(gameId)===item.game_id}" v-for="(item,index) in agentGameList" :key="index">{{item.agent_alias}}</div>
			</div>
			
			<div class="mask-box flex-rcc" v-if="showMask">
				<div class="countTimeBox rihht-1">{{timeData.seconds1}}</div>
				<div class="countTimeBox">{{timeData.seconds2}}</div>
			</div>	
		</div>	
		
		<!-- 底部弹窗 -->
		<van-popup :show="show" 
				round safeAreaInsetBottom 
				:mode="'center'" 
				class="popupStyle" 
				:class="'follow_popup'" 
		>
			<div class="popupBox">
				<div class="head">
					<div class="box-header colorBSize" :class="`color${selectType}`">
						<div class="con">{{gameType[currentTime].label}}{{ $t("lottery.minute") }}</div>
						<div v-if="[0,1,2,3,4,5,6,7,8,9].includes(selectType)" class="color img_box">
							<img :src="'/static/game/number_'+selectType+'.png'" alt="">
						</div>
						<div class="color" v-else>{{$t("lottery.popupchoose")}}<span style="padding-left: 9px;box-sizing:border-box">
							{{popupTitle}}
						</span></div>
					</div>
				</div>
				<div class="info">
					<div class="item">
						<span class="name">{{$t("lottery.Balance")}}</span>
						<div class="list_item">
							<div class="item_box">
								<span class="label">₫</span>
                            	<span class="value">{{userStore.balance}}</span>
							</div>
						</div>
					</div>
					<div class="item">
						<span class="name">{{$t("lottery.popupcell2")}}</span>
						<div class="flex flex-item-col-center">
							<div v-for="(i,index) in moneyList" 
								:key="index" class="monItem" 
								:class="{'action':form.money == i.value}" 
								@click="cutMon(i)">{{i.label}}</div>
						</div>
					</div>
					<div class="item">
						<span class="name">{{$t("lottery.popupcell3")}}</span>
						<div class="number_box">
							<van-stepper
								v-model="form.size" 
								theme="round"
								@change="valChange">
							</van-stepper>
						</div>
					</div>
					<div class="item liBox">
						<div class="li" v-for="i in liList" :key="i" :class="{'action': form.size === i}" @click="rateChange(i)">X{{i}}</div>
					</div>
				</div>
				<div class="foot">
					<div class="left flex-rcc" @click="cancel">{{$t("lottery.popupbtn1")}}</div>
					<div class="right flex-rcc" @click="postBet">{{$t("lottery.popupbtn2")}}  {{ form.bet_amount}}</div>
				</div>
			</div>
		</van-popup>
		<van-overlay
            :show="showLoading"
            :opacity="0.6"
            class-name="flex-rcc"
			z-index="99999999"
            >
            <van-loading color="#3498db"></van-loading>
        </van-overlay>
		<!-- 投注信息弹窗 -->
		<BetInfo ref="betInfo" gameType="win"/>
		<Trend ref="trendRef" :currentTime="currentTime"/>
	</div>
</template>

<script setup lang="ts">
import miment from 'miment'
import { ref, defineEmits, watch } from "vue"
import { getTimes, getGame, bet, getResult, getGameAgentAlias } from '@/api/lottery'
import { showToast } from 'vant'
import { $t } from '@/locales'
import { useUserStore } from '@/store/modules/user'
import trendIcon from "@/assets/lottery/trend-icon.svg"
import randomIcon from "@/assets/lottery/random.svg"
import Trend from "@/components/follow-up/trend.vue"
const userStore = useUserStore() 
import BetInfo from "./betInfoDialog.vue"

const props = defineProps({
	gameId:{
        default: () => {
            return '' as any;
        }
    },
	currentTime:{
        default: () => {
            return '' as any;
        }
    },
	followInfo:{
        default: () => {
            return {} as any;
        }
    },
    isFollow:{
        default: () => {
            return true;
        }
    },
	noThree:{
        default: () => {
            return true;
        }
    }
})

const timer = ref(null);
const popupTitle = ref('');
const show = ref(false)
const time = ref(null)
const countdownTime:any = ref({});
const timeData:any = ref({})
const gameType = ref([{value: 1,label: '1'},{value: 3,label: '3'},{value: 5,label: '5'},{value: 10,label: '10'}])
const rateList = ref([1,3,9,27,81,243,729])
const form:any = ref(
	{
		game_id: null, // 游戏id
		currency: 'SYSTEM', // 币种
		period: null, // 期号
		play_group: null, // 玩法组名
		bet_play: null, // 玩法
		bet_amount: 1000, // 下注金额
		money: 1000,
		size: 1,
	})
const moneyList = ref(
	[
		{label:'1K',value:'1000'},
		{label:'10K',value:'10000'},
		{label:'100K',value:'100000'},
		{label:'500K',value:'500000'},
		{label:'1000K',value:'1000000'},
		{label:'5000K',value:'5000000'}
	]
)
const liList = ref([1,3,9,27,81,243,729,2187])
const rate = ref(1)
const agree = ref([1])
const styleColor = ref('green')
const gameInfo:any = ref({})
const gameTime:any = ref({})
const winInfo = ref({})
const randomNum = ref(null)
const agentGameList = ref([])
const showMask = ref(false)
const selectType:any = ref('')
const lang = ref('yuenan')
const recentReuslt:any = ref({})
const followBetInfo:any = ref({})
const userFollow = ref(false)
const showLoading = ref(false)
const trendRef = ref(null)
const betInfo = ref(null)
const countDownBet = ref(null)
const resultTimer = ref(null)

const emit = defineEmits(["showLotteryResult","updata","upDataLog","openRule"]);
const showLotteryResult=()=> {
	emit("showLotteryResult");
}
const showTrend =()=> {
	trendRef.value && trendRef.value.showTrend(props.gameId)
}
const followBet=(info)=> {
	followBetInfo.value = info;
	userFollow.value = true;
	
}
// 随机数字
const randomNumber=()=>{
	timer.value = setInterval(()=>{
		randomNum.value= Math.ceil(Math.random()*9)
	},100)
	
	setTimeout(()=>{
		clearInterval(timer.value)
		select('NumberPlay',randomNum.value,randomNum.value)
		randomNum.value = null
	},2000)
	
}
// 获取游戏信息
const getGameData=()=>{
	getGame({game_id: props.gameId}).then(res =>{
		gameInfo.value = res
		if(userFollow.value) {
			// 用户跟投
			let info:any = followBetInfo.value
			let betNum = {
				'Green':11,
				'Violet':12,
				'Red':13,
				'Big':22,
				'Small':21
			}
			select( info.play_group, info.bet_play, betNum[info.bet_play] ? betNum[info.bet_play] : Number(info.bet_play))
		}
		getGameAgentList()
	})
}
		
// 获取代理游戏列表
const getGameAgentList=()=>{
	getGameAgentAlias({game_name: gameInfo.value.game_name}).then(res=>{
		agentGameList.value = res
	})
}
		
// 游戏开奖时间
const getTime=(isEnd?:boolean)=>{
	getTimes({game_id: props.gameId}).then((res:any)=>{
		gameTime.value = res
		form.value.period = res.period
		/**
		 * // 上期开始封盘，本期投注时间开始
			"open_time": "2023-01-23 09:33:00",
			这里上下区间为投注时间
			// （模式0使用）新添加，封盘开始时间
			"closing_open": "2023-01-23 09:33:55",
			这里上下区间为封盘时间
			// 本期投注结速
			"end_time": "2023-01-23 09:34:00",

			
			"open_time": "2025-12-02 14:42:00",
			"closing_time": "2025-12-02 14:42:05",
			"closing_open": "2025-12-02 14:42:55",
			"end_time": "2025-12-02 14:43:00",
			"current_time": "2025-12-02 14:42:25"
		 */
		if(isEnd){ // 倒计时结束查结果更新记录
			getResultData(gameTime.value.previous_period)
		}else {
			comOpenTime(gameTime.value.current_time,gameTime.value.end_time)
		}
	})
}
		
// 获取本期开奖
const getResultData=(previous_period)=>{
	let params = {
		game_id: props.gameId,
		period: previous_period
	}
	getData(params);
}
const getData=async(params)=> {
	clearInterval(resultTimer.value)
	try {
		let res:any = await getResult(params);
		if(res != null) {
			winInfo.value = res
			recentReuslt.value = res
			emit('updata')
		}
	}catch(error) {
		resultTimer.value = setInterval(async()=>{
			let res:any = await getResult(params)
			if(res != null) {
				clearInterval(resultTimer.value)
				winInfo.value = res
				recentReuslt.value = res
				emit('updata')
			}
		},1000)
	}
	
}
const setRecentRes=(result)=> {
	recentReuslt.value = result
}
// 下注
const postBet=async()=>{
	let paramas;
	if(props.isFollow) {	
		if(props.followInfo.isLunch) {
			paramas = {
				identification: props.followInfo.identification,     //用户标识号
				peerId:props.followInfo.groupId || props.followInfo.gameId,              //群id(发跟投自定义消息时使用)
				peerType:props.followInfo.groupType,                  //群类型(发跟投自定义消息时使用)
				isFollow:true,
				...form.value
			}
		}else {
			paramas = {
				identification: props.followInfo.identification,     //用户标识号
				peerId: props.followInfo.betInfo.peer_id, //群id(发跟投自定义消息时使用)
				peerType: props.followInfo.betInfo.peer_type, //群类型(发跟投自定义消息时使用)
				isFollow:false,
				...form.value
			}
		}
	}else {
		paramas = form.value
	}
	showLoading.value = true
	try {
		await bet(paramas);
		cancel()
		showToast($t('lottery.gametoast'))
		emit('upDataLog')
	}catch(error) {
		showToast(error.msg)
	}finally {
		showLoading.value = false
	}
	// bet(paramas).then(res=>{
	// 	cancel()
	// 	if(res.code == 1) {
	// 		showToast($t('lottery.gametoast'))
	// 	}else {
	// 		showToast(res.msg)
	// 	}
	// 	showLoading.value = false
	// 	emit('upDataLog')
	// })
}
		
const onChange=(e)=> {
	// console.log(e,"99999")
	let str = (e.seconds/10).toFixed(1)
	let arr:any = str.split('.')
	timeData.value = e
	timeData.value.seconds1 = arr[0]
	timeData.value.seconds2 = arr[1];
	if(arr[0] == '0' && arr[1]<6) {
		showMask.value = true;
		if(show.value) {
			show.value = false
		}
	}else {
		showMask.value = false
	}
	if(arr[0] == '0' && arr[1] == '0') {
		showMask.value = false
	}
}
// 投注时间计时结束事件
const finish=()=>{
	resetCountDown()
	getTime(true)
	//countDownBet.value.reset();
	
}
const resetCountDown = ()=>{
    let numeGameid = {
        1:1000*60,
        2:1000*60*3,
        3:1000*60*5,
        4:1000*60*10
    }
    time.value = numeGameid[props.gameId]
	countDownBet.value && countDownBet.value.reset()
}	
// 选择数字
const select=(key1,key2,type)=>{
	selectType.value = type;
	const data = gameInfo.value.odds
	form.value.play_group = key1//`${gameInfo.value.game_name}.${key1}.${key2}`//玩法组名
	form.value.bet_play = key2 //玩法
	const green = [11,1,3,7,9,21]
	const red = [13,2,4,6,8]
	if (green.includes(type)) {
		styleColor.value = 'green'
	} else if(red.includes(type)){
		styleColor.value = 'red'
	} else if(type===12) {
		styleColor.value = 'violet'
	} else if(type===0){
		styleColor.value = '0'
	}else if(type===5){
		styleColor.value = '5'
	}else{
		styleColor.value = 'big'
	}
	popupTitle.value = keyText(type)
	if(userFollow.value) {
		form.value.size  = followBetInfo.value.size;
		form.value.money = followBetInfo.value.money;
		form.value.bet_amount = followBetInfo.value.bet_amount
	}else {
		form.value.size = rate.value
		form.value.bet_amount = form.value.size  * form.value.money
	}
	show.value = true
}
		
const keyText=(type)=>{
	let str = ''
	if(type<10){
		str = type
	}else if(type<20){
		if(type===11){
			str = $t("lottery.winGogreen")
		}else if(type===12){
			str = $t("lottery.winGoviolet")
		}else{
			str = $t("lottery.winGored")
		}
	}else{
		if(type===22){
			str = $t("lottery.winGobig")
		}else{
			str = $t("lottery.winGosmall")
		}
	}
	return str
}
// 切换金额
const cutMon=(i)=>{
	form.value.money = i.value
	form.value.bet_amount = form.value.size * form.value.money
}
// 数量change
const valChange=(e)=>{
	form.value.bet_amount = e * form.value.money
}
// 倍率
const rateChange=(i)=>{
	form.value.size = i
	form.value.bet_amount = form.value.size  * form.value.money
}
const closePopup=()=>{
	init()
}
const init=()=>{
	if(!userFollow.value) {
		form.value.play_group = null
		form.value.bet_play = null
		form.value.bet_amount = 1000
		form.value.money = 1000
		form.value.size = 1
		showMask.value = false
	}
}
const cancel=()=>{
	init()
	show.value = false
}
// 计算距开奖时间剩余秒数
const comOpenTime=(start,end)=>{
	console.log(start,end,"comOpenTime")
	console.time()
	let arr = (miment().distance(start, end).format('mm,ss',true)).split(',')
	console.log(arr,"[]==")
	time.value = (Number(arr[0])*60 +Number(arr[1])) *1000
	console.log(time.value,"time.value")
	console.timeEnd()
}
watch(
    ()=>props.gameId, (newV:any,oldV:any) => {
        if (newV) {
            form.value.game_id = newV;
            init();
            getGameData();
            getTime();
        }
    },{immediate: true}
)
watch(
    ()=>props.noThree, (newV:any,oldV:any) => {
        if(newV){
			if(gameType.value.length===4){
				gameType.value.splice(1,1)
			}
		}
    },{immediate: true}
)
defineExpose({
	setRecentRes,
	followBet 
})
</script>

<style lang="less" scoped>
.flex-warp {
  flex-wrap: wrap;
}
// 两列上下左右居中
.flex-cc{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// 一行上下左右居中
.flex-rcc{
  display: flex;
  align-items: center;
  justify-content: center;
}

// 子元素两端对齐均分
.flex-sb{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mask-box{
	width: 100%;
	height: 100%;
	border-radius: 15px;
	background-color: rgba(0, 0, 0, .6);
	position: absolute;
	top: 0;
	left: 0;
	.countTimeBox{
		display: inline-block;
		border-radius: 14px;
		padding: 0 14px;
		box-sizing:border-box;
		background-color: #4899FB;
		font-size: 150px;
		color: #fff;
		font-weight: bold;
		margin-right: 18px;
	}
	.rihht-1{
		// margin-right: 13px;
	}
}
.number_box {
	::v-deep {
		.u-number-box__input {
			background-color: #f0f0f0 !important;
			color: #303133 !important;
			// border:1px solid #cdcdcd;
			width: 80px !important;
			font-weight: 500;
			font-size: 15px;
			color: #333333;
		}
		.u-number-box {
			.u-number-box__slot {
				background: #f0f0f0;
				color: #EF233B !important;
				// border: 4px solid #f0f0f0;
				border-radius: 43px;
				display: flex;
				// justify-content: center;
				align-items: center;
				height: 43px;
				width: 43px;
				margin-right: -10px;
				padding-right: 5px;
				padding-top: 6px;
				box-sizing:border-box;
				.minus {
					width: 30px;
					height: 30px;
					background: #fff;
					border-radius: 30px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				&:last-child {
					margin-right: 0;
					margin-left: -10px;
					padding-left: 8px;
					box-sizing:border-box;
				}
			}
		}
	}
}
.content {
	margin-top: 15px;
	padding: 0 10px;
	box-sizing:border-box;
	.time-box{
		border-radius: 8px;
		background: #fff;
		box-shadow:  0 4px 12px rgba(88, 184, 253, 0.3);
		margin-bottom: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		// overflow: hidden;
		position: relative;
		padding: 10px;
		.info{
			box-sizing:border-box;
			color: #77819B;
			.txt{
				font-weight: 500;
				font-size: 14px;
				color: #3E2404;
				width: 68px;
				height: 26px;
				background: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
				color:#fff;
				border-radius: 8px 0 8px 0;
				position: absolute;
				left: 0;
				top: 0;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.num{
				font-weight: 700;
				font-size: 18px;
				color: #77819B;
				margin-top: 20px;
			}
		}
		.out{
			height: 100%;
			position: relative;
			
			box-sizing:border-box;
			.txt{
				font-weight: 400;
				font-size: 14px;
				color: #77819B;
				text-align: center;
			}
			.time{
				color: #fff;
				font-size: 20px;
				margin-top: 5px;
			}
			.time__custom__item{
				// padding: 5px;
				width: 30px;
				height: 45px;
				background: url("/static/game/remintime_bg.png") no-repeat center;
				background-size: 100% 100%;
				font-size: 20px;
				margin-left: 5px;
				font-weight: 900;
				font-size: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				::v-deep {
					span {
						// background-image: linear-gradient(90deg, #F5B968 0%, #F5DCC0 100%);
						// background-clip: text;
						// -webkit-background-clip: text;
						// -webkit-text-fill-color: transparent;
						color:#fff
					}
				}
			}
		}
		.recently {
			position: absolute;
			left: 80px;
			top:4px;
			img {
				width: 30px;
				height: 30px;
			}
		}
	}
	.recently {
		width: 100%;
		height: 42px;
		background: #fff;
		box-shadow: 0 4px 12px rgba(88, 184, 253, 0.3);
		border-radius: 6px;
		margin-bottom: 10px;
		.container {
			display: flex;
			align-items: center;
			height: 42px;
			color: #3E424D;
			padding: 0 10px;
			justify-content: space-between;
			.peroid {
				flex: 2;
				display: flex;
				align-items: center;
				gap: 4px;
				.showMore {
					font-size: 10px;
					border-radius: 4px;
					padding: 2px;
					color: #fff;
					background: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
					height: 20px;
				}
				.trend {
					display:flex;
					justify-content:center;
					align-items: center;
					img {
						width:16px;
						height:16px
					}
				}
			}
			.result_word {
				flex: 1;
				text-align: center;
			}
			.num_gcolor {
				color: #5cba47 !important;
				}
				.num_rcolor {
				color: #d0322d !important;
				}
			}
			img {
				width: 30px;
				height: 30px;
			}
			.circle {
				height: 10px;
				width: 10px;
				border-radius: 50%;
			}
			.redc {
				background-color: #fb4e4e;
			}
			.greenc {
				background-color: #5cba47;
			}
			.color0 {
			background-image: linear-gradient(
				to bottom right,
				#fb4e4e 50%,
				#eb43dd 0
			) !important;
			}
			.color5 {
			background-image: linear-gradient(
				to bottom right,
				#5cba47 50%,
				#eb43dd 0
			) !important;
			}
			.zi {
				margin-left: 5px;
				background-color: #eb43dd;
			}
		}
	.box{
		border-radius: 15px;
		background-color: #fff;
		// box-shadow: 0 9px 18px 1px #ebebf1;
		background: #fff;
		border-radius: 8px;
		padding: 10px;
		box-sizing:border-box;
		padding-bottom: 10px;
		position: relative;
		.btn{
			height: 41px;
			color: #fff;
			width: 33%;
			text-align: center;
			line-height: 41px;
			font-size: 15px;
			border: none !important;
		}
		.green{
			// background: url("/static/game/new/green.png") no-repeat center;
			background-size: 100% 100%;
		}
		.violet{
			// background-color: #db5fd1;
			// border-radius: 10px;
			// box-shadow: 0 0 8px 1px rgb(219 95 209 / 58%);
			// background: url("/static/game/new/violet.png") no-repeat center;
			background-size: 100% 100%;
		}
		.red{
			// background: url("/static/game/new/red.png") no-repeat center;
			background-size: 100% 100%;
		}
		.violet_v {
			background: url("/static/game/violetv.png") no-repeat center;
			background-size: 100% 100%;
		}
		.green_v {
			background: url("/static/game/greenv.png") no-repeat center;
			background-size: 100% 100%;
		}
		.red_v {
			background: url("/static/game/redv.png") no-repeat center;
			background-size: 100% 100%;
		}
	}
	.number-box{
		padding: 10px 10px 0;
		box-sizing:border-box;
		border-radius: 10px;
		background-color: #F1F6FF;
		margin-top: 10px;
		.item{
			width: 20%;
			border: none;
			margin-bottom: 9px;
			.number{
				width: 56px;
				height: 56px;
				border-radius: 50%;
				text-align: center;
				
			}
			&:nth-child(1) {
				.number{
					background: url("/static/game/number_0.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(2) {
				.number{
					background: url("/static/game/number_1.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(3) {
				.number{
					background: url("/static/game/number_2.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(4) {
				.number{
					background: url("/static/game/number_3.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(5) {
				.number{
					background: url("/static/game/number_4.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(6) {
				.number{
					background: url("/static/game/number_5.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(7) {
				.number{
					background: url("/static/game/number_6.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(8) {
				.number{
					background: url("/static/game/number_7.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(9) {
				.number{
					background: url("/static/game/number_8.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
			&:nth-child(10) {
				.number{
					background: url("/static/game/number_9.png") no-repeat center;
					background-size: 100% 100%;
				}
			}
		}
	}
	.random-box{
		margin-top: 9px;
		padding: 9px 0;
		box-sizing:border-box;
		.random{
			width: 31px;
			height: 28px;
			color: #fff;
			background-image: linear-gradient(180deg, #FCFDFF 0%, #E4EDFE 53%, #F4F7FE 100%);
			border-radius: 4px;
			display: flex;
			justify-content: center;
			flex-shrink: 0;
			align-items: center;
			img {
				width: 17px;
				height: 15px;
			}
		}
		.rateItem{
			padding: 7px;
			display: flex;
			box-sizing:border-box;
			justify-content: center;
			align-items: center;
			border-radius: 4px;
			font-weight: 500;
			font-size: 12px;
			margin-left: 4px;
			background-image: linear-gradient(180deg, #FCFDFF 0%, #E4EDFE 53%, #F4F7FE 100%);
			color: #77819B;
		}
		.action{
			background-image: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
			color: #fff;
		}
	}
	.btn-box{
		// padding: 9px;
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		.item{
			height: 45px;
			width: 49%;
		}
		.big{
			// background: url("/static/game/new/big.png") no-repeat center;
			background-size: 100% 100%;
		}
		.small{
			// background: url("/static/game/new/small.png") no-repeat center;
			background-size: 100% 100%;
		}
		.big_v{
			background: url("/static/game/bigv.png") no-repeat center;
			background-size: 100% 100%;
		}
		.small_v{
			background: url("/static/game/smallv.png") no-repeat center;
			background-size: 100% 100%;
		}
	}
}
.popupStyle{
	background: none;
    max-height: none;
}
.van-popup {
	background: none !important;
}
.popupBox{
	color: #303133;
	font-size: 14px;
	.head{
		.box-header{
		    border-radius: 14px 14px 0 0;
			width: 100%;
			background-image: linear-gradient(123deg, #5EAFEF 0%, #3487F6 98%);
			border-radius: 30px 30px 0 0;
			background-size: 100% 100%;
		    position: relative;
			.img_box {
				width: 100%;
				display: flex;
				justify-content: center;
				padding-top: 15px;
				box-sizing:border-box;
				img {
					width: 80px;
					height:80px;
				}
			}
			.con {
			    font-weight: 600;
			    text-align: center;
			    color: #fff;
			    font-size: 18px;
				height: 48px;
				line-height: 48px;
				position: relative;
				&::before {
					content: "";
					position: absolute;
					width: 14px;
					height: 10px;
					background:url("/static/game/title_fake.svg") no-repeat center;
					background-size: 100% 100%;
					left: 130px;
					top: 50%;
					transform: translateY(-50%);
				}
				&::after {
					content: "";
					position: absolute;
					width: 14px;
					height: 10px;
					background:url("/static/game/title_fake.svg") no-repeat center;
					background-size: 100% 100%;
					right: 130px;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			.color{
			    text-align: center;
			    width: 100%;
			    // background-color: #fff;
			    height: 114px;
				background-image: linear-gradient(180deg, #ffffffb3 0%, #FFFFFF 100%);
				border: 1px solid #FFFFFF;
				border-bottom:  none;
				border-radius: 30px 30px 0 0;
			    line-height: 114px;
			    font-size: 18px;
				font-weight: 700;
				position: relative;
				margin-bottom: -2px;
			}	
		}
		.colorBSize{
			background-size: 100% 100%;
		}
		
		.color0{
		    background-color: #fb4e4e;
		    background-image: linear-gradient(to bottom right,#fb4e4e 50%,#eb43dd 0)!important;
			.color{
				color: #fb4e4e;
			}
		}
		
		.colorgreen{
			background: #26bd2f;
			background-image: linear-gradient(90deg,#26bd2f,#75c76b);
			.color{
				color: #26bd2f;
			}
		}
		
		.colorviolet {
			background: #9831e9;
		    background-image: linear-gradient(90deg,#b354fd,#d483ff);
		    .color{
		    	color: #9831e9;
		    }
		}
		
		.colorred{
		    background: #fb4e4e;
		    background-image: linear-gradient(90deg,#fb4e4e,#fe666e);
			.color{
				color: #fb4e4e;
			}
		}
		
		.color5 {
		    background: #5cba47;
		    background-image: linear-gradient(to bottom right,#5cba47 50%,#eb43dd 0)!important;
			.color{
				color: #5cba47;
			}
		}
		
		.colorbig {
		    background: #f5bb00;
		    background-image: linear-gradient(90deg,#f5bb00,#fdd556);
			.color{
				color: #f5bb00;
			}
		}
		
		// .box-header:before {
		//     content: "";
		//     position: absolute;
		//     right: 0;
		//     bottom: 0;
		//     width: 50%;
		//     height: 37px;
		//     background-image: linear-gradient(-10deg,#fff 50%,transparent 0);
		// }
		// .box-header:after {
		//     content: "";
		//     position: absolute;
		//     width: 50%;
		//     left: 0;
		//     bottom: 0;
		//     height: 37px;
		//     background-image: linear-gradient(10deg,#fff 50%,transparent 0);
		// }
	} 
	.info{
		padding: 0 14px 14px;
		background: #fff;
		margin-top: -4px;
		box-sizing:border-box;
		.item{
		     margin-top: 12px;
			.name {
        		font-weight: 500;
				font-size: 15px;
				color: #77819B;
				position: relative;
				padding-left: 10px;
				margin-bottom: 4px;
				display: block;
				&::before {
					content: "";
					width: 4px;
					height: 4px;
					background: #3487F6;
					border-radius: 4px;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			.monItem{
				text-align: center;
				padding: 0 9px;
				box-sizing: border-box;
				margin-left: 4px;
				background-color: rgba(66, 66, 66, 0.1);
				border-radius: 18px;
				color: #666666;
				height:28px;
				line-height: 28px;
				font-weight: 500;
				font-size: 12px;
			}
			.action{
				background-color: #3487F6!important;
				color: #fff!important;
			}
			.rule{
				color: #2150A4;
				font-size: 14px;
				margin-left: 20px;
			}
			&:first-child {
				margin: 0;
			}
			.list_item {
				display: flex;
				align-items: center;
				gap: 20px;
				.item_box {
					display: flex;
					gap: 8px;
					color: #333333;
					font-size: 15px;
					font-weight: 500;
					.label {
						opacity: 0.6;
					}
				}
			}
		}
		.number_box {
			:deep(.van-stepper){
				.van-stepper__input {
					width: 80px;
					height: 30px;
					background: #f0f0f0;
					border-radius: 4px;
				}
			}
		}
		.liBox{
			display: flex;
			flex-direction: row;
			// justify-content: flex-end;
			height: auto;
			.li{
				height: 28px;
				line-height: 28px;
				text-align: center;
				font-size: 12px;
				font-weight: 500;
				padding: 0 7px;
				box-sizing:border-box;
				margin-left: 4px;
				background-color: #f0f0f0;
				color: #333;
				border-radius: 4px;
			}
			.action {
			    color: #fff!important;
			    background-color: #3487F6!important;
			}
		}
	}
	.foot{
	    width: 100%;
	    height: 100px;
		padding: 20px 14px;
		box-sizing:border-box;
		padding-bottom: 34px;
		margin-top: -2px;
		display: flex;
	    // line-height: 37px;
	    text-align: center;
		gap: 10px;
	    font-size: 13px;
		background: #fff;
		.left{
		    width: 128px;
			height: 45px;
			background: #FFFFFF;
			border: 1px solid #3487F6;
			border-radius: 6px;
			font-weight: 900;
			font-size: 16px;
			color: #3487F6;
		}
		.right{
			flex: 1;
			height: 45px;
			 background-image: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
			border-radius: 6px;
			font-weight: 900;
			font-size: 16px;
			color: #fff;
		}
	}
}
.follow_popup {
	.popupBox {
		.foot {
			border-radius: 0 0 20px 20px;
		}
	}
}
.randomNum{
	transform:scale(1.1);
}
.agent-item {
  line-height: 26px;
  text-align: center;
  padding: 0 5px;
  box-sizing:border-box;
  border: 0.5px solid #fff;
  color: #fff;
  border-radius: 9px;
  font-size: 13px;
  margin-left: 4px;
  box-shadow: 0 0 5px 1px rgba(92,186,71,.72);
  background-color: #3fa628;
}
.red-agent-item {
  background-color: #fb4e4e;
  box-shadow: 0 0 5px 1px rgba(183, 71, 71, 0.72);
}
</style>