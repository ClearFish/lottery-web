<template>
	<div class="bg">
		<div class="top_cont">
			<div class="top_filter">
				<div v-for="(item,index) in filterTop" @click="clickFilter(item,index)" :key="index" class="filter_item" :class="currentIndex == index ?'active' :''">
					{{item.name}}
				</div>
			</div>
			<div class="other_filter">
				<div class="date_picker" @click="showDatePicker=true">
                    <van-icon name="notes-o" size="20"/>
                    <p class="start_time">{{params.start_date || $t('promotionactivity.start_date')}}</p>
                    <p>-</p>
                    <p class="end_time">{{params.end_date || $t('promotionactivity.end_date')}}</p>
                    <van-icon  name="cross" size="20" @click="showDatePicker = false" class="close-btn"/>
				</div>
			</div>
		</div>
		<div class="content_box">
			<div class="list flex flex-col" v-if="list.length>0">
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        :finished-text="$t('common.noMore')"
                        @load="onLoad"
                     >
                        <div class="flex-sb item" v-for="(item,index) in list" :key="index">
                            <div class="flex-col add_width">
                                <div class="order_box">
                                    <div class="number_box">
                                        <span> {{item.title}}</span>
                                        <img src="@/assets/giftcode/copy.min.png" class="copy" @click="copyNumber(item.order_number)"/>
                                    </div>
                                    
                                </div>
                                <div class="time">{{item.created_at}}</div>
                            </div>
                            <div :class="'status status_'+item.status">{{getStatus(item.status)}}</div>
                            <div class="jf flex-cc number_width">
                                <span class="num">+{{item.bonus}}</span>
                                <span>{{$t('promotionactivity.trading_recordcurrency')}}: VND</span>
                            </div>
                        </div>
                    </van-list>
                </van-pull-refresh>
			</div>
            <van-empty v-else  :description="$t('profile.noEarningsRecord')"/>
		</div>
		<van-popup :show="showTypes" mode="bottom" round  class="popupStyle" closeOnClickOverlay>
            <div class="container_box">
				<div class="top_action">
					<div @click="showTypes=false" class="cancle">{{$t('common.cancel')}}</div>
					<div class="sure" @click="confirm">{{$t('common.confirm')}}</div>
				</div>
				<div class="search_box">
					<div :class="itemChosedIndex == index ? 'search_item chosedItem':'search_item'" 
							v-for="(item,index) in scrollList" :key="index" 
							@click="choseItem(item,index)">{{item.name}}</div>
				</div>
			</div>
		</van-popup>
        <!-- 日期选择 -->
        <van-popup v-model:show="showDatePicker" position="bottom">
           <van-picker-group
            :tabs="[$t('promotionactivity.start_date'), $t('promotionactivity.end_date')]"
            @confirm="onConfirm"
            @cancel="showDatePicker=false"
            >
            <van-date-picker
                v-model="range[0]"
                :min-date="minDate"
                :max-date="maxDate"
            />
            <van-date-picker
                v-model="range[1]"
                :min-date="minDate"
                :max-date="maxDate"
            />
            </van-picker-group>
        </van-popup>
	</div>
</template>

<script  lang="ts" setup>
import { promotionsRecord } from '@/api/promotions'
import miment from 'miment'
import {ref,onMounted} from "vue"
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { $t } from '@/locales'

const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const list = ref([]);
const params:any = ref({status:'',start_date:'',end_date:''})
const minDate = ref( new Date(2018, 0, 1))
const maxDate = ref( new Date())
const range:any = ref([])
const showDatePicker = ref(false)
const statusList:any = ref([
    {name:$t('promotionactivity.ALL'),value:''},
    {name:$t('promotionactivity.Pending'),value:'0'},
    {name:$t('promotionactivity.Success'),value:'1'}
])
const showTypes:any = ref(false)
const scrollList:any = ref([])
const itemChosedIndex:any = ref(0);
const currentIndex:any = ref(null);
const itemChosedItem:any = ref({});
const renderList:any = ref([])
const filterTop:any = ref(
[
    {	name:$t('promotionactivity.today'),
        value:{
            start_date:miment().format('YYYY-MM-DD') + ' 00:00',
            end_date:miment().format('YYYY-MM-DD') + ' 23:59'
        }
    },
    {	name:$t('promotionactivity.YesterDay'),
        value:{
            start_date:miment().add(-1,'DD').format('YYYY-MM-DD') + ' 00:00',
            end_date:miment().add(-1,'DD').format('YYYY-MM-DD') + ' 23:59'
        }
    },
    {	name:'7 '+ $t('promotionactivity.Days'),
        value:{
            start_date:miment().add(-7,'DD').format('YYYY-MM-DD') + ' 00:00',
            end_date:miment().add(-1,'DD').format('YYYY-MM-DD') + ' 23:59'
        }
    }
]
)
const onLoad = async()=>{
	finished.value = true
}
const getData= async()=>{
	let res:any = await promotionsRecord({pageIndex: 1,...params.value})   
    list.value = res.rows
}
onMounted(()=>{
	getData()
})
const onRefresh = async () => {
  refreshing.value = true
  await getData()
  refreshing.value = false
}
const showSelest=(arr:any)=> {
    showTypes.value = true;
    scrollList.value = arr
}
const dateChage=(val:any)=> {
    params.value.start_date = val[0] + ' 00:00';
    params.value.end_date = val[1] + ' 23:59';
    currentIndex.value = null;
    list.value = []
    getData()
}
const choseItem=(item:any,index:any)=> {
    itemChosedIndex.value = index;
    itemChosedItem.value = item
}
const confirm=()=> {
    params.value.status = statusList.value[itemChosedIndex.value].value;
    list.value = [];
    renderList.value = [];
    getData()
    showTypes.value = false
}
const clickFilter=(item:any,index:any)=> {
    console.log(item)
    currentIndex.value = index
    params.value.start_date = item.value.start_date;
    params.value.end_date = item.value.end_date;
    range.value = []
    list.value = [];
    renderList.value = [];
    getData()
}
const onConfirm = async()=>{
    console.log(range.value,"222");
    let start_date = range.value[0].join('-')+' 00:00';
    let end_date = range.value[1].join('-')+' 25:59';
    params.value.start_date = start_date;
    params.value.end_date = end_date;
    getData();
    showDatePicker.value = false
}
const getStatus=(status)=> {
    switch(status){
        case 0:
            return $t('promotionactivity.Pending');
        case 1:
            return $t('promotionactivity.Success');
        default:break
    }
}
const copyNumber=async(number:any)=> {
    try {
        await navigator.clipboard.writeText(number)
        showToast($t('deposit.copiedToClipboard'))
    } catch (error) {
        showToast($t('deposit.copyFailed'))
    }
}
</script>

<style lang="less" scoped>
.flex-sb {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.flex-cc {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.flex-col {
    flex-direction: column;
}
.bg {
	height: 100%;
	.top_filter {
		height: 46px;
		border-bottom: 1px solid #e4e4e4;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
		.filter_item {
			padding: 4px 16px;
			border: 1px solid #e4e4e4;
			border-radius: 4px;
			&.active {
				background: #108ee9;
				border: none;
				color: #fff;
			}
		}
	}
	.other_filter {
		width: 100%;
		padding: 8px;
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid #e4e4e4;
		.types {
			padding: 4px 16px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 4px;
			border: 1px solid #e4e4e4;
			font-size: 12px;
		}
		.date_picker {
			width: 100%;
            height: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            box-sizing: border-box;
            border: 1px solid #e4e4e4;
            border-radius: 4px;
		}
	}
	.popupStyle {
		.container_box {
			padding: 10px;
			.top_action {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 0;
				.cancle {
					color: rgb(144, 145, 147);;
				}
				.sure {
					color:rgb(60, 156, 255);
				}
			}
			.search_box {
				// height: 320px;
				overflow-y: scroll;
				margin-top: 10px;
				.search_item {
					height: 44px;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #e4e4e4;
					font-size: 16px;
					color: rgb(144, 145, 147);
					&:first-child {
						border-top: 1px solid #e4e4e4;
					}
				}
				.chosedItem {
					color: #000;
					font-weight: bold;
				}
			}
		}
	}
	.message_box {
        position: relative;
        margin-right: 10px;
        .noread_num {
            position: absolute;
            top: 0;
            right: -5px;
            z-index: 2;
            width: 14px;
            height: 14px;
            font-size: 10px;
            background: #EF233B;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
			color: #fff;
        }
    }
}
.txtBox {
	.text {
        color: #fff;
        font-weight: 600;
        font-size: 15px;
    }
}
.order_box {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.number_box {
		display: flex;
		align-items: center;
		gap: 10px;
		.copy {
			width: 14px;
			height: 14px;
		}
	}
}
.content_box {
	// margin-top: -80px;
	background: #fff;
	border-radius: 10px 10px 0 0 ;
}
.status {
	width: 64px;
	height: 28px;
	border-radius: 4px;
	font-size: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 6px;
}
.status_0 {
	background: #cdcdcd;
	color: #fff;
}
.status_1 {
	background: #6bbe58;
	color: #fff;
}
.item{
	padding: 14px 9px;
	border-bottom: 1px solid #f2f5f7;
	.add_width {
		width: 196px;
	}
	.number_width {
		flex: 1;
	}
	.time{
		font-size: 15px;
		font-weight: 600;
		color: #999;
		image{
			width: 26px;
			height: 26px;
			margin-right: 5px;
		}
	}
	.jf{
		font-size: 14px;
			font-weight: 500;
			color: #cdcfd6;
		.num{
			font-weight: 600;
			font-size: 18px;
			color: #6bbe58;
		}
		.red{
			color: #f2443e;
		}
	}
}
</style>