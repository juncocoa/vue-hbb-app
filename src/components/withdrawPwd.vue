<template>
  <div class="page" style="background-color: #F7F7F7;">
    <div class="divSetPwd">
      <div style="height: 310px;">
        <div class="divTip">
          <div class="divTitle">输入提现密码</div>
          <div class="divContent">轻输入6位提现密码</div>
        </div>
        <div style="margin-top: 60px;">
          <van-password-input
            :value="password"
            :focused="showKeyboard"
            @focus="showKeyboard = true"
          />
          <a href="/verifyPhone/false" class="aForget">忘记交易密码</a>
        </div>
      </div>
      <van-button color="#FF6B88" :disabled="disabled" block class="btnLogin" @click="setRealAuth">确定</van-button>
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"/>
    <van-overlay :show="showOverlay">
      <div class="wrapper" :style="{height: height}">
        <van-loading size="24px" vertical color="#FFF"><font color="#FFF">请求中...</font></van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/withdraw.js'

export default {
  name: 'withdrawPwd',
  props: {
    proMoney: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    height: window.innerHeight + "px",
    money: '',
    password: '',
    showKeyboard: true,
    disabled: true,

    showOverlay: false
  }),
  methods: {
    setParams(money){
      this.money = money;
    },
    onInput(key) {
      this.password = (this.password + key).slice(0, 6);
    },
    onDelete() {
      this.password = this.password.slice(0, this.password.length - 1);
    },
    setRealAuth: function(event){
      var that = this;
      var paramData = {
        money: parseInt(this.money)*100,
        tradPwd: this.password
      }; this.showOverlay = true;
      request.postCashRequest(paramData).then((json)=>{
        if(json.code == 200){
          that.showOverlay = false;
          Toast(json.msg); that.$router.push('/withdrawalApplication');
        }
      }).catch((err)=>{
        that.showOverlay = false;
      });
    },
  },
  mounted() {
    this.money = this.proMoney;
  },
  watch: {
    password: function (newValue, oldValue) {
      if(newValue.length == 6){
        this.disabled = false; this.showKeyboard = false;
      }else {
        this.disabled = true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .divSetPwd{
    background-color: #F7F7F7;
  }
  .btnLogin{
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px; border-radius: 25px;
    box-shadow: 0 5px 10px #ffb5c4;
  }
  .divSetPwd .divTip{
    padding-top: 74px;
    margin-left: 20px;
    margin-bottom: 35px;
  }
  .divSetPwd .divTip .divTitle{
    font-size: 18px; font-weight: bold;
    color: #333333; margin-bottom: 9px;
  }
  .divSetPwd .divTip .divContent{
    font-size: 14px; color: #999999;
  }
  .divSetPwd .aForget{
    font-size: 14px; color: #2F8DFB; text-decoration: underline;
    float: right; margin-right: 17px; margin-top: 15px;
  }
  .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
