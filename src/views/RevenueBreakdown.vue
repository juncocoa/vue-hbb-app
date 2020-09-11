<template>
  <div class="page divRevenue" :style="{height: height}">
    <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
      <img src="@/assets/images/default/recording.png" class="imgDefault" style="margin-top: 0px;"/>
      <div class="divTip" style="margin-top: -10px;">没有数据</div>
    </div>
    <EasyRefresh
        v-if="list.length > 0"
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
        <div class="divContent" v-if="list.length > 0" >
          <div class="divItem" v-for="(item, index) in list" :key="index">
            <div class="divLeft">
              <div class="divName" v-if="item.course != null">{{item.course.name}}</div>
              <div class="divName" v-if="item.course == null">提现</div>
              <div class="divWechat">
                <van-image :src="item.avatar" lazy-load class="imgAvatar" fit="contain">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
                </van-image>
                <label>{{item.wechatName}}</label>
              </div>
            </div>
            <div class="divRight">
              <div :class="(item.billType == 1)?'divMoney':'divMoneyBlue'">{{((item.billType == 1)?'+':'-')}}{{item.money | formatMoney}}</div>
              <div class="divTimer">{{item.createTime | formatDateByFormat('yyyy.MM.dd')}}</div>
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
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/withdraw.js'

export default {
  name: 'revenueBreakdown',
  data: () => ({
    height: window.innerHeight + "px",
    list: [],
    total: 0,
    currentPage: 1,
  }),
  methods: {
    initiData: function(done){
      var that = this;
      request.getBillList().then((json) => {
        if(json.code == 200){
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; this.currentPage++;
        request.getBillList({page: this.currentPage}).then((json) => {
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
      this.initiData(done);
    }
  },
  mounted() {
    this.initiData();
  }
}
</script>
<style lang="scss" scoped>
  .divRevenue{
    background-color: #F7F7F7;
    overflow-x: hidden; overflow-y: auto;
  }
  .divRevenue .divContent{
    background-color: #FFF; box-sizing: border-box;
    padding-bottom: 10px; padding-left: 15px; padding-right: 15px;
    padding-top: 15px;
  }
  .divRevenue .divItem{
    display: flex; align-items: flex-start;
    border-bottom: 1px solid #F7F7F7; padding-bottom: 10px;
    margin-bottom: 13px;
  }
  .divRevenue .divItem:last-child{
    border-bottom: none; margin-bottom: 0px;
  }
  .divRevenue .divItem .divLeft{
    flex: 1;
  }
  .divRevenue .divItem .divLeft .divName{
    font-size: 18px; font-weight: bold; color: #333333;
    display: -webkit-box; -webkit-box-orient: vertical; max-height: 37px;
    -webkit-line-clamp: 2; overflow: hidden; padding-top: 1px;
  }
  .divRevenue .divItem .divLeft .divWechat{
    font-size: 16px; color: #333333; display: flex; align-items: center;
    margin-top: 8px;
  }
  .divRevenue .divItem .divLeft .divWechat .imgAvatar{
    border-radius: 50%; width: 36px; height: 36px; margin-right: 8px;
    overflow: hidden; min-width: 36px;
  }
  .divRevenue .divItem .divLeft .divWechat label{
    padding-top: 2px; display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divRevenue .divItem .divRight{
    text-align: right;
  }
  .divRevenue .divItem .divRight .divMoney{
    font-size: 16px; color: #FF6B88; font-weight: bold;
  }
  .divRevenue .divItem .divRight .divMoneyBlue{
    font-size: 16px; color: #2F8DFB; font-weight: bold;
  }
  .divRevenue .divItem .divRight .divTimer{
    font-size: 14px; color: #999999; margin-top: 5px;
  }
  .divRevenue .divDefInfo{
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
  }
  .divRevenue .divDefInfo .imgDefault{
    width: 160px;
  }
  .divRevenue .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
