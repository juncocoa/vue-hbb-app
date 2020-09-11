<template>
  <div class="page divFavorites">
    <van-tabs line-width="33" line-height="3" color="#FF6B88" title-active-color="#FF6B88" title-inactive-color="#333333">
      <van-tab title="课程">
        <div class="divResults" :style="{height: height}">
          <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
            <img src="@/assets/images/default/favorites.png" class="imgDefault" style="margin-top: 0px;"/>
            <div class="divTip" style="margin-top: -10px;">没有课程收藏哦</div>
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
                <van-swipe-cell :on-close="onClose" :name="item.uuid" v-for="(item, index) in list" :key="item.uuid">
                  <div class="divItem" @click="gotoCourse(item.uuid, 'course')" >
                    <div class="divCourse">
                      <van-image :src="item.icon" fit="contain" lazy-load class="imgItem">
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                        </template>
                        <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                      </van-image>
                    </div>
                    <div class="divContent" style="flex: 1;">
                      <div class="divTop">
                        <div class="divTitle1">
                          <div class="divPeriod" v-if="item.courseType == 2">系</div>
                          <img :src="((item.chapterStyle == 2)?require('@/assets/images/home/music.png'):require('@/assets/images/home/play.png'))" v-if="item.courseType == 1" class="imgIcon"/>
                          {{item.name}}
                        </div>
                      </div>
                      <div class="divDesc">{{item.expert.name}} {{item.expert.hospital}}</div>
                    </div>
                  </div>
                  <template slot="right">
                    <img src="@/assets/images/course/delete.png" class="imgDelete"/>
                  </template>
                </van-swipe-cell>
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
      <van-tab title="直播">
        <div class="divResults" :style="{height: height}">
          <div v-if="liveList.length <= 0" class="divDefInfo" :style="{height: height}">
            <img src="@/assets/images/default/favorites.png" class="imgDefault" style="margin-top: 0px;"/>
            <div class="divTip" style="margin-top: -10px;">没有直播收藏哦</div>
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
                <van-swipe-cell :on-close="onClose" :name="item.uuid" v-for="(item, index) in liveList" :key="'live_' + item.uuid">
                  <div class="divItem" @click="gotoCourse(item.uuid, 'live')" >
                    <div class="divCourse">
                      <van-image :src="item.banner" fit="contain" lazy-load class="imgItem"  style="height: 90px;">
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                        </template>
                        <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                      </van-image>
                    </div>
                    <div class="divContent" style="flex: 1;">
                      <div class="divTitle2">
                        <img src="@/assets/images/home/play.png" class="imgIcon"/>
                        {{item.name}}
                      </div>
                      <div class="divStart">
                        <img src="@/assets/images/myProfile/start.png" class="imgStart"/>
                        开课：{{item.startTime | formatDateByFormat('yyyy-MM-dd')}}
                      </div>
                      <div class="divStart">
                        <img src="@/assets/images/myProfile/end.png" class="imgStart"/>
                        <label v-if="item.endTime == null">结束：--</label>
                        <label v-if="item.endTime != null">结束：{{item.endTime | formatDateByFormat('yyyy-MM-dd')}}</label>
                      </div>
                      <div class="divStart">
                        <img src="@/assets/images/home/fire.png" class="imgStart"/>
                        {{item.studyNum}} 人已学习
                      </div>
                    </div>
                  </div>
                  <template slot="right">
                    <img src="@/assets/images/course/delete.png" class="imgDelete"/>
                  </template>
                </van-swipe-cell>
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
import * as request from '../service/study';

export default {
  name: 'favorites',
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
      request.getBehavior({ type: 2 }).then((json) => {
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
      request.getLikeRoom().then((json) => {
        if(json.code == 200){
          that.liveList = json.data.results;
          that.liveTotal = json.data.count;
          that.liveCurrentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    gotoCourse(uuid, flag){
      if(flag == 'course'){
        this.$router.push('/course/' + uuid);
      }else if(flag == 'live'){
        var that = this;
        request.getRoomRight({ uuid: uuid }).then((json) => {
          if(json.code == 200){
            if(json.data == true){
              that.$router.push('/liveCourse/RoomUuid/'+ uuid);
            }else if(json.data == false){
              Dialog({ message: '对不起，无权限进入。' });
            }
          }
        });
      }
    },
    onClose(clickPosition, instance){
      var that = this;
      switch (clickPosition) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            message: '你确定要 取消收藏 吗？'
          }).then(() => {
            request.cancelBehavior({ behaviorType: 2, courseUuid: instance.name }).then((json) => {
              if(json.code == 200){
                Toast(json.msg); that.refreshData();
              }
            });
          });
          break;
      }
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; that.currentPage++;
        request.getBehavior({type: 2,page: that.currentPage}).then((json) => {
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
        request.getLikeRoom({page: this.liveCurrentPage}).then((json) => {
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
  .divResults{
    width: 100%; position: absolute; box-sizing: border-box;
    background-color: #F7F7F7; height: 600px; z-index: 2;
    overflow-y: auto;
  }
  .divItems{
    padding-bottom: 15px;
  }
  .divItems .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-top: 10px;
    margin-left: 13px;
    margin-right: 13px;
  }
  .divItems .divItem .divCourse{
    width: 120px;
    position: relative;
    margin-right: 5px;
    height: 90px;
  }
  .divItems .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 120px;
    height: 85px;
    overflow: hidden;
  }
  .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 16px;
    font-weight: 600;
    flex: 1; width: 120px; height: 54px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden; padding-top: 5px;
  }
  .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
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
  .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divItems .divItem .divContent .divStart{
    font-size: 14px; color: #999999; flex: 1;
    display: flex; align-items: center;
    margin-bottom: 6px;
  }
  .divItems .divItem .divContent .divStart .imgStart{
    width: 15px; height: 15px; margin-right: 6px;
  }
  .divItems .divItem .divContent .divTitle2{
    flex: 1; color: #333333;
    font-size: 16px;
    font-weight: 600; height: 19px;
    flex: 1; margin-bottom: 6px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden; padding-top: 5px;
  }
  .divItems .divItem .divContent .divTitle2 .imgIcon{
    width: 18px; height: 18px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divItems .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 9px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divResults .divDefInfo{
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    margin-top: -20px;
  }
  .divResults .divDefInfo .imgDefault{
    width: 160px;
  }
  .divResults .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
  .divResults .divItems .imgDelete{
    width: 64px; height: 64px; margin-top: 20px;
    margin-left: -6px; margin-right: 10px;
  }
</style>
