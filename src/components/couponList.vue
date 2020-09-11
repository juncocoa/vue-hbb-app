<template>
  <div class="page divCouponList">
    <div class="divTitle">
      <div class="divName">我的优惠券</div>
      <img src="@/assets/images/buy/close.png" class="imgClose" @click="closeWindows"/>
    </div>
    <van-checkbox v-model="checked" checked-color="#FF6B88">不使用优惠券</van-checkbox>
    <div class="divList" :style="{height: height}">
      <div v-if="couponList.length <= 0" class="divDefInfo" :style="{height: height}">
        <img src="@/assets/images/default/card.png" class="imgDefault"/>
        <div class="divTip">暂无优惠券</div>
      </div>
      <div class="couponItem" :class="'bg'+ item.coupon.couponType" v-for='(item, index) in couponList' :key='index'>
        <van-row type="flex">
          <van-col class="one">
            <div>￥<span class="price">{{item.coupon.money | formatMoneyByDollar}}<span style="font-size: 12px;">{{item.coupon.money | formatMoneyByDollar2}}</span></span></div>
            <div class="type-tips">{{item.coupon.couponType | couponType}}</div>
          </van-col>
          <van-col class="two">
            <div class="coupon-name">{{item.coupon.name}}</div>
            <div>{{item.coupon.endTime | formatDateByFormat('yyyy-MM-dd')}} 到期</div>
            <div v-if="item.coupon.couponType == 1">原价 ¥{{item.coupon.price | formatMoney}}</div>
            <div v-if="item.coupon.couponType == 2">
              <div class="divScope">仅限于使用 {{item.coupon.scope}}</div>
              <div>满 {{item.coupon.accountMoney | formatMoney}} 元可用</div>
            </div>
            <div v-if="item.coupon.couponType == 3">满 {{item.coupon.accountMoney | formatMoney}} 元可用</div>
          </van-col>
          <van-col class="three" @click="userCoupon(item)">点击使用</van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/course.js'
import { Checkbox } from 'vant';

export default {
  name: 'couponList',
  props: {
    courseUUID: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    height: (window.innerHeight - 90) + "px",
    checked: false,
    couponList: []
  }),
  components: {
    "van-checkbox": Checkbox
  },
  methods: {
    initiaData: function(){
      if(this.courseUUID !== ''){
        var that = this;
        request.getCourseCoupons({uuid: this.courseUUID}).then((json) => {
          if(json.code == 200){
            that.couponList = json.data.results;

          }
        });
      }
    },
    closeWindows: function(){
      this.$emit('showCouponList', false);
      if(this.checked == true){
        this.$emit('clearCoupon');
      }
    },
    userCoupon: function(item){
      this.checked = false;
      this.$emit('userCoupon', item);
    }
  },
  mounted() {
    this.initiaData();
  }
}
</script>
<style lang="scss" scoped>
  .divCouponList{
    width: 100%; padding: 20px; box-sizing: border-box;
    padding-bottom: 0px;
  }
  .divCouponList .divTitle{
    display: flex; flex-direction: row; align-items: center;
    justify-content: space-between; margin-bottom: 10px;
  }
  .divCouponList .divTitle .divName{
    font-size: 18px; color: #333333; font-weight: bold;
  }
  .divCouponList .divTitle .imgClose{
    width: 28px;
  }
  .divCouponList .spanCheck{
    font-size: 14px; color: #333333; font-weight: 500;
  }
  .divCouponList .divList{
    margin-top: 10px; overflow-x: hidden; overflow-y: auto;
    width: 100%; box-sizing: border-box;
  }
  .divCouponList .divList .couponItem{
    background-color: #F7F7F7;
    box-sizing: border-box;
    height: 102px;
    margin-bottom: 12px;
    font-size: 12px;
    .one{
      width: 90px;
      margin: 35px 10px 0 0;
      text-align:center;
      .price{
        font-size: 26px;
      }
      .type-tips{
        margin-top: 10px;
      }
    }
    .two{
      width: calc(100% - 150px);
      margin: 20px 10px;
      line-height: 22px;
      color: #999999;
      .coupon-name{
        font-size: 18px;
        font-weight:bold;
        color:#000000;
        text-overflow:ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .three{
      width: 20px;
      margin: 10px;
      line-height: 20px;
      color: #F9626A;
      font-size: 14px;
      vertical-align: middle;
      font-weight: bold;
    }
  }
  .divCouponList .divList .bg1{
    background-image: url('~@/assets/images/coupon/1.png');
    background-repeat: no-repeat;
    background-size: contain;
    .type-tips{
      color: #767363;
    }
  }
  .divCouponList .divList .bg2{
    .one {
      color: #fff;
    }
    background-image: url('~@/assets/images/coupon/2.png');
    background-repeat: no-repeat;
    background-size: contain;
  }
  .divCouponList .divList .bg3{
    .one {
      color: #fff;
    }
    background-image: url('~@/assets/images/coupon/3.png');
    background-repeat: no-repeat;
    background-size: contain;
  }

  .divCouponList .divList .divDefInfo{
    display: flex; align-items: center;
    justify-content: center; flex-direction: column;
    margin-top: -30px;
  }
  .divCouponList .divList .divDefInfo .imgDefault{
    width: 160px;
  }
  .divCouponList .divList .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
