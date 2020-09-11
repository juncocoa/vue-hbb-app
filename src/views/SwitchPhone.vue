<template>
  <div class="page" style="background-color: #F7F7F7;">
    <div class="divSetPwd" v-if="stepNum == 1">
      <div style="background-color: #FFF; height: 264px;">
        <div class="divTip">
          <div class="divTitle">安全验证</div>
          <div class="divContent">为保证账户安全，请您完成身份验证</div>
        </div>
        <div class="divPwd">
          <input type="password" maxlength="16" placeholder="请填写旧密码" v-model="password" autocomplete="off"/>
        </div>
      </div>
      <van-button color="#FF6B88" :disabled="!verifyOld" block class="btnLogin" @click="stepNext">下一步</van-button>
    </div>

    <div class="divSetPwd" v-if="stepNum == 2">
      <div style="background-color: #FFF; height: 264px;">
        <div class="divTip">
          <div class="divTitle">输入新手机号</div>
          <div class="divContent">更换手机号后，您需要使用新的手机号登录</div>
        </div>
        <div class="divPhone">
          <div class="divTitle">+86</div>
          <input type="tel" maxlength="11" placeholder="输入手机号" v-model="tel" autocomplete="off"/>
        </div>
        <div class="divCode">
          <input type="tel" maxlength="6" placeholder="请输入验证码" v-model="code" autocomplete="off"/>
          <div class="divGetVerifCode" @click="clientSendCode">{{txtCode}}</div>
        </div>
      </div>
      <van-button color="#FF6B88" :disabled="!verify" block class="btnLogin" @click="submitPwd">确认更换</van-button>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/login.js'

export default {
  name: 'SwitchPhone',
  data: () => ({
    stepNum: 1,
    tel: '',
    code: '',
    password: '',

    //短信倒计时
    interval: 0,
    speed: 120,
    txtCode: '获取验证码'
  }),
  computed: {
    verifyOld() {
      return this.password
    },
    verify() {
      return this.tel && this.code
    },
    verifyTel(){
      return !/^1[3456789]\d{9}$/.test(this.tel)
    },
    verifyCode(){
      if(this.code.length == 6){
        return false;
      }else {
        return true;
      }
    },
    verifyPassword(){
      if(this.password.length >= 6 && this.password.length <= 16){
        return false;
      }else {
        return true;
      }
    }
  },
  methods: {
    stepNext: function(event){
      if (this.verifyPassword) {
        Dialog.alert({ message: '密码必须 6 到 16 位。' });
        return;
      }
      var paramData = {
        type: 'pwd',
        tel: this.$route.params.tel,
        password: this.password
      }; var that = this;
      request.clientLogin(paramData).then((json)=>{
        if(json.code == 200){
          sessionStorage.setItem("token", json.data.token);
          that.stepNum = 2; Toast('密码验证成功');
        }
      })
    },
    clientSendCode: function(event){
      if(this.txtCode == "获取验证码"){
        if (this.verifyTel) {
          Dialog.alert({ message: '手机号格式错误！' });
          return;
        }
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
    submitPwd: function (event){
      if (this.verifyTel) {
        Dialog.alert({ message: '手机号格式错误！' });
        return;
      }
      if (this.verifyCode) {
        Dialog.alert({ message: '验证码必须 6 位数。' });
        return;
      }
      var paramData = {
        tel: this.tel,
        code: this.code
      }; var that = this;
      request.clientChangeTel(paramData).then((json)=>{
        if(json.code == 200){
          Toast(json.msg); that.$router.replace('/myProfile');
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
		color: #999999;
	}
	::-moz-placeholder { /* Firefox 19+ */
		color: #999999;
	}
	:-ms-input-placeholder { /* IE 10+ */
	 color: #999999;
	}
	:-moz-placeholder { /* Firefox 18- */
	 color: #999999;
	}
  .divSetPwd{
    background-color: #F7F7F7;
  }
  .divPhone{
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    height: 32px;
    border-bottom: 1px solid #F5F5F5;
  }
  .divPhone .divTitle{
    color: #333333; width: 40px; font-size: 14px;
    font-weight: bold;
  }
  .divPhone input{
    width: 100%;
    border: none;
    font-size: 0.29rem;
  }

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
  .divPwd{
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    height: 36px;
    border-bottom: 1px solid #F7F7F7;
  }
  .divPwd input{
    width: 100%;
    border: none;
    font-size: 0.29rem;
  }
</style>
