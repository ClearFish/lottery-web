<template>
  <div class="lottery_box" v-if="show">
    <div class="followup_container">
      <div class="top_header">
        <div class="empty"></div>
        <div class="word">{{$t('lottery.Game_History')}}</div>
        <div class="icon"><van-icon name="cross" size="18" color="#77819b" @click="closeHistory"/></div>
      </div>
      <div class="table_box">
        <div class="head">
          <template v-if="game_type === 0">
            <div class="flex-item-2 flex-rcc">{{
              $t("lottery.tableth1")
            }}</div>
            <div class="flex-item-1 flex-rcc">{{
              $t("lottery.tableth2")
            }}</div>
            <div class="flex-item-1 flex-rcc">{{
              $t("lottery.tableth3")
            }}</div>
            <div class="flex-item-1 flex-rcc">{{
              $t("lottery.tableth4")
            }}</div>
          </template>
          <template v-else-if="game_type === 1">
            <div class="flex-item-2 flex-rcc">{{
              $t("lottery.tableth1")
            }}</div>
            <div class="flex-item-2 flex-rcc">{{
              $t("lottery.table5dth2")
            }}</div>
            <div class="flex-item-1 flex-rcc">{{
              $t("lottery.table5dth3")
            }}</div>
          </template>

          <template v-else>
            <div class="flex-item-2 flex-rcc">{{
              $t("lottery.tableth1")
            }}</div>
            <div class="flex-item-1 flex-rcc">{{
              $t("lottery.table5dth3")
            }}</div>
            <div class="flex-item-1 flex-rcc">{{
              $t("lottery.tableth3")
            }}</div>
            <div class="flex-item-1 flex-rcc">{{
              $t("lottery.tablek3th4")
            }}</div>
            <div class="flex-item-1 flex-rcc">{{
              $t("lottery.tablek3th5")
            }}</div>
          </template>
        </div>
        <div class="table">
          <div
            class="t-tr tr flex flex-item-col-center"
            v-for="(item, key) in gameLog"
            :key="key"
          >
            <template v-if="game_type === 0">
              <div class="flex-item-2 flex-rcc">{{ item.period }}</div>
              <div
                class="flex-item-1 flex-rcc"
                :class="{
                  num_gcolor: [1, 3, 5, 7, 9].includes(Number(item.result[0])),
                  num_rcolor: [0, 2, 4, 6, 8].includes(Number(item.result[0])),
                }"
                >{{ item.result[0] }}</div>
              <div class="flex-item-1 flex-rcc">{{
                Number(item.result[0]) > 4
                  ? $t("lottery.winGobig")
                  : $t("lottery.winGosmall")
              }}</div>
              <div class="flex-item-1 flex-rcc">
                <text
                  class="redc circle"
                  v-if="[0, 2, 4, 6, 8].includes(Number(item.result[0]))"
                ></text>
                <text
                  class="greenc circle"
                  v-if="[1, 3, 5, 7, 9].includes(Number(item.result[0]))"
                ></text>
                <text
                  class="zi circle"
                  v-if="[0, 5].includes(Number(item.result[0]))"
                ></text>
              </div>
            </template>

            <template v-else-if="game_type === 1">
              <div class="flex-item-2 flex-rcc">{{ item.period }}</div>
              <div class="flex-item-2 flex-rcc">
                <text
                  class="border"
                  v-for="(i, index) in item.result"
                  :key="index"
                  >{{ i }}</text
                >
              </div>
              <div class="flex-item-1 flex-rcc">
                <text class="border-r">{{ sumWin(item.result) }}</text>
              </div>
            </template>

            <template v-else>
              <div class="flex-item-2 flex-rcc third">{{ item.period }}</div>
              <div class="flex-item-1 flex-rcc third">{{
                sumWin(item.result)
              }}</div>
              <div class="flex-item-1 flex-rcc third">{{
                sumWin(item.result) > 10
                  ? $t("lottery.winGobig")
                  : $t("lottery.winGosmall")
              }}</div>
              <div class="flex-item-1 flex-rcc third">{{
                sumWin(item.result) % 2 === 0
                  ? $t("lottery.k3even")
                  : $t("lottery.k3odd")
              }}</div>
              <div class="flex-item-1 flex-rcc third">
                <div v-for="(i, index) in item.result" :key="index">
                  <img
                      :src="`/static/game/dice_show${i}.min.png`"
                      class="icon-num"
                    />
                </div>
              </div>
            </template>
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
      </div>
       <div class="page_container">
            <van-icon name="arrow-left" size="18" color="#77819b" @click="prevPage"></van-icon>
            <div class="number">{{pages.pageIndex}}/{{Math.ceil(total/pages.pageSize)}}</div>
            <van-icon name="arrow" size="18" color="#77819b" @click="nextPage"></van-icon>
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineEmits, watch } from "vue"
import { resultRecord } from "@/api/lottery";
// import PageNav from "@/components/PageNav/index.vue";

const show = ref(false)
const pages = ref({
  pageIndex: 1,
  pageSize: 10,
})
const game_type = ref(1);
const game_id = ref(12)
const gameLog = ref([]);
const total = ref(0);
const showLoading = ref(false)

const showResult = async(gameId, gameType)=> {
  game_type.value = gameType;
  game_id.value = gameId;
  show.value = true;
  getResultRecord()
}
const prevPage=()=> {
    if(pages.value.pageIndex == 1) {
        return
    }else {
        pages.value.pageIndex --;
        getResultRecord()
    }
}
const nextPage=()=> {
    if(Math.ceil(total.value/pages.value.pageSize) == pages.value.pageIndex) {
        return
    }else {
        pages.value.pageIndex ++;
        getResultRecord()
    }
}
const getResultRecord = async()=> {
  showLoading.value = true
  let res = await resultRecord({game_id:game_id.value, ...pages.value });
  gameLog.value = res.rows;
  total.value = res.total;
  showLoading.value = false
}
const closeHistory =()=> {
  show.value = false;
}
const changePage=(index:any)=> {
    pages.value.pageIndex = index;
    getResultRecord();
}
  // 求和
const sumWin =(value)=> {
  let arr = [];
  let sum = 0;
  if (Array.isArray(value)) {
    arr = value;
  } else {
    arr = value.split(",");
  }
  arr.map((v) => {
    sum = sum + Number(v);
  });
  return sum;
}
defineExpose({
  showResult
})
</script>
<style lang="less" scoped>
.lottery_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 999990;
  .flex-item-1 {
    flex: 1;
  }

  .flex-item-2 {
    flex: 2;
  }
  .flex-rcc{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .followup_container {
    width: 96%;
    max-width: 480px;
    padding: 8px;
    background: linear-gradient(180deg, #fcfdff, #e4edfe 53%, #f4f7fe);
    border-radius: 8px;
    // border: 1px solid #f0cc6d;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    .table_box {
        height: 400px;
        overflow-y: scroll;
      .head {
        display: flex;
        padding: 15px 4px;
        font-size: 12px;
      }
      .table {
        width: 100%;
      }
      .t-tr {
        padding: 15px 6px;
        box-sizing: border-box;
        font-weight: 600;
        color: #77819b;
        .m-li {
          width: 16px;
          height: 16px;
          line-height: 16px;
          border: 0.5px solid #bbb;
          border-radius: 16px;
          margin-right: 4px;
          color: #77819b;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .tr {
        font-weight: 400;
        font-size: 15px;
        color: #77819b;
        // border-bottom: 1px solid #e2e2e2;
        &:last-child {
          border-radius: 0 0 10px 10px;
        }
        &:nth-child(even) {
          background: #E4EDFE;
        }
        &:nth-child(odd) {
          background: #fff;
        }
      }
      .head {
        background-color: #E4EDFE ;
        color: #77819b;
        opacity: 0.5;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
      }
      .num_gcolor {
        color: #5cba47 !important;
      }
      .num_rcolor {
        color: #d0322d !important;
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
      .list-fooder {
        height: 20px;
        background-color: #fbedf3;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
      }
      .border {
        width: 16px !important;
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
      .border-r {
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
      .third {
        font-size: 11px;
      }
      .icon-num {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }
      .tabBox {
        width: 100%;
        margin-top: 18px;
        margin-bottom: 9px;
        border-bottom: 1px solid #c7c7cc;
        .tabItem {
          width: 37px;
          height: 37px;
          line-height: 37px;
          background: #ceced8;
          font-size: 15px;
          font-weight: 700;
          color: #77819b;
          border-radius: 17px 17px 0 0;
          position: relative;
          margin-right: 7px;
          text-align: center;
        }
        .action {
          background-color: #fa574a;
        }
        .action::after {
          background: radial-gradient(
            circle at 100% 0,
            rgba(204, 0, 0, 0) 9px,
            #fa574a 10px
          );
          right: -9px;
          z-index: 9;
        }
      }
      .log-li {
        padding: 12px;
        box-sizing: border-box;
        font-size: 13px;
        color: rgb(96, 98, 102);
        border-bottom: 1px solid #e2e2e2;
        .period {
          font-size: 15px;
          padding-bottom: 5px;
        }
        .money {
          font-size: 15px;
        }
      }
      .state-r {
        background-color: #f3f1f1;
        padding: 3px 9px;
        box-sizing: border-box;
        // margin-left: 44px;
        border-radius: 18px;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #333;
      }
      .flex-end {
        display: flex;
        align-items: flex-end;
      }
    }
    .page_container {
        display: flex;
        gap: 6px;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
        box-sizing: border-box;
        color: #77819b;
    }
  }
}
</style>