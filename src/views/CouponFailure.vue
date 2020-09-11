<template>
  <div class="page couponFailure">
    <div v-if="couponList.length <= 0" class="divDefInfo" :style="{height: height}">
      <img src="@/assets/images/default/card.png" class="imgDefault"/>
      <div class="divTip">暂无优惠券</div>
    </div>
    <EasyRefresh
        v-if="couponList.length > 0"
        :userSelect="false"
        :loadMore="loadMoreFn">
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
        <div style="padding-bottom: 15px;">
          <div class="couponItem bg0" v-for='(item,index) in couponList' :key='index'>
            <van-row type="flex">
              <van-col class="one">
                <div>￥<span class="price">{{item.coupon.money | formatMoneyByDollar}}<span style="font-size: 12px;">{{item.coupon.money | formatMoneyByDollar2}}</span></span></div>
                <div class="type-tips">已过期</div>
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
              <van-col class="three">已失效</van-col>
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
</template>

<script>
import { Row, Col, Toast } from 'vant';
import * as request from '../service/coupons'

export default {
  name: 'couponFailure',
  data: () => ({
    height: (window.innerHeight - 58) + 'px',
    couponList: [],
    couponTotal: 0,
    couponCurrentPage: 1,
  }),
  methods: {
    initiData: function (done) {
      var that = this;
      request.getUserCoupons({type: 'overdue'}).then((json)=>{
        if(json.code == 200){
          that.couponList = json.data.results;
          that.couponTotal = json.data.count;
          that.couponCurrentPage = 1;
          if(done != undefined){ done(); }
        }
      })
    },
    loadMoreFn: function (done) {
      if(this.couponList.length < this.couponTotal){
        var that = this; this.couponCurrentPage++;
        request.getUserCoupons({type: 'overdue', page: this.couponCurrentPage}).then((json) => {
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
  },
  mounted() {
    this.initiData();
  }
}
</script>
<style lang="scss">
  .couponFailure{
    overflow-x: hidden;
    background-color: #F7F7F7;
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
          color: #999999;
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
        margin: 18px 10px;
        line-height: 20px;
        color: #999;
        font-size: 14px;
        vertical-align: middle;
        font-weight: bold;
      }
    }
    .bg0{
      background: url('~@/assets/images/coupon/couponbg0.png') no-repeat;
      background-size: contain;
    }
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
