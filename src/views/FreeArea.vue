<template>
  <div class="page divModal">
    <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
      <img src="@/assets/images/default/video.png" class="imgDefault"/>
      <div class="divTip">暂时没有课程哦</div>
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
        <van-row type="flex" class="divCards" gutter="10" justify="space-between" v-if="list.length > 0">
          <van-col span="12" @click="gotoCourse(item.uuid)" v-for="(item, index) in list" :key="item.uuid">
            <div class="divCard">
              <div class="divCourse">
                <van-image :src="item.icon" lazy-load class="imgCourse">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error><img src="@/assets/images/home/card.png" class="imgCourse"/></template>
                </van-image>
                <div class="divRadius" v-if="item.courseType == 1 && item.chapterStyle == 1">
                  <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                  <label class="lblTimer">{{item.startTime | formatDate}}{{(item.endTime == null)?"": "-" + new Date(item.endTime).Format('h:m')}}</label>
                </div>
              </div>
              <div class="divTitle1">
                <div class="divPeriod" v-if="item.courseType == 2">系</div>
                <img :src="((item.chapterStyle == 2)?require('@/assets/images/home/music.png'):require('@/assets/images/home/play.png'))" v-if="item.courseType == 1" class="imgIcon"/>
                <div class="txtTitle">{{item.name}}</div>
              </div>
              <div class="divDesc" v-if="item.expert != null">{{item.expert.name}} {{item.expert.hospital}}</div>
              <div class="divDesc" v-if="item.expert == null">暂无</div>
              <div class="divBottom">
                <div class="divPrice">
                  <span class="divDiscountPrice" v-if="item.coursePermission == 1">免费</span>
                  <span class="divDiscountPrice" v-if="item.coursePermission != 1">¥{{item.realPrice | formatMoney}}</span>
                  <span class="divOriginalPrice" v-if="item.coursePermission != 1 && item.originalPrice > 0">{{item.originalPrice | formatMoney}}</span>
                </div>
                <div class="divNum">{{item.vPopularity + '人学习'}}</div>
              </div>
            </div>
          </van-col>
        </van-row>
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
import * as request from '../service/home'

export default {
  name: 'FreeArea',
  data: () => ({
    height: (window.innerHeight) + 'px',
    list: [],
    total: 0,
    currentPage: 1,
  }),
  methods: {
    initiData: function(done){
      var that = this;
      request.clientCourse({type: 'free'}).then((json)=>{
        if(json.code == 200){
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      })
    },
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; that.currentPage++;
        request.clientCourse({type: 'free', page: that.currentPage}).then((json) => {
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
  .divModal{
    overflow-x: hidden;
    background-color: #F7F7F7;
  }
  .divModal .divCards{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 10px; box-sizing: border-box;
    padding-left: 15px; padding-right: 15px;
    align-content: baseline; padding-bottom: 10px;
  }
  .divModal .divCards .divCard{
    border-radius: 10px; box-sizing: border-box;
    background-color: #FFF; overflow: hidden;
    flex: 1; height: 195px; margin-bottom: 10px;
  }
  .divModal .divCards .divCard .divCourse{
    width: 100%;
    position: relative;
  }
  .divModal .divCards .divCard .divCourse .imgCourse{
    width: 100%; height: 108px;
  }
  .divModal .divCards .divCard .divCourse .divRadius{
    position: absolute;
    width: 100%;
    background-color: rgba(255,107,136,0.72);
    border-radius: 11px 11px 0px 0px;
    height: 25px;
    left: 0;
    bottom: 11px;
    display: flex;
    align-items: center;
  }
  .divModal .divCards .divCard .divCourse .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 10px;
    margin-right: 5px;
  }
  .divModal .divCards .divCard .divCourse .divRadius .lblTimer{
    color: #FFF;
    font-size: 15px;
    margin-top: 1px;
  }
  .divModal .divCards .divCard .divTitle1{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
  }
  .divModal .divCards .divCard .divTitle1 .imgIcon{
    width: 18px; height: 18px;
    margin-top: -3px;
    margin-right: 5px;
  }
  .divModal .divCards .divCard .divTitle1 .divPeriod{
    background:linear-gradient(137deg,rgba(73,205,172,1) 0%,rgba(3,207,149,1) 100%);
    border-radius:6px;
    width: 22px;
    font-size: 12px;
    letter-spacing: 1px;
    color: #FFF;
    display: inline-block;
    text-align: center;
    padding: 4px;
    padding-left: 1px;
    padding-right: 0px;
    margin-right: 2px;
    vertical-align: middle;
    margin-top: -4px;
  }
  .divModal .divCards .divCard .divTitle1 .txtTitle{
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    flex: 1;
    width: 90px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divModal .divCards .divCard .divDesc{
    margin-left: auto;
    margin-right: auto;
    font-size: 0.3rem;
    color: #999999;
    margin-top: 0.2rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    padding-left: 8px;
  }
  .divModal .divCards .divCard .divBottom{
    display: flex;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 7px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: space-between;
  }
  .divModal .divCards .divCard .divBottom .divPrice{
    display: flex;
    font-size: 14px;
    color: #999999;
  }
  .divModal .divCards .divCard .divBottom .divPrice .divDiscountPrice{
    text-decoration: initial;
    font-size: 14px;
    color: #FF6B88;
    margin-right: 5px;
  }
  .divModal .divCards .divCard .divBottom .divPrice .divOriginalPrice{
    text-decoration: line-through; margin-right: 5px;
  }
  .divModal .divCards .divCard .divBottom .divNum{
    font-size: 14px;
    color: #999999;
    text-align: right;
    width: 81px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divModal .divDefInfo{
    display: flex; justify-content: center;
    align-items: center; flex-direction: column;
  }
  .divModal .divDefInfo .imgDefault{
    width: 160px;
  }
  .divModal .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
