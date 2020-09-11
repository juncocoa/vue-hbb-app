<template>
  <div class="page divAudioCourse" :style="{height: height}">
    <div class="divIcon">
      <van-image class="imgIcon" fit="contain" :src="course.icon"/>
    </div>
    <div class="divTitle">{{course.name}}</div>
    <div class="divAudition" v-if="isTrialLesson">
      <img src="@/assets/images/course/audition.png" class="imgAudition"/>
    </div>
    <router-link :to="'/expertIntro/' + course.expert.uuid + '/'" class="divSpeaker">
      <img :src="course.expert.avatar" class="imgAvatar"/>
      <div class="divBaseInfo">
        <div class="divName">{{course.expert.name}}</div>
        <div class="divInfo" v-if="course.expert.hospital != null | course.expert.jobTitle != null">{{course.expert.hospital}} {{course.expert.jobTitle}}</div>
      </div>
      <img src="@/assets/images/course/right.png" class="imgRight"/>
    </router-link>
    <div class="divSchedule">
      <div class="divTimer">{{currentTimer}}</div>
      <van-slider class="divSlider" v-model="sliderValue" :max="sliderMax" @drag-start="sliderDragStart" @drag-end="sliderDragEnd" @change="sliderChange" bar-height="4px" active-color="rgb(245,110,137)" inactive-color="rgb(216,216,216)"/>
      <div class="divTimer">{{source.duration | formatDuration}}</div>
    </div>
    <div class="divContent">
      <audio id="audioEl" autoplay preload class="audioEl" @canplay="canplayEvent" @play="playEvent" @pause="pauseEvent" @error="errorEvent" @loadedmetadata="onLoadedMetaData" @timeupdate="onTimeUpdate" @ended="onEnded"/>
      <div class="divMenu" @click="showPlayListFn(true)"></div>
      <div class="divControl">
        <div class="divPrev" @click="coursePrev"></div>
        <div :class="(playStatus == 'playing')?'divPlay':'divPause'" @click="coursePlay"></div>
        <div class="divNext" @click="courseNext"></div>
      </div>
      <div class="divSpeed" @click="setPlaybackRate">{{playbackRate | playbackRate}}</div>
    </div>

    <div class="divBottom" v-if="endOfAudition == false">
      <div class="divComment">
        <input placeholder="输入评论内容或提问" class="iptComment" v-model="content" v-on:keydown="keydown" v-on:blur="onBlur"/>
      </div>
      <div class="divButton">
        <img src="@/assets/images/course/msg.png" class="imgMsg" @click="showCommentEvent"/>
        <div class="divFavorites" @click="btnFavorites">
          <img src="@/assets/images/course/favorited.png" class="imgFavorites" v-if="course.isLike == true"/>
          <img src="@/assets/images/course/favourite.png" class="imgFavorites" v-if="course.isLike == false"/>
          <span :class="(course.isLike == true)?'spanRed':'spanGray'">收藏</span>
        </div>
      </div>
    </div>
    <div class="divBottomBuy" v-if="endOfAudition == true" @click="gotoBuy">
      <span>券后¥{{(course.realPrice - couponPrice) | formatMoney}}</span>购买完整课程
    </div>
    <van-popup v-model="showPlayList" round position="bottom" :style="{ height: '70%' }">
      <div class="divPlayTitle">播放列表<span>（{{(course.chapters)?course.chapters.length:0}}）</span></div>
      <div :style="{overflowX: 'hidden',overflowY: 'auto', height: chapterListHeight}">
        <vue-chapter-list @itemClick="itemClickCallback" :chapters="course.chapters" :preChapter="course.preChapter" :canStudy="course.canStudy" :showChapter="false"/>
      </div>
      <div class="divPlayClose" @click="showPlayListFn(false)">关闭</div>
    </van-popup>
    <van-popup v-model="showCommentList" position="bottom" :style="{ height: '95%' }">
      <vue-comment-list ref="commentList" :courseUUID="course.uuid" :showReply="true" :showPullRefresh="true"/>
    </van-popup>
    <van-popup v-model="showVideoPlay" position="bottom" :style="{ height: '100%' }">
      <vue-video-play ref="videoPlay" @closeVideoCourse="closeVideoCourse" :couponPrice="couponPrice" :proCourse="course" :proPlayIndex="playIndex" :isTrialLesson="isTrialLesson"/>
    </van-popup>
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
import videoCourse from '../components/videoCourse.vue';
import payDetail from '../components/payDetail.vue';

export default {
  name: 'audioCourse',
  data: () => ({
    height: (window.innerHeight-35) + "px",
    chapterListHeight: ((window.innerHeight*0.7)-101) + "px",
    course: {expert:{}},
    list: [],
    content: '',
    isTrialLesson: false,
    showPlayList: false,
    showCommentList: false,
    courseType: 1, //1:单次课，2：系列课

    source: {}, //视频源存放
    uuid: '',
    currentTimer: '00:00',
    playStatus: 'playing',
    sliderMax: 1,
    sliderValue: 0,
    playIndex: 0,
    playbackRate: 1,
    dragStatus: "stop",
    showVideoPlay: false,
    //试听结束
    endOfAudition: false,
    showPayDetail: false,

    couponPrice: 0 //优惠券价格
  }),
  components: {
    "vue-chapter-list": chapterList,
    "vue-comment-list": commentList,
    "vue-video-play": videoCourse,
    "vue-pay-detail": payDetail
  },
  methods: {
    initiaSource: function(source){
      this.source = source; this.currentTimer = "00:00";
      document.getElementById('audioEl').setAttribute("src", this.source.url); document.getElementById('audioEl').load();
    },
    onBlur(){
      var timeout = setTimeout(function(){
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0)); clearTimeout(timeout);
      }, 100);
    },
    filterLiveLessons: function (value) {
      var tempArray = [];
      for (let i = 0; i < value.chapters.length; i++) {
        if(value.chapters[i].chapterStyle == 2 || value.chapters[i].chapterStyle == 3){
          tempArray.push(value.chapters[i]);
        }
      }
      value.chapters = tempArray;
      return value;
    },
    initiaData: function(){
      var that = this;
      if(this.$route.params.playIndex == undefined){
        this.playIndex = 0;
      }else {
        this.playIndex = parseInt(this.$route.params.playIndex);
      }
      request.getCourseDetail({uuid: this.$route.params.uuid}).then((res) => {
        if(res.code == 200){
          that.course = that.filterLiveLessons(res.data);
          that.isTrialLesson = (res.data.canStudy == false && res.data.haveTry == true);
          that.courseType = res.data.courseType; //1:单次课，2：系列课
          if(that.course.coupons != null){ that.getUserCoupons(); } //优惠券
          if(res.data.canStudy == true){
            request.getCourseSource({uuid: that.$route.params.uuid}).then((json) => {
              if(json.code == 200){
                that.list = json.data;
                for (let i = 0; i < json.data.length; i++) {
                  for (let j = 0; j < that.course.chapters.length; j++) {
                    if(json.data[i].uuid === that.course.chapters[j].uuid){
                      that.course.chapters[j].source = json.data[i].source;
                      that.course.chapters[j].playStatus = "stop"; break;
                    }
                  }
                }

                if(that.course.chapters[that.playIndex].chapterStyle == 2){
                  that.uuid = that.course.chapters[that.playIndex].uuid; that.initiaSource(that.course.chapters[that.playIndex].source);
                  that.course.chapters[that.playIndex].playStatus = "playing";
                }else if(that.course.chapters[that.playIndex].chapterStyle == 3){
                  that.uuid = that.course.chapters[that.playIndex].uuid;
                  that.showVideoPlay = true; that.refreshList();
                  if(that.$refs.videoPlay != undefined){
                    that.$refs.videoPlay.dataInitil(that.playIndex, that.uuid);
                  }
                }
              }
            });
          }else {
            for (let j = 0; j < that.course.chapters.length; j++) {
              if(that.course.chapters[j].tryInfo != null){
                if(j === that.playIndex){
                  //当前点击章节
                  that.course.chapters[j].source = that.course.chapters[j].tryInfo;
                  if(that.course.chapters[that.playIndex].chapterStyle == 2){
                    that.course.chapters[j].playStatus = "playing";
                    that.uuid = that.course.chapters[j].uuid; that.initiaSource(that.course.chapters[j].source);
                  }else if(that.course.chapters[that.playIndex].chapterStyle == 3){
                    that.uuid = that.course.chapters[that.playIndex].uuid;
                    that.showVideoPlay = true; that.refreshList();
                    if(that.$refs.videoPlay != undefined){
                      that.$refs.videoPlay.dataInitil(that.playIndex, that.uuid);
                    }
                  }
                }else {
                  //有试听 但 不是选择的章节
                  that.course.chapters[j].source = that.course.chapters[j].tryInfo;
                  that.course.chapters[j].playStatus = "stop";
                }
              }else {
                //没有试听课件
                that.course.chapters[j].source = null;
                that.course.chapters[j].playStatus = "stop";
              }
            }
          }
        }
      });
    },

    closeVideoCourse: function (playIndex) {
      if(playIndex == undefined){
        this.playIndex = 0; this.showVideoPlay = false;
        for (let i = 0; i < this.course.chapters.length; i++) {
          var item = this.course.chapters[i];
          item.playStatus = 'stop';
          this.$set(this.course.chapters, i, item);
        }
      }else {
        this.playIndex = playIndex; this.showVideoPlay = false;
        if(this.course.chapters[this.playIndex].source == null){
          for (let i = 0; i < this.course.chapters.length; i++) {
            var item = this.course.chapters[i];
            item.playStatus = 'stop';
            this.$set(this.course.chapters, i, item);
          }
          Dialog({ message: '你需要购买此章节。' }); this.endOfAudition = true;
        }else {
          this.uuid = this.course.chapters[this.playIndex].uuid;
          this.initiaSource(this.course.chapters[this.playIndex].source); this.refreshList();
        }
      }
    },
    showPlayListFn: function(val){
      if(this.courseType == 2){
        this.showPlayList = val;
        if(val == true && this.playStatus == 'pause'){
          this.refreshList();
        }
      }else {
        Dialog({ message: '单次课，没有播放列表。' });
      }
    },
    showCommentEvent: function(){
      this.showCommentList = true;
      if(this.$refs.commentList != undefined){
        this.$refs.commentList.initiaData();
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
            that.content = ''; Toast(json.msg);
          }
        });
	    }
    },
    setPlaybackRate: function(){
      switch (this.playbackRate) {
        case 1:
          this.playbackRate = 1.5;
          document.getElementById('audioEl').playbackRate = this.playbackRate;
          break;
        case 1.5:
          this.playbackRate = 2;
          document.getElementById('audioEl').playbackRate = this.playbackRate;
          break;
        case 2:
          this.playbackRate = 0.8;
          document.getElementById('audioEl').playbackRate = this.playbackRate;
          break;
        case 0.8:
          this.playbackRate = 1;
          document.getElementById('audioEl').playbackRate = this.playbackRate;
          break;
        default:
            break;
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
            this.uuid = this.course.chapters[this.playIndex].uuid;
            var item = this.course.chapters[i]; this.showPlayList = false; this.endOfAudition = false;
            item.playStatus = 'playing'; this.$set(this.course.chapters, i, item);
            this.initiaSource(this.course.chapters[i].source);
          }else if(this.course.chapters[this.playIndex].chapterStyle == 3){
            document.getElementById('audioEl').pause();
            this.uuid = this.course.chapters[this.playIndex].uuid; this.refreshList();
            this.showPlayList = false; this.showVideoPlay = true;
            if(this.$refs.videoPlay != undefined){
              this.$refs.videoPlay.dataInitil(this.playIndex, this.uuid);
            }
          }
        }else {
          var item = this.course.chapters[i];
          item.playStatus = 'stop';
          this.$set(this.course.chapters, i, item)
        }
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
    coursePrev: function () {
      if(this.courseType == 2){
        //上一课
        if(this.playIndex <= 0){
          if(this.course.chapters[(this.course.chapters.length - 1)].source != null){
            this.playIndex = (this.course.chapters.length - 1);
            if(this.course.chapters[this.playIndex].chapterStyle == 1){
              //跳转直播
            }else if(this.course.chapters[this.playIndex].chapterStyle == 2){
              this.uuid = this.course.chapters[this.playIndex].uuid;
              this.initiaSource(this.course.chapters[this.playIndex].source); this.refreshList();
            }else if(this.course.chapters[this.playIndex].chapterStyle == 3){
              document.getElementById('audioEl').pause();
              this.uuid = this.course.chapters[this.playIndex].uuid; this.refreshList();
              this.showPlayList = false; this.showVideoPlay = true;
              if(this.$refs.videoPlay != undefined){
                this.$refs.videoPlay.dataInitil(this.playIndex, this.uuid);
              }
            }
          }else {
            Dialog({ message: '请购买课程，才能听课。' }); this.endOfAudition = true;
          }
        }else {
          if(this.course.chapters[(this.playIndex - 1)].source != null){
            this.playIndex--;
            if(this.course.chapters[this.playIndex].chapterStyle == 1){
              //跳转直播
            }else if(this.course.chapters[this.playIndex].chapterStyle == 2){
              this.uuid = this.course.chapters[this.playIndex].uuid;
              this.initiaSource(this.course.chapters[this.playIndex].source); this.refreshList();
            }else if(this.course.chapters[this.playIndex].chapterStyle == 3){
              document.getElementById('audioEl').pause();
              this.uuid = this.course.chapters[this.playIndex].uuid; this.refreshList();
              this.showPlayList = false; this.showVideoPlay = true;
              if(this.$refs.videoPlay != undefined){
                this.$refs.videoPlay.dataInitil(this.playIndex, this.uuid);
              }
            }
          }else {
            Dialog({ message: '请购买课程，才能听课。' }); this.endOfAudition = true;
          }
        }
      }else {
        Dialog({ message: '单次课，不能上一课。' });
      }
    },
    coursePlay: function () {
      if(this.playStatus == "playing"){
        document.getElementById("audioEl").play();
        if(this.courseType == 2){ this.refreshList(); }
      }else if(this.playStatus == "pause"){
        document.getElementById("audioEl").pause();
        if(this.courseType == 2){
          for (let i = 0; i < this.course.chapters.length; i++) {
            var item = this.course.chapters[i];
            item.playStatus = 'stop';
            this.$set(this.course.chapters, i, item);
          }
        }
      }
    },
    courseNext: function () {
      if(this.courseType == 2){
        //下一课
        if(this.playIndex >= (this.course.chapters.length - 1)){
          if(this.course.chapters[0].source != null){
            this.playIndex = 0;
            if(this.course.chapters[this.playIndex].chapterStyle == 1){
              //跳转直播
            }else if(this.course.chapters[this.playIndex].chapterStyle == 2){
              this.uuid = this.course.chapters[this.playIndex].uuid;
              this.initiaSource(this.course.chapters[this.playIndex].source); this.refreshList();
            }else if(this.course.chapters[this.playIndex].chapterStyle == 3){
              document.getElementById('audioEl').pause();
              this.uuid = this.course.chapters[this.playIndex].uuid; this.refreshList();
              this.showPlayList = false; this.showVideoPlay = true;
              if(this.$refs.videoPlay != undefined){
                this.$refs.videoPlay.dataInitil(this.playIndex, this.uuid);
              }
            }
          }else {
            Dialog({ message: '请购买课程，才能听课。' }); this.endOfAudition = true;
          }
        }else {
          if(this.course.chapters[(this.playIndex + 1)].source != null){
            this.playIndex++;
            if(this.course.chapters[this.playIndex].chapterStyle == 1){
              //跳转直播
            }else if(this.course.chapters[this.playIndex].chapterStyle == 2){
              this.uuid = this.course.chapters[this.playIndex].uuid;
              this.initiaSource(this.course.chapters[this.playIndex].source); this.refreshList();
            }else if(this.course.chapters[this.playIndex].chapterStyle == 3){
              document.getElementById('audioEl').pause();
              this.uuid = this.course.chapters[this.playIndex].uuid; this.refreshList();
              this.showPlayList = false; this.showVideoPlay = true;
              if(this.$refs.videoPlay != undefined){
                this.$refs.videoPlay.dataInitil(this.playIndex, this.uuid);
              }
            }
          }else {
            Dialog({ message: '请购买课程，才能听课。' }); this.endOfAudition = true;
          }
        }
      }else {
        Dialog({ message: '单次课，不能下一课。' });
      }
    },
    canplayEvent: function(event){
      document.getElementById('audioEl').play(); this.playStatus = "pause";
    },
    onLoadedMetaData: function (event) {
      this.sliderMax = parseInt(event.currentTarget.duration * 100);
      this.currentTimer = '00:00'; this.sliderValue = 0;
      document.getElementById('audioEl').play();
    },
    onTimeUpdate: function (event){
      this.currentTimer = formatDuration(event.currentTarget.currentTime);
      if(this.dragStatus == "stop"){
        this.sliderValue = parseInt(event.currentTarget.currentTime * 100);
      }
      // this.setPercentage(event.currentTarget.duration, event.currentTarget.currentTime);
    },
    onEnded: function (event){
      if(this.courseType == 2){
        //单循环播放一次
        if(this.playIndex >= (this.course.chapters.length - 1)){
          Dialog({ message: '循环播放完毕。' });
          this.currentTimer = "00:00"; this.playStatus = "playing"; this.sliderValue = 0;
          for (let i = 0; i < this.course.chapters.length; i++) {
            var item = this.course.chapters[i]; item.playStatus = 'stop';
            this.$set(this.course.chapters, i, item);
          }
        }else {
          this.playIndex++;
          if(this.course.chapters[this.playIndex].source == null){
            for (let i = 0; i < this.course.chapters.length; i++) {
              var item = this.course.chapters[i];
              item.playStatus = 'stop';
              this.$set(this.course.chapters, i, item);
            }
            Dialog({ message: '你需要购买此章节。' }); this.endOfAudition = true;
          }else {
            if(this.course.chapters[this.playIndex].chapterStyle == 1){
              //跳转直播
            }else if(this.course.chapters[this.playIndex].chapterStyle == 2){
              this.uuid = this.course.chapters[this.playIndex].uuid;
              this.initiaSource(this.course.chapters[this.playIndex].source); this.refreshList();
            }else if(this.course.chapters[this.playIndex].chapterStyle == 3){
              document.getElementById('audioEl').pause();
              this.uuid = this.course.chapters[this.playIndex].uuid; this.refreshList();
              this.showPlayList = false; this.showVideoPlay = true;
              if(this.$refs.videoPlay != undefined){
                this.$refs.videoPlay.dataInitil(this.playIndex, this.uuid);
              }
            }
          }
        }
      }else {
        event.currentTarget.pause(); this.currentTimer = '00:00';
        this.sliderValue = 0; this.playStatus = 'playing';
      }
    },
    sliderChange: function(value){
      document.getElementById("audioEl").currentTime = (value/100);
      document.getElementById("audioEl").play(); this.playStatus = 'pause';
    },
    sliderDragStart: function(){
      this.dragStatus = "droping";
    },
    sliderDragEnd: function(){
      this.dragStatus = "stop";
    },
    playEvent: function(){
      this.playStatus = "pause";
    },
    pauseEvent: function(){
      this.playStatus = "playing";
    },
    errorEvent: function(){
      Dialog.alert({message: '播放错误，音频格式错误。'});
      if(this.courseType == 2){
          this.currentTimer = "00:00"; this.playStatus = "playing"; this.sliderValue = 0;
          for (let i = 0; i < this.course.chapters.length; i++) {
            var item = this.course.chapters[i]; item.playStatus = 'stop';
            this.$set(this.course.chapters, i, item);
          }
      }else {
        this.currentTimer = '00:00'; this.sliderValue = 0; this.playStatus = 'playing';
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
        this.showPayDetail = false; this.initiaData();
      }
    },
    getUserCoupons: function(){
      var that = this;
      request.postUserCoupons({couponsUuid: this.course.coupons.uuid}).then((json) => {
        if(json.code == 200){
          that.couponPrice = json.data.coupon.money;
        }
      });
    },
    setPercentage: function(duration, currentTime){
      var percentage = [];
      if(localStorage.getItem('percentage') != null){ percentage = JSON.parse(localStorage.getItem('percentage')); }

      if(this.course.courseType == 1){
        //单次课
        if(this.isTrialLesson == true){
          var isHave = false;
          for (let i = 0; i < percentage.length; i++) {
            if(percentage[i].uuid == this.course.uuid){
              percentage[i].total = 5; isHave = true;
              break;
            }
          }
          if(isHave == false){ percentage.push({uuid: this.course.uuid, total: 5}) }
        }else {
          if (isNaN(duration) == true){ return; }
          var ratio = parseInt((parseInt(currentTime*1000)/parseInt(duration*1000))*100)

          if(percentage.length <= 0){
            percentage.push({uuid: this.course.uuid, total: ratio})
          }else {
            var isHave = false;
            for (let i = 0; i < percentage.length; i++) {
              if(percentage[i].uuid == this.course.uuid){
                if(percentage[i].total < ratio){ percentage[i].total = ratio; }
                isHave = true;
                break;
              }
            }
            if(isHave == false){ percentage.push({uuid: this.course.uuid, total: ratio}) }
          }
        }
        localStorage.setItem('percentage', JSON.stringify(percentage));
      }else if(this.course.courseType == 2){
        //系列课
        if(this.isTrialLesson == true){
          var isHave = false;
          for (let i = 0; i < percentage.length; i++) {
            if(percentage[i].uuid == this.course.uuid){
              percentage[i].total = 10; isHave = true;
              break;
            }
          }
          if(isHave == false){ percentage.push({uuid: this.course.uuid, total: 10}) }
        }else {

        }
      }
    }
  },
  mounted() {
    this.initiaData();
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
  .divAudioCourse .divIcon{
    text-align: center;
    padding-top: 10px;
    overflow: hidden;
  }
  .divAudioCourse .divIcon .imgIcon{
    width: 93%; height: 218px; border-radius: 10px;
    background-color: #f9f9f9;
  }
  .divAudioCourse .divTitle{
    font-size: 18px; font-weight: bold;
    color: #333333; margin-left: 12px; margin-right: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .divAudioCourse .divSpeaker{
    background-repeat: no-repeat;
    background-image: url('~@/assets/images/course/bg.png');
    background-size: 100% 100%;
    width: 93%; display: flex; align-items: center;
    justify-content: center; height: 80px;
    margin-top: 15px; margin-left: auto; margin-right: auto;
    padding: 10px; box-sizing: border-box;
  }
  .divAudioCourse .divSpeaker .imgAvatar{
    width: 56px; height: 56px; border-radius: 50%;
    margin-right: 8px;
  }
  .divAudioCourse .divSpeaker .divBaseInfo{
    flex: 1;
  }
  .divAudioCourse .divSpeaker .divBaseInfo .divName{
    font-size: 15px; color: #333333; font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divAudioCourse .divSpeaker .divBaseInfo .divInfo{
    font-size: 14px; color: #999999; font-weight: 500;
    margin-top: 8px; display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divAudioCourse .divSpeaker .imgRight{
    width: 9px; margin-right: 5px;
  }
  .divAudioCourse .divBottom{
    display: flex; flex-direction: row; height: 46px;
    position: fixed; bottom: 0; width: 100%;
  }
  .divAudioCourse .divAudition{
    width: 93%; margin-left: auto; margin-right: auto;
    margin-top: 7px;
  }
  .divAudioCourse .divAudition .imgAudition{
    width: 45px; display: block;
  }
  .divAudioCourse .divSchedule{
    width: 93%; margin-left: auto; margin-right: auto;
    display: flex; align-items: center; justify-content: center;
    margin-top: 20px;
  }
  .divAudioCourse .divSchedule .divSlider{
    flex: 1; margin-left: 14px; margin-right: 14px;
  }
  .divAudioCourse .divSchedule .divTimer{
    font-size: 13px; color: #999999;
  }
  .divAudioCourse .divContent{
    width: 85%; margin-left: auto; margin-right: auto;
    display: flex; align-items: center;
    justify-content: space-between; margin-top: 25px;
  }
  .divAudioCourse .divContent .audioEl{
    display: none;
  }
  .divAudioCourse .divContent .divMenu{
    background-image: url('~@/assets/images/course/menu.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 35px; height: 35px;
    border: none; background-color: transparent;
  }
  .divAudioCourse .divContent .divControl{
    display: flex; align-items: center;
  }
  .divAudioCourse .divContent .divControl .divPrev{
    background-image: url('~@/assets/images/course/prev.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 35px; height: 35px;
    border: none; background-color: transparent;
  }
  .divAudioCourse .divContent .divControl .divPlay{
    background-image: url('~@/assets/images/course/play.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 90px; height: 90px;
    margin-left: 10px; margin-right: 10px;
    border: none; background-color: transparent;
  }
  .divAudioCourse .divContent .divControl .divPause{
    background-image: url('~@/assets/images/course/pause.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 90px; height: 90px;
    margin-left: 10px; margin-right: 10px;
    border: none; background-color: transparent;
  }
  .divAudioCourse .divContent .divControl .divNext{
    background-image: url('~@/assets/images/course/next.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 35px; height: 35px;
    border: none; background-color: transparent;
  }
  .divAudioCourse .divContent .divSpeed{
    font-size: 14px; color: #333333; margin-right: 10px;
  }
  .divAudioCourse .divBottom{
    position: fixed; width: 100%; bottom: 0px;
    padding-bottom: 8px; display: flex; align-items: center;
    background-color: #FFF;
  }
  .divAudioCourse .divBottom .divComment{
    border-radius: 20px; display: flex;
    background-color: rgb(245, 249, 255);
    flex: 1; margin-left: 10px; margin-right: 8px;
    height: 35px; padding-left: 12px; padding-right: 12px;
  }
  .divAudioCourse .divBottom .divComment .iptComment{
    font-size: 14px; font-weight: 500; border: none;
    background-color: rgb(245, 249, 255); width: 100%;
  }
  .divAudioCourse .divBottom .divButton{
    display: flex; align-items: center;
  }
  .divAudioCourse .divBottom .divButton .imgMsg{
    width: 24px; margin-right: 6px;
  }
  .divAudioCourse .divBottom .divButton .divFavorites{
    display: flex; align-items: center;
    justify-content: center; margin-right: 10px;
  }
  .divAudioCourse .divBottom .divButton .divFavorites .imgFavorites{
    width: 26px; margin-right: 2px;
  }
  .divAudioCourse .divBottom .divButton .divFavorites .spanGray{
    margin-top: 5px; font-size: 14px; color: #333333;
  }
  .divAudioCourse .divBottom .divButton .divFavorites .spanRed{
    margin-top: 5px; font-size: 14px; color: #FF6B88;
  }
  .divAudioCourse .divBottomBuy{
    position: fixed; width: 100%; bottom: 0px; height: 46px;
    display: flex; align-items: center; justify-content: center;
    background:linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    font-size: 18px; font-weight: 500; color: #FFF;
    letter-spacing: 1px;
  }
  .divAudioCourse .divBottomBuy span{
    font-size: 13px; font-weight: 500; margin-right: 10px;
  }
  .divAudioCourse .divPlayTitle{
    font-size: 18px; font-weight: bold;
    line-height: 50px; padding-left: 20px;
    border-bottom: 1px solid rgb(247,247,247);
  }
  .divAudioCourse .divPlayTitle span{
    font-size: 14px; margin-left: 5px;
  }
  .divAudioCourse .divPlayClose{
    background-color: #FFF;
    font-size: 18px; color: #333333; font-weight: 500;
    letter-spacing: 10px; position: fixed;
    width: 100%; text-align: center; bottom: 0; line-height: 50px;
    border-top: 1px solid #d2d2d2; box-shadow: 0 0 6px #d2d2d2;
  }
</style>
