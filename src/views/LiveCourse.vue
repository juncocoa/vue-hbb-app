<template>
  <div class="page divLiveCourse">
    <div class="divCourseWare" v-show="showCourseware">
      <div class="divEmptyData" v-if="course.courseSource == null">当前没有上传课件。</div>
      <van-swipe ref="swipe" :loop="true" @change="onChange" v-if="sourceType == 3 || sourceType == 4" >
        <van-swipe-item v-for="(url, index) in sourceURL" :key="index">
          <van-image class="vanImage" fit="contain" lazy-load :src="url">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error>
              <img src="@/assets/images/home/banner.png">
            </template>
          </van-image>
        </van-swipe-item>

        <div class="customIndicator" slot="indicator">
          {{ current + 1 }}/{{ sourceURL.length }}
        </div>
      </van-swipe>

      <div class="divVideo" v-if="sourceType == 1 || sourceType == 2" >
        <video id="videoEl" class="video"
          preload autoplay
          playsinline="isiPhoneShowPlaysinline"
          x5-video-player-type="h5-page"
          t7-video-player-type="inline"
          webkit-playsinline="isiPhoneShowPlaysinline"
          x-webkit-airplay="allow"
        @play="playEvent" @pause="pauseEvent" @canplay="canplayEvent" @loadedmetadata="onLoadedMetaData" @timeupdate="onTimeUpdate" @ended="onEnded"/>

        <div class="divPlayContext" @click="videoPause">
          <img :src="(playStatus == 'playing')?require('@/assets/images/course/videoPlay.png'):require('@/assets/images/course/videoPause.png')" class="imgPlay" v-if="showPlayStatus" />
          <div class="divAdvisory" v-if="sourceType == 2 && showPlayStatus == false">
            <div class="divTip">音频播放</div>
          </div>
        </div>
        <div class="divControl">
          <div class="divScroll">
            <label>{{currentTimer}}</label>
            <van-slider class="divSlider" :style="{marginTop: (this.browserType == 'WeChat')?'-2px':'3px'}" v-model="sliderValue" :max="sliderMax" @drag-start="sliderDragStart" @drag-end="sliderDragEnd" @change="sliderChange" bar-height="4px" active-color="rgb(245,110,137)" inactive-color="rgb(216,216,216)"/>
            <label v-if="course.courseSource != null">{{course.courseSource.duration | formatDuration}}</label>
            <label v-if="course.courseSource == null">00:00</label>
          </div>
          <div class="divNumberRate" @click="setPlaybackRate">{{playbackRate | playbackRate}}</div>
          <div class="divFullScreen" v-if="sourceType == 1 && browserType != 'WeChat'" @click="requestFullscreen">
            <img src="@/assets/images/course/fullScreen.png" class="imgFullScreen"/>
          </div>
        </div>
      </div>
    </div>
    <div class="divBase">
      <div class="divText">
        <div class="divName">{{ course.name }}</div>
        <div class="divNumber">{{ course.studyNum + memberCount}} 次学习{{ (course.isEnd)?'·直播回看':'' }}</div>
      </div>
      <div class="divFlag">
        <img :src="(showCourseware == true)?require('@/assets/images/live/courseWare.png'):require('@/assets/images/live/closeCourseWare.png')" v-if="sourceType != 3" class="imgType" @click="showCoursewareFn"/>
        <img :src="(showCourseware == true)?require('@/assets/images/live/ppt.png'):require('@/assets/images/live/closeppt.png')" v-if="sourceType == 3" class="imgType" @click="showCoursewareFn"/>
        <img :src="(showBarrage == true)?require('@/assets/images/live/barrage.png'):require('@/assets/images/live/closeBarrage.png')" class="imgBarrage" @click="showBarrageFn"/>
      </div>
    </div>
    <div id="divChat" class="divChat" @scroll="scrollChatFn" :style="{height: scrollHeight1}">
      <div class="divTip" v-if="liveStart">直播开始</div>
      <div v-for="(item, index) in contentList" :key="'divItem_' + index">
        <!-- 语音对话框 -->
        <div class="divItem" v-if="item.type == 'voice'">
          <van-image :src="item.avatar" lazy-load class="imgAvatar">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
          </van-image>
          <div class="divContent">
            <div class="divName">
              {{item.username}}
              <div class="divExpert" v-if="item.role == 'expert'">专家</div>
              <div class="divCompere" v-if="item.role == 'compere'">主持人</div>
            </div>
            <div class="divContext">
              <img src="@/assets/images/live/left.png" class="imgLeft"/>
              <div class="divPlay">
                <img :src="(item.playStatus == 'stop')?require('@/assets/images/live/play.png'):require('@/assets/images/live/pause.png')" @click="playAudio(item)" class="imgPlay"/>
                <van-progress class="vueProgress" :percentage="item.percentage" :show-pivot="false" :stroke-width="3" color="#FFF"/>
                <label class="lblTimer">{{item.duration | formatTime}}</label>
              </div>
              <div class="divHaveRead" v-if="false">已读</div>
              <div class="divUnRead" v-if="false">未读</div>
            </div>
          </div>
        </div>
        <!-- 视频消息 -->
        <div class="divItem" v-if="item.type == 'video'">
          <van-image :src="item.avatar" lazy-load class="imgAvatar">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
          </van-image>
          <div class="divContent">
            <div class="divName">
              {{item.username}}
              <div class="divExpert" v-if="item.role == 'expert'">专家</div>
              <div class="divCompere" v-if="item.role == 'compere'">主持人</div>
            </div>
            <div class="divContext">
              <img src="@/assets/images/live/left.png" class="imgLeft"/>
              <div class="divText1">
                <video :src="item.content" class="imgMsg videoClass"
                playsinline="isiPhoneShowPlaysinline"
                x5-video-player-type="h5-page"
                t7-video-player-type="inline"
                webkit-playsinline="isiPhoneShowPlaysinline"
                x-webkit-airplay="allow"
                controls="controls" preload @play="itemPlayEvent"/>
              </div>
            </div>
          </div>
        </div>
        <!-- 图片消息 -->
        <div class="divItem" v-if="item.type == 'img'">
          <van-image :src="item.avatar" lazy-load class="imgAvatar">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
          </van-image>
          <div class="divContent">
            <div class="divName">
              {{item.username}}
              <div class="divExpert" v-if="item.role == 'expert'">专家</div>
              <div class="divCompere" v-if="item.role == 'compere'">主持人</div>
            </div>
            <div class="divContext">
              <img src="@/assets/images/live/left.png" class="imgLeft"/>
              <div class="divText1">
                <img :src="item.content" class="imgMsg"/>
              </div>
            </div>
          </div>
        </div>
        <!-- 普通消息 -->
        <div class="divItem" v-if="item.type == 'txt'">
          <van-image :src="item.avatar" lazy-load class="imgAvatar">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
          </van-image>
          <div class="divContent">
            <div class="divName">
              {{item.username}}
              <div class="divExpert" v-if="item.role == 'expert'">专家</div>
              <div class="divCompere" v-if="item.role == 'compere'">主持人</div>
            </div>
            <div class="divContext">
              <img src="@/assets/images/live/left.png" class="imgLeft"/>
              <div class="divText">{{item.content}}</div>
            </div>
          </div>
        </div>
        <!-- 上墙消息 -->
        <div class="divItem" v-if="item.type == 'qna'">
          <van-image :src="item.avatar" lazy-load class="imgAvatar">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
          </van-image>
          <div class="divContent">
            <div class="divName">
              {{item.username}}
              <div class="divExpert" v-if="item.role == 'expert'">专家</div>
              <div class="divCompere" v-if="item.role == 'compere'">主持人</div>
            </div>
            <div class="divContext">
              <img src="@/assets/images/live/left.png" class="imgLeft"/>
              <div class="divText">
                @{{item.question.username}}
                <div>{{'问：' + item.question.content}}</div>
                <div class="divSplitline"></div>
                {{item.content}}
              </div>
              <div class="divWithdraw" v-if="false">撤回</div>
            </div>
          </div>
        </div>
      </div>
      <div class="divTip" v-if="liveEnd">直播结束</div>
    </div>

    <div id="divReplys" class="divReplys" v-if="showBarrage" :style="{bottom: replysBottom, maxHeight: scrollHeight2}">
      <div class="divFlex" v-for="(item, index) in groupChatList" :key="'group_' + index">
        <div class="divItem">
          <div class="divTxt">{{item.content}}</div>
          <van-image :src="item.avatar" lazy-load class="imgAvatar">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
          </van-image>
        </div>
      </div>
    </div>
    <div class="divPlayPositioning" :style="{bottom: positioningBottom}" v-if="showScrollTop" @click="scrollTop">当前播放位置</div>

    <div class="divBottom" v-if="isLecturer == false && liveEnd == false">
      <div class="divComment">
        <input placeholder="输入评论内容或提问" class="iptComment" v-model="content" v-on:keydown="keydown" v-on:blur="onBlur"/>
        <van-checkbox class="vanRadio" v-model="question">
          <label class="label">提问</label>
          <img
            slot="icon"
            slot-scope="props"
            style="width: 12px"
            :src="props.checked ? activeIcon : inactiveIcon">
        </van-checkbox>
      </div>
      <div class="divButton">
        <img src="@/assets/images/live/comment.png" class="imgMsg" @click="showQuestionFn"/>
        <div class="divFavorites" @click="btnFavorites">
          <img src="@/assets/images/course/favorited.png" class="imgFavorites" v-if="course.isLike == true"/>
          <img src="@/assets/images/course/favourite.png" class="imgFavorites" v-if="course.isLike == false"/>
          <span :class="(course.isLike)?'spanRed':'spanGray'">收藏</span>
        </div>
      </div>
    </div>
    <div class="divBottom1" v-if="isLecturer == true && liveEnd == false">
      <div class="divFlex">
        <div :class="(tabIndex == 1)?'divItemSelect':'divItem'" @click="itemTabFn(1)">语音</div>
        <div :class="(tabIndex == 2)?'divItemSelect':'divItem'" @click="itemTabFn(2)">文字</div>
        <div :class="(tabIndex == 3)?'divItemSelect':'divItem'" @click="itemTabFn(3)">多媒体</div>
        <div :class="(tabIndex == 4)?'divItemSelect':'divItem'" v-if="course.role == 'expert'" @click="itemTabFn(4)">讨论</div>
      </div>
      <div class="divRecord" v-if="tabIndex == 1">
        <div class="divSpeak" v-if="recordState != 'Play'">
          <div v-if="recordState == 'Start'" class="imgSpeakGeneral" @click="startRecord"></div>
          <div v-if="recordState == 'Stop'" class="imgSpeakPress" @click="stopRecord">
            <van-circle
              v-if="recordState == 'Stop'"
              v-model="currentRate" :size="pxToRem(85)"
              :color="{'0%': '#FF90AC', '100%': '#F46782'}"
              layer-color="rgba(0,0,0,0)" fill="rgba(0,0,0,0)"
              :rate="0" :stroke-width="40" :speed="100"
              class="divCircle" stroke-linecap="butt"
            />
          </div>
          <label :class="(recordState == 'Start')?'lblInfo':'lblInfoRecord'">{{txtVoice}}</label>
        </div>
        <div class="divControl" v-if="recordState == 'Play'">
          <img src="@/assets/images/live/back.png" class="imgRevoke" @click="revokeFn"/>
          <img :src="(recordPlayStatus == 'Play')?require('@/assets/images/live/recordPlay.png'):require('@/assets/images/live/recordPause.png')" class="imgPlay" @click="playVoice"/>
          <img src="@/assets/images/live/ok.png" class="imgSend" @click="sendVoice"/>
        </div>
      </div>
      <div class="divText" v-if="tabIndex == 2">
        <div class="divReply">
          <input placeholder="请输入评论内容..." class="iptText" v-model="lecturerContent" v-on:keydown="keydownLecturer" v-on:blur="onBlur"/>
        </div>
      </div>
      <div class="divMedia" v-if="tabIndex == 3">
        <div class="divFileFlex">
          <img src="@/assets/images/live/image.png" class="imgImage" />
          <input type="file" name="pic" accept="image/*" @change="fileChange">
        </div>
        <div class="divFileFlex">
          <img src="@/assets/images/live/video.png" class="imgVideo" />
          <input type="file" name="pic" accept="video/mp4" @change="fileChange">
        </div>
      </div>
    </div>
    <div class="divBottom1" v-if="liveEnd == true">
      <div style="background-color: #efefef;font-size: 14px;color: #a7a7a7;display: flex;align-items: center;justify-content: center;height: 48px;">直播已结束</div>
    </div>
    <van-popup v-model="showQuestion" position="bottom" :style="{ height: '73%' }">
      <vue-question-list ref="question" :course="course" :proQuestion="question" :isLecturer="isLecturer" :proContent="content" @showOnTheWall="showOnTheWallFn" @setQuestion="setQuestion" @closeWindows="closeQuestion" @setGroupMuted="setGroupMuted"/>
    </van-popup>
    <van-dialog
      v-model="showOnTheWall"
      title="上墙" @confirm="sendOnWall"
      confirm-button-color="#FF6B88"
      cancel-button-color="#999999"
      show-cancel-button>
      <div class="divOnTheWall">
        <textarea class="textarea" v-model="textarea" placeholder="点击确定后，回复内容会同步到直播主屏，回复内容不可以为空。"></textarea>
      </div>
    </van-dialog>
    <van-overlay :show="showOverlay">
      <div class="wrapper" :style="{height: height}">
        <van-loading size="24px" vertical color="#FFF"><font color="#FFF">{{maskLoading}}</font></van-loading>
      </div>
    </van-overlay>
    <van-overlay :show="showContract" :z-index="15">
      <vue-contract @closeContract="closeContract"/>
    </van-overlay>
    <audio id="audio" style="display: none;"></audio>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import { formatDuration, pxToRem } from '../utils'
import * as request from '../service/live.js'
import * as TIM from "../utils/TIM.js"
import * as file from "../utils/fileUpdating.js";
import questionList from '../components/questionList.vue';
import contract from '../components/contract.vue';

export default {
  name: 'liveCourse',
  data: () => ({
    pxToRem: pxToRem,
    height: (window.innerHeight) + "px", //聊天高度
    scrollHeight1: (window.innerHeight - (360 + ((navigator.userAgent.includes('iPhone') == true || navigator.userAgent.includes('iPad') == true)?20:0))) + "px", //聊天高度
    scrollHeight2: (window.innerHeight - (400)) + "px", //评论高度
    replysBottom: "47px", //回帖底部距离
    positioningBottom: "55px",
    showBarrage: true, //是否显示弹幕
    showCourseware: true, //是否显示课件
    showScrollTop: false, //当前播放位置
    showOverlay: false, // 蒙层 加载中 状态
    maskLoading: '加载中...', //加载状态

    showQuestion: false,
    course:{ isLike: false },
    sourceType: 0, sourceURL: '',
    activeIcon: require('@/assets/images/live/select.png'),
    inactiveIcon: require('@/assets/images/live/unselect.png'),
    question: false,
    content: '',
    current: 0,

    //播放逻辑
    showPlayStatus: true,
    sliderValue: 0,
    sliderMax: 1,

    playbackRate: 1,
    currentTimer: '00:00',
    playStatus: 'playing',
    browserType: false,
    dragStatus: 'stop',

    //讲师端所有参数
    isLecturer: false,
    tabIndex: 0,
    currentRate: 0,
    lecturerContent: '',
    //上墙
    showOnTheWall: false,
    textarea: '',
    objQuestion: {},
    //内容列表 、 聊天列表
    contentList: [], //专家，主持人
    groupChatList: [], //普通用户、嘉宾
    liveStart: false,
    liveEnd: false,

    //录音功能
    recordState: 'Start',  //Start 开始、Stop 停止、Play 播放
    recordPlayStatus: 'Play', //Play 播放、Stop 停止
    txtVoice: '轻触点击录音',
    timerTick: 60,
    localId: '',
    isWeChat: false, //请在微信环境下，授权成功
    showContract: false,
    expert: {}, //专家信息
    memberCount: 0,
    interval: 0
  }),
  components: {
    "vue-question-list": questionList,
    "vue-contract": contract,
  },
  beforeRouteEnter (to, from, next) {
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // 修复 iOS 版微信 HTML5 History 兼容性问题
    if (isiOS && to.path !== location.pathname) {
      // 此处不可使用location.replace
      location.assign(to.fullPath)
    } else {
      next()
    }
  },
  methods: {
    onBlur(){
      var timeout = setTimeout(function(){
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0)); clearTimeout(timeout);
      }, 100);
    },
    getGroupMemberList: function(){
      var that = this;
      this.interval = setInterval(()=>{
        TIM.getGroupMemberList(that.course.groupId, that);
      }, 1500);
    },
    onChange: function(index){
      this.current = index;
      if(this.liveEnd == true){ return; }
      if(this.course.role == 'expert'){
        var paramData = {
          avatar: this.expert.avatar,
          username: this.expert.name,
          role: this.course.role,
          type: "ppt-pos",
          content: index,  //PPT index ，0 开始
          from_uid: this.expert.uuid,
          msg_time: new Date().getTime(),
          room_id: this.course.groupId
        }
        if(this.course.platform == "tencent"){
          TIM.sendMessage(this.course.groupId, 'txbamaketang', JSON.stringify(paramData), this)
        }
      }
    },
    isWeChatAndQQ: function (){
      var ua = navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == "micromessenger") {
          this.browserType = "WeChat"; return;
      }
      this.browserType = "Browser";
    },
    showOnTheWallFn: function (val, question) {
      this.showOnTheWall = val; this.objQuestion = question;
    },
    setQuestion: function(val, content){
      this.question = val;
      this.content = content;
    },
    showQuestionFn: function () {
      this.showQuestion = true;
      if(this.$refs.question != undefined){
        this.$refs.question.initiData();
      }
    },
    showBarrageFn: function(){
      if(this.showBarrage == true){
        this.showBarrage = false;
      }else {
        this.showBarrage = true;
      }
    },
    showCoursewareFn: function(){
      var ios = 0;
      if(navigator.userAgent.includes('iPhone') == true || navigator.userAgent.includes('iPad') == true){ ios = 20; }
      if(this.showCourseware == true){
        this.showCourseware = false;
        this.scrollHeight1 = (window.innerHeight - (122 + ios)) + "px"; //聊天高度
        this.scrollHeight2 = (window.innerHeight - (350)) + "px"; //评论高度+40
      }else {
        this.showCourseware = true;
        this.scrollHeight1 = (window.innerHeight - (360 + ios)) + "px"; //聊天高度
        this.scrollHeight2 = (window.innerHeight - (400)) + "px"; //评论高度
      }
      this.adaptive();
    },
    scrollTop: function(){
      this.showScrollTop = false;
      document.getElementById('divChat').scrollTop = document.getElementById('divChat').scrollHeight;
    },
    scrollChatFn: function(event){
      var nDivHight = document.getElementById('divChat').clientHeight;  //div高度
      var nScrollHight = event.target.scrollHeight;
      var nScrollTop = event.target.scrollTop;

      if(nScrollTop + nDivHight >= (nScrollHight - 20)){
        this.showScrollTop = false;
      }else {
        this.showScrollTop = true;
      }
    },
    closeQuestion: function(){
      this.showQuestion = false;
      if(this.isLecturer == true && this.tabIndex == 4){
        this.tabIndex = 0;
      }
    },
    btnFavorites: function(){
      var that = this;
      if(this.course.isLike == false){
        request.postLikeRoom({uuid: this.course.uuid}).then((json) => {
          if(json.code == 200){
            that.course.isLike = true; Toast(json.msg);
          }
        });
      }else {
        request.deleteLikeRoom({uuid: this.course.uuid}).then((json) => {
          if(json.code == 200){
            that.course.isLike = false; Toast(json.msg);
          }
        });
      }
    },
    sendMessage: function(val){
      var paramData = {};var profile = JSON.parse(sessionStorage.getItem("profile"));
      var avatar = ""; var nickName = "";
      if(profile.wechatInfo != null){
        avatar = profile.wechatInfo.avatar;
        nickName = profile.wechatInfo.nickName;
      }else {
        avatar = profile.avatar;
        nickName = profile.nickName;
      }
      if(this.course.role == "expert"){
        //专家
        paramData = {
          avatar: this.expert.avatar,
          username: this.expert.name,
          role: this.course.role,
          type: "txt",
          content: val,
          duration: null,
          display: "live",
          from_uid: this.expert.uuid,
          msg_time: new Date().getTime(),
          room_id: this.course.groupId
        }
      }else if(this.course.role == "compere"){
        //主持人
        paramData = {
          avatar: avatar,
          username: nickName,
          role: this.course.role,
          type: "txt",
          content: val,
          duration: null,
          display: "live",
          from_uid: profile.uuid,
          msg_time: new Date().getTime(),
          room_id: this.course.groupId
        }
      }else if(this.course.role == "inviter" || this.course.role == "normal"){
        //嘉宾、普通用户
        paramData = {
          avatar: avatar,
          username: nickName,
          role: this.course.role,
          type: "txt",
          isQuestion: this.question,
          content: val,
          display: "barrage",
          from_uid: profile.uuid,
          msg_time: new Date().getTime(),
          room_id: this.course.groupId
        }
      }
      if(this.course.platform == "tencent"){
        TIM.sendMessage(this.course.groupId, 'txbamaketang', JSON.stringify(paramData), this)
      }
    },
    keydown: function(e){
      if(!e){ e = window.event; }
	    if(e.keyCode == 13){
        if(e.target.value.trim() == ""){ return; }
        this.sendMessage(e.target.value);
	    }
    },
    keydownLecturer: function(e){
      if(!e){ e = window.event; }
	    if(e.keyCode == 13){
        if(e.target.value.trim() == ""){ return; }
        this.sendMessage(e.target.value);
	    }
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
    videoPause: function () {
      if(this.playStatus == 'pause'){
        document.getElementById("videoEl").pause();
      }else {
        this.stopVoice(1);
        document.getElementById("videoEl").play();
      }
    },
    onLoadedMetaData: function (event) {
      this.sliderMax = parseInt(event.currentTarget.duration * 100);
      if(parseInt(event.currentTarget.duration * 100) <= 0){
        this.sliderMax = (this.course.courseSource.duration * 100);
      }
      this.currentTimer = '00:00'; this.sliderValue = 0;
    },
    onTimeUpdate: function (event){
      this.currentTimer = formatDuration(event.currentTarget.currentTime);
      if(this.dragStatus == "stop"){
        this.sliderValue = parseInt(event.currentTarget.currentTime * 100);
      }
    },
    onEnded: function (event){
      event.currentTarget.pause(); this.currentTimer = '00:00';
      this.sliderValue = 0; this.playStatus = 'playing';
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
    playEvent: function(){
      this.playStatus = 'pause'; var that = this;
      if(this.browserType == 'WeChat'){
        this.showPlayStatus = false;
      }else {
        var timeout = setTimeout(()=>{ clearTimeout(timeout); that.showPlayStatus = false; }, 200);
      }
    },
    pauseEvent: function(){
      this.showPlayStatus = true; this.playStatus = 'playing';
    },
    canplayEvent: function(event){
      document.getElementById('videoEl').play();
    },
    //自适应计算
    adaptive: function(){
      var ios = 0;
      if(navigator.userAgent.includes('iPhone') == true || navigator.userAgent.includes('iPad') == true){ ios = 20; }
      switch (this.tabIndex) {
        case 0: //什么都不选
          if(this.showCourseware == true){
            this.scrollHeight1 = (window.innerHeight - (360 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (400)) + "px"; //评论高度
          }else {
            this.scrollHeight1 = (window.innerHeight - (122 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (350)) + "px"; //评论高度+40
          }
          this.replysBottom = "47px"; this.positioningBottom = "55px";
          break;
        case 1: //语音
          if(this.showCourseware == true){
            this.scrollHeight1 = (window.innerHeight - (360 + 181 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (400 + 181)) + "px"; //评论高度
          }else {
            this.scrollHeight1 = (window.innerHeight - (122 + 181 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (350 + 61)) + "px"; //评论高度+40
          }
          this.replysBottom = "228px"; this.positioningBottom = "236px";
          break;
        case 2: //文字
          if(this.showCourseware == true){
            this.scrollHeight1 = (window.innerHeight - (360 + 61 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (400 + 61)) + "px"; //评论高度
          }else {
            this.scrollHeight1 = (window.innerHeight - (122 + 61 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (280)) + "px"; //评论高度+40
          }
          this.replysBottom = "108px"; this.positioningBottom = "116px";
          break;
        case 3: //媒体
          if(this.showCourseware == true){
            this.scrollHeight1 = (window.innerHeight - (360 + 103 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (400 + 103)) + "px"; //评论高度
          }else {
            this.scrollHeight1 = (window.innerHeight - (122 + 103 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (322)) + "px"; //评论高度+40
          }
          this.replysBottom = "150px"; this.positioningBottom = "158px";
          break;
        case 4: //讨论
          if(this.showCourseware == true){
            this.scrollHeight1 = (window.innerHeight - (360 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (400)) + "px"; //评论高度
          }else {
            this.scrollHeight1 = (window.innerHeight - (122 + ios)) + "px"; //聊天高度
            this.scrollHeight2 = (window.innerHeight - (350)) + "px"; //评论高度+40
          }
          this.replysBottom = "47px"; this.positioningBottom = "55px";
          break;
      }
    },
    itemTabFn: function(index){
      if(index == 1 && this.isWeChat == false){
        Dialog({ message: '请在 微信 环境下。' });
        return;
      }
      if(this.tabIndex == index){
        this.tabIndex = 0;
      }else {
        this.tabIndex = index;
        if(index == 4){
          this.showQuestion = true;
          if(this.$refs.question != undefined){
            this.$refs.question.initiData();
          }
        }else {
          this.showQuestion = false;
        }
      }
      this.adaptive();
    },
    loginTim: function(json){
      this.maskLoading = '登入 TIM 中，请稍后..';
      var paramData = {
        userID: json.data.uuid,
        userSig: json.data.userSign
      };
      TIM.login(paramData, this);
    },
    fileChange: function(event){
      if(event.currentTarget.files.length > 0){
        this.showOverlay = true; this.maskLoading = '上传中，请稍后...';
        file.checkedFileMD5ByMP4(this, event.currentTarget.files[0])
      }
    },
    sendFileMsg: function(fileUrl, file){
      this.maskLoading = '发送中，请稍后...';
      var paramData = {};
      if(file.type.includes("image/") == true){
        paramData = {
          avatar: this.expert.avatar,
          username: this.expert.name,
          role: this.course.role,
          type: "img",
          content: fileUrl,
          duration: null,
          display: "live",
          from_uid: this.expert.uuid,
          msg_time: new Date().getTime(),
          room_id: this.course.groupId
        }
      }else if(file.type.includes("video/") == true){
        paramData = {
          avatar: this.expert.avatar,
          username: this.expert.name,
          role: this.course.role,
          type: "video",
          content: fileUrl,
          duration: null,
          display: "live",
          from_uid: this.expert.uuid,
          msg_time: new Date().getTime(),
          room_id: this.course.groupId
        }
      }
      if(this.course.platform == "tencent"){
        TIM.sendMessage(this.course.groupId, 'txbamaketang', JSON.stringify(paramData), this)
      }
    },
    getJsSdk: function(){
      var that = this;
      var u = navigator.userAgent, app = navigator.appVersion; var strPlatform = "ios";
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //如果输出结果是true就判定是android终端或者uc浏览器
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //根据输出结果true或者false来判断ios终端
      if(isAndroid){
        strPlatform = "android";
      }else if(isiOS){
        strPlatform = "ios";
      }
      request.getJsSdk({platform: strPlatform, url: location.href}).then((json) => {
        if(json.code == 200){
          wx.config({
             debug: false,
             appId: json.data.appId,
             timestamp: json.data.timestamp, // 必填，生成签名的时间戳
             nonceStr: json.data.nonceStr, // 必填，生成签名的随机串
             signature: json.data.signature, // 必填，签名
             // 需要授权的api接口
             jsApiList: [
               'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice', 'downloadVoice', 'playVoice', 'pauseVoice', 'onVoicePlayEnd'
             ]
          });
          wx.ready(() => {
             //录音结束：回调
             wx.onVoiceRecordEnd({
               complete: function (res) {
                 that.localId = res.localId; that.txtVoice = '轻触点击录音';
                 that.recordState = "Play"; that.playVoice();
               }
             });
             //播放完成：回调
             wx.onVoicePlayEnd({
                success: function (res) {
                  that.recordPlayStatus = 'Play';
                }
             });
             that.isWeChat = true;
          })
        }
      })
    },
    //录音功能
    startRecord: function(){
      var that = this;
      wx.startRecord({
         success: function() {
          that.stopVoice(0); that.recordState = "Stop";
          that.timerInterval = setInterval(()=>{
            if(that.timerTick > 0){
              that.timerTick--; that.txtVoice = that.timerTick + 's';
              that.currentRate = ((60 - that.timerTick)/60)*100;
            }else {
              clearInterval(that.timerInterval);
              that.txtVoice = '轻触点击录音'; that.timerTick = 60;
            }
          }, 1000);
         },
         cancel: function() {
           that.recordState = "Start"; Toast('用户拒绝授权录音');
         }
      })
    },
    stopRecord: function(){
      var that = this;
      wx.stopRecord({
         success: function(res) {
           that.recordState = "Play"; that.localId = res.localId;
           clearInterval(that.timerInterval); that.txtVoice = '轻触点击录音';
           that.playVoice();
         },
         fail: function(res) {
           console.log("stopRecord：", JSON.stringify(res))
         }
      })
    },
    playVoice: function(){
      if(this.recordPlayStatus == 'Play'){
        wx.playVoice({
          localId: this.localId // 需要播放的音频的本地 ID，由stopRecord接口获得
        }); this.recordPlayStatus = 'Stop';
      }else if(this.recordPlayStatus == 'Stop'){
        wx.pauseVoice({
          localId: this.localId
        }); this.recordPlayStatus = 'Play';
      }
    },
    revokeFn: function(){
      wx.pauseVoice({ localId: this.localId });
      this.currentRate = 0; this.recordPlayStatus = 'Play';
      this.txtVoice = '轻触点击录音'; this.timerTick = 60; this.localId = '';
      this.recordState = "Start"; this.recordPlayStatus = 'Play';
    },
    sendVoice: function(){
      this.maskLoading = '转码中，请稍后...';
      var that = this; this.showOverlay = true;
      wx.uploadVoice({
        localId: this.localId,
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
          request.getTranscoding({serverId: res.serverId}).then((json) => {
            if(json.code == 200){
              that.maskLoading = '发送中，请稍后...';
              var audio = document.createElement("AUDIO");
              audio.setAttribute("src", json.data.url); audio.load();
              audio.oncanplay = function () {
                var paramData = {
                  avatar: that.expert.avatar,
                  username: that.expert.name,
                  role: that.course.role,
                  type: "voice",
                  content: audio.src,
                  duration: (audio.duration * 1000),
                  display: "live",
                  from_uid: that.expert.uuid,
                  msg_time: new Date().getTime(),
                  room_id: that.course.groupId,
                  playStatus: 'stop', //play，stop
                  percentage: 0 //播放进度
                }
                if(that.course.platform == "tencent"){
                  TIM.sendMessage(that.course.groupId, 'txbamaketang', JSON.stringify(paramData), that)
                }
              }
            }
          });
        }
      });
    },
    playAudio: function(item){
      var audio = document.getElementById("audio"); var that = this;
      audio.ontimeupdate = function (event) {
        for (var i = 0; i < that.contentList.length; i++) {
          if(that.contentList[i].type == 'voice' && that.contentList[i].from_uid == item.from_uid && that.contentList[i].msg_time == item.msg_time){
            var duration = item.duration;
            var currentTime = parseInt(event.currentTarget.currentTime * 1000)
            var percentage = parseInt((currentTime/duration)*100);
            that.contentList[i].percentage = percentage; break;
          }
        }
      }
      audio.onended = function (event) {
        for (var i = 0; i < that.contentList.length; i++) {
          if(that.contentList[i].type == 'voice' && that.contentList[i].from_uid == item.from_uid && that.contentList[i].msg_time == item.msg_time){
            that.contentList[i].playStatus = "stop"; that.contentList[i].percentage = 0;
            break;
          }
        }
      }
      audio.oncanplay = function () {
        for (var i = 0; i < that.contentList.length; i++) {
          if(that.contentList[i].type == 'voice' && that.contentList[i].from_uid == item.from_uid && that.contentList[i].msg_time == item.msg_time){
            that.contentList[i].playStatus = "play"; that.contentList[i].percentage = 0;
            break;
          }
        }
        that.stopVoice(2);
        audio.play();
      }
      if (item.playStatus == "play"){
        for (var i = 0; i < this.contentList.length; i++) {
          if(this.contentList[i].type == 'voice'){
            this.contentList[i].playStatus = "stop"; this.contentList[i].percentage = 0;
          }
        }
        audio.pause();
      }else if (item.playStatus == "stop"){
        for (var i = 0; i < this.contentList.length; i++) {
          if(this.contentList[i].type == 'voice'){
            this.contentList[i].playStatus = "stop"; this.contentList[i].percentage = 0;
          }
        }
        audio.setAttribute("src", item.content); audio.load();
      }
    },
    sendOnWall: function(){
      //专家、主持人
      var paramData = {
        avatar: this.expert.avatar,
        username: this.expert.name,
        role: this.course.role,
        type: "qna",
        content: this.textarea,
        duration: null,
        display: "live",
        from_uid: this.expert.uuid,
        msg_time: new Date().getTime(),
        room_id: this.course.groupId,
        question: this.objQuestion
      }
      if(this.course.platform == "tencent"){
        TIM.sendMessage(this.course.groupId, 'txbamaketang', JSON.stringify(paramData), this)
      }
    },
    setGroupMuted: function(userId){
      var that = this;
      Dialog.confirm({
        message: '你确定要 禁言 此用户吗？'
      }).then(() => {
        TIM.setGroupMemberMuteTime(that.course.groupId, userId, 600, that);
      });
    },
    closeContract: function(){
      this.showContract = false;
      localStorage.setItem("showContract", true);
    },
    itemPlayEvent: function(){
      if(document.getElementById("videoEl") != null){
        document.getElementById("videoEl").pause(); this.currentTimer = '00:00';
        this.playStatus = 'playing';
      }
      if(document.getElementById("audio") != null){
        document.getElementById("audio").pause();
        for (var i = 0; i < this.contentList.length; i++) {
          if(this.contentList[i].type == 'voice'){
            this.contentList[i].playStatus = "stop"; this.contentList[i].percentage = 0;
          }
        }
      }
    },
    stopVoice: function(type){
      if(type == 0){
        //停止全部语音
        if(document.getElementById("videoEl") != null){
          document.getElementById("videoEl").pause(); this.currentTimer = '00:00';
          this.playStatus = 'playing';
        }
        if(document.getElementById("audio") != null){
          document.getElementById("audio").pause();
          for (var i = 0; i < this.contentList.length; i++) {
            if(this.contentList[i].type == 'voice'){
              this.contentList[i].playStatus = "stop"; this.contentList[i].percentage = 0;
            }
          }
        }
        if ($(".videoClass").length > 0){
          for (let i = 0; i < $(".videoClass").length; i++) {
            if($(".videoClass")[i].pause != undefined){
              $(".videoClass")[i].pause()
            }
          }
        }
      }else if(type == 1){
        //停止聊天语音
        if(document.getElementById("audio") != null){
          document.getElementById("audio").pause();
          for (var i = 0; i < this.contentList.length; i++) {
            if(this.contentList[i].type == 'voice'){
              this.contentList[i].playStatus = "stop"; this.contentList[i].percentage = 0;
            }
          }
        }
        if ($(".videoClass").length > 0){
          for (let i = 0; i < $(".videoClass").length; i++) {
            if($(".videoClass")[i].pause != undefined){
              $(".videoClass")[i].pause()
            }
          }
        }
      }else if(type == 2){
        //停止课件语音
        if(document.getElementById("videoEl") != null){
          document.getElementById("videoEl").pause(); this.currentTimer = '00:00';
          this.playStatus = 'playing';
        }
        if ($(".videoClass").length > 0){
          for (let i = 0; i < $(".videoClass").length; i++) {
            if($(".videoClass")[i].pause != undefined){
              $(".videoClass")[i].pause()
            }
          }
        }
      }
    }
  },
  mounted() {
    this.isWeChatAndQQ();
    this.showOverlay = true; this.maskLoading = '加载中...';
    if(this.browserType == "WeChat"){
      var that = this;
      window.onpagehide = function(){
        if(that.course.platform == "tencent"){
          if(that.course.role == 'normal' || that.course.role == 'inviter'){
            TIM.quitGroup(that.course.groupId, this);
          }else {
            TIM.logout();
          }
        }
        that.groupChatList = []; that.contentList = [];
        clearInterval(that.interval);
      }
    }
    var that = this; var paramsData = {};
    if(this.$route.params.type == "uuid"){
      paramsData = {
        uuid: this.$route.params.uuid
      }
    }else if(this.$route.params.type == "RoomUuid"){
      paramsData = {
        roomUuid: this.$route.params.uuid
      }
    }
    request.getLiveDetails(paramsData).then((json) => {
      if(json.code == 200){
        that.course = json.data;
        if(that.course.courseSource != null){
          //资源类型
          that.sourceType = that.course.courseSource.sourceType;
        }

        if(that.course.role == "expert" && localStorage.getItem("showContract") == "false"){
          that.showContract = true;
        }
        if(that.course.role == "expert" || that.course.role == "compere"){ that.isLecturer = true; that.getJsSdk(); }
        if(that.course.courseSource != null){
          //资源类型
          switch (that.course.courseSource.sourceType) {
            case 1: //视频
              that.sourceURL = that.course.courseSource.url;
              var interval = setInterval(()=>{
                if(document.getElementById('videoEl') != null){
                  document.getElementById('videoEl').setAttribute("src", that.sourceURL);
                  document.getElementById('videoEl').load();
                  clearInterval(interval);
                }
              }, 100);
              break;
            case 2: //音频
              that.sourceURL = that.course.courseSource.url;
              var interval = setInterval(()=>{
                if(document.getElementById('videoEl') != null){
                  document.getElementById('videoEl').setAttribute("src", that.sourceURL);
                  document.getElementById('videoEl').load();
                  clearInterval(interval);
                }
              }, 100);
              break;
            case 3: //PPT
              that.sourceURL = that.course.courseSource.url;
              break;
            case 4: //图片
              that.sourceURL = new Array(that.course.courseSource.url);
              break;
          }
        }
        that.maskLoading = "课前话术，请稍等...";
        request.getRoomMsg({uuid: that.course.uuid}).then((json) => {
          if(json.code == 200){
            var paramData = {}; that.expert = json.data.expert;
            for (var i = 0; i < json.data.courseSources.length; i++) {
              var expert = that.expert;
              var sources = json.data.courseSources[i];

              if(sources.sourceType == 1){ //音频
                paramData = {
                  avatar: expert.avatar,
                  username: expert.name,
                  role: 'expert',
                  type: "voice",
                  content: sources.url,
                  duration: (sources.duration * 1000),
                  display: "live",
                  from_uid: expert.uuid,
                  msg_time: new Date().getTime(),
                  room_id: that.course.groupId,
                  playStatus: 'stop',
                  percentage: 0
                }
              }else if(sources.sourceType == 2){ //视频
                paramData = {
                  avatar: expert.avatar,
                  username: expert.name,
                  role: 'expert',
                  type: "video",
                  content: sources.url,
                  duration: null,
                  display: "live",
                  from_uid: expert.uuid,
                  msg_time: new Date().getTime(),
                  room_id: that.course.groupId
                }
              }else if(sources.sourceType == 3){ //图片
                paramData = {
                  avatar: expert.avatar,
                  username: expert.name,
                  role: 'expert',
                  type: "img",
                  content: sources.url,
                  duration: null,
                  display: "live",
                  from_uid: expert.uuid,
                  msg_time: new Date().getTime(),
                  room_id: that.course.groupId
                }
              }else if(sources.sourceType == 4){ //文字
                paramData = {
                  avatar: expert.avatar,
                  username: expert.name,
                  role: 'expert',
                  type: "txt",
                  content: sources.url,
                  duration: null,
                  display: "live",
                  from_uid: expert.uuid,
                  msg_time: new Date().getTime(),
                  room_id: that.course.groupId
                }
              }
              that.contentList.push(paramData);
            }
            if(that.course.role == 'expert'){
              request.getIMStatus({uuid: JSON.parse(sessionStorage.getItem("profile")).uuid}).then((json) => {
                if(json.code == 200){
                  if(json.data.status == "Online"){
                    Dialog.confirm({
                      message: '当前直播间已有专家在线，是否继续进入并以专家身份同时使用？'
                    }).then(() => {
                      if(that.course.platform == "tencent"){
                        var uuid = JSON.parse(sessionStorage.getItem("profile")).uuid;
                        request.postIMSignUp({uuid: uuid}).then((json) => {
                          that.loginTim(json);
                        });
                      }
                    }).catch(() => {
                      history.back();
                    });
                  }else if(json.data.status == "Offline" || json.data.status == "PushOnline"){
                    if(that.course.platform == "tencent"){
                      var uuid = JSON.parse(sessionStorage.getItem("profile")).uuid;
                      request.postIMSignUp({uuid: uuid}).then((json) => {
                        that.loginTim(json);
                      });
                    }
                  }
                }
              });
            }else {
              if(that.course.platform == "tencent"){
                var uuid = JSON.parse(sessionStorage.getItem("profile")).uuid;
                request.postIMSignUp({uuid: uuid}).then((json) => {
                  that.loginTim(json);
                });
              }
            }
          }
        });
      }
    });
  },
  beforeDestroy: function () {
    if(this.course.platform == "tencent"){
      if(this.course.role == 'normal' || this.course.role == 'inviter'){
        TIM.quitGroup(this.course.groupId, this);
      }else {
        TIM.logout();
      }
    }
    this.groupChatList = []; this.contentList = [];
    clearInterval(this.interval);
  },
  watch: {
    question: function(newValue, oldValue){
      if(this.$refs.question != undefined){
        this.$refs.question.setQuestion(newValue, this.content);
      }
    },
    content: function(newValue, oldValue){
      if(this.$refs.question != undefined){
        this.$refs.question.setQuestion(this.question, newValue);
      }
    },
    showQuestion: function(newValue, oldValue){
      if (newValue == false && this.isLecturer == true && this.tabIndex == 4) {
        this.tabIndex = 0;
      }
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
  .divLiveCourse{
    background-color: #F7F7F7;
  }
  .divLiveCourse .divRecord *{
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  .divLiveCourse .divCourseWare{
    width: 100%; height: 230px; background-color: #333333;
  }
  .divLiveCourse .divCourseWare .divEmptyData{
    font-size: 14px; color: #FFF; font-weight: 500; width: 100%;
    height: 190px; display: flex; align-items: center; justify-content: center;
    letter-spacing: 1px;
  }
  .divLiveCourse .divCourseWare .vanImage{
    width: 100%; height: 230px;
  }
  .divLiveCourse .divCourseWare .customIndicator{
    position: absolute;
    left: 5px;
    bottom: 15px;
    padding-top: 4px; padding-bottom: 2px;
    padding-left: 5px; padding-right: 5px;
    color: #fff;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.6);
  }
  .divLiveCourse .divCourseWare .divVideo{
    width: 100%; height: 230px;
    position: sticky;
    top: 0; z-index: 10;
  }
  .divLiveCourse .divCourseWare .divVideo video{
    width: 100%; height: 230px; position: absolute;
    background-color: #333333;
  }
  .divLiveCourse .divCourseWare .divVideo .divPlayContext{
    position: absolute;
    padding-top: 90px;
    text-align: center; width: 100%; height: 205px; box-sizing: border-box;
  }
  .divLiveCourse .divCourseWare .divVideo .divPlayContext .imgPlay{
    width: 50px; height: 50px;
  }
  .divLiveCourse .divCourseWare .divVideo .divPlayContext .divAdvisory{
    width: 100%; text-align: center;
  }
  .divLiveCourse .divCourseWare .divVideo .divPlayContext .divAdvisory .divTip{
    font-size: 20px; font-weight: 500; color: #FFFFFF; margin-top: 12px;
    letter-spacing: 2px;
  }

  .divLiveCourse .divCourseWare .divVideo .divControl{
    position: absolute;
    display: flex; flex-direction: row;
    align-items: center; width: 100%; margin-top: 204px;
  }
  .divLiveCourse .divCourseWare .divVideo .divControl .divScroll{
    display: flex; align-items: center; justify-content: center;
    flex-direction: row; box-sizing: border-box;
    flex: 1; padding-left: 10px; padding-right: 10px; height: 20px;
  }
  .divLiveCourse .divCourseWare .divVideo .divControl .divScroll label{
    font-size: 12px; color: #FFF; width: 30px;
  }
  .divLiveCourse .divCourseWare .divVideo .divControl .divScroll .divSlider{
    flex: 1; margin-left: 13px; margin-right: 13px;
    margin-top: -2px; overflow: visible;
  }
  .divLiveCourse .divCourseWare .divVideo .divControl .divNumberRate{
    background-color: #333333; opacity: 0.8; width: 28px;
    font-size: 12px; color: #FFF; display: flex;
    align-items: center; justify-content: center;
    padding-left: 3px; padding-right: 3px; border-radius: 3px;
    line-height: 22px; margin-right: 10px;
  }
  .divLiveCourse .divCourseWare .divVideo .divControl .divFullScreen{
    width: 20px; height: 20px; display: flex; align-items: center;
    background-color: #333333; border-radius: 4px; opacity: 0.8;
    justify-content: center; margin-right: 10px;
    padding: 1px;
  }
  .divLiveCourse .divCourseWare .divVideo .divControl .divFullScreen .imgFullScreen{
    width: 14px; height: 14px;
  }
  .divLiveCourse .divBase{
    width: 100%; display: flex; align-items: center;
    justify-content: center; padding-left: 10px;
    box-sizing: border-box; width: 100%;
    padding-top: 6px; background-color: #FFF;
  }
  .divLiveCourse .divBase .divText{
    flex: 1;
  }
  .divLiveCourse .divBase .divText .divName{
    font-size: 15px; font-weight: bold; color: #333333;
  }
  .divLiveCourse .divBase .divText .divNumber{
    font-size: 13px; font-weight: 500; color: #999999;
    margin-top: 5px;
  }
  .divLiveCourse .divBase .divFlag{
    margin-top: -10px;
  }
  .divLiveCourse .divBase .divFlag .imgType{
    height: 25px; margin-right: 10px;
  }
  .divLiveCourse .divBase .divFlag .imgBarrage{
    height: 25px; margin-right: 10px;
  }
  .divLiveCourse .divBottom{
    position: fixed; width: 100%; bottom: 0px;
    padding-bottom: 8px; display: flex; align-items: center;
    background-color: #FFF; padding-top: 5px;
  }
  .divLiveCourse .divBottom .divButton{
    display: flex; align-items: center;
  }
  .divLiveCourse .divBottom .divButton .imgMsg{
    width: 24px; margin-right: 6px;
  }
  .divLiveCourse .divBottom .divComment{
    border-radius: 20px; display: flex;
    background-color: rgb(245, 249, 255);
    flex: 1; margin-left: 10px; margin-right: 8px;
    height: 35px; padding-left: 12px; padding-right: 12px;
  }
  .divLiveCourse .divBottom .divComment .iptComment{
    font-size: 14px; font-weight: 500; border: none;
    background-color: rgb(245, 249, 255); width: 100%;
  }
  .divLiveCourse .divBottom .divFavorites{
    display: flex; align-items: center;
    justify-content: center; margin-right: 10px;
  }
  .divLiveCourse .divBottom .divFavorites .imgFavorites{
    width: 26px; margin-right: 2px;
  }
  .divLiveCourse .divBottom .divFavorites .spanGray{
    margin-top: 5px; font-size: 14px; color: #333333;
  }
  .divLiveCourse .divBottom .divFavorites .spanRed{
    margin-top: 5px; font-size: 14px; color: #FF6B88;
  }
  .divLiveCourse .vanRadio{
    width: 54px;
    height: 28px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .divLiveCourse .vanRadio .label{
    font-size: 13px;
    margin-left: -3px; color: #999999;
  }
  .divLiveCourse .divChat{
    background-color: #F7F7F7; width: 100%;
    overflow-x: hidden; overflow-y: auto;
    padding-top: 15px; height: 322px;
  }
  .divLiveCourse .divChat .divTip{
    font-weight: 500; font-size: 14px; color: #999999;
    background-color: #EEEEEE; border-radius: 20px;
    line-height: 30px; padding-left: 15px; padding-right: 15px;
    width: 80px; text-align: center; margin-left: auto;
    margin-right: auto; margin-bottom: 15px;
  }
  .divLiveCourse .divChat .divItem{
    margin-bottom: 15px; width: 100px;
    display: flex; flex-direction: row; align-items: flex-start;
    width: 100%; padding-left: 10px;
  }
  .divLiveCourse .divChat .divItem .imgAvatar{
    border-radius: 50%; width: 50px; height: 50px; overflow: hidden;
    border: 1px solid rgb(216, 216, 216); background-color: rgb(216, 216, 216);
  }
  .divLiveCourse .divChat .divItem .divContent{
    margin-left: 5px; align-items: flex-start;
    display: flex; flex-direction: column;
  }
  .divLiveCourse .divChat .divItem .divContent .divName{
    font-size: 18px; color: #333333; display: flex; font-weight: 500;
    align-items: center; justify-content: flex-start;
  }
  .divLiveCourse .divChat .divItem .divContent .divName .divExpert{
    background:linear-gradient(135deg,rgba(95,180,255,1) 0%,rgba(100,146,255,1) 100%);
    border-radius: 3px; line-height: 18px; margin-left: 10px;
    font-size: 12px; font-weight: 500; padding-left: 6px; padding-right: 6px;
    color: #FFF; letter-spacing: 1px; padding-top: 2px;
  }
  .divLiveCourse .divChat .divItem .divContent .divName .divCompere{
    background:linear-gradient(135deg, #ffbd84 0%, #fb9523 100%);
    border-radius: 3px; line-height: 18px; margin-left: 10px;
    font-size: 12px; font-weight: 500; padding-left: 6px; padding-right: 6px;
    color: #FFF; letter-spacing: 1px; padding-top: 2px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext{
    margin-top: 6px; display: flex; align-items: flex-start;
    justify-content: center;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .imgLeft{
    height: 12px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divPlay{
    background:linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    padding: 6px; display: flex; flex-direction: row; align-items: center;
    width: 210px; border-top-right-radius: 6px;  border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px; padding-left: 10px; padding-right: 10px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divPlay .imgPlay{
    width: 35px; height: 35px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divPlay .vueProgress{
    flex: 1; margin-left: 8px; margin-right: 8px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divPlay .lblTimer{
    font-size: 15px; font-weight: 500; color: #FFF;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divText1{
    background:linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    padding: 10px; max-width: 210px; padding-bottom: 0px;
    border-top-right-radius: 6px;  border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divText1 .imgMsg{
    max-width: 200px; height: auto;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divText{
    background:linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    padding: 6px; font-size: 14px; color: #FFF; max-width: 210px; line-height: 17px;
    border-top-right-radius: 6px;  border-bottom-right-radius: 6px; letter-spacing: 0px;
    border-bottom-left-radius: 6px; padding-left: 10px; padding-right: 10px;
  }

  .divLiveCourse .divChat .divItem .divContent .divContext .divText .divSplitline{
    width: 100%; border-bottom: 1px solid #FFF; margin-top: 8px; margin-bottom: 8px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divWithdraw{
    font-size: 14px; color: #2F8DFB; margin-top: 17px; margin-left: 7px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divHaveRead{
    font-size: 14px; color: #999999; margin-top: 17px; margin-left: 7px;
  }
  .divLiveCourse .divChat .divItem .divContent .divContext .divUnRead{
    font-size: 14px; color: #FF6B88; margin-top: 17px; margin-left: 7px;
  }
  .divLiveCourse .divPlayPositioning{
    position: absolute; left: 0; bottom: 55px; z-index: 1;
    padding: 8px; width: 90px; text-align: center; padding-right: 15px;
    background:#FFF; font-size: 14px; color: #FF5D86;
    box-shadow:0px 0px 10px 0px rgba(0,0,0,0.1);
    border-radius:0px 20px 20px 0px;
  }
  .divLiveCourse .divReplys{
    overflow-x: hidden; overflow-y: auto; position: absolute;
    bottom: 47px; max-width: 242px; right: 0; padding-right: 8px;
  }
  .divLiveCourse .divReplys .divFlex{
    display: flex; justify-content: flex-end; margin-bottom: 10px;
  }
  .divLiveCourse .divReplys .divFlex .divItem{
    background-color: rgba(0,0,0,0.5); border-radius: 6px;
    display: flex; flex-direction: row; align-items: flex-start;
    padding: 5px;
  }
  .divLiveCourse .divReplys .divFlex .divItem .divTxt{
    font-size: 14px; color: #FFF; margin-top: 5px; word-break: break-word;
  }
  .divLiveCourse .divReplys .divFlex .divItem .imgAvatar{
    width: 25px; min-width: 25px; height: 25px; border-radius: 50%;
    margin-left: 6px; margin-right: 4px; overflow: hidden;
  }
  .divLiveCourse .divOnTheWall{
    padding: 10px;
  }
  .divLiveCourse .divOnTheWall .textarea{
    padding: 6px; border-radius: 6px;
    resize: none; box-sizing: border-box; width: 100%;
    height: 120px; border: none; background-color: #F7F7F7;
    font-size: 14px; color: #333333;
  }
  .divLiveCourse .divBottom1{
    position: fixed; width: 100%; bottom: 0px;
    background-color: #FFF; min-height: 48px;
  }
  .divLiveCourse .divBottom1 .divFlex{
    display: flex; align-items: center; justify-content: center;
    height: 48px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }
  .divLiveCourse .divBottom1 .divFlex .divItem{
    font-size: 14px; color: #999999; flex: 1; text-align: center;
    height: 28px; display: flex; justify-content: center;
    align-items: center; border-right: 1px solid #D8D8D8;
  }
  .divLiveCourse .divBottom1 .divFlex .divItem:last-child{
    border-right: none;
  }
  .divLiveCourse .divBottom1 .divFlex .divItemSelect{
    font-size: 14px; color: #FF6B88; flex: 1; text-align: center;
    height: 28px; display: flex; justify-content: center;
    align-items: center; border-right: 1px solid #D8D8D8;
  }
  .divLiveCourse .divBottom1 .divFlex .divItemSelect:last-child{
    border-right: none;
  }
  .divLiveCourse .divBottom1 .divRecord{
    height: 170px;
  }
  .divLiveCourse .divBottom1 .divRecord .divSpeak{
    display: flex; flex-direction: column; align-items: center;
    height: 170px; justify-content: center;
  }
  .divLiveCourse .divBottom1 .divRecord .divSpeak .divCircle{
    position: absolute; margin-top: 0px; margin-left: 0px;
  }
  .divLiveCourse .divBottom1 .divRecord .divSpeak .imgSpeakGeneral{
    background-image: url('~@/assets/images/live/record_general.png');
    background-repeat: no-repeat; background-size: 100% 100%;
    width: 85px; height: 85px;
  }
  .divLiveCourse .divBottom1 .divRecord .divSpeak .imgSpeakPress{
    background-image: url('~@/assets/images/live/record_press.png');
    background-repeat: no-repeat; background-size: 100% 100%;
    width: 85px; height: 85px;
  }
  .divLiveCourse .divBottom1 .divRecord .divSpeak .lblInfo{
    font-size: 14px; color: #999999; margin-top: 8px;
  }
  .divLiveCourse .divBottom1 .divRecord .divSpeak .lblInfoRecord{
    font-size: 14px; color: #F6708B; margin-top: 8px;
  }
  .divLiveCourse .divBottom1 .divRecord .divControl{
    display: flex; align-items: center; justify-content: space-around;
    height: 170px;
  }
  .divLiveCourse .divBottom1 .divRecord .divControl .imgRevoke{
    width: 54px; height: 54px; margin-left: 15px
  }
  .divLiveCourse .divBottom1 .divRecord .divControl .imgPlay{
    width: 85px; height: 85px;
  }
  .divLiveCourse .divBottom1 .divRecord .divControl .imgSend{
    width: 54px; height: 54px; margin-right: 15px
  }
  .divLiveCourse .divBottom1 .divText{
    width: 100%; height: 55px; padding-top: 8px;
    box-sizing: border-box;
  }
  .divLiveCourse .divBottom1 .divText .divReply{
    border-radius: 20px; display: flex;
    background-color: rgb(245, 249, 255);
    flex: 1; margin-left: 10px; margin-right: 8px;
    height: 35px; padding-left: 12px; padding-right: 12px;
  }
  .divLiveCourse .divBottom1 .divText .divReply .iptText{
    font-size: 14px; font-weight: 500; border: none;
    background-color: rgb(245, 249, 255); width: 100%;
  }
  .divLiveCourse .divBottom1 .divMedia{
    width: 100%; height: 95px;
    box-sizing: border-box; display: flex; flex-direction: row;
    align-items: center;
  }
  .divLiveCourse .divBottom1 .divMedia .divFileFlex{
    width: 70px; height: 70px; margin-left: 10px;

  }
  .divLiveCourse .divBottom1 .divMedia .divFileFlex .imgImage{
    width: 70px; height: 70px;
  }
  .divLiveCourse .divBottom1 .divMedia .divFileFlex .imgVideo{
    width: 70px; height: 70px;
  }
  .divLiveCourse .divBottom1 .divMedia .divFileFlex input[type=file]{
    position: absolute;
    width: 70px; height: 70px;
    margin-left: -70px; opacity: 0;
  }
  .divLiveCourse .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
