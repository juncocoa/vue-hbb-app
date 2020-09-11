<template>
  <div class="page">
    <div class="divTop">
      <div class="divBaseFlex">
        <router-link to="/personalInfo">
          <van-image :src="(profile.wechatInfo)?profile.wechatInfo.avatar:((profile.avatar)?profile.avatar:'@/assets/images/myProfile/avatar.png')" lazy-load class="imgAvatar">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgDefaultAvatar"/></template>
          </van-image>
        </router-link>
        <div class="divBaseInfo">
          <div class="divBaseName">
            <router-link to="/personalInfo">
              <div class="txtName">{{(profile.wechatInfo)?profile.wechatInfo.nickName:profile.nickName}}</div>
            </router-link>
            <img src="@/assets/images/myProfile/shopkeeper.png" v-if="false" class="imgShopkeeper"/>
          </div>
          <div class="divRemaining" v-if="profile.member != null">
            <img src="@/assets/images/myProfile/diamond.png" class="imgDiamond"/>
            剩余 {{profile.member.days}} 天
            <img src="@/assets/images/myProfile/right1.png" class="imgRight"/>
          </div>
        </div>
      </div>
      <div class="btnJoinMembership" v-if="false">{{(profile.member == null)?'开通会员':'续费'}}</div>
    </div>

    <div class="divMiddle">
      <div class="divTitle">
        <div class="divTip">收益余额</div>
        <div class="divDetail" @click="gotoRevenueBreakdown">收益明细</div>
      </div>
      <div class="divBalance">
        <span class="spanBalance">¥</span>{{profile.banlance | formatMoney}}
        <button class="btnCashOut" @click="gotoWithdraw">提现</button>
      </div>
      <div class="divCumulativeIncome">累计收益 ¥ {{profile.income | formatMoney}}</div>
    </div>

    <div class="divFlex">
      <router-link to="/purchasedCourse" class="divItem">
        <img src="@/assets/images/myProfile/purchasedClass.png" class="imgIcon"/>
        <div class="divName">已购课程</div>
      </router-link>
      <router-link to="/browsingHistory" class="divItem">
        <img src="@/assets/images/myProfile/browsingHistory.png" class="imgIcon"/>
        <div class="divName">浏览历史</div>
      </router-link>
      <router-link to="/promotionCenter" class="divItem">
        <img src="@/assets/images/myProfile/promotionCenter.png" class="imgIcon"/>
        <div class="divName">推广中心</div>
      </router-link>
      <router-link to="/couponCenter" class="divItem">
        <img src="@/assets/images/myProfile/coupon.png" class="imgIcon"/>
        <div class="divName">优惠券</div>
      </router-link>
    </div>
    <div class="divSplitLine"></div>
    <div class="divBottom">
      <router-link to="/myRoom" class="divItem" v-if="profile.haveRoom">
        <img src="@/assets/images/myProfile/myShop.png" class="imgIcon"/>
        <div class="txtName">
          我的直播间
          <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
        </div>
      </router-link>
      <div class="divItem" v-if="false">
        <img src="@/assets/images/myProfile/account.png" class="imgIcon"/>
        <div class="txtName">
          我的钱包
          <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
        </div>
      </div>
      <router-link to="/favorites"  class="divItem">
        <img src="@/assets/images/myProfile/favorites.png" class="imgIcon"/>
        <div class="txtName">
          我的收藏
          <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
        </div>
      </router-link>
      <div class="divItem" v-if="false">
        <img src="@/assets/images/myProfile/pwd.png" class="imgIcon"/>
        <div class="txtName">
          密码管理
          <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
        </div>
      </div>
      <router-link to="/feedback"  class="divItem" v-if="false">
        <img src="@/assets/images/myProfile/help.png" class="imgIcon"/>
        <div class="txtName">
          意见反馈
          <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
        </div>
      </router-link>
      <router-link to="/personalInfo"  class="divItem">
        <img src="@/assets/images/myProfile/setting.png" class="imgIcon"/>
        <div class="txtName">
          设置
          <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
        </div>
      </router-link>

      <div class="divItem" v-if="false">
        <img src="@/assets/images/myProfile/msg.png" class="imgIcon"/>
        <div class="txtName">
          我的消息
          <img src="@/assets/images/myProfile/right.png" class="imgRight"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/login.js'

export default {
  name: 'myProfile',
  data: () => ({
    profile: {nickName: '加载中...'}
  }),
  methods: {
    gotoRevenueBreakdown: function(){
      this.$router.push('/revenue')
    },
    gotoWithdraw: function(){
      if(this.profile.telInfo == null){
        this.$router.push('/personalInfo'); Toast('请先绑定手机号');
      }else {
        if(this.profile.isReal == false){
          this.$router.push('/verifyPhone/true');
        }else if(this.profile.isReal == true){
          if(this.profile.banlance > 0){
            this.$router.push('/withdraw/' + this.profile.banlance);
          }else {
            Toast('可用余额为零');
          }
        }
      }
    }
  },
  mounted() {
    var that = this;
    request.clientUserInfo().then((json)=>{
      if(json.code == 200){
        that.profile = json.data;
        sessionStorage.setItem("profile", JSON.stringify(that.profile));
      }
    });
  }
}
</script>
<style lang="scss" scoped>
  .divTop{
    margin: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .divTop .divBaseFlex{
    display: flex; align-items: center;
  }
  .divTop .imgAvatar{
    width: 60px; height: 60px;
    margin-right: 8px;
    border-radius: 50%;
    overflow: hidden;
  }
  .divTop .imgDefaultAvatar{
    width: 60px; height: 60px;
    border-radius: 50%;
    overflow: hidden;
  }
  .divTop .divBaseInfo{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .divTop .divBaseInfo .divBaseName{
    display: flex; align-items: center;
    margin-bottom: 5px;
  }
  .divTop .divBaseInfo .divBaseName .txtName{
    font-size: 20px; font-weight: 500;
    color: #333333; margin-right: 10px;
  }
  .divTop .divBaseInfo .divBaseName .imgShopkeeper{
    width: 50px;
  }
  .divTop .divBaseInfo .divRemaining{
    background-image: url('~@/assets/images/myProfile/remaining.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: 14px;
    color: #FFF;
    display: flex;
    align-items: center;
    height: 26px;
  }
  .divTop .divBaseInfo .divRemaining .imgDiamond{
    width: 18px; height: 18px; margin-left: 7px;
    margin-right: 4px;
  }
  .divTop .divBaseInfo .divRemaining .imgRight{
    width: 7px; height: 12px; margin-right: 7px;
    margin-left: 6px;
  }
  .divTop .btnJoinMembership{
    border: 2px solid #FFCC33;
    border-radius: 24px;
    color: #FFCC33;
    font-size: 14px;
    display: flex;
    padding: 6px;
    padding-left: 12px;
    padding-right: 12px;
    letter-spacing: 1px;
    align-items: center;
    justify-content: center;
  }

  .divMiddle{
    background-image: url('~@/assets/images/myProfile/bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%; height: 130px;
  }
  .divMiddle .divTitle{
    padding-top: 25px;
    padding-left: 25px;
    padding-right: 25px;
    display: flex;
    justify-content: space-between;
  }
  .divMiddle .divTitle .divTip{
    font-size: 14px;
    color: #FFFFFF;
  }
  .divMiddle .divTitle .divDetail{
    font-size: 14px;
    color: #FFFFFF;
    text-decoration: underline;
  }
  .divMiddle .divBalance{
    padding-left: 25px;
    padding-top: 13px;
    font-size: 21px;
    color: #FFF;
  }
  .divMiddle .divBalance .spanBalance{
    font-size: 14px;
    padding-right: 8px;
    color: #FFF;
  }
  .divMiddle .divBalance .btnCashOut{
    font-weight: 600;
    border: none;
    background-color: #FFFFFF;
    border-radius: 20px;
    padding: 6px;
    letter-spacing: 1px;
    padding-left: 18px;
    padding-right: 18px;
    font-size: 14px;
    color: #37363B;
    float: right;
    margin-top: 18px;
    margin-right: 25px;
  }
  .divMiddle .divCumulativeIncome{
    padding-left: 25px;
    margin-top: 10px;
    font-size: 14px;
    color: #78C553;
  }
  .divFlex{
    display: flex;
    margin-top: 10px;
  }
  .divFlex .divItem{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .divFlex .divItem .imgIcon{
    width: 70px; height: 70px;
  }
  .divFlex .divItem .divName{
    text-align: center;
    font-size: 14px;
    color: #666666
  }
  .divSplitLine{
    margin-top: 18px;
    background-color: #F7F7F7;
    height: 5px;
  }
  .divBottom{
    width: 100%
  }
  .divBottom .divItem{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .divBottom .divItem:active{
    background-color: #F7F7F7;
  }
  .divBottom .divItem .imgIcon{
    width: 20px; height: 20px;
    margin-right: 20px; margin-left: 20px;
  }
  .divBottom .divItem .txtName{
    height: 48px; font-weight: 500;
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
</style>
