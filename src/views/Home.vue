<template>
  <div class="page divHome">
      <div class="divSearch">
        <router-link to="/search" class="divItem">
          <div class="iptSearch">
            <img src="@/assets/images/home/search.png" class="imgSearch"/>
            <label class="lblText">{{defaultSearch}}</label>
          </div>
        </router-link>
        <img src="@/assets/images/home/msg.png" class="imgMsg" v-if="false"/>
      </div>

      <van-tabs line-width="33" line-height="3" color="#FF6B88" title-active-color="#FF6B88" title-inactive-color="#333333">
        <van-tab :title="typeItem.name" :style="{height: height, overflowX: 'hidden'}" v-for="(typeItem, typeIndex) in typeList" :key="typeIndex">
          <div v-if="typeIndex == 0">
            <van-swipe :width="swipeWidth" :autoplay="4000" indicator-color="#F56645" >
              <van-swipe-item v-for="(item, index) in banners" :key="'item_' + index" :style="{width: swipeWidth + 'px'}">
                <a :href="item.target" v-if="item.type == 2" target="_blank">
                  <img v-lazy="item.icon" class="imgBanner"/>
                </a>
                <img v-lazy="item.icon" v-if="item.type == 1" class="imgBanner" :title="item.name" @click="openBanner(item)"/>
                <img src="@/assets/images/home/banner.png" v-if="item.type == -1" class="imgBanner"/>
              </van-swipe-item>
            </van-swipe>
            <div class="divTypes">
              <router-link to="/freearea" class="divItem">
                  <img class="imgType" src="@/assets/images/home/freeZone.png"/>
                  <div class="txtName">免费区</div>
              </router-link>
              <div @click="noFunction" class="divItem">
                <img class="imgType" src="@/assets/images/home/activity.png"/>
                <div class="txtName">活动</div>
              </div>
              <router-link to="/leaderboard" class="divItem">
                <img class="imgType" src="@/assets/images/home/leaderboard.png"/>
                <div class="txtName">排行榜</div>
              </router-link>
              <router-link to="/couponCenter" class="divItem">
                <img class="imgType" src="@/assets/images/home/coupon.png"/>
                <div class="txtName">优惠券</div>
              </router-link>
            </div>
            <div class="divSplitLine"></div>
            <div class="divBigCoffeeLive">
              <div class="divTop">
                <div class="divTitle">
                  <img class="imgType" src="@/assets/images/home/TV.png"/>
                  <label class="lblText">大咖直播</label>
                </div>
              </div>
              <van-swipe :autoplay="4000" :show-indicators="false">
                <van-swipe-item v-for="(item, index) in bigCoffeeLiveBanners" :key="index">
                  <img v-lazy="item.icon" class="imgBigCoffee" @click="openBigCoffeeLive(item)"/>
                </van-swipe-item>
              </van-swipe>
            </div>
            <div class="divTrainingCamp divPuplicTitle" v-if="false">
              <div class="divTitle">
                <label class="lblTitle">训练营</label>
                <div class="divMore">
                  <label class="lblMore">更多</label>
                  <img class="imgRight" src="@/assets/images/home/right.png"/>
                </div>
              </div>
              <div class="divItem">
                <img src="@/assets/images/home/trainingCamp.png" class="imgItem"/>
                <div class="divContent">
                  <div class="divTop">
                    <div class="divTitle1">孕期产检训练营</div>
                    <div class="divPeriod">第一期</div>
                  </div>
                  <div class="divDesc">妇产科专家总结30年的临床经验</div>
                  <div class="divBottom">
                    <div class="divPrice">¥19.9</div>
                    <div class="divNumber">
                      <img src="@/assets/images/home/info.png" class="imgNum"/>
                      <div class="divNum">2233人已报名</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="divItem">
                <img src="@/assets/images/home/trainingCamp.png" class="imgItem"/>
                <div class="divContent">
                  <div class="divTop">
                    <div class="divTitle1">孕期产检训练营圣诞风科技手段来开房记录数据</div>
                    <div class="divPeriod">第一期</div>
                  </div>
                  <div class="divDesc">妇产科专家总结30年的临床经验上的辅导书辅导书辅导书辅导书</div>
                  <div class="divBottom">
                    <div class="divPrice">¥19.9</div>
                    <div class="divNumber">
                      <img src="@/assets/images/home/info.png" class="imgNum"/>
                      <div class="divNum">2233人已报名</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="divModal divPuplicTitle" v-for="(item, index) in list" :key="index">
              <div class="divTitle">
                <label class="lblTitle">{{item.name}}</label>
                <div class="divMore" @click="showMore(item.uuid, item.name, item.showType)">
                  <label class="lblMore">更多</label>
                  <img class="imgRight" src="@/assets/images/home/right.png"/>
                </div>
              </div>
              <div v-if="item.courses.length <= 0 & item.showType == 2" class="divDefInfo">
                <img src="@/assets/images/default/video.png" class="imgDefault"/>
                <div class="divTip">暂时没有课程哦</div>
              </div>
              <div v-if="item.courses.length <= 0 & item.showType == 1" class="divDefInfo">
                <img src="@/assets/images/default/recording.png" class="imgDefault" style="margin-top: 0px;"/>
                <div class="divTip" style="margin-top: -10px;">暂时没有课程哦</div>
              </div>
              <van-row type="flex" class="divCards" gutter="10" justify="space-between" v-if="item.courses.length > 0 & item.showType == 2">
                <van-col span="12" @click="gotoCourse(subItem.uuid)" v-for="(subItem, index) in item.courses" :key="subItem.uuid">
                  <div class="divCard">
                    <div class="divCourse">
                      <van-image :src="subItem.icon" lazy-load class="imgCourse">
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                        </template>
                        <template v-slot:error><img src="@/assets/images/home/card.png" class="imgCourse"/></template>
                      </van-image>
                      <div class="divRadius" v-if="subItem.courseType == 1 && subItem.chapterStyle == 1">
                        <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                        <label class="lblTimer">{{subItem.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(subItem.endTime == null)?"": "-" + new Date(subItem.endTime).Format('hh:mm')}}</label>
                      </div>
                    </div>
                    <div class="divTitle1">
                      <div class="divPeriod" v-if="subItem.courseType == 2">系</div>
                      <img :src="((subItem.chapterStyle == 2)?require('@/assets/images/home/music.png'):require('@/assets/images/home/play.png'))" v-if="subItem.courseType == 1" class="imgIcon"/>
                      <div class="txtTitle">{{subItem.name}}</div>
                    </div>
                    <div class="divDesc">{{subItem.expert.name}} {{subItem.expert.hospital}}</div>
                    <div class="divBottom">
                      <div class="divPrice">
                        <span class="divDiscountPrice" v-if="subItem.coursePermission == 1">免费</span>
                        <span class="divDiscountPrice" v-if="subItem.coursePermission != 1">¥{{subItem.realPrice | formatMoney}}</span>
                        <span class="divOriginalPrice" v-if="subItem.coursePermission != 1 && subItem.originalPrice > 0">{{subItem.originalPrice | formatMoney}}</span>
                      </div>
                      <div class="divNum">{{subItem.vPopularity + '人学习'}}</div>
                    </div>
                  </div>
                </van-col>
              </van-row>
              <div class="divItems" v-if="item.courses.length > 0 & item.showType == 1">
                <div class="divItem" @click="gotoCourse(subItem.uuid)" v-for="(subItem, index) in item.courses" :key="subItem.uuid">
                  <div class="divCourse">
                    <van-image :src="subItem.icon" lazy-load :class="(subItem.courseType == 1 && subItem.chapterStyle == 1 && subItem.endTime == null)?'imgItem1':'imgItem'">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                    </van-image>
                    <div class="divRadius" v-if="subItem.courseType == 1 && subItem.chapterStyle == 1 && subItem.endTime == null">
                      <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                      <label class="lblTimer">{{subItem.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(subItem.endTime == null)?"": "-" + new Date(subItem.endTime).Format('hh:mm')}}</label>
                    </div>
                  </div>
                  <div class="divContent" style="flex: 1;">
                    <div class="divTop">
                      <div class="divTitle1">
                        <div class="divPeriod" v-if="subItem.courseType == 2">系</div>
                        <div v-if="subItem.courseType == 1 && subItem.chapterStyle == 1" class="divPeriod divLive">直</div>
                        <img src="@/assets/images/home/music.png" v-if="subItem.courseType == 1 && subItem.chapterStyle == 2" class="imgIcon"/>
                        <img src="@/assets/images/home/play.png" v-if="subItem.courseType == 1 && subItem.chapterStyle == 3" class="imgIcon"/>
                        {{subItem.name}}
                      </div>
                    </div>
                    <div class="divDesc">{{subItem.expert.name}} {{subItem.expert.hospital}}</div>
                    <div class="divBottom">
                      <div class="divPrice" v-if="subItem.coursePermission == 1">免费</div>
                      <div class="divPrice" v-if="subItem.coursePermission != 1">¥{{subItem.realPrice | formatMoney}}</div>
                      <span class="divOriginalPrice" v-if="subItem.coursePermission != 1 && subItem.originalPrice > 0">{{subItem.originalPrice | formatMoney}}</span>
                      <div class="divNumber">
                        <img src="@/assets/images/home/fire.png" class="imgNum"/>
                        <div class="divNum">{{subItem.vPopularity + '人学习'}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <vue-typelist v-if="typeIndex != 0" :typeItem="typeItem.children" :typeUUID="typeItem.uuid"/>
        </van-tab>
      </van-tabs>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/home';
import typeList from '../components/typeList.vue';

export default {
  name: 'home',
  data: () => ({
    swipeWidth: window.innerWidth,
    height: (window.innerHeight-158) + "px",
    defaultSearch: '',
    typeList: [],
    banners: [],
    bigCoffeeLiveBanners: [],
    list: [],
    isLoading: false
  }),
  components: {
    "vue-typelist": typeList
  },
  methods: {
    initiData(){
      //获取首页 banner
      var that = this;
      request.getBanners().then((json) => {
        if(json.code == 200){
          if(json.data.length > 0){
            that.banners = json.data;
          }else {
            var defaultBanner = new Array({
              icon: require('@/assets/images/home/banner.png'),
              name: "",
              target: "",
              type: -1,
              uuid: ""
            });
            that.banners = defaultBanner;
          }
        }
      });
      //大咖直播
      request.getLives().then((json) => {
        if(json.code == 200){
          if(json.data.length > 0){
            that.bigCoffeeLiveBanners = json.data;
          }else {
            var defaultBanner = new Array({
              courseUuid: "",
              icon: require('@/assets/images/home/bigCoffeeLive.png'),
              uuid: "2"
            });
            that.bigCoffeeLiveBanners = defaultBanner;
          }
        }
      });
      //首页模块展示
      request.getSection().then((json) => {
        if(json.code == 200){
          this.list = json.data;
        }
      });
    },
    noFunction: function(){
      Dialog({ message: '暂无活动，敬请期待~' });
    },
    openBanner: function (item) {
      this.$router.push('/course/' + item.target);
    },
    openBigCoffeeLive(item){
      if(item.courseUuid != ""){
        this.$router.push('/course/' + item.courseUuid);
      }
    },
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    showMore(uuid, name, showType){
      var paramData = {
        uuid: uuid,
        name: name,
        showType: showType
      }
      this.$router.push('/sectionMore/' + JSON.stringify(paramData));
    }
  },
  mounted() {
    //默认搜索词
    var that = this;
    request.getDefaultSearch().then((json) => {
      if(json.code == 200){
        if(json.data.length > 0){
          that.defaultSearch = json.data[0].keyword;
        }
      }
    });
    //首页标签
    request.getTags().then((json) => {
      if(json.code == 200){
        json.data.unshift({
          children: null,
          name: "编辑推荐",
          uuid: ""
        });
        that.typeList = json.data;
        this.initiData();
      }
    });
  }
}
</script>
<style lang="scss" scoped>
  .imgBanner{
    width: 92%;
    height: 160px;
    box-shadow: 0 4px 10px rgba(221, 224, 228, 0.58);
    margin-top: 15px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 12px;
    border-radius: 15px;
    overflow: hidden;
    display: block;
  }
  .imgBigCoffee{
    width: 92%;
    height: 110px;
    box-shadow: 0 4px 10px rgba(221, 224, 228, 0.58);
    margin-top: 15px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    border-radius: 15px;
    overflow: hidden;
    display: block;
    margin-left: 15px;
    margin-right: 60px;
  }
  .divSearch{
    padding: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
  }
  .divSearch .divItem{
    flex: 1;
  }
  .divSearch .iptSearch{
    background-color: #F7F7F7;
    border-radius: 30px;
    flex: 1;
    display: flex;
    align-items: center;
    height: 38px;
  }
  .divSearch .iptSearch .imgSearch{
    width: 17px;
    height: 17px;
    margin-right: 7px;
    margin-left: 15px;
  }
  .divSearch .iptSearch .lblText{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 254px;
  }
  .divSearch .imgMsg{
    width: 41px;
    height: 32px;
    margin-left: 8px;
  }
  .divTypes{
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .divTypes .divItem{
    flex: 1;
    margin-left: 12px;
    margin-right: 12px;
  }
  .divTypes .divItem:first-child{
    margin-left: 16px;
  }
  .divTypes .divItem:last-child{
    margin-right: 16px;
  }
  .divTypes .divItem .imgType{
    width: 100%;
  }
  .divTypes .divItem .txtName{
    width: 100%;
    margin-top: -10px;
    text-align: center;
    font-size: 13px;
    color: #666666;
    letter-spacing: 1px;
  }
  .divBigCoffeeLive{
    margin-top: 25px;
    background: linear-gradient(180deg, #FFF, #F7F7F7);
  }
  .divBigCoffeeLive .divTop{
    display: flex;
    flex-direction: row;
    padding-left: 15px;
    padding-right: 15px;
  }
  .divBigCoffeeLive .divTop .divTitle{
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .divBigCoffeeLive .divTop .divTitle .imgType{
    width: 18px;
    margin-right: 5px;
  }
  .divBigCoffeeLive .divTop .divTitle .lblText{
    font-size: 20px;
    font-weight: bold;
    color: #333333;
    letter-spacing: 1px;
    height: 20px;
  }
  .divBigCoffeeLive .divTop .divMore{
    display: flex;
    align-items: center;
  }
  .divBigCoffeeLive .divTop .divMore .lblMore{
    color: #999999;
    font-size: 14px;
  }
  .divBigCoffeeLive .divTop .divMore .imgRight{
    width: 6px;
    margin-left: 5px;
  }
  .divSplitLine{
    margin-top: 25px;
    margin-left: 15px;
    margin-right: 15px;
    border-bottom: 1px solid #F5F5F5;
  }
  .divPuplicTitle{
    padding-top: 10px;
    background-color: #F7F7F7;
  }
  .divPuplicTitle  .divTitle{
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    align-items: center;
  }
  .divPuplicTitle .divTitle .lblTitle{
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1px;
    flex: 1;
  }
  .divPuplicTitle .divTitle .divMore{
    display: flex;
    align-items: center;
  }
  .divPuplicTitle .divTitle .divMore .lblMore{
    color: #999999;
    font-size: 14px;
  }
  .divPuplicTitle .divTitle .divMore .imgRight{
    width: 6px;
    margin-left: 5px;
  }
  .divTrainingCamp .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px;
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
  }
  .divTrainingCamp .divItem .imgItem{
    border-radius: 10px;
    width: 120px; min-width: 120px;
    height: 100px; min-height: 100px;
    margin-right: 7px;
  }
  .divTrainingCamp .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divTrainingCamp .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    margin-right: 5px;
    flex: 1; width: 120px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divTrainingCamp .divItem .divContent .divTop .divPeriod{
    background-image: url('~@/assets/images/home/periods.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 60px;
    height: 22px;
    font-size: 12px;
    color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .divTrainingCamp .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 5px;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .divTrainingCamp .divItem .divContent .divBottom{
    margin-top: 6px;
    display: flex;
    align-items: center;
  }
  .divTrainingCamp .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divTrainingCamp .divItem .divContent .divBottom .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divTrainingCamp .divItem .divContent .divBottom .divNumber .imgNum{
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  .divTrainingCamp .divItem .divContent .divBottom .divNumber .divNum{
    font-size: 14px;
    color: #666666;
    width: 90px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divModal .divCards{
    overflow: hidden;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
    padding-left: 15px; padding-right: 15px;
    align-content: baseline;
  }
  .divModal .divCards .divCard{
    overflow: hidden;
    border-radius: 10px;
    background-color: #FFF;
    flex: 1; height: 195px; margin-bottom: 10px;
  }
  .divModal .divCards .divCard .divCourse{
    width: 100%;
    position: relative;
  }
  .divModal .divCards .divCard .divCourse .imgCourse{
    width: 100%; height: 108px; background-color: #FFF;
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
    font-size: 14px;
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
    border-radius:6px; box-sizing: border-box;
    width: 20px;
    font-size: 12px;
    letter-spacing: 1px;
    color: #FFF;
    display: inline-block;
    text-align: center;
    padding-top: 4px; padding-bottom: 2px;
    padding-left: 2px;
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
    color: #999999; height: 16px;
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
  .divModal .divItems{
    padding-bottom: 10px;
  }
  .divModal .divItems .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
  }
  .divModal .divItems .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divModal .divItems .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divModal .divItems .divItem .divCourse .imgItem1{
    border-top-left-radius: 6px; border-top-right-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divModal .divItems .divItem .divCourse .divRadius{
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
  .divModal .divItems .divItem .divCourse .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .divModal .divItems .divItem .divCourse .divRadius .lblTimer{
    color: #FFF;
    font-size: 14px;
    margin-top: 1px;
  }
  .divModal .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divModal .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: bold;
    flex: 1; width: 120px; height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divModal .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
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
  .divModal .divItems .divItem .divContent .divTop .divTitle1 .divLive{
    background:linear-gradient(137deg, #3a37fa 0%, #00a375 100%);
  }
  .divModal .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
    image-rendering: optimizeQuality;
  }
  .divModal .divItems .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 8px; height: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divModal .divItems .divItem .divContent .divBottom{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divModal .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divModal .divItems .divItem .divContent .divBottom .divOriginalPrice{
    font-size: 11px;
    color: #999999;
    margin-left: 3px;
    text-decoration: line-through;
  }
  .divModal .divItems .divItem .divContent .divBottom .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divModal .divItems .divItem .divContent .divBottom .divNumber .imgNum{
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  .divModal .divItems .divItem .divContent .divBottom .divNumber .divNum{
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divModal .divDefInfo{
    text-align: center;
  }
  .divModal .divDefInfo .imgDefault{
    width: 160px; margin-top: -10px;
  }
  .divModal .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -25px; padding-bottom: 20px;
  }
</style>
