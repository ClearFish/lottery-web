<template>
  <div class="bg_page">
      <div class="p-list">
        <div class="p-list-item flex title_con">
          <div class="title_c">{{$t("promotionactivity.Reg_Time")}}</div>
          <div class="title_c">{{$t("promotionactivity.UserName")}}</div>
          <div class="title_c">{{$t("promotionactivity.Revenue")}}</div>
          <div class="title_c">{{$t("promotionactivity.Reward")}}</div>
        </div>
      </div>
      <div class="p-list">
        <template v-if="showLoading">
            <div class="loading-overlay">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <div class="loading-text">{{ $t('sign.Loading') }}</div>
                </div>
            </div>
        </template>
        <template v-else>
          <template v-if="list.length>0">
            <div class="p-list-item p-list-item1 flex" v-for="(item,index) in list" :key="index">
              <div>{{item.createtime.split(' ')[0].substring(5)}}</div>
              <div class="name_con">
                <div class="name">{{item.username}}</div>
                <img src="@/assets/invite/add_user.svg" alt="" @click="addUser(item.player_id)">
              </div>
              <div style="flex-direction: column;"> 
                  <text>{{item.game_bonus && item.game_bonus.SYSTEM && item.game_bonus.SYSTEM.total_amount}}{{item.game_bonus && item.game_bonus.SYSTEM && item.game_bonus.SYSTEM.symbo}}</text>
              </div>
              <div style="flex-direction: column;">
                  <text>{{item.invite_bonus && item.invite_bonus.SYSTEM && item.invite_bonus.SYSTEM.total_amount}}{{item.invite_bonus && item.invite_bonus.SYSTEM && item.invite_bonus.SYSTEM.symbo}}</text>
              </div>
            </div>
          </template>
           <van-empty 
              v-if="!showLoading && list.length === 0" 
              :description="$t('invite.nomore')"
            />
        </template>
         <div class="page_box">
              <div class="page_container">
                  <van-icon name="arrow-left" size="18" color="#77819b" @click="prevPage"></van-icon>
                  <div class="number">{{form.pageIndex}}/{{Math.ceil(form.total/form.pageSize)}}</div>
                  <van-icon name="arrow" size="18" color="#77819b" @click="nextPage"></van-icon>
              </div>
          </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { Subordinate,addMsgUser } from '@/api/promotions'
import {ref,onMounted,defineExpose } from "vue"
import { $t } from '@/locales'
import { showToast } from 'vant'
import miment from 'miment'
const list:any = ref([])
const lvList:any = ref([])
const form:any = ref({
  pageIndex: 1,
  pageSize: 10,
  userLevel: 1,
  total:0,
  join_time_start:miment().format('YYYY-MM-DD') + ' 00:00',
  join_time_end:miment().format('YYYY-MM-DD') + ' 23:59'
})
const showLoading:any = ref(false)
const addUser=async(uid:any)=> {
  try {
    await addMsgUser({identificationContact:uid})
    showToast($t('invite.add_success'))
  }catch(error) {
    showToast(error.msg)
  }
}
const changeLevel=(level:any)=>{
  form.value.userLevel = level
  form.value.pageIndex = 1
  getMyTeamSubordinate()
}
const changeTime=(obj:any)=> {
  form.value = Object.assign(form.value,obj);
  form.value.pageIndex = 1
  getMyTeamSubordinate()
}
const getMyTeamSubordinate=()=>{
  showLoading.value = true
  Subordinate(form.value).then((res:any) =>{
    list.value = res.rows
    form.value.total = res.total
    showLoading.value = false
  })
}
const prevPage=()=> {
    if(form.value.pageIndex == 1) {
        return
    }else {
        form.value.pageIndex --;
        getMyTeamSubordinate()
    }
}
const nextPage=()=> {
    if(Math.ceil(form.value.total/form.value.pageSize) == form.value.pageIndex) {
        return
    }else {
        form.value.pageIndex ++;
        getMyTeamSubordinate()
    }
}
defineExpose({
    getMyTeamSubordinate,
    changeTime,
    changeLevel
})
</script>

<style lang="less" scoped>
.flex {
  display: flex;
}
.bg_page {
  margin-top: 10px;
  min-height: 100vh;
  border: none;
  	.other_filter {
		width: 100%;
		padding: 8px 0;
		padding-left: 10px;
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid #e4e4e4;
		.types {
			padding: 4px 16px;
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
			width: 57%;
		}
	}

}
.list{
  width: 100%;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  .item{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid red;
    border-right: none;
    height: 50px;
    &:last-child {
      border-right: 1px solid red;
    }
  }
  .activeItem{
    background-color: red;
    color: #fff;
  }
  .item1{
    border-right: none;
  }
  .item2{
    border-right: none !important;
  }
}
.p-list{
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
  }

  .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
  }

  .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
  .p-list-item{
    div{
      flex: 1;
      display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    }
  }
  .title_con {
      .title_c {
        font-size:10px;
      }
    }
  .p-list-item1{
    font-size: 14px;
    color: #666;
    .name_con {
      display: flex;
      align-items: center;
      gap: 4px;
      img {
        width: 16px;
        height: 16px;
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
</style>