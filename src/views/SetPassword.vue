<template>
  <div class="page divSetPwd">
    <div style="background-color: #FFF;">
      <div class="divPhone">
        <div class="divTitle">手机号：</div>
        <input type="tel" maxlength="11" placeholder="请填写您的手机号" v-model="tel" autocomplete="off" disabled />
      </div>
      <div class="divPwd">
        <div class="divTitle">验证码：</div>
        <div class="divFlex">
          <input type="tel" maxlength="6" placeholder="请输入验证码" v-model="code" autocomplete="off"/>
          <div class="divGetVerifCode" @click="clientSendCode">{{txtCode}}</div>
        </div>
      </div>
      <div class="divPhone">
        <div class="divTitle">设置密码：</div>
        <input type="password" maxlength="16" placeholder="请输入密码" v-model="password" autocomplete="off"/>
      </div>
      <div class="divPhone">
        <div class="divTitle">确认密码：</div>
        <input type="password" maxlength="16" placeholder="请输入确认密码" v-model="confirmPassword" autocomplete="off"/>
      </div>
      <div class="divTip">密码必须至少8个字符，而且同时包含字母和数字</div>
    </div>
    <van-button color="#FF6B88" :disabled="!verify" block class="btnLogin" @click="submitPwd">提交</van-button>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/login.js'

export default {
  name: 'SetPassword',
  data: () => ({
    tel: '',
    code: '',
    password: '',
    confirmPassword: '',

    //短信倒计时
    interval: 0,
    speed: 120,
    txtCode: '获取验证码'
  }),
  computed: {
    verify() {
      return this.tel && this.password && this.code && this.confirmPassword
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
      if (this.verifyPassword) {
        Dialog.alert({ message: '密码必须 6 到 16 位。' });
        return;
      }
      if (this.password != this.confirmPassword) {
        Dialog.alert({ message: '密码 与 确定密码必须相同。' });
        return;
      }
      var paramData = {
        tel: this.tel,
        code: this.code,
        password: this.password
      }; var that = this;
      request.clientChangePwd(paramData).then((json)=>{
        if(json.code == 200){
          Toast(json.msg); that.$router.back();
        }
      })
    }
  },
  mounted() {
    this.tel = this.$route.params.tel;
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
  .divTip{
    font-size: 12px; color: #999999;
    line-height: 40px; width: 85%;
    margin-left: auto;
    margin-right: auto;
  }
  .divPhone{
    display: flex;
    align-items: center;
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    height: 1.18rem;
    border-bottom: 1px solid #F5F5F5;
  }
  .divTitle{
    color: #333333; width: 1.9rem; font-size: 14px;
  }
  .divPhone input{
    width: 100%;
    border: none;
    font-size: 0.29rem;
  }
  .divPhone input:disabled{
    background-color: #FFF; color: #9d9d9d;
  }
  .divPwd{
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #F5F5F5;
  }
  .divPwd .divFlex{
    display: flex; width: 100%;
    flex-direction: row;
    align-items: center;
  }
  .divPwd input{
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
    margin-top: 55px; border-radius: 25px;
    box-shadow: 0 5px 10px #ffb5c4;
  }
</style>
