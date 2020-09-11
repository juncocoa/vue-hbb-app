<template>
  <div id="divPayDetail" class="page divPayDetail">
    <div class="divTitle">
      <div class="divName">付费详情</div>
      <img src="@/assets/images/buy/close.png" class="imgClose" @click="closeWindows"/>
    </div>
    <div class="divContext">
      <div class="divItem">
        <span class="spanName">课程价格</span>
        <span class="spanOldPrice">¥{{course.originalPrice | formatMoney}}</span>
      </div>
      <div class="divItem">
        <span class="spanName">限时特价</span>
        <span class="spanNewPrice">¥{{course.realPrice | formatMoney}}</span>
      </div>
      <div class="divItem" @click="showCouponListFn(true)">
        <span class="spanName">优惠券</span>
        <div class="divPrice">
          <span v-if="couponPrice > 0">-¥{{couponPrice | formatMoneyByDollar1}}</span>
          <img src="@/assets/images/buy/more.png" class="imgRight" />
        </div>
      </div>
    </div>
    <div class="divPurchaseNotes">
      <div class="divNotes">购买须知</div>
      <div class="divRichTxt" v-html="course.mustRead" v-if="course.mustRead != null"></div>
      <div class="divRichTxt" v-if="course.mustRead == null">暂无</div>
    </div>
    <button class="btnBuy" @click="buyCourse">
      <div v-if="inPurchase == 0" class="divInPurchase">
        <span>¥{{(course.realPrice - couponPrice) | formatMoney}}</span>
        立即购买
      </div>
      <div v-if="inPurchase == 1" class="divInPurchase">
        <div class="van-loading van-loading--circular van-button__loading">
          <span class="van-loading__spinner van-loading__spinner--circular" style="color: currentcolor; width: 20px; height: 20px;">
            <svg viewBox="25 25 50 50" class="van-loading__circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg>
          </span>
        </div>
        <div style="font-size: 15px;">加载优惠券中</div>
      </div>
      <div v-if="inPurchase == 2" class="divInPurchase">
        <div class="van-loading van-loading--circular van-button__loading">
          <span class="van-loading__spinner van-loading__spinner--circular" style="color: currentcolor; width: 20px; height: 20px;">
            <svg viewBox="25 25 50 50" class="van-loading__circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg>
          </span>
        </div>
        <div style="font-size: 15px;">支付中，请稍后</div>
      </div>
    </button>
    <van-popup v-model="showCouponList" get-container=".divCourse" position="bottom" :style="{ height: '100%' }">
      <vue-coupon-list ref="couponList" @userCoupon="userCouponFn" @showCouponList="showCouponListFn" @clearCoupon="clearCoupon" :courseUUID="course.uuid"/>
    </van-popup>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/course.js'
import couponList from '../components/couponList.vue';

export default {
  name: 'payDetail',
  props: {
    proCourse: {
      type: Object,
      default: {}
    }
  },
  data: () => ({
    course: {},
    couponUUID: '',
    couponPrice: 0,
    showCouponList: false,
    weChatPayInterface: false,
    inPurchase: 1 //购买中（0:启用，1:加载优惠券，2:支付中）
  }),
  components: {
    "vue-coupon-list": couponList
  },
  methods: {
    initiaData: function(){
      if(this.course.userCoupon == null && this.course.coupons != null){
        var that = this; that.inPurchase = 1;
        request.postUserCoupons({couponsUuid: this.course.coupons.uuid}).then((json) => {
          if(json.code == 200){
            that.inPurchase = 0; console.log('优惠券领取成功。');
            that.couponUUID = json.data.uuid;
            that.couponPrice = json.data.coupon.money;
          }
        }).catch((err)=>{
          that.inPurchase = 0;
        });
      }else {
        if(this.course.userCoupon != null){
          this.couponUUID = this.course.userCoupon.uuid;
          this.couponPrice = this.course.userCoupon.coupon.money;
        }
        this.inPurchase = 0;
      }
    },
    closeWindows: function(){
      this.$emit('closeWindows', false);
    },
    showCouponListFn: function (val) {
      this.showCouponList = val;
      if(val == true && this.$refs.couponList != undefined){
          this.$refs.couponList.initiaData();
      }
    },
    userCouponFn: function(item){
      this.couponUUID = item.uuid;
      this.couponPrice = item.coupon.money;
      this.showCouponList = false;
    },
    clearCoupon: function(){
      this.couponUUID = '';
      this.couponPrice = 0;
    },
    buyCourse: function(){
      if(this.inPurchase != 0){ return; }

      if((this.course.realPrice - this.couponPrice) <= 0){
        var paramData = {
          uuid: this.course.uuid,
          couponUuid: this.couponUUID
        }; this.inPurchase = 2;
        if(sessionStorage.getItem("shareUuid") != null){
          paramData.shareUuid = sessionStorage.getItem("shareUuid");
        }; var that = this;
        request.postPayZero(paramData).then((json) => {
          if(json.code == 200){
            Dialog.alert({ message: json.msg });
            that.$emit('closeWindows', true);  that.inPurchase = 0;
            if(sessionStorage.getItem("shareUuid") != null){ sessionStorage.removeItem("shareUuid"); }
          }
        }).catch((err)=>{
          that.inPurchase = 0;
        });
      }else {
        if(this.weChatPayInterface == false){
          Dialog.alert({ message: '请在微信中，启动支付此课程。' }); return;
        }
        var that = this; this.inPurchase = 2;
        var paramData = {
          uuid: this.course.goodsUuid
        }
        if(sessionStorage.getItem("shareUuid") != null){
          paramData.shareUuid = sessionStorage.getItem("shareUuid");
        }
        if(this.couponUUID != ''){
          paramData.couponUuid = this.couponUUID;
        }
        request.postWXPayParams(paramData).then((json) => {
          if(json.code == 200){
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                 "appId": json.data.payData.appid,     //公众号名称，由商户传入
                 "timeStamp": json.data.payData.timeStamp,         //时间戳，自1970年以来的秒数
                 "nonceStr": json.data.payData.nonceStr, //随机串
                 "package": json.data.payData.package,
                 "signType": "MD5",         //微信签名方式：
                 "paySign":  json.data.payData.sign//微信签名
              },
              function(res){
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                if(res.err_msg == "get_brand_wcpay_request:ok"){
                  request.getWXPayQuery({uuid: json.data.uuid}).then((response) => {
                    if(response.code == 200){
                      Dialog.alert({ message: response.msg });
                      that.$emit('closeWindows', true);  that.inPurchase = 0;
                      if(sessionStorage.getItem("shareUuid") != null){ sessionStorage.removeItem("shareUuid"); }
                    }
                  }).catch((err)=>{
                    that.inPurchase = 0;
                  });
                }else if(res.err_msg == "get_brand_wcpay_request:fail" ){
                  Dialog.alert({ message: '支付失败' }); that.inPurchase = 0;
                }else if(res.err_msg == "get_brand_wcpay_request:cancel" ){
                  Dialog.alert({ message: '支付取消，欢迎下次购买' }); that.inPurchase = 0;
                }else {
                  Dialog.alert({ message: '支付异常，联系管理员：13888888888' }); that.inPurchase = 0;
                }
              }
            );
          }
        }).catch((err)=>{
          that.inPurchase = 0;
        });
      }
    },
    onBridgeReady: function(){
      //拥有微信支付环境
      this.weChatPayInterface = true;
    }
  },
  mounted() {
    this.course = this.proCourse;
    this.initiaData(); var timeout = setTimeout(()=>{
      this.$emit('adaptiveHeight'); clearTimeout(timeout);
    }, 200);
    //检查微信环境支付接口
    if (typeof WeixinJSBridge == "undefined"){
       if(document.addEventListener){
           document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
       }else if (document.attachEvent){
           document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
           document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
       }
    }else{
       this.onBridgeReady();
    }
  }
}
</script>
<style lang="scss" scoped>
  .divPayDetail{
    width: 100%; padding: 20px; box-sizing: border-box; overflow: visible;
    height: initial;
  }
  .divPayDetail .divTitle{
    display: flex; flex-direction: row; align-items: center;
    justify-content: space-between;
  }
  .divPayDetail .divTitle .divName{
    font-size: 18px; color: #333333; font-weight: bold;
  }
  .divPayDetail .divTitle .imgClose{
    width: 28px;
  }
  .divPayDetail .divContext{
    background-color: #F6F6FB; border-radius: 3px;
    margin-top: 20px; padding-top: 8px; padding-bottom: 8px;
    box-sizing: border-box;
  }
  .divPayDetail .divContext .divItem{
    display: flex; align-items: center; justify-content: space-between;
    padding-left: 15px; padding-right: 15px;
    line-height: 32px;
  }
  .divPayDetail .divContext .divItem .spanName{
    font-size: 14px; color: #666666;
  }
  .divPayDetail .divContext .divItem .spanOldPrice{
    font-size: 16px; color: #333333; font-weight: bold;
    padding-right: 11px;
  }
  .divPayDetail .divContext .divItem .spanNewPrice{
    font-size: 15px; color: #FF6B88; font-weight: bold;
    padding-right: 11px;
  }
  .divPayDetail .divContext .divItem .divPrice{
    font-size: 14px; color: #2F8DFB; display: flex;
    align-items: center; font-weight: bold;
  }
  .divPayDetail .divContext .divItem .divPrice .imgRight{
    width: 7px; margin-left: 5px;
  }
  .divPayDetail .btnBuy{
    border: none; font-size: 18px; color: #FFF; font-weight: bold;
    background: linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    border-radius: 35px; display: flex; align-items: center; justify-content: center;
    height: 45px; width: 100%; margin-top: 25px;
  }
  .divPayDetail .btnBuy span{
    font-size: 16px;
    font-weight: normal; margin-right: 10px;
  }
  .divPayDetail .btnBuy .divInPurchase{
    display: flex; justify-content: center; align-items: center;
  }
  .divPayDetail .divPurchaseNotes{
    margin-top: 15px;
  }
  .divPayDetail .divPurchaseNotes .divNotes{
    font-size: 16px; color: #333333; font-weight: bold;
    margin-bottom: 10px;
  }
  .divPayDetail .divPurchaseNotes .divRichTxt{
    font-size: 14px; overflow-x: hidden; overflow-y: auto;
    max-height: 87px;
  }
</style>
