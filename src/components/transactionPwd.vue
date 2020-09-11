<template>
  <div class="page" style="background-color: #F7F7F7;">
    <div class="divSetPwd">
      <div style="height: 310px;">
        <div class="divTip">
          <div class="divTitle">{{title}}</div>
          <div class="divContent">{{tip}}</div>
        </div>
        <div style="margin-top: 60px;" v-if="stepFrequency == 1">
          <van-password-input
            :value="password"
            :focused="showKeyboard"
            @focus="showKeyboard = true"/>
        </div>
        <div style="margin-top: 60px;" v-if="stepFrequency == 2">
          <van-password-input
            :value="confirmPwd"
            :focused="showKeyboard"
            @focus="showKeyboard = true"/>
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
        <van-loading size="24px" vertical color="#FFF"><font color="#FFF">设置中...</font></van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/withdraw.js'

export default {
  name: 'transactionPwd',
  props: {
    proIdCard: {
      type: String,
      default: ''
    },
    proRealName: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    height: window.innerHeight + "px",
    title: '交易密码',
    tip: '请输入 6 位密码',

    realName: '',
    idCard: '',
    stepFrequency: 1,
    password: '',
    confirmPwd: '',
    showKeyboard: true,
    disabled: true,

    showOverlay: false
  }),
  methods: {
    setParams(realName, idCard){
      this.realName = realName;
      this.idCard = idCard;
    },
    onInput(key) {
      if(this.stepFrequency == 1){
        this.password = (this.password + key).slice(0, 6);
      }else if(this.stepFrequency == 2){
        this.confirmPwd = (this.confirmPwd + key).slice(0, 6);
      }
    },
    onDelete() {
      if(this.stepFrequency == 1){
        this.password = this.password.slice(0, this.password.length - 1);
      }else if(this.stepFrequency == 2){
        this.confirmPwd = this.confirmPwd.slice(0, this.confirmPwd.length - 1);
      }
    },
    setRealAuth: function(event){
      var that = this;
      var paramData = {
        realName: this.realName,
        idCard: this.idCard,
        tradePwd: this.password
      }; this.showOverlay = true;
      request.postRealAuth(paramData).then((json)=>{
        if(json.code == 200){
          Toast(json.msg); that.showOverlay = false;
          that.$router.push('/myProfile');
        }
      }).catch((err)=>{
        that.showOverlay = false;
      });
    },
  },
  mounted() {
    this.realName = this.proRealName;
    this.idCard = this.proIdCard;
  },
  watch: {
    password: function (newValue, oldValue) {
      if(newValue.length == 6){
        this.stepFrequency = 2;
        this.title = '请再次输入';
        this.tip = '请输入 6 位确认密码';
      }
    },
    confirmPwd: function (newValue, oldValue) {
      if(newValue.length == 6){
        if(this.password === newValue){
          this.disabled = false; this.showKeyboard = false;
        }else {
          this.stepFrequency = 1; this.disabled = true;
          this.password = ''; this.confirmPwd = '';
          this.title = '交易密码';
          this.tip = '请输入 6 位密码';
          Toast('两次密码不同，请重新输入。');
        }
      }
      if(this.password != newValue){ this.disabled = true; }
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
  .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
