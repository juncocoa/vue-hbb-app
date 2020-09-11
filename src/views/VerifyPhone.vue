<template>
  <div class="page" style="background-color: #F7F7F7;">
    <div class="divSetPwd">
      <div style="background-color: #FFF; height: 264px;">
        <div class="divTip">
          <div class="divTitle">手机号验证</div>
          <div class="divContent">为保护账户安全，需要验证本人手机号</div>
        </div>
        <div class="divCode">
          <input type="tel" maxlength="6" placeholder="请输入验证码" v-model="code" autocomplete="off"/>
          <div class="divGetVerifCode" @click="clientSendCode">{{txtCode}}</div>
        </div>
      </div>
      <van-button color="#FF6B88" :disabled="!verifyOld" block class="btnLogin" @click="submitVerify">提交验证信息</van-button>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/withdraw.js'

export default {
  name: 'verifyPhone',
  data: () => ({
    tel: '',
    code: '',

    //短信倒计时
    interval: 0,
    speed: 120,
    txtCode: '获取验证码'
  }),
  computed: {
    verifyOld() {
      return this.code
    },
    verifyCode(){
      if(this.code.length == 6){
        return false;
      }else {
        return true;
      }
    },
  },
  methods: {
    submitVerify: function(event){
      if (this.verifyCode) {
        Dialog.alert({ message: '验证码必须等于 6 位。' });
        return;
      }
      var paramData = {
        code: this.code
      }; var that = this;
      request.postChecktel(paramData).then((json)=>{
        if(json.code == 200){
          Toast(json.msg);
          if(that.$route.params.isFirst == "true"){
            that.$router.push('/identityAuth');
          }else if(that.$route.params.isFirst == "false"){
            that.$router.push('/resetPwd');
          }
        }
      })
    },
    clientSendCode: function(event){
      if(this.txtCode == "获取验证码"){
        var that = this;
        request.clientSendCode({ tel: this.tel}).then((json)=>{
          if(json.code == 200){
            Dialog.alert({ message: json.msg });

            that.interval = setInterval(()=>{
              if(that.speed > 0){
                that.txtCode = that.speed-- + "s后再次发送"
              }else {
                clearInterval(that.interval); that.speed = 120; that.txtCode = "获取验证码";
              }
            }, 1000);
          }
        })
      }
    },
  },
  mounted() {
    var profile = JSON.parse(sessionStorage.getItem("profile"));
    this.tel = profile.telInfo.tel;
  }
}
</script>
<style lang="scss" scoped>
  .divCode{
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 46px;
    border-bottom: 1px solid #F5F5F5;
  }
  .divCode .divFlex{
    display: flex; width: 100%;
    flex-direction: row;
    align-items: center;
  }
  .divCode input{
    border: none;
    flex: 1; width: 100%;
    font-size: 0.29rem;
  }
  .divGetVerifCode{
    min-width: 0.56rem;
    font-size: 0.26rem;
    color: #999999;
    border-left: 1px solid #D8D8D8;
    padding-right: 10px;
    padding-left: 10px;
    line-height: 20px;
  }
  .btnLogin{
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px; border-radius: 25px;
    box-shadow: 0 5px 10px #ffb5c4;
  }
  .divSetPwd .divTip{
    padding-top: 64px;
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
</style>
