<template>
  <div class="bg">
    <div class="wallet-user a-text-center"></div>
    <div class="wallet-box">
      <div class="top_cont">
        <div class="other_filter">
          <div class="types" @click="showSelest(methodsList,'lv')">LV {{choseLv}}</div>
          <div class="types" @click="choseQuick(item,index)" :class="quickType == index?'is_chosed':''" v-for="(item,index) in statusList" :key="index">
            <div>{{item.name}}</div>
          </div>
          <div class="date_picker" :class="date ? 'date_chosed':''" @click="showDatePicker=true">
              <van-icon name="notes-o" size="20"/>
              <p>{{$t('invite.select_date')}}</p>
          </div>
        </div>
      </div>
      <TeamPage ref="teamPage"/>
    </div>
    <van-popup :show="showTypes" position="bottom" round class="popupStyle" closeOnClickOverlay>
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

<script lang="ts" setup>
import TeamPage from "./team-page.vue"
import {ref,onMounted} from "vue"
import { $t } from '@/locales'
import miment from 'miment'
const teamPage:any = ref(null)
onMounted(()=>{
  teamPage.value && teamPage.value.getMyTeamSubordinate()
})
const info:any = ref({ level: 0,total_person: 0})
const showTypes:any = ref(false)
const scrollList:any = ref([])
const methodsList:any = ref([
				{name:'LV 1',value:'1'},
				{name:'LV 2',value:'2'},
				{name:'LV 3',value:'3'},
				{name:'LV 4',value:'4'},
				{name:'LV 5',value:'5'},
        {name:'LV 6',value:'6'},
			])
const statusList:any = ref([
				{name: $t('promotionactivity.YesterDay'),
        value:{
						start_date:miment().add(-1,'DD').format('YYYY-MM-DD') + ' 00:00',
						end_date:miment().add(-1,'DD').format('YYYY-MM-DD') + ' 23:59'
					}
        },
				{name:'7 '+ $t('promotionactivity.Days'),
         value:{
						start_date:miment().add(-7,'DD').format('YYYY-MM-DD') + ' 00:00',
						end_date:miment().format('YYYY-MM-DD') + ' 23:59'
					}
        },
        {
        name:'30 '+ $t('promotionactivity.Days'),    
        value:{
						start_date:miment().add(-29,'DD').format('YYYY-MM-DD') + ' 00:00',
						end_date:miment().format('YYYY-MM-DD') + ' 23:59'
					}}
			])
const choseType:any = ref('lv')
const date:any = ref('')
const itemChosedIndex:any = ref(0)
const choseLv:any = ref(1)
const quickType:any = ref(null)
const showDatePicker:any = ref(false)
const minDate = ref( new Date(2018, 0, 1))
const maxDate = ref( new Date())
const range:any = ref([])

const choseQuick=(item:any,index:any)=> {
  quickType.value = index;
  date.value = '';
  let obj = {
    join_time_start:item.value.start_date,
    join_time_end:item.value.end_date
  }
  teamPage.value && teamPage.value.changeTime(obj)
}
const onConfirm=()=> {
  let obj={}
  if( range.value &&  range.value.length) {
    obj = {
      join_time_start:range.value[0].join('-')+' 00:00',
      join_time_end:range.value[1].join('-')+' 25:59'
    }
  }else {
    obj = {
      join_time_start:miment().format('YYYY-MM-DD') + ' 00:00',
      join_time_end:miment().format('YYYY-MM-DD') + ' 23:59'
    }
  }
  quickType.value = null
  showDatePicker.value = false
  teamPage.value && teamPage.value.changeTime(obj)
}
const showSelest=(arr:any,type:any)=> {
  showTypes.value = true;
  scrollList.value = arr;
  choseType.value = type
}
const choseItem=(item,index)=> {
  itemChosedIndex.value = index;
}
const confirm=()=>{
  if(choseType.value == 'lv') {
    let val = methodsList.value[itemChosedIndex.value].value
    // this.$refs.teamPage.changeLevel(val);
    teamPage.value && teamPage.value.changeLevel(val)
    choseLv.value = val
   showTypes.value = false;
  }
}
</script>

<style lang="less" scoped>
.wallet-user {
  // padding: 20px;
  // background: url('/static/img/banlance_bg.dddd9837.min.png') no-repeat 50%;
  background-size: 100% 100%;
  width: 100%;
}

.wallet-box {
  // padding: 0 18px;
  // padding-top: 6px;
  .top_filter {
		height: 46px;
		border-bottom: 1px solid #e4e4e4;
	}
	.other_filter {
		width: 100%;
		padding: 8px 0;
		padding-left: 4px;
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid #e4e4e4;
		.types {
			padding: 2px 8px;
      box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 4px;
			border: 1px solid #e4e4e4;
			font-size: 12px;
		}
    .is_chosed {
      gap: 4px;
      border: none;
      background: #108ee9;
      color: #fff;
    }
		.date_picker {
			// width: 57%;
      width: 30%;
      display: flex;
      padding:0 4px;
      box-sizing: border-box;
      align-items: center;
      height: 36px;
      border: 1px solid #e4e4e4;
      font-size: 12px;
      border-radius: 4px;
      gap: 12px;
		}
    .date_chosed {
        ::v-deep {
            .uni-date {
                background: #0396ff;
                // border: none;
                border-radius: 4px;
                .uni-date-editor {
                    // border: none;
                    .uni-date-x--border {
                        border-color: #0396ff !important;
                    }
                    .uni-date-single {
                          background: #0396ff;
                          .u-icon--right {
                            color: #fff;
                          }
                          .u-icon__icon {
                            color: #fff !important;
                          }
                    }
                    .uni-date__x-input {
                        color: #fff !important;
                    }
                    .uni-date__icon-clear {
                        .u-icon__icon {
                            color: #fff !important;
                        }
                    }
                }
            }
        }
    }
	}

  .list {
    background: #fff;
    box-shadow: 0 0 .8rem 0 rgba(58, 58, 58, .07);
    margin-top: 14px;

    .itemBox {
      min-height: 56px;
      line-height: 1.1rem;
      font-size: 13px;
      color: #000;
      border-bottom: 1px solid #efeeee;
      padding: 10px 14px;
      box-sizing: border-box;
      .leftIcon {
        width: 17px;
        height: 17px;
        margin-right: 9px;
      }
    }
    .top_box {
      .top_container {
        display: flex;
        justify-content: center;
        padding-top: 40px;
        align-items: center;
        
      }
      .receive_bonous {
        padding: 10px 14px;
        border-top: 1px solid #efeeee;
        border-bottom: 1px solid #efeeee;
        margin-top: 14px;
        box-sizing: border-box;
        .receive_box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .receive_btn {
            margin-left: 12px;
            padding: 4px 12px;
            box-sizing: border-box;
            border-radius: 4px;
            background: #cdcdcd;
            
          }
          .get_btn {
            background: #f2413b;
            color: #fff;
          }
        }
        .add_margin {
          margin-top: 10px;
        }
        
      }
      .cener_container {
        display: flex;
        margin-top: 30px;
        padding: 0 10px;
        box-sizing: border-box;
        justify-content: center;
        .left {
          width: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .title {
            color: rgb(112, 112, 112);
          }
        }
      }
      .bottom_container {
        margin-top: 30px;
        .content_box {
          width: 100%;
          padding: 0 14px;
          box-sizing: border-box;
          margin-bottom: 20px;
          .title {
            color: rgb(112, 112, 112);
            margin-bottom: 10px;
          }
          .content {
            border-bottom: 1px solid #efeeee;
            padding-right: 10px;
            padding-bottom: 8px;
            box-sizing: border-box;
            width: 100%;
            word-break: break-all
          }
        }
        .copy_box {
          width: 150px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          margin-top: 20px;
          background: #dfdfdf;
          border-radius: 4px;
        }
      }
    }
  }
  .u-text-right {
    text-align: right;
    display: block;
  }

}
.bg {
  padding-top: 0 !important;
  .rulePopup {
        ::v-deep {
            .u-popup__content {
                width: 90%;
            }
        }
        width: 90%;
        box-sizing: border-box;
        .receive_box {
            .title {
                padding: 20px;
                box-sizing: border-box;
                background: #f2413b;
                border-radius: 15px 15px 0 0 ;
                color: #fff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                view {
                    display: flex;
                    justify-content: center;
                }
                .add_margin {
                    margin-top: 10px;
                }
            }
            .receive_info {
                padding: 20px;
                box-sizing: border-box;
                .addfont {
                    font-size: 18px;
                    font-weight: 600;
                }
                .info_detail {
                    margin-top: 15px;
                    // padding: 10px 20px;
                    // box-shadow: 0 -9px 18px 0 rgb(63 69 83 / 30%);
                    border-radius: 4px;
                    line-height: 30px;
                    .amount {
                        padding:2px 5px;
                        background: #f2413b;
                        border-radius: 4px;
                        margin-left: 4px;
                        color: #fff;
                    }
                }
                .rule-btn {
                    margin-top: 15px;
                    .btn {
                        width: 140px;
                        height: 34px;
                        border-radius: 17px;
                        color: #fff;
                        background: #f2413b;
                    }
                }
            }
        }
        .center_text {
            display: flex;
            justify-content: center;
            align-items: center;
        }
  }
  .popupStyle {
    // max-width: 600px;
    // left: 50%;
    // transform: translateX(-50%);
		.container_box {
			padding: 10px;
      box-sizing: border-box;
      width: 100%;
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
				height: 240px;
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
}
</style>