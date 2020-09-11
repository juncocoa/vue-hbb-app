<template>
  <div class="page divPurchased" :style="{height: height}">
    <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
      <img src="@/assets/images/default/card.png" class="imgDefault" style="margin-top: 0px;"/>
      <div class="divTip" style="margin-top: -10px;">没有相关课程</div>
    </div>
    <div class="divItems" :style="{height: height}">
      <div class="divItem" @click="gotoCourse(item.uuid)" v-if="list.length > 0" v-for="(item, index) in list" :key="index">
        <div class="divCourse">
          <img :src="item.icon" class="imgItem"/>
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
            <span class="divOriginalPrice" v-if="item.coursePermission != 1 && item.originalPrice > 0">{{item.originalPrice | formatMoney}}</span>
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
import * as request from '../service/coupons'

export default {
  name: 'couponList',
  data: () => ({
    height: window.innerHeight + "px",
    list: []
  }),
  methods: {
    gotoCourse: function(uuid){
      this.$router.push('/course/' + uuid);
    }
  },
  mounted() {
    var that = this;
    request.getCouponsCourse({uuid: this.$route.params.uuid, page: 1}).then((json) => {
      if(json.code == 200){
        that.list = json.data.results;
      }
    });
  }
}
</script>
<style lang="scss" scoped>
  .divPurchased{
    background-color: #F5F5F5;
  }
  .divPurchased .divItems{
    padding-bottom: 10px;
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto; box-sizing: border-box;
  }
  .divPurchased .divItems .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
  }
  .divPurchased .divItems .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divPurchased .divItems .divItem .divCourse .imgItem{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    width: 144px;
    height: 95px;
  }
  .divPurchased .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divPurchased .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    flex: 1; width: 120px; height: 40px;
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
  .divPurchased .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divPurchased .divItems .divItem .divContent .divDesc{
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
  .divPurchased .divItems .divItem .divContent .divBottom{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divPurchased .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divPurchased .divItems .divItem .divContent .divBottom .divOriginalPrice{
    font-size: 11px;
    color: #999999;
    margin-left: 3px;
    text-decoration: line-through;
  }
  .divPurchased .divItems .divItem .divContent .divBottom .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divPurchased .divItems .divItem .divContent .divBottom .divNumber .imgNum{
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  .divPurchased .divItems .divItem .divContent .divBottom .divNumber .divNum{
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divPurchased .divItems .divDefInfo{
    margin-top: -10px;
    display: flex; align-items: center;
    justify-content: center; flex-direction: column;
  }
  .divPurchased .divItems .divDefInfo .imgDefault{
    width: 160px;
  }
  .divPurchased .divItems .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
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
