<template>
  <div class="page divCourse" :style="{height: height}">
    <div v-if="showGotoHome" class="btnHome" @click="gotoHome">
      <img src="@/assets/images/home/home.png" class="imgHome"/>
      <label>返回首页</label>
    </div>
    <div class="divShare" v-if="course.share != null" @click="btnShare">
      <img src="@/assets/images/course/share.png" class="imgShare"/>
      <div class="lblShare">赚 ¥{{course.share}}</div>
    </div>
    <div class="divShare" v-if="course.share == null" @click="btnShare">
      <img src="@/assets/images/course/share.png" class="imgShare"/>
      <div class="lblShare">分 享</div>
    </div>
    <div class="divIcon">
      <van-image :src="course.icon" lazy-load class="imgIcon" fit="contain">
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
        </template>
        <template v-slot:error><img src="@/assets/images/home/card.png" class="imgIcon" style="margin: 15px;"/></template>
      </van-image>
      <div class="divDeduction" v-if="course.canStudy == false && course.coupons != null">购买时自动抵扣 ¥{{course.coupons.money | formatMoney}}</div>
    </div>
    <div class="divTitle">{{course.name}}</div>
    <div class="divSubTitle">{{course.subhead}}</div>
    <div id="divDesc" :class="isExpand">
        课程简介：{{course.intro | contentIsEmpty}}
        <span @click="expandDesc" v-if="showMore">{{(this.expand == true)?'收起':'展开'}}</span>
    </div>
    <div @click="course.expert && gotoExpertIntro(course.expert.name, course.expert.uuid, course.expert.enable)" class="divSpeaker">
      <van-image :src="(course.expert != null)?course.expert.avatar:''" lazy-load class="imgAvatar">
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
        </template>
        <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgDefaultAvatar"/></template>
      </van-image>
      <div class="divBaseInfo" v-if="course.expert != null">
        <div class="divName">{{course.expert.name}}</div>
        <div class="divInfo" v-if="course.expert.hospital != null | course.expert.jobTitle != null">{{course.expert.hospital}} {{course.expert.jobTitle}}</div>
      </div>
      <div class="divBaseInfo" v-if="course.expert == null"></div>
      <img src="@/assets/images/course/right.png" class="imgRight"/>
    </div>
    <van-tabs line-width="33" line-height="3" color="#FF6B88" title-active-color="#FF6B88" title-inactive-color="#333333" @change="tabsChange">
      <van-tab title="课程介绍">
        <div v-html="course.info" v-if="course.infoType == 1" class="divRichText"></div>
        <div v-if="course.infoType == 2 & course.info == null" class="divDefInfo">
          <img src="@/assets/images/default/recording.png" class="imgDefault" style="margin-top: 0px;"/>
          <div class="divTip" style="margin-top: -10px;">暂时没有课程哦</div>
        </div>
        <div v-if="course.infoType == 2 & course.info != null" >
          <img :src="item" v-for="(item, index) in course.info_Imgs" :key="'oldImg_' + index" style="width: 100%"/>
        </div>
        <div class="divItems" v-if="relatedCourses.length > 0">
          <div class="divTitle">更多推荐</div>
          <div class="divItem" @click="gotoCourse(subItem.uuid)" v-for="(subItem, index) in relatedCourses" :key="'related_' + subItem.uuid">
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
              <div class="divDesc2">{{subItem.expert.name}} {{subItem.expert.hospital}}</div>
              <div class="divBottom2">
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
      </van-tab>
      <van-tab title="课程目录" v-if="course.courseType == 2">
        <!-- 课程目录 -->
        <vue-chapter-list @itemClick="itemClickCallback" :chapters="course.chapters" :preChapter="course.preChapter" :canStudy="course.canStudy" :showChapter="true"/>
      </van-tab>
      <van-tab title="评论">
        <!-- 互动评论 -->
        <vue-comment-list ref="comment" :courseUUID="course.uuid" :showReply="false"/>
      </van-tab>
    </van-tabs>

    <div class="divBottom" v-if="showComment == false">
      <div class="btnAudition" v-if="course.canStudy == false && course.haveTry == true" @click="gotoByTry">试听</div>
      <div class="btnBuy" v-if="course.canStudy == false"  @click="gotoBuy">
        <div class="btnTxt">
          <span class="spanPrice" v-if="course.coursePermission != 1">¥{{course.realPrice | formatMoney}}</span>
          <span class="spanOriginal" v-if="course.coursePermission !=1 && course.originalPrice > 0">¥<span class="spanDelete">{{course.originalPrice | formatMoney}}</span></span>
          <span class="spanTip">立即购买</span>
        </div>
      </div>
      <div class="btnBuy" v-if="course.canStudy == true" @click="gotoStartLearn">
        <div class="btnTxt">
          <span class="spanTip" style="letter-spacing: 10px;">开始学习</span>
        </div>
      </div>
    </div>
    <div class="divBottom" style="height: 52px;" v-if="showComment == true">
      <div class="divFlex">
        <div class="divComment">
          <input placeholder="输入评论内容..." class="iptComment" v-model="content" v-on:keydown="keydown" v-on:blur="onBlur"/>
        </div>
        <div class="divSend" @click="btnSendCommend">发 送</div>
      </div>
    </div>
    <vue-html2canvas v-if="showHtml2Canvas" :courseUUID="course.uuid" @closeShare="closeShare"/>
    <van-popup v-model="showPayDetail" position="bottom" :style="{ height: payDetailHeight }">
      <vue-pay-detail ref="payDetail" :proCourse="course" @closeWindows="closeWindows" @adaptiveHeight="adaptiveHeight"/>
    </van-popup>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/course.js'
import chapterList from '../components/chapterList.vue';
import commentList from '../components/commentList.vue';
import screenCapture from '../components/screenCapture.vue';
import payDetail from '../components/payDetail.vue';

export default {
  name: 'course',
  data: () => ({
    height: (window.innerHeight-35) + "px",
    course: {expert:{}},
    expand: false,
    showMore: false,
    showHtml2Canvas: false,
    showPayDetail: false,
    showGotoHome: false,
    relatedCourses: [],
    payDetailHeight: '0px',
    showComment: false,
    content: ''
  }),
  components: {
    "vue-chapter-list": chapterList,
    "vue-comment-list": commentList,
    "vue-html2canvas": screenCapture,
    "vue-pay-detail": payDetail
  },
  computed: {
    isExpand(){
      if(document.getElementById("divDesc") == null){ this.showMore = false; return 'divDesc1'}
      if(document.getElementById("divDesc").innerText.length >= 47){
        this.showMore = true;
        return (this.expand == true)?'divDesc1':'divDesc';
      }else {
        this.showMore = false;
        return 'divDesc1';
      }
    }
  },
  methods: {
    onBlur(){
      var timeout = setTimeout(function(){
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0)); clearTimeout(timeout);
      }, 100);
    },
    gotoCourse(uuid){
      location.href = '/course/' + uuid;
    },
    adaptiveHeight: function () {
      this.payDetailHeight = document.getElementById('divPayDetail').clientHeight + "px";
    },
    keydown: function(e){
      if(!e){ e = window.event; }
	    if(e.keyCode == 13){
        if(e.target.value.trim() == ''){ return; }
        this.getAddComment(e.target.value);
	    }
    },
    btnSendCommend: function(){
      if(this.content.trim() != ''){
        this.getAddComment(this.content);
      }else {
        Dialog.alert({ message: '评论内容，不能为空。' });
      }
    },
    getAddComment(val){
      var that = this;
      request.getAddComment({uuid: this.$route.params.uuid, content: val}).then((json) => {
        if(json.code == 200){
          that.content = ''; Toast(json.msg);
          that.$refs.comment.initiaData();
        }
      });
    },
    btnShare: function () {
      var profile = JSON.parse(sessionStorage.getItem("profile"));
      if(profile.telInfo == null){
        Dialog.alert({
          message: '请先绑定手机号'
        }).then(() => {
          this.$router.push("/personalInfo");
        });
      }else {
        this.showHtml2Canvas = true;
      }
    },
    gotoExpertIntro: function(name, uuid, enable){
      if(uuid == undefined){ return; }
      if(enable == false){
        Dialog({ message: '专家：' + name + '，已被 <font color="red">禁用</font>，不能查看。' });
      }else {
        this.$router.push('/expertIntro/' + uuid + '/');
      }
    },
    tabsChange: function(name, title){
      if(title == "评论"){
        if(this.$refs.comment != undefined){
          this.$refs.comment.initiaData();
        }
        //如果已购买
        if(this.course.canStudy == true){ this.showComment = true; }
      }else {
        this.showComment = false;
      }
    },
    closeShare: function(){
      this.showHtml2Canvas = false;
    },
    gotoHome: function(){
      this.$router.push('/home');
    },
    initiaData: function(){
      var that = this;
      request.getCourseDetail({uuid: this.$route.params.uuid}).then((json) => {
        if(json.code == 200){
          that.course = json.data;
          if(that.course.infoType == 2 & that.course.info != null){
            if(that.course.info != ""){
              var arrStr = that.course.info.split(',');
              that.course.info_Imgs = arrStr;
            }else {
              that.course.info_Imgs = [];
            }
          }
          //相关课程
          request.getRelateCourses({uuid: that.course.uuid}).then((json) => {
            if(json.code == 200){
              that.relatedCourses = json.data.results;
            }
          });
        }
      });
    },
    closeWindows: function (flag) {
      if(flag == false){
        this.showPayDetail = false;
      }else if(flag == true){
        this.showPayDetail = false; this.initiaData();
      }
    },
    filterLiveLessons: function (value, uuid) {
      var tempArray = [];
      //排除直播
      for (let i = 0; i < value.chapters.length; i++) {
        if(value.chapters[i].chapterStyle == 2 || value.chapters[i].chapterStyle == 3){
          tempArray.push(value.chapters[i]);
        }
      }
      //获得音视频索引
      for (let j = 0; j < tempArray.length; j++) {
        if(tempArray[j].uuid === uuid){
          return j;
        }
      }
      return 0;
    },
    itemClickCallback: function(uuid){
      var playIndex = 0;
      for (let i = 0; i < this.course.chapters.length; i++) {
        if(this.course.chapters[i].uuid == uuid){
          if(this.course.canStudy == false && this.course.chapters[i].isTry == false){
            Dialog({ message: '请购买课程，才能听课。' }); return;
          }else {
            playIndex = i; break;
          }
        }
      }
      if(this.course.chapters[playIndex].chapterStyle == 1){
        //直播课件
        var that = this;
        if(this.course.chapters[playIndex].liveSatus == null){ return; }
        if(this.course.chapters[playIndex].liveSatus != 1){
          Dialog.confirm({
            message: '你确定要进入直播间吗？'
          }).then(() => {
            that.$router.push('/liveCourse/uuid/'+ that.course.chapters[playIndex].uuid);
          });
        }else {
          Dialog.alert({ message: '直播未开始' });
        }
      }else {
        var playIndex = this.filterLiveLessons(this.course, uuid);
        this.$router.push('/audioCourse/' + this.course.uuid + "/" + playIndex);
      }
    },
    expandDesc: function (event) {
      if(this.expand == true){
        this.expand = false;
      }else {
        this.expand = true;
      }
    },
    gotoByTry(){
      if(this.course.chapters.length <= 0){
        Dialog.alert({
          message: '没有相关试听课数据。'
        });
      }else {
        var playIndex = 0;
        for (let i = 0; i < this.course.chapters.length; i++) {
          if(this.course.chapters[i].isTry == true){
            playIndex = i; break;
          }
        }

        if(this.course.chapters[playIndex].chapterStyle == 1){
          var that = this;
          if(this.course.chapters[playIndex].liveSatus == null){ return; }
          if(this.course.chapters[playIndex].liveSatus != 1){
            Dialog.confirm({
              message: '你确定要进入直播间吗？'
            }).then(() => {
              that.$router.push('/liveCourse/uuid/'+ that.course.chapters[playIndex].uuid);
            });
          }else {
            Dialog.alert({ message: '直播未开始' });
          }
        }else {
          this.$router.push('/audioCourse/' + this.course.uuid + "/" + playIndex);
        }
      }
    },
    gotoStartLearn(){
      if(this.course.chapters.length <= 0){
        Dialog.alert({
          message: '没有相关课程数据。'
        });
      }else {
        if(this.course.chapters[0].chapterStyle == 1){
          var that = this;
          if(this.course.chapters[0].liveSatus == null){ return; }
          if(this.course.chapters[0].liveSatus != 1){
            Dialog.confirm({
              message: '你确定要进入直播间吗？'
            }).then(() => {
              that.$router.push('/liveCourse/uuid/'+ that.course.chapters[0].uuid);
            });
          }else {
            Dialog.alert({ message: '直播未开始' });
          }
        }else {
          this.$router.push('/audioCourse/' + this.course.uuid + "/0");
        }
      }
    },
    gotoBuy(){
      this.showPayDetail = true;
      if(this.$refs.payDetail != undefined){
        this.$refs.payDetail.initiaData();
      }
    }
  },
  mounted() {
    this.initiaData();
    if(sessionStorage.getItem("jumpUrl") != null){
      this.showGotoHome = true;
      sessionStorage.removeItem("jumpUrl")
    }
  }
}
</script>
<style lang="scss" scoped>
  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: #999999; padding-top: 3px;
  }
  ::-moz-placeholder { /* Firefox 19+ */
    color: #999999; padding-top: 3px;
  }
  :-ms-input-placeholder { /* IE 10+ */
   color: #999999; padding-top: 3px;
  }
  :-moz-placeholder { /* Firefox 18- */
   color: #999999; padding-top: 3px;
  }
  .divCourse .divIcon{
    text-align: center;
    padding-top: 10px;
    overflow: hidden;
  }
  .divCourse .divIcon .imgIcon{
    width: 93%; height: 218px; border-radius: 10px;
    background-color: #f9f9f9;
  }
  .divCourse .divIcon .divDeduction{
    height: 30px;
    display: flex; justify-content: center; align-items: center;
    font-size: 14px; border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    background-color: rgb(255,204,51); color: #FFF;
    font-weight: 500; position: absolute;
    margin-top: -41.5px; margin-left: 12px;
    padding-left: 13px; padding-right: 13px
  }
  .divCourse .divTitle{
    font-size: 18px; font-weight: bold;
    color: #333333; margin-left: 12px; margin-right: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .divCourse .divSubTitle{
    font-size: 14px; font-weight: 500; margin-top: 10px;
    color: #515151; margin-left: 12px; margin-right: 12px;
  }
  .divCourse .divDesc{
    font-size: 14px; font-weight: 500; color: #999999;
    margin-left: 12px; margin-right: 12px;
    margin-top: 10px;
    position: relative; line-height: 20px; max-height: 40px;overflow: hidden;
  }
  .divCourse .divDesc span::before{
    content: "..."; position: absolute; bottom: 0; right: 33px; color: #999999;
    background: -webkit-linear-gradient(left, transparent, #fff 55%);
    background: -o-linear-gradient(right, transparent, #fff 55%);
    background: -moz-linear-gradient(right, transparent, #fff 55%);
    background: linear-gradient(to right, transparent, #fff 55%);
  }
  .divCourse .divDesc span{
    font-size: 14px; font-weight: 500; color: #1B82FB;
    position: absolute; bottom: 0; right: 0px; padding-left: 70px;
    background: -webkit-linear-gradient(left, transparent, #fff 55%);
    background: -o-linear-gradient(right, transparent, #fff 55%);
    background: -moz-linear-gradient(right, transparent, #fff 55%);
    background: linear-gradient(to right, transparent, #fff 55%);
  }
  .divCourse .divDesc1{
    font-size: 14px; font-weight: 500; color: #999999;
    margin-left: 12px; margin-right: 12px;
    margin-top: 10px; overflow: hidden;
    position: relative; line-height: 20px;
  }
  .divCourse .divDesc1 span{
    font-size: 14px; font-weight: 500; color: #1B82FB;
    position: absolute; bottom: 0; right: 0px;
  }
  .divCourse .divSpeaker{
    background-repeat: no-repeat;
    background-image: url('~@/assets/images/course/bg.png');
    background-size: 100% 100%;
    width: 93%; display: flex; align-items: center;
    justify-content: center; height: 80px;
    margin-top: 15px; margin-left: auto; margin-right: auto;
    padding: 10px; box-sizing: border-box;
  }
  .divCourse .divSpeaker .imgAvatar{
    width: 56px; height: 56px; border-radius: 50%;
    margin-right: 8px; overflow: hidden;
  }
  .divCourse .divSpeaker .imgDefaultAvatar{
    width: 56px; height: 56px; border-radius: 50%;
  }
  .divCourse .divSpeaker .divBaseInfo{
    flex: 1;
  }
  .divCourse .divSpeaker .divBaseInfo .divName{
    font-size: 15px; color: #333333; font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divCourse .divSpeaker .divBaseInfo .divInfo{
    font-size: 14px; color: #999999; font-weight: 500;
    margin-top: 8px; display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divCourse .divSpeaker .imgRight{
    width: 9px; margin-right: 5px;
  }
  .divCourse .divBottom{
    display: flex; flex-direction: row; height: 46px;
    position: fixed; bottom: 0; width: 100%; background-color: #FFF;
  }
  .divCourse .divBottom .btnAudition{
    background-color: #FFF1F1; font-size: 16px; font-weight: 500;
    color: #F9626A; width: 100px;
    display: flex; align-items: center; justify-content: center;
  }
  .divCourse .divBottom .btnBuy{
    flex: 1; background:linear-gradient(135deg, rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    justify-content: center; display: flex;
  }
  .divCourse .divBottom .btnBuy .btnTxt{
    color: #FFF;
    display: flex; align-items: center; justify-content: center;
  }
  .divCourse .divBottom .btnBuy .btnTxt .spanPrice{
    margin-right: 5px; font-size: 16px; font-weight: 500;
  }
  .divCourse .divBottom .btnBuy .btnTxt .spanOriginal{
    font-size: 13px; font-weight: 500; margin-right: 5px;
  }
  .divCourse .divBottom .btnBuy .btnTxt .spanOriginal span{
    text-decoration: line-through; margin-right: 8px;
  }
  .divCourse .divBottom .btnBuy .btnTxt .spanTip{
    color: #FFF; font-size: 18px; font-weight: bold;
  }
  .divCourse .divBottom .divFlex{
    display: flex; flex: 1; box-shadow:0px 2px 10px 0px rgba(0,0,0,0.1);
    padding-top: 8px;
  }
  .divCourse .divBottom .divFlex .divComment{
    border-radius: 20px; display: flex;
    background-color: #EFEFEF;
    flex: 1; margin-left: 10px; margin-right: 8px;
    height: 35px; padding-left: 12px; padding-right: 12px;
  }
  .divCourse .divBottom .divFlex .divComment .iptComment{
    font-size: 14px; font-weight: 500; border: none;
    background-color: #EFEFEF; width: 100%;
  }
  .divCourse .divBottom .divFlex .divSend{
    text-align: center; display: flex; align-items: center;
    justify-content: center; padding-bottom: 6px; padding-right: 5px;
    font-size: 14px; color: #FF6B88; width: 50px; font-weight: 500;
  }
  .divCourse .divShare{
    background:linear-gradient(135deg,rgba(72,174,255,1) 0%,rgba(74,137,255,1) 100%);
    border-radius:20px 0px 0px 20px;
    display: flex; align-items: center; top: 20px;
    justify-content: center; padding-left: 6px;
    position: absolute; right: 0; height: 30px;
    padding-right: 6px; z-index: 2;
  }
  .divCourse .divShare .imgShare{
    width: 20px; height: 19px; margin-right: 4px;
    margin-left: 6px; margin-top: 4px;
  }
  .divCourse .divShare .lblShare{
    font-size: 14px; color: #fff; padding-top: 3px;
  }
  .divCourse .btnHome{
    font-size: 16px; color: #FFF; font-weight: 500;
    position: fixed; top: 15px; left: 0; z-index: 1;
    border-radius:0px 29px 29px 0px; padding: 6px; padding-left: 10px; padding-right: 13px;
    background:linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    display: flex; align-items: center;
  }
  .divCourse .btnHome .imgHome{
    margin-right: 6px; width: 20px; height: 20px;
  }
  .divCourse .btnHome label{
    padding-top: 4px;
  }

  .divCourse .divItems {
    padding-bottom: 20px;
  }
  .divCourse .divItems .divTitle{
    font-size: 16px; font-weight: bold;
  }
  .divCourse .divItems .divItem{
    display: flex;
    padding-bottom: 5px;
    margin-top: 10px; margin-left: 13px;
    margin-right: 13px;
    border-bottom: 1px solid #EFEFEF;
  }
  .divCourse .divItems .divItem:last-child{
    border-bottom: none;
  }
  .divCourse .divItems .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divCourse .divItems .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divCourse .divItems .divItem .divCourse .imgItem1{
    border-top-left-radius: 6px; border-top-right-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divCourse .divItems .divItem .divCourse .divRadius{
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
  .divCourse .divItems .divItem .divCourse .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .divCourse .divItems .divItem .divCourse .divRadius .lblTimer{
    color: #FFF;
    font-size: 14px;
    margin-top: 1px;
  }
  .divCourse .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divCourse .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: bold;
    flex: 1; width: 120px; height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divCourse .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
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
  .divCourse .divItems .divItem .divContent .divTop .divTitle1 .divLive{
    background:linear-gradient(137deg, #3a37fa 0%, #00a375 100%);
  }
  .divCourse .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
    image-rendering: optimizeQuality;
  }
  .divCourse .divItems .divItem .divContent .divDesc2{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divCourse .divItems .divItem .divContent .divBottom2{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divCourse .divItems .divItem .divContent .divBottom2 .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divCourse .divItems .divItem .divContent .divBottom2 .divOriginalPrice{
    font-size: 11px;
    color: #999999;
    margin-left: 3px;
    text-decoration: line-through;
  }
  .divCourse .divItems .divItem .divContent .divBottom2 .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divCourse .divItems .divItem .divContent .divBottom2 .divNumber .imgNum{
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  .divCourse .divItems .divItem .divContent .divBottom2 .divNumber .divNum{
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divCourse .divRichText{
    font-size: 14px;
    padding-left:10px;
    padding-right:10px;
  }
</style>
