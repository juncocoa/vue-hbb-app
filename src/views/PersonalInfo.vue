<template>
  <div class="page">
    <div class="divBottom" :style="{height: height}">
      <div class="divItem" v-if="profile.wechatInfo != null">
        <div class="txtName">
          微信
          <div class="divFlex">
            <img src="@/assets/images/myProfile/avatar.png" class="imgAvatar" v-if="profile.wechatInfo.avatar == null"/>
            <van-image :src="profile.wechatInfo.avatar" lazy-load class="imgAvatar" v-if="profile.wechatInfo.avatar != null">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
            </van-image>
            <label>{{profile.wechatInfo.nickName}}</label>
          </div>
        </div>
      </div>
      <div class="divItem" v-if="profile.wechatInfo == null" @click="bindWechat">
        <div class="txtName">
          微信
          <div class="divFlex">
            <label>未绑定</label>
          </div>
        </div>
      </div>
      <div class="divItem" @click="gotoBindTel">
        <div class="txtName">
          手机号
          <div class="divFlex" v-if="profile.telInfo == null">
            <label>未绑定</label>
          </div>
          <div class="divFlex" v-if="profile.telInfo != null">
            <label class="lblPhone">{{profile.telInfo.tel}}</label>
            <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
          </div>
        </div>
      </div>
      <div class="divItem" v-if="profile.telInfo != null">
        <router-link :to="'/setPassword/' + profile.telInfo.tel" class="txtName">
          账号密码
          <div class="divFlex">
            <label class="lblPhone" v-if="!profile.telInfo.havePwd">未设置</label>
            <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
          </div>
        </router-link>
      </div>
      <div class="divItem">
        <a href="javascript:;" @click="gotoWithdrawalPwd" class="txtName">
          提现密码
          <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/login.js'
import { fileUpload } from '../service/fileUpload.js'

export default {
  name: 'personalInfo',
  data: () => ({
    height: (window.innerHeight) + "px",
    profile: {}
  }),
  methods: {
    initiData(){
      var that = this;
      request.clientUserInfo().then((json)=>{
        if(json.code == 200){
          that.profile = json.data;
        }
      });
    },
    gotoWithdrawalPwd(){
      if(this.profile.telInfo == null){
        this.$router.push('/personalInfo'); Toast('请先绑定手机号');
      }else {
        if(this.profile.isReal == false){
          this.$router.push('/verifyPhone/true');
        }else if(this.profile.isReal == true){
          this.$router.push('/verifyPhone/false');
        }
      }
    },
    gotoBindTel(event){
      if(this.profile.telInfo == null){
        this.$router.push("/bindPhone");
      }else {
        this.$router.push("/switchPhone/" + this.profile.telInfo.tel);
      }
    },
    bindWechat(){
      var APPID = "wx233ca74b3d313293";
      var REDIRECT_URI = encodeURIComponent(window.CallbackURL + "/personalInfo");
      var scope = 'snsapi_userinfo';
      var URL = `http://oauth.hbbclub.com/#/?appid=${APPID}&redirect_url=${REDIRECT_URI}`
      location.href = URL;
    }
  },
  mounted() {
    var code = location.href;
    if(code.includes("?code=") == true){
      code = code.substr(code.indexOf("?code=") + 6, code.length);
      var that = this;
      request.bindWechat({wxcode: code, appType: 'web'}).then((json)=>{
        if(json.code == 200){
          Toast(json.msg); that.$router.push('/personalInfo');
          that.initiData();
        }
      })
    }
    this.initiData();
  }
}
</script>
<style lang="scss" scoped>
  .divBottom{
    width: 100%; background-color: #F7F7F7;
  }
  .divBottom .divItem{
    padding-left: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    box-sizing: border-box;
  }
  .divBottom .divItem:active{
    background-color: #F7F7F7;
  }
  .divBottom .divItem .txtName{
    height: 58px; font-weight: 500;
    flex: 1; display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px; color: #333333;
    border-bottom: 1px solid #F7F7F7;
    letter-spacing: 1px; margin-right: 20px;
  }
  .divBottom .divItem .txtName .imgRight{
    width: 8px; height: 15px;
  }
  .divBottom .divItem .txtName .divFlex{
    display: flex; align-items: center;
  }
  .divBottom .divItem .txtName .divFlex label{
    font-size: 16px; color: #333333; font-weight: bold;
  }
  .divBottom .divItem .txtName .divFlex .imgAvatar{
    width: 46px; height: 46px; margin-right: 5px; border-radius: 50%;
  }
  .divBottom .divItem .txtName .divFlex .lblPhone{
    margin-right: 7px; font-size: 15px; color: #333333; font-weight: 500;
    letter-spacing: 0px;
  }
</style>
