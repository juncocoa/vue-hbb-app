<template>
  <div class="page divStudy">
    <van-tabs line-width="33" line-height="3" color="#FF6B88" title-active-color="#FF6B88" title-inactive-color="#333333" @change="tabChange">
      <van-tab title="最近学习" style="overflow-x: hidden">
        <div class="divItems" :style="{height: height}">
          <div v-if="behaviorList.length <= 0" class="divDefInfo" :style="{height: height}">
            <img src="@/assets/images/default/recording.png" class="imgDefault"/>
            <div class="divTip">暂时没有课程哦</div>
          </div>
          <EasyRefresh
              v-if="behaviorList.length > 0"
              ref="behavior"
              :userSelect="false"

              :loadMore="loadMoreBehavior"
              :onRefresh="onRefreshBehavior">
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
                <div class="divItem" @click="gotoCourse(item.uuid)" v-for="(item, index) in behaviorList" :key="'behavior_' + index">
                  <div class="divCourse">
                    <van-image :src="item.icon" lazy-load class="imgItem">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                    </van-image>
                  </div>
                  <div class="divContent">
                    <div class="divTop">
                      <div class="divTitle1">
                        <div class="divPeriod" v-if="item.courseType == 2">系</div>
                        <div v-if="item.courseType == 1 && item.chapterStyle == 1" class="divPeriod divLive">直</div>
                        <img src="@/assets/images/home/music.png" v-if="item.courseType == 1 && item.chapterStyle == 2" class="imgIcon"/>
                        <img src="@/assets/images/home/play.png" v-if="item.courseType == 1 && item.chapterStyle == 3" class="imgIcon"/>
                        {{item.name}}
                      </div>
                    </div>
                    <div class="divDesc" v-if="item.expert != null">{{item.expert.name}} {{item.expert.hospital}}</div>
                    <div class="divDesc" v-if="item.expert == null">暂无</div>
                    <div class="divBottom1" v-if="item.courseType == 2 || item.chapterStyle != 1">
                      <van-progress :show-pivot="false" style="flex: 1; margin-right:5px;" stroke-width="8" color="#2F8DFB" :percentage="(item.percentage)?item.percentage:0"/>
                      <div class="divPercentage">已学习{{(item.percentage)?item.percentage:0}}%</div>
                    </div>
                    <div class="divBottom1" v-if="item.courseType == 1 && item.chapterStyle == 1">
                      <div class="divPercentage">直播课无学习进度。</div>
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
      </van-tab>
      <van-tab title="已购课程" style="overflow-x: hidden">
        <div class="divItems" :style="{height: height}">
          <div v-if="purchasedList.length <= 0" class="divDefInfo" :style="{height: height}">
            <img src="@/assets/images/default/recording.png" class="imgDefault"/>
            <div class="divTip">暂时没有课程哦</div>
          </div>
          <EasyRefresh
              v-if="purchasedList.length > 0"
              ref="purchased"
              :userSelect="false"
              :loadMore="loadMorePurchased"
              :onRefresh="onRefreshPurchased">
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
                <div class="divItem" @click="gotoCourse(item.uuid)" v-for="(item, index) in purchasedList" :key="'purchased_' + index">
                  <div class="divCourse">
                    <van-image :src="item.icon" lazy-load class="imgItem">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                    </van-image>
                  </div>
                  <div class="divContent">
                    <div class="divTop" style="margin-bottom: 20px;">
                      <div class="divTitle1">
                        <div class="divPeriod" v-if="item.courseType == 2">系</div>
                        <div v-if="item.courseType == 1 && item.chapterStyle == 1" class="divPeriod divLive">直</div>
                        <img src="@/assets/images/home/music.png" v-if="item.courseType == 1 && item.chapterStyle == 2" class="imgIcon"/>
                        <img src="@/assets/images/home/play.png" v-if="item.courseType == 1 && item.chapterStyle == 3" class="imgIcon"/>
                        {{item.name}}
                      </div>
                    </div>
                    <div class="divDesc1" v-if="item.expert != null">{{item.expert.name}} {{item.expert.hospital}}</div>
                    <div class="divDesc1" v-if="item.expert == null">暂无</div>
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
      </van-tab>
      <van-tab title="猜你喜欢" style="overflow-x: hidden;">
        <div class="divItems" :style="{height: height}">
          <div v-if="mayLikeList.length <= 0" class="divDefInfo" :style="{height: height}">
            <img src="@/assets/images/default/recording.png" class="imgDefault"/>
            <div class="divTip">暂时没有课程哦</div>
          </div>
          <EasyRefresh
              v-if="mayLikeList.length > 0"
              ref="mayLike"
              :userSelect="false"
              :loadMore="loadMore"
              :onRefresh="onRefresh">
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
                <div class="divItem" @click="gotoCourse(item.uuid)" v-for="(item, index) in mayLikeList" :key="'mayLike_' + index">
                  <div class="divCourse">
                    <van-image :src="item.icon" lazy-load class="imgItem">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                    </van-image>
                  </div>
                  <div class="divContent">
                    <div class="divTop">
                      <div class="divTitle1">
                        <div class="divPeriod" v-if="item.courseType == 2">系</div>
                        <div v-if="item.courseType == 1 && item.chapterStyle == 1" class="divPeriod divLive">直</div>
                        <img src="@/assets/images/home/music.png" v-if="item.courseType == 1 && item.chapterStyle == 2" class="imgIcon"/>
                        <img src="@/assets/images/home/play.png" v-if="item.courseType == 1 && item.chapterStyle == 3" class="imgIcon"/>
                        {{item.name}}
                      </div>
                    </div>
                    <div class="divDesc" v-if="item.expert != null">{{item.expert.name}} {{item.expert.hospital}}</div>
                    <div class="divDesc" v-if="item.expert == null">暂无</div>
                    <div class="divBottom">
                      <div class="divPrice" v-if="item.coursePermission == 1">免费</div>
                      <div class="divPrice" v-if="item.coursePermission != 1">¥{{item.realPrice | formatMoney}}</div>
                      <div class="divOldPrice" v-if="item.coursePermission != 1 && item.originalPrice > 0">{{item.originalPrice | formatMoney}}</div>
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
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/study.js'

export default {
  name: 'study',
  data: () => ({
    height: (window.innerHeight-99) + "px",
    mayLikeList: [],
    mayLikeTotal: 0, currentPageMayLike: 1,

    behaviorList: [],
    behaviorTotal: 0, currentPageBehavior: 1,

    purchasedList: [],
    purchasedTotal: 0, currentPagePurchased: 1,
  }),
  methods: {
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    getBehavior: function (done) {
      var that = this;
      request.getBehavior({type: 3}).then((json) => {
        if(json.code == 200){
          that.behaviorTotal = json.data.count;
          that.behaviorList = json.data.results;
          that.currentPageBehavior = 1;
          if(done != undefined){done();}
        }
      });
    },
    getPurchasedBehavior: function (done) {
      var that = this;
      request.getPurchasedBehavior({type: 5}).then((json) => {
        if(json.code == 200){
          that.purchasedTotal = json.data.count;
          that.purchasedList = json.data.results;
          that.currentPagePurchased = 1;
          if(done != undefined){done();}
        }
      });
    },
    getMayLike: function(done){
      var that = this;
      request.getMayLike().then((json) => {
        if(json.code == 200){
          that.mayLikeTotal = json.data.count;
          that.mayLikeList = json.data.results;
          that.currentPageMayLike = 1;
          if(done != undefined){done();}
        }
      });
    },
    tabChange: function(id, title){
      if(id == 0){
        this.getBehavior();
      }else if(id == 1){
        this.getPurchasedBehavior();
      }else if(id == 2){
        this.getMayLike();
      }
    },
    // done(false) //还有数据
    // done(true) //没有数据
    onRefresh: function (done) {
      this.getMayLike(done);
    },
    loadMore: function (done) {
      if(this.mayLikeList.length < this.mayLikeTotal){
        var that = this; that.currentPageMayLike++;
        request.getMayLike(that.currentPageMayLike).then((json) => {
          if(json.code == 200){
            that.mayLikeTotal = json.data.count;
            json.data.results.map((item, index)=>{
              that.mayLikeList.push(item);
            });
            done(false);
          }
        });
      }else {
        Toast('没有数据'); done(false);
      }
    },
    onRefreshBehavior: function (done) {
      this.getBehavior(done);
    },
    loadMoreBehavior: function (done) {
      if(this.behaviorList.length < this.behaviorTotal){
        var that = this; that.currentPageBehavior++;
        request.getBehavior({type: 3}, that.currentPageBehavior).then((json) => {
          if(json.code == 200){
            that.behaviorTotal = json.data.count;
            json.data.results.map((item, index)=>{
              that.behaviorList.push(item);
            });
            done(false);
          }
        });
      }else {
        Toast('没有数据'); done(false);
      }
    },
    loadMorePurchased: function (done) {
      if(this.purchasedList.length < this.purchasedTotal){
        var that = this; that.currentPagePurchased++;
        request.getPurchasedBehavior({type: 5}, that.currentPagePurchased).then((json) => {
          if(json.code == 200){
            that.purchasedTotal = json.data.count;
            json.data.results.map((item, index)=>{
              that.purchasedList.push(item);
            });
            done(false);
          }
        });
      }else {
        Toast('没有数据'); done(false);
      }
    },
    onRefreshPurchased: function (done) {
      this.getPurchasedBehavior(done);
    }
  },
  mounted() {
    this.getMayLike();
    this.getBehavior();
    this.getPurchasedBehavior();
  }
}
</script>
<style lang="scss" scoped>
  .divStudy .divItems{
    background-color: #F7F7F7; overflow-y: auto;
    height: 600px;
  }
  .divStudy .divItems .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-left: 15px;
    margin-right: 15px; margin-top: 10px;
  }
  .divStudy .divItems .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divStudy .divItems .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divStudy .divItems .divItem .divContent{
    flex: 1;
  }
  .divStudy .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divStudy .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    flex: 1; width: 120px; height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divStudy .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
    background:linear-gradient(137deg,rgba(73,205,172,1) 0%,rgba(3,207,149,1) 100%);
    border-radius:6px;
    width: 22px;
    font-size: 12px;
    color: #FFF;
    display: inline-block;
    text-align: center;
    padding-top: 5px; padding-bottom: 3px;
    padding-left: 0px;
    padding-right: 0px;
    vertical-align: middle;
    margin-top: -4px;
  }
  .divStudy .divItems .divItem .divContent .divTop .divTitle1 .divLive{
    background:linear-gradient(137deg, #3a37fa 0%, #00a375 100%);
  }
  .divStudy .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divStudy .divItems .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 5px;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divStudy .divItems .divItem .divContent .divDesc1{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 10px;
    line-height: 18px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .divStudy .divItems .divItem .divContent .divBottom1{
    flex: 1; display: flex; align-items: center;
    margin-top: 6px;
  }
  .divStudy .divItems .divItem .divContent .divBottom1 .divPercentage{
    font-size: 12px; color: #2F8DFB; margin-top: 1px;
  }
  .divStudy .divItems .divItem .divContent .divBottom{
    margin-top: 8px;
    display: flex;
    align-items: flex-end;
  }
  .divStudy .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divStudy .divItems .divItem .divContent .divBottom .divOldPrice{
    font-size: 13px;
    color: #999999; margin-left: 5px;
    text-decoration: line-through;
  }
  .divStudy .divDefInfo{
    margin-top: -10px;
    display: flex; align-items: center;
    justify-content: center; flex-direction: column;
  }
  .divStudy .divDefInfo .imgDefault{
    width: 120px; margin-bottom: 10px;
  }
  .divStudy .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
