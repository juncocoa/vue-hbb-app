<template>
  <div class="page">
    <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
      <img src="@/assets/images/default/recording.png" class="imgDefault"/>
      <div class="divTip">暂时没有课程哦</div>
    </div>
    <div class="divLeaderboard" :style="{height: height, overflowY: 'auto'}" v-if="list.length > 0">
      <div class="divItem" @click="gotoCourse(item.uuid)" v-for="(item, index) in list" :key="index">
        <div class="divCourse">
          <van-image :src="item.icon" lazy-load class="imgItem">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
          </van-image>
          <img :src="require('@/assets/images/leaderboard/' + (index + 1) +'.png')" class="imgNumber"/>
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
          <div class="divBottom">
            <div class="divPrice" v-if="item.coursePermission == 1">免费</div>
            <div class="divPrice" v-if="item.coursePermission != 1">¥{{item.realPrice | formatMoney}}</div>
            <div class="divNumber">
              <img src="@/assets/images/home/fire.png" class="imgNum"/>
              <div class="divNum">{{item.vPopularity + '人学习'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/home'

export default {
  name: 'Leaderboard',
  data: () => ({
    height: window.innerHeight + "px",
    list: []
  }),
  methods: {
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    }
  },
  mounted() {
    var that = this;
    request.clientCourse({type: 'rank'}).then((json)=>{
      if(json.code == 200){
        that.list = json.data.results;
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .divLeaderboard{
    background-color: #F7F7F7;
    padding-top: 10px; height: 600px;
    box-sizing: border-box;
  }
  .divLeaderboard .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 10px;
  }
  .divLeaderboard .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divLeaderboard .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divLeaderboard .divItem .divCourse .imgNumber{
    width: 35px; position: absolute; margin-left: -35px
  }
  .divLeaderboard .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divLeaderboard .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    flex: 1; width: 120px; height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 3px;
  }
  .divLeaderboard .divItem .divContent .divTop .divTitle1 .divPeriod{
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
  .divLeaderboard .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divLeaderboard .divItem .divContent .divDesc{
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
  .divLeaderboard .divItem .divContent .divBottom{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divLeaderboard .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divLeaderboard .divItem .divContent .divBottom .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divLeaderboard .divItem .divContent .divBottom .divNumber .imgNum{
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  .divLeaderboard .divItem .divContent .divBottom .divNumber .divNum{
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divDefInfo{
    display: flex; justify-content: center;
    align-items: center; flex-direction: column;
  }
  .divDefInfo .imgDefault{
    width: 160px;
  }
  .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
