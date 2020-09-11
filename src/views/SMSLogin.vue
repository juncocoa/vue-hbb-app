<template>
  <div class="page">
    <div class="divHeader">欢迎登录好呗呗</div>
    <div class="divPhone">
      <input type="tel" maxlength="11" placeholder="输入您的手机号" v-model="tel" autocomplete="off"/>
    </div>
    <div class="divPwd">
      <input type="tel" maxlength="6" placeholder="请输入验证码" v-model="code" autocomplete="off"/>
      <div class="divGetVerifCode" @click="clientSendCode">{{txtCode}}</div>
    </div>
    <van-button color="#FF6B88" :disabled="!verify" block class="btnLogin" @click="login">登录</van-button>
    <div class="divNavigation">
      <a href="javascript:;" @click="gotoRegister">注册</a>
      <a href="javascript:;" @click="gotoLogin">账号密码登录&gt;</a>
    </div>
    <div class="divQuickLogin">
      <div class="divSplitLine"></div>
      <label class="divTxt">快捷登录</label>
    </div>
    <div class="divWeChatLogin" @click="loginWeChat">
      <img src="@/assets/images/login/WeChat.png" class="imgLogin"/>
      <div class="divWeChat">微信</div>
    </div>
    <van-overlay :show="showOverlay">
      <div class="wrapper" :style="{height: height}">
        <van-loading size="24px" vertical color="#FFF"><font color="#FFF">登录中...</font></van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/login.js'

export default {
  name: 'SMSLogin',
  data: () => ({
    height: window.innerHeight + "px",
    tel: '',
    code: '',

    //短信倒计时
    interval: 0,
    speed: 120,
    txtCode: '获取验证码',

    showOverlay: false
  }),
  computed: {
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
  },
  methods: {
    gotoLogin: function(event){
      this.$router.push('/login');
    },
    gotoRegister: function(event){
      this.$router.push('/register');
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
    login: function(event){
      if (this.verifyTel) {
        Dialog.alert({ message: '手机号格式错误！' });
        return;
      }
      if (this.verifyCode) {
        Dialog.alert({ message: '验证码必须 6 位数。' });
        return;
      }
      var paramData = {
        type: 'code',
        tel: this.tel,
        code: this.code
      }; var that = this; this.showOverlay = true;
      request.clientLogin(paramData).then((json)=>{
        if(json.code == 200){
          Toast('登录成功'); sessionStorage.setItem("token", json.data.token);
          sessionStorage.setItem("profile", JSON.stringify(json.data.profile));
          that.showOverlay = false; that.$router.push('/home');
        }
      }).catch((err)=>{
        that.showOverlay = false;
      });
    },
    loginWeChat: function (event){
      var APPID = "wx233ca74b3d313293";
      var REDIRECT_URI = encodeURIComponent(window.CallbackURL + "/SMSLogin");
      var scope = 'snsapi_userinfo'; //snsapi_base、snsapi_userinfo

      // var URL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`
      var URL = `http://oauth.hbbclub.com/#/?appid=${APPID}&redirect_url=${REDIRECT_URI}`
      location.href = URL;
    }
  },
  mounted() {
    var code = location.href;
    if(code.includes("?code=") == true){
      code = code.substr(code.indexOf("?code=") + 6, code.length);
      var that = this; this.showOverlay = true
      request.clientWechatLogin({wxcode: code, appType: 'web'}).then((json)=>{
        if(json.code == 200){
          Toast('登录成功'); sessionStorage.setItem("token", json.data.token);
          sessionStorage.setItem("profile", JSON.stringify(json.data.profile));
          that.showOverlay = false; that.$router.push('/home');
        }
      }).catch((err)=>{
        that.showOverlay = false;
      });
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
  .divHeader{
    font-size: 0.5rem;
    color: #333333;
    padding-top: 2rem;
    margin-bottom: 0.5rem;
    margin-left: auto;
    margin-right: auto;
    width: 85%;
    font-weight: 500;
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
  .divNavigation{
    font-size: 0.27rem;
    margin-top: 0.4rem;
    display: flex;
    justify-content: space-between;
    width: 85%;
    margin-right: auto;
    margin-left: auto;
  }
  .divNavigation a{
    color: #1877DF;
    text-decoration: none;
  }
  .divQuickLogin{
    width: 67%;
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
  .divQuickLogin .divSplitLine{
    width: 100%;
    border-bottom: 1px solid #F7F7F7;
  }
  .divQuickLogin .divTxt{
    color: #999999;
    font-size: 0.27rem;
    position: absolute;
    margin-top: -9px;
    margin-left: -35px;
    background-color: white;
    padding-left: 10px;
    padding-right: 10px;
  }
  .divWeChatLogin{
    width: 2rem;
    height: 2rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.3rem;
    text-align: center;
  }
  .divWeChatLogin .divWeChat{
    color: #999999;
    font-size: 0.27rem;
    margin-top: -25px;
    text-align: center;
  }
  .divWeChatLogin .imgLogin{
    width: 2rem;
  }
  .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
