<template>
    <div class="agent_box">
        <div class="form_box">
            <div class="form_con">
                <van-form 
                    labelPosition="top" 
                    :model="form" 
                    ref="form1" 
                    style="position: relative;" 
                    :labelWidth="140"
                    label-align="top"
                >
                    <!-- <u-form-item :label="'* '+$t('username')">
						<u--input  placeholderClass="placeholder_style" clearable v-model="form.username" :placeholder="$t('username')"></u--input>
					</u-form-item> -->
                    <van-field
                        v-model="form.username"
                        required
                        :label="$t('agent.username')"
                        :placeholder="$t('agent.username')"
                        class="custom-field"
                    />
                    <!-- <u-form-item :label="'* '+$t('password')">
						<u--input  placeholderClass="placeholder_style" type="password" clearable v-model="form.password" :placeholder="$t('password')"></u--input>
					</u-form-item> -->
                    <van-field
                        v-model="form.password"
                        required
                        :label="$t('agent.password')"
                        :placeholder="$t('agent.password')"
                        type="password"
                        class="custom-field"
                    />
                    
                    <!-- <u-form-item :label="$t('Mail')">
						<u--input  placeholderClass="placeholder_style" clearable v-model="form.email" :placeholder="$t('Mail')"></u--input>
					</u-form-item> -->
                    <van-field
                        v-model="form.email"
                        :label="$t('agent.Mail')"
                        :placeholder="$t('agent.Mail')"
                        class="custom-field"
                    />
                    <!-- <u-form-item :label="'* '+$t('Remark')">
                         <u--textarea
                            :placeholder="$t('Please_describe_your_business_scenario')"
                            border="surround"
                            v-model="form.remark"
                            clearable
                        ></u--textarea>
					</u-form-item> -->
                    <van-field
                        v-model="form.remark"
                        :label="$t('agent.Remark')"
                        :placeholder="$t('agent.Remark')"
                        type="textarea"
                        class="custom-field"
                    />
                </van-form>
                <div class="remind">* {{ $t('agent.You_will_use_the_set_to_log') }}</div>
            </div>
            <van-button type="primary" color="#fa3534" class="btn" @click="submitForm">{{ $t('agent.Register') }}</van-button>
            <div class="to_backend" @click="toManage">
                <div>{{ $t('agent.to_backend') }}</div>
                <van-icon name="arrow-double-right" color="#3487F6" size="18"></van-icon>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { applyAgent} from '@/api/auth'
// import {redirectTo} from "@/utils/common";
import { onMounted, ref } from 'vue'
import { $t } from '@/locales'
import {  showToast } from 'vant'
const form:any = ref({
    username:'',
    password:'',
    email:'',
    remark:''
})
const submitForm = async()=>{
    if(!form.value.username) {
        showToast($t('agent.username_not_null'))
        return
    }else if(/^\d+$/.test(form.value.username)) {
        showToast($t('agent.username_not_allnumber'))
        return
    }else if(/\s/.test(form.value.username)) {
        showToast($t('agent.username_not_spaces'))
        return
    }else if(!form.value.password){
        showToast($t('agent.password_not_null'))
        return
    }else if(!form.value.remark) {
        showToast($t('agent.Remarknot_null'))
        return
    }else {
        console.log(form.value)
        try {
            await applyAgent(form.value);
            showToast($t('agent.Agent_user_registration_successful'))
        }catch(error) {
            showToast(error.msg)
        }
    }
}
const toManage=()=> {
    let jumpUrl = 'https://agent.vib999.com/'
    window.open(jumpUrl, '_blank');
}
</script>
<style lang="less" scoped>
.agent_box {
    min-height: 100vh;
	background: #fff;
    padding-top: 10px;
    .form_box {
        width: 100%;
        min-height: 150px;
        padding: 10px;
        box-sizing: border-box;
        .form_con{
            width: 100%;
            display: flex;
            flex-direction: column;
            background-color: #f1f6ff;
            border-radius: 4px;
            min-height: 150px;
            box-shadow: 0 0 .8rem 0 rgba(58,58,58,.07);
            padding: 10px;
            font-size: 12px;
            .custom-field {
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                margin-bottom: 10px;
            }
        }
        .remind {
            color: #3487F6;
            font-size: 14px;
        }
        .to_backend {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            color: #3487F6;
            align-items: center;
            gap: 6px;
        }
    }
    .btn {
		width: 90%;
		margin: 0 auto;
		margin-top: 20px;
		background-image: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%) !important;
		border-radius: 60px;
		border: none !important;
		color: #fff !important;
		font-size: 16px;
		font-weight: 600;
	}
}
</style>