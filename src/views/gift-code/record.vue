<template>
	<div>
		<div class="list flex-cc">
			<template v-if="list.length>0">
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        :finished-text="$t('common.noMore')"
                        @load="onLoad"
        >
                        <div class="flex-sb item" v-for="(item,index) in list" :key="index">
                            <div class="flex flex-col">
                                <div class="time">
                                    {{item.order_number}}
                                    <img src="@/assets/giftcode/copy.min.png" class="copy" @click="copyNumber(item.order_number)"/>
                                </div>
                                <span style="font-size: 13px">{{item.created_at}}</span>
                            </div>
                            <div class="jf flex-cc">
                                <span class="num" >{{item.receive_amount}}</span>
                                <span>{{item.currency_symbol}}</span>
                            </div>
                        </div>
                    </van-list>
                </van-pull-refresh>
			</template>
            <van-empty v-else  :description="$t('profile.noEarningsRecord')"/>
		</div>    
	</div>
</template>
<script lang="ts" setup>
import { redenvelopeRecord } from '@/api/promotions'
import {ref,onMounted} from "vue"
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { $t } from '@/locales'

const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const list = ref([])

const onLoad = async () => {
  try {
    const res = await redenvelopeRecord({ pageIndex: 1 })
    list.value = (res as any)?.rows || []
  } finally {
    finished.value = true
  }
}
const onRefresh = async () => {
  refreshing.value = true
  await onLoad()
  refreshing.value = false
}
const copyNumber=async (number:any)=> {
     try {
        await navigator.clipboard.writeText(number)
        showToast($t('deposit.copiedToClipboard'))
    } catch (error) {
        showToast($t('deposit.copyFailed'))
    }
}
</script>
<style lang="less" scoped>
.list {
	margin-top: 50px;
}
.item{
		width: 100%;
		padding: 14px 9px;
		border-bottom: 1px solid #f2f5f7;
		.time{
			font-size: 15px;
			font-weight: 600;
			color: #303133;
			image{
				width: 14px;
				height: 14px;
				margin-left: 5px;
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