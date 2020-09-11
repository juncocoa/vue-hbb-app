<template>
  <div class="page">
    <div class="divPhone">
      <input type="tel" maxlength="11" placeholder="输入您的手机号" v-model="tel" autocomplete="off"/>
    </div>
    <div class="divPwd">
      <input type="tel" maxlength="6" placeholder="请输入验证码" v-model="code" autocomplete="off"/>
      <div class="divGetVerifCode" @click="clientSendCode">{{txtCode}}</div>
    </div>
    <div class="divPhone">
      <input type="password" maxlength="12" placeholder="请输入6-16位登录密码" v-model="password" autocomplete="off"/>
    </div>
    <van-button color="#FF6B88" :disabled="!verify" block class="btnLogin" @click="register">确认注册</van-button>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/login.js'

export default {
  name: 'Register',
  data: () => ({
    tel: '',
    code: '',
    password: '',

    //短信倒计时
    interval: 0,
    speed: 120,
    txtCode: '获取验证码'
  }),
  computed: {
    verify() {
      return this.tel && this.password && this.code
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
    register: function (event){
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
      var paramData = {
        tel: this.tel,
        code: this.code,
        password: this.password
      }; var that = this;
      request.clientRegister(paramData).then((json)=>{
        if(json.code == 200){
          Toast(json.msg); sessionStorage.setItem("token", json.data.token);
          sessionStorage.setItem("profile", JSON.stringify(json.data.profile));
          that.$router.push('/home');
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
  .divPhone{
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    height: 1.18rem;
    border-bottom: 1px solid #F5F5F5;
  }
  .divPhone input{
    width: 100%;
    border: none;
    font-size: 0.29rem;
  }
  .divPwd{
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 1rem;
    border-bottom: 1px solid #F5F5F5;
    padding-bottom: 0.18rem;
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
    margin-top: 55px;
    box-shadow: 0 5px 10px #ffb5c4;
  }
</style>
