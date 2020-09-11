<template>
  <div class="page divVideoCourse" :style="{height: height}">
    <div class="divVideo">
      <video id="videoEl" class="video"
        preload autoplay
        playsinline="isiPhoneShowPlaysinline"
        x5-video-player-type="h5-page"
        t7-video-player-type="inline"
        webkit-playsinline="isiPhoneShowPlaysinline"
        x-webkit-airplay="allow"
      @play="playEvent" @pause="pauseEvent" @loadedmetadata="onLoadedMetaData" @timeupdate="onTimeUpdate" @ended="onEnded"/>

      <div class="divPlayContext" @click="videoPause">
        <img :src="(playStatus == 'playing')?require('@/assets/images/course/videoPlay.png'):require('@/assets/images/course/videoPause.png')" class="imgPlay" v-if="endOfAudition == false && showPlayStatus" />
        <div class="divAdvisory" v-if="endOfAudition">
          <div class="divTip" v-if="course.coursePermission == 2">试听已结束，购买或成为VIP后可学习完整版课程</div>
          <div class="divTip" v-if="course.coursePermission == 3">试听已结束，购买后学习完整版课程</div>
          <button class="btnVIP" @click="gotoVIP" v-if="course.coursePermission == 2">成为VIP</button>
        </div>
      </div>
      <div class="divControl">
        <div class="divScroll">
          <label>{{currentTimer}}</label>
          <van-slider class="divSlider" :style="{marginTop: (this.browserType == 'WeChat')?'-2px':'3px'}" v-model="sliderValue" :max="sliderMax" @drag-start="sliderDragStart" @drag-end="sliderDragEnd" @change="sliderChange" bar-height="4px" active-color="rgb(245,110,137)" inactive-color="rgb(216,216,216)"/>
          <label>{{source.duration | formatDuration}}</label>
        </div>
        <div class="divNumberRate" @click="setPlaybackRate">{{playbackRate | playbackRate}}</div>
        <div class="divFullScreen" v-if="browserType != 'WeChat'" @click="requestFullscreen">
          <img src="@/assets/images/course/fullScreen.png" class="imgFullScreen"/>
        </div>
      </div>
    </div>
    <div class="divBase">
      <div class="divTitle">精品专家课 | 孕期产检究竟要过多少关？产科主任为你指点迷津！</div>
      <img src="@/assets/images/course/audition.png" class="imgIsTry" v-if="isTrialLesson"/>
    </div>
    <router-link :to="'/expertIntro/' + course.expert.uuid + '/'" class="divSpeaker">
      <img :src="course.expert.avatar" class="imgAvatar"/>
      <div class="divBaseInfo">
        <div class="divName">{{course.expert.name}}</div>
        <div class="divInfo" v-if="course.expert.hospital != null | course.expert.jobTitle != null">{{course.expert.hospital}} {{course.expert.jobTitle}}</div>
      </div>
      <img src="@/assets/images/course/right.png" class="imgRight"/>
    </router-link>
    <van-tabs line-width="33" line-height="3" color="#FF6B88" title-active-color="#FF6B88" title-inactive-color="#333333">
      <van-tab title="课程目录">
        <vue-chapter-list @itemClick="itemClickCallback" :chapters="course.chapters" :preChapter="course.preChapter" :canStudy="course.canStudy" :showChapter="false"/>
      </van-tab>
      <van-tab title="互动讨论">
        <vue-comment-list ref="commentList" :courseUUID="course.uuid" :showReply="false"/>
      </van-tab>
    </van-tabs>

    <div class="divBottom" v-if="endOfAudition == false">
      <div class="divComment">
        <input placeholder="输入评论内容或提问" class="iptComment" v-model="content" v-on:keydown="keydown" v-on:blur="onBlur"/>
      </div>
      <div class="divFavorites" @click="btnFavorites">
        <img src="@/assets/images/course/favorited.png" class="imgFavorites" v-if="course.isLike == true"/>
        <img src="@/assets/images/course/favourite.png" class="imgFavorites" v-if="course.isLike == false"/>
        <span :class="(course.isLike == true)?'spanRed':'spanGray'">收藏</span>
      </div>
    </div>
    <div class="divBottomBuy" v-if="endOfAudition == true" @click="gotoBuy">
      <span>券后¥{{(course.realPrice - couponPrice) | formatMoney}}</span>购买完整课程
    </div>
    <van-popup v-model="showPayDetail" position="bottom" :style="{ height: '290px' }">
      <vue-pay-detail ref="payDetail" :proCourse="course" @closeWindows="closeWindows" />
    </van-popup>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import { formatDuration } from '../utils'
import * as request from '../service/course.js'
import chapterList from '../components/chapterList.vue';
import commentList from '../components/commentList.vue';
import payDetail from '../components/payDetail.vue';

export default {
  name: 'videoCourse',
  props: {
    proCourse: {
      type: Object,
      default: {}
    },
    proPlayIndex: {
      type: Number,
      default: 0
    },
    isTrialLesson: {
      type: Boolean,
      default: false
    },
    couponPrice: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    height: (window.innerHeight-35) + "px",
    course: {expert:{}},
    source: {}, //视频源存放
    content: '',
    courseType: 3,

    currentTimer: '00:00',
    playStatus: 'playing',
    playbackRate: 1,
    playIndex: 0,
    sliderValue: 0,
    sliderMax: 1,
    dragStatus: "stop",
    showPlayStatus: false,
    //试听结束
    endOfAudition: false,
    browserType: false,
    showPayDetail: false
  }),
  components: {
    "vue-chapter-list": chapterList,
    "vue-comment-list": commentList,
    "vue-pay-detail": payDetail
  },
  methods: {
    initiaSource: function(source){
      this.source = source; this.currentTimer = "00:00";
      if(this.browserType == 'WeChat'){
        this.playStatus = "playing";
      }else {
        this.playStatus = "pause";
      }
      document.getElementById('videoEl').setAttribute("src", this.source.url);
    },
    onBlur(){
      var timeout = setTimeout(function(){
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0)); clearTimeout(timeout);
      }, 100);
    },
    isWeChatAndQQ: function (){
      var ua = navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == "micromessenger") {
          this.browserType = "WeChat"; return;
      }
      this.browserType = "Browser";
    },
    requestFullscreen: function(){
      if(this.browserType == 'WeChat'){
        document.getElementById("videoEl").webkitRequestFullscreen();
      }else {
        document.getElementById("videoEl").requestFullscreen();
      }
    },
    setPlaybackRate: function(){
      switch (this.playbackRate) {
        case 1:
          this.playbackRate = 1.5;
          document.getElementById('videoEl').playbackRate = this.playbackRate;
          break;
        case 1.5:
          this.playbackRate = 2;
          document.getElementById('videoEl').playbackRate = this.playbackRate;
          break;
        case 2:
          this.playbackRate = 0.8;
          document.getElementById('videoEl').playbackRate = this.playbackRate;
          break;
        case 0.8:
          this.playbackRate = 1;
          document.getElementById('videoEl').playbackRate = this.playbackRate;
          break;
        default:
            break;
      }
    },
    refreshList: function(){
      for (let i = 0; i < this.course.chapters.length; i++) {
        if(this.course.chapters[i].uuid == this.uuid){
          var item = this.course.chapters[i];
          item.playStatus = 'playing'; this.$set(this.course.chapters, i, item);
        }else {
          var item = this.course.chapters[i];
          item.playStatus = 'stop';
          this.$set(this.course.chapters, i, item)
        }
      }
    },
    itemClickCallback: function(uuid){
      for (let i = 0; i < this.course.chapters.length; i++) {
        if(this.course.chapters[i].uuid == uuid && this.course.chapters[i].source == null){
          Dialog({ message: '请购买课程，才能听课。' }); this.endOfAudition = true; return;
        }
      }

      for (let i = 0; i < this.course.chapters.length; i++) {
        if(this.course.chapters[i].uuid == uuid){
          this.playIndex = i;
          if(this.course.chapters[this.playIndex].chapterStyle == 1){
            //跳转直播
          }else if(this.course.chapters[this.playIndex].chapterStyle == 2){
            document.getElementById('videoEl').pause();
            this.$emit('closeVideoCourse', this.playIndex);
          }else if(this.course.chapters[this.playIndex].chapterStyle == 3){
            this.endOfAudition = false;
            var item = this.course.chapters[i]; this.uuid = this.course.chapters[this.playIndex].uuid;
            item.playStatus = 'playing'; this.$set(this.course.chapters, i, item);
            this.initiaSource(this.course.chapters[i].source);
          }
        }else {
          var item = this.course.chapters[i];
          item.playStatus = 'stop';
          this.$set(this.course.chapters, i, item)
        }
      }
    },
    onLoadedMetaData: function (event) {
      this.sliderMax = parseInt(event.currentTarget.duration * 100);
      this.currentTimer = '00:00'; this.sliderValue = 0;
    },
    onTimeUpdate: function (event){
      this.currentTimer = formatDuration(event.currentTarget.currentTime);
      if(this.dragStatus == "stop"){
        this.sliderValue = parseInt(event.currentTarget.currentTime * 100);
      }
    },
    onEnded: function (event){
      if(this.courseType == 3){
        //单循环播放一次
        if(this.playIndex >= (this.course.chapters.length - 1)){
          Dialog({ message: '循环播放完毕。' });
          this.currentTimer = "00:00"; this.playStatus = "playing"; this.sliderValue = 0;
          for (let i = 0; i < this.course.chapters.length; i++) {
            var item = this.course.chapters[i]; item.playStatus = 'stop';
            this.$set(this.course.chapters, i, item);
          }
          this.$emit('closeVideoCourse');
        }else {
          this.playIndex++;
          if(this.course.chapters[this.playIndex].source == null){
            for (let i = 0; i < this.course.chapters.length; i++) {
              var item = this.course.chapters[i];
              item.playStatus = 'stop';
              this.$set(this.course.chapters, i, item);
            }
            document.getElementById('videoEl').setAttribute("src", "");
            Dialog({ message: '你需要购买此章节。' }); this.endOfAudition = true;
          }else {
            if(this.course.chapters[this.playIndex].chapterStyle == 1){
              //跳转直播
            }else if(this.course.chapters[this.playIndex].chapterStyle == 2){
              document.getElementById('videoEl').pause();
              this.$emit('closeVideoCourse', this.playIndex);
            }else if(this.course.chapters[this.playIndex].chapterStyle == 3){
              this.uuid = this.course.chapters[this.playIndex].uuid;
              this.initiaSource(this.course.chapters[this.playIndex].source); this.refreshList();
            }
          }
        }
      }else {
        event.currentTarget.pause(); this.currentTimer = '00:00';
        this.sliderValue = 0; this.playStatus = 'playing';
      }
    },
    sliderChange: function(value){
      document.getElementById("videoEl").currentTime = (value/100); var that = this;
      document.getElementById("videoEl").play(); this.playStatus = 'pause';
      var timeout = setTimeout(()=>{ clearTimeout(timeout); that.showPlayStatus = false; }, 500);
    },
    sliderDragStart: function(){
      this.dragStatus = "droping";
    },
    sliderDragEnd: function(){
      this.dragStatus = "stop";
    },
    dataInitil: function (playIndex, uuid) {
      this.endOfAudition = false;
      this.playIndex = playIndex; this.uuid = uuid; this.refreshList();
      this.initiaSource(this.course.chapters[this.playIndex].source);
    },
    videoPause: function () {
      if(this.playStatus == 'pause'){
        document.getElementById("videoEl").pause();
        for (let i = 0; i < this.course.chapters.length; i++) {
          var item = this.course.chapters[i];
          item.playStatus = 'stop';
          this.$set(this.course.chapters, i, item);
        }
      }else {
        document.getElementById("videoEl").play();
        this.refreshList();
      }
    },
    btnFavorites: function(){
      var that = this;
      if(this.course.isLike == false){
        request.behavior({courseUuid: this.$route.params.uuid, behaviorType: 2}).then((json) => {
          if(json.code == 200){
            that.course.isLike = true; Toast(json.msg);
          }
        });
      }else {
        request.cancelBehavior({courseUuid: this.$route.params.uuid, behaviorType: 2}).then((json) => {
          if(json.code == 200){
            that.course.isLike = false; Toast(json.msg);
          }
        });
      }
    },
    keydown: function(e){
      if(!e){ e = window.event; }
	    if(e.keyCode == 13){
        var that = this;
        request.getAddComment({uuid: this.$route.params.uuid, content: e.target.value}).then((json) => {
          if(json.code == 200){
            if(that.$refs.commentList != undefined){
              that.$refs.commentList.initiaData();
            }
            that.content = ''; Toast(json.msg);
          }
        });
	    }
    },
    playEvent: function(){
      this.playStatus = 'pause'; var that = this; this.refreshList();
      if(this.browserType == 'WeChat'){
        this.showPlayStatus = false;
      }else {
        var timeout = setTimeout(()=>{ clearTimeout(timeout); that.showPlayStatus = false; }, 200);
      }
    },
    pauseEvent: function(){
      this.showPlayStatus = true; this.playStatus = 'playing';
      for (let i = 0; i < this.course.chapters.length; i++) {
        var item = this.course.chapters[i];
        item.playStatus = 'stop';
        this.$set(this.course.chapters, i, item);
      }
    },
    gotoBuy(){
      this.showPayDetail = true;
      if(this.$refs.payDetail != undefined){
        this.$refs.payDetail.initiaData();
      }
    },
    closeWindows: function (flag) {
      if(flag == false){
        this.showPayDetail = false;
      }else if(flag == true){
        this.showPayDetail = false; location.reload();
      }
    },
    gotoVIP(){
      debugger;
      // this.$router.push('/course/' + uuid);
    }
  },
  mounted() {
    this.isWeChatAndQQ();
    this.playIndex = this.proPlayIndex;
    this.course = this.proCourse;
    this.uuid = this.course.chapters[this.playIndex].uuid;
    this.initiaSource(this.course.chapters[this.playIndex].source);
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
  .divVideoCourse{
    width: 100%;
  }
  .divVideoCourse .divVideo{
    width: 100%; height: 230px;
    position: sticky;
    top: 0; z-index: 10;
  }
  .divVideoCourse .divVideo video{
    width: 100%; height: 230px; position: absolute;
    background-color: #333333;
  }
  .divVideoCourse .divVideo .divPlayContext{
    position: absolute;
    padding-top: 90px;
    text-align: center; width: 100%; height: 205px; box-sizing: border-box;
  }
  .divVideoCourse .divVideo .divPlayContext .imgPlay{
    width: 50px; height: 50px;
  }
  .divVideoCourse .divVideo .divPlayContext .divAdvisory{
    width: 100%; text-align: center;
  }
  .divVideoCourse .divVideo .divPlayContext .divAdvisory .divTip{
    font-size: 14px; color: #FFFFFF;
  }
  .divVideoCourse .divVideo .divPlayContext .divAdvisory .btnVIP{
    font-size: 14px; color: #FFF; border: 1px solid #979797;
    border-radius: 20px; display: flex; align-items: center;
    background-color: transparent; width: 100px;
    justify-content: center; height: 35px; padding-bottom: 5px;
    margin-top: 20px; margin-left: auto; margin-right: auto;
  }

  .divVideoCourse .divVideo .divControl{
    position: absolute;
    display: flex; flex-direction: row;
    align-items: center; width: 100%; margin-top: 204px;
  }
  .divVideoCourse .divVideo .divControl .divScroll{
    display: flex; align-items: center; justify-content: center;
    flex-direction: row; box-sizing: border-box;
    flex: 1; padding-left: 10px; padding-right: 10px; height: 20px;
  }
  .divVideoCourse .divVideo .divControl .divScroll label{
    font-size: 12px; color: #FFF; width: 30px;
  }
  .divVideoCourse .divVideo .divControl .divScroll .divSlider{
    flex: 1; margin-left: 13px; margin-right: 13px;
    margin-top: -2px; overflow: visible;
  }
  .divVideoCourse .divVideo .divControl .divNumberRate{
    background-color: #333333; opacity: 0.8; width: 28px;
    font-size: 12px; color: #FFF; display: flex;
    align-items: center; justify-content: center;
    padding-left: 3px; padding-right: 3px; border-radius: 3px;
    line-height: 22px; margin-right: 10px;
  }
  .divVideoCourse .divVideo .divControl .divFullScreen{
    width: 20px; height: 20px; display: flex; align-items: center;
    background-color: #333333; border-radius: 4px; opacity: 0.8;
    justify-content: center; margin-right: 10px;
    padding: 1px;
  }
  .divVideoCourse .divVideo .divControl .divFullScreen .imgFullScreen{
    width: 14px; height: 14px;
  }
  .divVideoCourse .divBase{
    padding-top: 10px; position: sticky;
    top: 230.5px; z-index: 10; width: 100%;
    background-color: #FFF; padding-bottom: 8px;
  }
  .divVideoCourse .divBase .divTitle{
    font-size: 18px; font-weight: bold;
    color: #333333; margin-left: 12px; margin-right: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .divVideoCourse .divBase .imgIsTry{
    margin-left: 12px; margin-right: 12px; margin-top: 8px;
    width: 45px; display: block;
  }
  .divVideoCourse .divSpeaker{
    background-repeat: no-repeat;
    background-image: url('~@/assets/images/course/bg.png');
    background-size: 100% 100%;
    width: 93%; display: flex; align-items: center;
    justify-content: center; height: 80px;
    margin-top: 5px; margin-left: auto; margin-right: auto;
    padding: 10px; box-sizing: border-box;
  }
  .divVideoCourse .divSpeaker .imgAvatar{
    width: 56px; height: 56px; border-radius: 50%;
    margin-right: 8px;
  }
  .divVideoCourse .divSpeaker .divBaseInfo{
    flex: 1;
  }
  .divVideoCourse .divSpeaker .divBaseInfo .divName{
    font-size: 15px; color: #333333; font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divVideoCourse .divSpeaker .divBaseInfo .divInfo{
    font-size: 14px; color: #999999; font-weight: 500;
    margin-top: 8px; display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divVideoCourse .divSpeaker .imgRight{
    width: 9px; margin-right: 5px;
  }
  .divVideoCourse .divBottom{
    position: fixed; width: 100%; bottom: 0px;
    padding-bottom: 8px; display: flex; align-items: center;
    background-color: #FFF; padding-top: 5px;
  }
  .divVideoCourse .divBottom .divComment{
    border-radius: 20px; display: flex;
    background-color: rgb(245, 249, 255);
    flex: 1; margin-left: 10px; margin-right: 8px;
    height: 35px; padding-left: 12px; padding-right: 12px;
  }
  .divVideoCourse .divBottom .divComment .iptComment{
    font-size: 14px; font-weight: 500; border: none;
    background-color: rgb(245, 249, 255); width: 100%;
  }
  .divVideoCourse .divBottom .divFavorites{
    display: flex; align-items: center;
    justify-content: center; margin-right: 10px;
  }
  .divVideoCourse .divBottom .divFavorites .imgFavorites{
    width: 26px; margin-right: 2px;
  }
  .divVideoCourse .divBottom .divFavorites .spanGray{
    margin-top: 5px; font-size: 14px; color: #333333;
  }
  .divVideoCourse .divBottom .divFavorites .spanRed{
    margin-top: 5px; font-size: 14px; color: #FF6B88;
  }
  .divVideoCourse .divBottomBuy{
    position: fixed; width: 100%; bottom: 0px; height: 46px;
    display: flex; align-items: center; justify-content: center;
    background:linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    font-size: 18px; font-weight: 500; color: #FFF;
    letter-spacing: 1px;
  }
  .divVideoCourse .divBottomBuy span{
    font-size: 13px; font-weight: 500; margin-right: 10px;
  }
</style>
