<template>
  <div class="page divMyRoom">
    <van-tabs line-width="33" line-height="3" color="#FF6B88" title-active-color="#FF6B88" title-inactive-color="#333333">
      <van-tab title="单次课">
        <div class="divResults" :style="{height: height}">
          <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
            <img src="@/assets/images/default/favorites.png" class="imgDefault" style="margin-top: 0px;"/>
            <div class="divTip" style="margin-top: -10px;">没有单次课</div>
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
              <div class="divItems" >
                <div class="divItem" @click="gotoCourse(item.uuid, 'SingleClass')" v-for="(item, index) in list" :key="item.uuid">
                  <div class="divCourse">
                    <van-image :src="item.icon" lazy-load :class="(item.courseType == 1 && item.chapterStyle == 1 && item.endTime == null)?'imgItem1':'imgItem'">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                    </van-image>
                    <div class="divRadius" v-if="item.courseType == 1 && item.chapterStyle == 1 && item.endTime == null">
                      <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                      <label class="lblTimer">{{item.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(item.endTime == null)?"": "-" + new Date(item.endTime).Format('hh:mm')}}</label>
                    </div>
                  </div>
                  <div class="divContent" style="flex: 1;">
                    <div class="divTop">
                      <div class="divTitle1">
                        <div class="divLive">直</div>
                        {{item.name}}
                      </div>
                    </div>
                    <div class="divDesc">{{item.expert.name}} {{item.expert.hospital}}</div>
                    <div class="divBottom">
                      <div class="divStarted" v-if="item.isStart == true">已开课</div>
                      <div class="divEnd" v-if="item.isStart == false">未开课</div>
                      <div class="divStart">
                        <img src="@/assets/images/home/fire.png" class="imgStart"/>
                        {{item.vPopularity}} 人报名
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
      </van-tab>
      <van-tab title="系列课">
        <div class="divResults" :style="{height: height}">
          <div v-if="liveList.length <= 0" class="divDefInfo" :style="{height: height}">
            <img src="@/assets/images/default/favorites.png" class="imgDefault" style="margin-top: 0px;"/>
            <div class="divTip" style="margin-top: -10px;">没有系列课</div>
          </div>
          <EasyRefresh
              v-if="liveList.length > 0"
              :userSelect="false"
              :loadMore="loadMoreLiveFn"
              :onRefresh="onRefreshLiveFn">
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
              <div class="divItems" >
                <div class="divItem" @click="gotoCourse(item.uuid, 'SeriesClass')" v-for="(item, index) in liveList" :key="'live_' + item.uuid">
                  <div class="divCourse">
                    <van-image :src="item.icon" lazy-load :class="(item.courseType == 2 && item.chapterStyle == 1 && item.endTime == null)?'imgItem1':'imgItem'">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                    </van-image>
                    <div class="divRadius" v-if="item.courseType == 2 && item.chapterStyle == 1 && item.endTime == null">
                      <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                      <label class="lblTimer">{{item.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(item.endTime == null)?"": "-" + new Date(item.endTime).Format('hh:mm')}}</label>
                    </div>
                  </div>
                  <div class="divContent" style="flex: 1;">
                    <div class="divTop">
                      <div class="divTitle1">
                        <div class="divLive">直</div>
                        {{item.name}}
                      </div>
                    </div>
                    <div class="divDesc">{{item.expert.name}} {{item.expert.hospital}}</div>
                    <div class="divBottom">
                      <div class="divCount">更新至{{item.chapterCount}}节</div>
                      <div class="divStart">
                        <img src="@/assets/images/home/fire.png" class="imgStart"/>
                        {{item.vPopularity}} 人报名
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
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/myRoom';

export default {
  name: 'myRoom',
  data: () => ({
    height: (window.innerHeight - 42) + "px",
    list: [],
    total: 0,
    currentPage: 1,

    liveList: [],
    liveTotal: 0,
    liveCurrentPage: 1,
  }),
  methods: {
    refreshData: function(done){
      var that = this;
      request.getMyRoom({ courseType: 1 }).then((json) => {
        if(json.code == 200){
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    refreshLiveData: function(done){
      var that = this;
      request.getMyRoom({ courseType: 2 }).then((json) => {
        if(json.code == 200){
          that.liveList = json.data.results;
          that.liveTotal = json.data.count;
          that.liveCurrentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    gotoCourse(uuid, flag){
      // if(flag == 'course'){
        this.$router.push('/course/' + uuid);
      // }
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; that.currentPage++;
        request.getMyRoom({ courseType: 1, page: that.currentPage }).then((json) => {
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
      this.refreshData(done);
    },
    loadMoreLiveFn: function (done) {
      if(this.liveList.length < this.liveTotal){
        var that = this; this.liveCurrentPage++;
        request.getMyRoom({ courseType: 2, page: this.liveCurrentPage }).then((json) => {
          if(json.code == 200){
            that.liveTotal = json.data.count;
            json.data.results.map((item, index)=>{
              that.liveList.push(item);
            });
            done(false);
          }
        });
      }else {
        Toast('没有数据'); done(false);
      }
    },
    onRefreshLiveFn: function (done) {
      this.refreshLiveData(done);
    }
  },
  mounted() {
    this.refreshData();
    this.refreshLiveData();
  }
}
</script>
<style lang="scss" scoped>
  .divMyRoom{
    width: 100%; box-sizing: border-box;
    background-color: #F7F7F7;
  }
  .divItems{
    padding-bottom: 10px; padding-top: 10px;
  }
  .divItems .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-bottom:10px;
    margin-left: 13px;
    margin-right: 13px;
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
    overflow: hidden;
  }
  .divItems .divItem .divCourse .imgItem1{
    border-top-left-radius: 6px; border-top-right-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divItems .divItem .divCourse .divRadius{
    position: absolute;
    width: 100%;
    background-color: rgba(255,107,136,0.72);
    border-radius: 11px 11px 0px 0px;
    height: 25px;
    left: 0;
    bottom: 5px;
    display: flex;
    align-items: center;
  }
  .divItems .divItem .divCourse .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .divItems .divItem .divCourse .divRadius .lblTimer{
    color: #FFF;
    font-size: 14px;
    margin-top: 1px;
  }
  .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: bold;
    flex: 1; width: 120px; height: 38px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divItems .divItem .divContent .divTop .divTitle1 .divLive{
    background:linear-gradient(137deg, #3a37fa 0%, #00a375 100%);
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
  .divItems .divItem .divContent .divBottom{
    margin-top: 5px;
    display: flex;
    align-items: center;
  }
  .divItems .divItem .divContent .divBottom .divStarted{
    font-size: 14px; font-weight: 500;
    border-radius: 20px; padding: 8px;
    padding-top: 5px; padding-bottom: 3px;
    border-bottom-left-radius: 0px;
    color: #FF688E;
    background-color: #FFE5EA;
  }
  .divItems .divItem .divContent .divBottom .divEnd{
    font-size: 14px; font-weight: 500;
    border-radius: 20px; padding: 8px;
    padding-top: 5px; padding-bottom: 3px;
    border-bottom-left-radius: 0px;
    color: #2F8DFB;
    background-color: #DDEDFF;
  }
  .divItems .divItem .divContent .divBottom .divCount{
    font-size: 14px; font-weight: 500;
    border-radius: 20px; padding: 8px;
    padding-top: 5px; padding-bottom: 3px;
    border-bottom-left-radius: 0px;
    color: #FF688E;
    background-color: #FFE5EA;
  }
  .divItems .divItem .divContent .divBottom .divStart{
    font-size: 14px; color: #999999; flex: 1;
    display: flex; align-items: center; justify-content: flex-end;
  }
  .divItems .divItem .divContent .divBottom .divStart .imgStart{
    width: 15px; height: 15px; margin-right: 3px;
  }
  .divItems .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divMyRoom .divDefInfo{
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    margin-top: -20px;
  }
  .divMyRoom .divDefInfo .imgDefault{
    width: 160px;
  }
  .divMyRoom .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
