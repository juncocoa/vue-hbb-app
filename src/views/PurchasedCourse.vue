<template>
  <div class="page divPurchased" :style="{height: height}">
    <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
      <img src="@/assets/images/default/recording.png" class="imgDefault" style="margin-top: 0px;"/>
      <div class="divTip" style="margin-top: -10px;">没有购买课程</div>
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
        <div class="divItems" v-if="list.length > 0">
          <div class="divItem" @click="gotoCourse(item.course.uuid)" v-for="(item, index) in list" :key="index">
            <div class="divHead">
              <div class="divStatus">购买成功</div>
              <div class="divTimer">{{item.createTime | formatDateByFormat('yyyy-MM-dd hh:mm:ss')}}</div>
            </div>
            <div class="divContext">
              <div class="divCourse">
                <img :src="item.course.icon" class="imgItem"/>
              </div>
              <div class="divContent" style="flex: 1;">
                <div class="divTop">
                  <div class="divTitle1">
                    <div class="divPeriod" v-if="item.course.courseType == 2">系</div>
                    <img :src="((item.course.chapterStyle == 2)?require('@/assets/images/home/music.png'):require('@/assets/images/home/play.png'))" v-if="item.course.courseType == 1" class="imgIcon"/>
                    {{item.course.name}}
                  </div>
                </div>
                <div class="divDesc">{{item.course.expert.name}} {{item.course.expert.hospital}}</div>
                <div class="divBottom">
                  <div class="divPrice" v-if="item.course.coursePermission == 1">免费</div>
                  <div class="divPrice" v-if="item.course.coursePermission != 1">¥{{item.course.realPrice | formatMoney}}</div>
                </div>
              </div>
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
import * as request from '../service/study'

export default {
  name: 'purchasedCourse',
  data: () => ({
    height: window.innerHeight + "px",
    list: [],
    total: 0,
    currentPage: 1,
  }),
  methods: {
    initiData: function (done) {
      var that = this;
      request.getBuyCourses().then((json) => {
        if(json.code == 200){
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    gotoCourse: function(uuid){
      this.$router.push('/course/' + uuid);
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; that.currentPage++;
        request.getBuyCourses({page: that.currentPage}).then((json) => {
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
  .divPurchased{
    background-color: #F5F5F5;
  }
  .divPurchased .divItems{
    padding-bottom: 15px;
  }
  .divPurchased .divItems .divItem{
    background-color: #FFF;
    display: flex; flex-direction: column;
    padding: 10px; padding-bottom: 5px;
    padding-left: 15px; padding-right: 15px;
    margin-bottom: 10px;
  }
  .divPurchased .divItems .divItem .divHead{
    border-bottom: 1px solid #F7F7F7; display: flex; flex-direction: row;
    align-items: center; justify-content: space-between;
    margin-bottom: 10px; padding-bottom: 6px;
  }
  .divPurchased .divItems .divItem .divHead .divStatus{
    font-size: 16px; color: #FF6B88; font-weight: bold;
  }
  .divPurchased .divItems .divItem .divHead .divTimer{
    font-size: 13px; color: #999999;
  }
  .divPurchased .divItems .divItem .divContext{
    display: flex;
  }
  .divPurchased .divItems .divItem .divCourse{
    width: 120px;
    position: relative;
    margin-right: 5px;
    height: 90px;
  }
  .divPurchased .divItems .divItem .divCourse .imgItem{
    border-radius: 5px;
    width: 120px;
    height: 85px;
  }
  .divPurchased .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divPurchased .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 16px;
    font-weight: 600;
    flex: 1; width: 120px; height: 35px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divPurchased .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
    background:linear-gradient(137deg,rgba(73,205,172,1) 0%,rgba(3,207,149,1) 100%);
    border-radius:6px;
    width: 22px;
    font-size: 12px;
    color: #FFF;
    display: inline-block;
    text-align: center;
    padding: 4px;
    padding-left: 1px;
    padding-right: 0px;
    vertical-align: middle;
    margin-top: -4px;
  }
  .divPurchased .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divPurchased .divItems .divItem .divContent .divDesc{
    font-size: 13px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divPurchased .divItems .divItem .divContent .divBottom{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divPurchased .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 14px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divPurchased .divDefInfo{
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .divPurchased .divDefInfo .imgDefault{
    width: 160px; margin-top: -20px;
  }
  .divPurchased .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px; padding-bottom: 20px;
  }
</style>
