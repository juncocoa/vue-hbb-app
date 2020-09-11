<template>
  <div class="page couponCenter">
    <van-tabs>
      <van-tab title="可领优惠券">
        <div v-if="couponList.length <= 0" class="divDefInfo" :style="{height: height}">
          <img src="@/assets/images/default/card.png" class="imgDefault"/>
          <div class="divTip">暂无优惠券</div>
        </div>
        <div :style="{width: '100%', height: height}">
          <EasyRefresh
              v-if="couponList.length > 0"
              :userSelect="false"
              :loadMore="loadMoreCouponFn"
              :onRefresh="onRefreshCouponFn">
              <template v-slot:header>
                  <ClassicsHeader
                      refreshText="下拉刷新"
                      refreshReadyText="释放刷新"
                      refreshingText="正在刷新"
                      refreshedText="刷新完成"
                      moreInfo="更新于 %T"
                      :showMore="true"/>
              </template>
              <template v-slot:scrollbar>
                  <ClassicsScrollBar
                      color="rgba(0, 0, 0, 0.3)"
                      bgColor="transparent"
                      width="3" radius="2"/>
              </template>
              <div style="padding-bottom: 25px;">
                <div class="couponItem" :class="'bg'+ item.couponType" v-for='(item, index) in couponList' :key="'coupon_' + index">
                  <van-row type="flex">
                    <van-col class="one">
                      <div>￥<span class="price">{{item.money | formatMoneyByDollar}}<span style="font-size: 12px;">{{item.money | formatMoneyByDollar2}}</span></span></div>
                      <div class="type-tips">{{item.couponType | couponType}}</div>
                    </van-col>
                    <van-col class="two">
                      <div class="coupon-name">{{item.name}}</div>
                      <div>{{item.endTime | formatDateByFormat('yyyy-MM-dd')}} 到期</div>
                      <div v-if="item.couponType == 1">原价 ¥{{item.price | formatMoney}}</div>
                      <div v-if="item.couponType == 2">
                        <div class="divScope">仅限于使用 {{item.scope}}</div>
                        <div>满 {{item.accountMoney | formatMoney}} 元可用</div>
                      </div>
                      <div v-if="item.couponType == 3">满 {{item.accountMoney | formatMoney}} 元可用</div>
                    </van-col>
                    <van-col class="three" @click="receiveCoupon(item.uuid)">领取使用</van-col>
                  </van-row>
                </div>
              </div>
              <template v-slot:footer>
                  <ClassicsFooter
                      loadText="上拉加载"
                      loadReadyText="释放加载"
                      loadingText="正在加载"
                      noMoreText="没有更多数据"
                      loadedText="加载完成"
                      moreInfo="更新于 %T"
                      showMore="true"/>
              </template>
          </EasyRefresh>
        </div>
      </van-tab>
      <van-tab title="我的优惠券" class="mine">
        <div v-if="dueList.length <= 0" class="divDefInfo" :style="{height: height}">
          <img src="@/assets/images/default/card.png" class="imgDefault"/>
          <div class="divTip">暂无优惠券</div>
        </div>
        <div :style="{width: '100%', height: dueHeight}">
          <EasyRefresh
              v-if="couponList.length > 0"
              :userSelect="false"
              :loadMore="loadMoreDueFn"
              :onRefresh="onRefreshDueFn">
              <template v-slot:header>
                  <ClassicsHeader
                      refreshText="下拉刷新"
                      refreshReadyText="释放刷新"
                      refreshingText="正在刷新"
                      refreshedText="刷新完成"
                      moreInfo="更新于 %T"
                      :showMore="true"/>
              </template>
              <template v-slot:scrollbar>
                  <ClassicsScrollBar
                      color="rgba(0, 0, 0, 0.3)"
                      bgColor="transparent"
                      width="3" radius="2"/>
              </template>
              <div style="padding-bottom: 20px;">
                <div class="couponItem" :class="'bg'+ item.coupon.couponType" v-for='(item, index) in dueList' :key="'due_' + index">
                  <van-row type="flex">
                    <van-col class="one">
                      <div>￥<span class="price">{{item.coupon.money | formatMoneyByDollar}}<span style="font-size: 12px;">{{item.coupon.money | formatMoneyByDollar2}}</span></span></div>
                      <div class="type-tips">{{item.coupon.couponType | couponType}}</div>
                    </van-col>
                    <van-col class="two">
                      <div class="coupon-name">{{item.coupon.name}}</div>
                      <div>{{item.coupon.endTime | formatDate}} 到期</div>
                      <div v-if="item.coupon.couponType == 1">原价 ¥{{item.coupon.price | formatMoney}}</div>
                      <div v-if="item.coupon.couponType == 2">
                        <div class="divScope">仅限于使用 {{item.coupon.scope}}</div>
                        <div>满 {{item.coupon.accountMoney | formatMoney}} 元可用</div>
                      </div>
                      <div v-if="item.coupon.couponType == 3">满 {{item.coupon.accountMoney | formatMoney}} 元可用</div>
                    </van-col>
                    <van-col class="three" @click="btnUseNow(item.uuid, item.target, item.coupon.couponType)">立即使用</van-col>
                  </van-row>
                </div>
              </div>
              <template v-slot:footer>
                  <ClassicsFooter
                      loadText="上拉加载"
                      loadReadyText="释放加载"
                      loadingText="正在加载"
                      noMoreText="没有更多数据"
                      loadedText="加载完成"
                      moreInfo="更新于 %T"
                      showMore="true"/>
              </template>
          </EasyRefresh>
        </div>
        <div class="nomore">
          <span>无更多优惠券 | </span>
          <router-link class="go-link" to='/couponFailure'>查看已失效&gt;&gt;</router-link>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/coupons'

export default {
  name: 'couponCenter',
  data: () => ({
    height: (window.innerHeight - 46) + 'px',
    dueHeight: (window.innerHeight - 106) + 'px',
    couponList: [],
    couponTotal: 0,
    couponCurrentPage: 1,
    dueList: [],
    dueTotal: 0,
    dueCurrentPage: 1,
  }),
  methods: {
    getCoupons: function(done){
      var that = this;
      request.getCoupons().then((json)=>{
        if(json.code == 200){
          that.couponList = json.data.results;
          that.couponTotal = json.data.count;
          that.couponCurrentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    getUserCoupons: function(done){
      var that = this;
      request.getUserCoupons({type: 'due'}).then((json)=>{
        if(json.code == 200){
          that.dueList = json.data.results;
          that.dueTotal = json.data.count;
          that.dueCurrentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    receiveCoupon: function(uuid){
      var that = this;
      request.postUserCoupons({couponsUuid: uuid}).then((json)=>{
        if(json.code == 200){
          Toast('优惠券领取成功。');
          that.getCoupons(); that.getUserCoupons();
        }
      });
    },
    btnUseNow(uuid, target, couponType){
      if(couponType == 1){
        if(target != null){
          this.$router.push('/course/' + target);
        }
      }else {
        this.$router.push('/couponList/' + uuid);
      }
    },
    loadMoreCouponFn: function (done) {
      if(this.couponList.length < this.couponTotal){
        var that = this; this.couponCurrentPage++;
        request.getCoupons({page: this.couponCurrentPage}).then((json) => {
          if(json.code == 200){
            that.couponTotal = json.data.count;
            json.data.results.map((item, index)=>{
              that.couponList.push(item);
            });
            done(false);
          }
        });
      }else {
        Toast('没有数据'); done(false);
      }
    },
    onRefreshCouponFn: function (done) {
      this.getCoupons(done);
    },
    loadMoreDueFn: function (done) {
      if(this.dueList.length < this.dueTotal){
        var that = this; this.dueCurrentPage++;
        request.getUserCoupons({type: 'due', page: this.dueCurrentPage}).then((json) => {
          if(json.code == 200){
            that.dueTotal = json.data.count;
            json.data.results.map((item, index)=>{
              that.dueList.push(item);
            });
            done(false);
          }
        });
      }else {
        Toast('没有数据'); done(false);
      }
    },
    onRefreshDueFn: function (done) {
      this.getUserCoupons(done);
    }
  },
  mounted() {
    this.getCoupons(); this.getUserCoupons();
  }
}
</script>
<style lang="scss">
  .couponCenter{
    overflow-x: hidden;
    background-color: #F7F7F7;
    .van-tabs__nav{
      width: 100%;
      height: 29px;
      position: fixed;
      top:0;
      left: 0;
    }
    .van-tabs__content{
      padding-bottom: 70px!important;
    }
    .van-tab span{
      color: #999 !important;
      font-size:15px;
    }
    .van-tabs .van-tab--active .van-ellipsis{
      color:#F9626A !important;

    }
    .van-tabs__line{
      width: 30px!important;
      background-color: #F9626A;
      border-radius: 10px!important;
      bottom: 0!important;
    }
    .couponItem{
      width: calc(100% - 40px);
      height: 102px;
      margin: 10px 20px 0;
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
    .bg1{
      background: url('~@/assets/images/coupon/couponbg1.png') no-repeat;
      background-size: contain;
      .type-tips{
        color: #767363;
      }
    }
    .bg2{
      .one {
        color: #fff;
      }
      background: url('~@/assets/images/coupon/couponbg2.png') no-repeat;
      background-size: contain;
    }
    .bg3{
      .one {
        color: #fff;
      }
      background: url('~@/assets/images/coupon/couponbg3.png') no-repeat;
      background-size: contain;
    }
    .nomore{
      width: 100%;
      height: 20px;
      line-height: 20px;
      padding: 20px;
      font-size: 12px;
      color: #999999;
      background: #F7F7F7;
      text-align: center;
      position: fixed;
      bottom: 0px;
      left: 0;
      .go-link{
        color: #2F8DFB;
      }
    }
  }
  .divScope{
    line-height: 12px;
    margin-top: 3px;
  }
  .divDefInfo{
    display: flex; align-items: center;
    justify-content: center; flex-direction: column;
    margin-top: -30px;
  }
  .divDefInfo .imgDefault{
    width: 160px;
  }
  .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
