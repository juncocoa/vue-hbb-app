<template>
  <div class="page divPromotionCenter">
    <div class="divTab">
      <div :class="(type == 1)?'divCourse':'divCourseDisabled'" @click="switchTab(1)">课程列表</div>
      <div :class="(type == 2)?'divCourse':'divCourseDisabled'" @click="switchTab(2)">优惠券</div>
    </div>
    <div :style="{height: height}" v-show="type == 1">
      <EasyRefresh
          :userSelect="false"
          :loadMore="loadMoreFn"
          :onRefresh="onRefreshFn">
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
          <div class="divItems">
            <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
              <img src="@/assets/images/default/recording.png" class="imgDefault" style="margin-top: 0px;"/>
              <div class="divTip" style="margin-top: -10px;">没有课程</div>
            </div>
            <div class="divItem" @click="gotoCourse(item.uuid)" v-for="(item, index) in list" :key="'item_' + index">
              <div class="divCourse">
                <img :src="item.icon" class="imgItem"/>
              </div>
              <div class="divContent" style="flex: 1;">
                <div class="divTop">
                  <div class="divTitle1">
                    <img src="@/assets/images/home/distribution.png" class="imgIcon"/>
                    {{item.name}}
                  </div>
                </div>
                <div class="divDesc">{{item.expert.name}} {{item.expert.hospital}}</div>
                <div class="divBottom">
                  <div class="divPrice" v-if="item.coursePermission == 1">免费</div>
                  <div class="divPrice" v-if="item.coursePermission != 1">¥{{item.realPrice | formatMoney}}</div>
                  <div class="divOriginalPrice" v-if="item.coursePermission != 1">¥{{item.originalPrice | formatMoney}}</div>
                </div>
                <div class="divSuccess">推荐成功得 {{item.share}} 元</div>
                <img src="@/assets/images/course/listShare.png" class="imgListShare" @click="imgListShare(item.uuid, $event)"/>
              </div>
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
    <div :style="{height: height}" v-show="type == 2">
      <EasyRefresh
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
          <div class="divCoupon">
            <div v-if="couponList.length <= 0" class="divDefInfo" :style="{height: height}">
              <img src="@/assets/images/default/card.png" class="imgDefault" style="margin-top: 0px;"/>
              <div class="divTip" style="margin-top: -10px;">没有优惠券</div>
            </div>
            <div class="couponItem bg1"  v-for='(item, index) in couponList' :key="'coupon_' + index">
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
    <vue-html2canvas v-if="showHtml2Canvas" :courseUUID="courseUUID" @closeShare="closeShare"/>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/promote.js'
import screenCapture from '../components/screenCapture.vue';

export default {
  name: 'promotionCenter',
  data: () => ({
    couponList: [],
    couponTotal: 0,
    couponCurrentPage: 1,
    height: (window.innerHeight - 48) + "px",
    list: [],
    total: 0,
    currentPage: 1,
    type: 1, //1:课程列表、2:优惠券
    courseUUID: '',
    showHtml2Canvas: false
  }),
  components: {
    "vue-html2canvas": screenCapture
  },
  methods: {
    imgListShare(uuid, event){
      event.stopPropagation(); event.preventDefault();
      this.courseUUID = uuid; this.showHtml2Canvas = true;
    },
    closeShare: function(){
      this.showHtml2Canvas = false;
    },
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    switchTab: function(type){
      this.type = type;
    },
    getPromote: function(done){
      var that = this;
      request.getPromote().then((json)=>{
        if(json.code == 200){
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    getPromoteCoupons: function(done){
      var that = this;
      request.getPromoteCoupons().then((json)=>{
        if(json.code == 200){
          that.couponList = json.data.results;
          that.couponTotal = json.data.count;
          that.couponCurrentPage = 1;
          if(done != undefined){ done(); }
        }
      })
    },
    receiveCoupon: function(uuid){
      var that = this;
      request.postUserCoupons({couponsUuid: uuid}).then((json)=>{
        if(json.code == 200){
          Toast(json.msg); that.getPromoteCoupons();
        }
      });
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; this.currentPage++;
        request.getPromote({page: this.currentPage}).then((json) => {
          if(json.code == 200){
            that.total = json.data.count;
            json.data.results.map((item, index)=>{
              that.list.push(item);
            });
            done(false);
          }
        });
      }else {
        Toast('没有数据'); done(false);
      }
    },
    onRefreshFn: function (done) {
      this.getPromote(done);
    },
    loadMoreCouponFn: function (done) {
      if(this.couponList.length < this.couponTotal){
        var that = this; this.couponCurrentPage++;
        request.getPromoteCoupons({page: this.couponCurrentPage}).then((json) => {
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
      this.getPromoteCoupons(done);
    },
  },
  mounted() {
    this.getPromote();
    this.getPromoteCoupons();
  }
}
</script>
<style lang="scss" scoped>
  .divPromotionCenter{
    background-color: #F7F7F7;
  }
  .divTab{
    width: 93%; margin-left: auto; margin-right: auto;
    display: flex; margin-top: 15px; margin-bottom: 15px;
    align-items: center;
  }
  .divTab div:first-child{
    margin-right: 15px;
  }
  .divTab .divCourse{
    font-size: 16px; color: #333333; font-weight: bold;
  }
  .divTab .divCourseDisabled{
    font-size: 14px; color: #999999; font-weight: 500;
  }
  .divCoupon{
    padding-bottom: 10px;
  }
  .divItems{
    padding-bottom: 10px;
  }
  .divItems .divItem{
    background-color: #FFF;
    border-radius: 6px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-bottom: 10px;
    margin-left: 15px;
    margin-right: 15px;
    box-shadow: 0px 0px 5px 0px rgba(255,233,240,0.5);
  }
  .divItems .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divItems .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
  }
  .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 14px;
    font-weight: 600;
    flex: 1; width: 120px; height: 31px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 18px; height: 14px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divItems .divItem .divContent .divDesc{
    font-size: 13px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 5px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divItems .divItem .divContent .divBottom{
    margin-top: 5px;
    display: flex;
    align-items: center;
  }
  .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 13px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divItems .divItem .divContent .divBottom .divOriginalPrice{
    font-size: 11px;
    color: #999999;
    margin-left: 3px;
    text-decoration: line-through;
  }
  .divItems .divItem .divContent .divSuccess{
    font-size: 13px; color: #FFCC33; margin-top: 4px;
  }
  .divItems .divItem .divContent .imgListShare{
    width: 30px; float: right; margin-top: -30px;
    box-shadow: 0 0 7px #fba2b5; border-radius: 50%;
    background-color: #ff98ad;
  }
  .bg1{
    background: url('~@/assets/images/coupon/couponbg1.png') no-repeat;
    background-size: contain;
    .type-tips{
      color: #767363;
    }
  }
  .couponItem{
    width: calc(100% - 40px);
    height: 102px;
    margin: 0px 20px 10px;
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
  .divPromotionCenter .divDefInfo{
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
  }
  .divPromotionCenter .divDefInfo .imgDefault{
    width: 160px;
  }
  .divPromotionCenter .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
