<template>
  <div class="page divWithdraw">
    <div class="divContent">
      <div class="divTitle">提现金额：</div>
      <div class="divInput">
        <label class="lblSymbol">¥</label>
        <input type="tel" v-model="money" :placeholder="'可提现金额 ¥' + availableBalance" readonly @touchstart.stop="showKeyboard = true">
      </div>
      <div class="divTip">
        <div class="divItem">1、每笔提现金额至少<label class="label">1元</label>，每日提现上限为<label class="label">2万</label></div>
        <div class="divItem">2、为保障您的资金安全，提现申请需要<label class="label">实名认证</label></label></div>
        <div class="divItem">3、提现到账后，直接转入<label class="label">微信钱包</label></div>
        <div class="divItem">4、每笔收入，微信已收取<label class="label">0.6%</label>的手续费</div>
      </div>
    </div>
    <van-button color="#FF6B88" :disabled="!verifyOld" block class="btnSubmit" @click="submitVerify">提交</van-button>
    <van-popup v-model="showWithdrawPwd" position="bottom" :style="{ height: '100%' }">
      <vue-withdraw-pwd ref="withdrawPwd" :proMoney="money" />
    </van-popup>
    <!-- 数字键盘 -->
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"/>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/withdraw.js'
import withdrawPwd from '../components/withdrawPwd.vue';

export default {
  name: 'withdraw',
  data: () => ({
    availableBalance: 0, //可用余额
    money: '',
    showKeyboard: false,
    showWithdrawPwd: false
  }),
  components: {
    "vue-withdraw-pwd": withdrawPwd,
  },
  computed: {
    verifyOld() {
      return this.money
    }
  },
  methods: {
    onInput(key) {
      this.money = (this.money + key).slice(0, 6);
    },
    onDelete() {
      this.money = this.money.slice(0, this.money.length - 1);
    },
    submitVerify: function(event){
      if(parseInt(this.money) <= this.availableBalance){
        this.showWithdrawPwd = true;
        if(this.$refs.withdrawPwd != undefined){
          this.$refs.withdrawPwd.setParams(this.money);
        }
      }else {
        Toast('可用余额不足');
      }
    }
  },
  mounted() {
    this.availableBalance = parseInt(this.$route.params.money/100);
  }
}
</script>
<style lang="scss" scoped>
  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
		color: #999999; font-size: 14px; transform: translate(0, -4px);
	}
	::-moz-placeholder { /* Firefox 19+ */
		color: #999999; font-size: 14px; transform: translate(0, -4px);
	}
	:-ms-input-placeholder { /* IE 10+ */
	 color: #999999; font-size: 14px; transform: translate(0, -4px);
	}
	:-moz-placeholder { /* Firefox 18- */
	 color: #999999; font-size: 14px; transform: translate(0, -4px);
	}
  .divWithdraw{
    background-color: #F5F5F5; overflow: hidden;
  }
  .divWithdraw .divContent{
    padding: 13px; margin-top: 10px; box-sizing: border-box;
    background-color: #FFF; width: 100%;
    padding-left: 20px; padding-right: 20px; padding-bottom: 16px;
  }
  .divWithdraw .divContent .divTitle{
    font-size: 16px; color: #333333; font-weight: 500;
  }
  .divWithdraw .divContent .divInput{
    display: flex; flex-direction: row; align-items: center;
    border-bottom: 1px solid #F7F7F7; margin-top: 18px;
    padding-bottom: 5px;
  }
  .divWithdraw .divContent .divInput .lblSymbol{
    font-weight: bold; font-size: 26px; color: #333333;
    margin-right: 8px;
  }
  .divWithdraw .divContent .divInput input{
    font-weight: 500; font-size: 26px; color: #333333;
    border: none;
  }
  .divWithdraw .divContent .divTip{
    margin-top: 14px; line-height: 20px;
  }
  .divWithdraw .divContent .divTip .divItem{
    font-size: 14px; color: #999999;
  }
  .divWithdraw .divContent .divTip .divItem .label{
    font-size: 14px; color: #FF6B88; margin-left: 2px; margin-right: 2px;
  }
  .divWithdraw .btnSubmit{
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 60px; border-radius: 25px;
    box-shadow: 0 5px 10px #ffb5c4;
  }
</style>
