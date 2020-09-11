<template>
  <div class="divQuestion">
    <div class="divTitle">
      <div class="divName">
        <div class="divSquare"></div>
        {{(isLecturer)?'只看问题':'提问'}}
      </div>
      <img src="@/assets/images/live/more.png" class="imgDown" @click="foldFn"/>
    </div>
    <div v-if="list.length <= 0" style="font-size: 14px;color: #333;margin: 30px;text-align: center;">暂无提问</div>
    <EasyRefresh
        v-if="list.length > 0"
        :userSelect="false"
        :style="{height: height}"
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
        <div class="divItems" :style="{height: height}">
          <div class="divItem" v-for="(item, index) in list" :key="'item_' + index">
            <van-image :src="item.content.avatar" lazy-load class="imgAvatar">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
            </van-image>
            <div class="divContent">
              <div class="divFlex">
                <div class="divLeft">
                  <div class="divName">
                    <div class="divText">{{item.content.username}}</div>
                    <div class="divOperate">
                      <div class="divDelete" v-if="isLecturer == true" @click="delComment(item.content.from_uid, item.content.msg_time)">删除</div>
                      <div class="divDelete" v-if="isLecturer == false && item.content.from_uid == profileUUID" @click="delComment(item.content.from_uid, item.content.msg_time)">删除</div>
                      <div class="divDelete" v-if="isLecturer" @click="btnMuted(item.content.from_uid)">禁言</div>
                    </div>
                  </div>
                  <div class="divTimer">{{item.content.msg_time | formatDateByFormat('yyyy-MM-dd hh:mm:ss')}}</div>
                </div>
                <button class="btnRight" v-if="isLecturer && item.isWall == false" @click="onTheWallFn(item.content)" >上墙</button>
                <button class="btnRightDisable" v-if="isLecturer && item.isWall == true">已上墙</button>
              </div>
              <div class="divTxt">{{item.content.content}}</div>
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
    <div class="divBottom">
      <div class="divComment">
        <input placeholder="输入评论内容或提问" class="iptComment" v-model="content" v-on:keydown="keydown" v-on:blur="onBlur"/>
        <van-checkbox class="vanRadio" v-model="question" v-if="isLecturer == false">
          <label class="label">提问</label>
          <img
            slot="icon"
            slot-scope="props"
            style="width: 12px"
            :src="props.checked ? activeIcon : inactiveIcon">
        </van-checkbox>
      </div>
      <div class="divButton" v-if="isLecturer">
        <img src="@/assets/images/live/comment.png" class="imgMsg" @click="showQuestionFn"/>
        <div class="divFavorites" @click="btnFavorites">
          <img src="@/assets/images/course/favorited.png" class="imgFavorites" v-if="course.isLike == true"/>
          <img src="@/assets/images/course/favourite.png" class="imgFavorites" v-if="course.isLike == false"/>
          <span :class="(course.isLike)?'spanRed':'spanGray'">收藏</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as TIM from "../utils/TIM.js"
import * as request from '../service/live.js'

export default {
  name: 'questionList',
  props: {
    course: {
      type: Object,
      default: {}
    },
    proQuestion: {
      type: Boolean,
      default: false
    },
    proContent: {
      type: String,
      default: ''
    },
    isLecturer: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    height: (parseInt(window.innerHeight * 0.73) - 90) + 'px',
    activeIcon: require('@/assets/images/live/select.png'),
    inactiveIcon: require('@/assets/images/live/unselect.png'),
    profileUUID: JSON.parse(sessionStorage.getItem("profile")).uuid,
    question: false,
    content: '',

    list: [],
    total: 0,
    currentPage: 1,
  }),
  methods: {
    onBlur(){
      var timeout = setTimeout(function(){
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0)); clearTimeout(timeout);
      }, 100);
    },
    foldFn: function(){
      this.$emit('closeWindows');
    },
    onRefreshFn: function (done) {
      this.initiData(done);
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; this.currentPage++;
        request.chatsHistory({uuid: this.course.groupId, displayPos: 'barrage', isQuestion: true, page: this.currentPage}).then((json) => {
          if(json.code == 200){
            for (let i = 0; i < json.data.results.length; i++) {
              json.data.results[i].content = JSON.parse(json.data.results[i].content)
            }
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
    sendMessage: function(val){
      var paramData = {}; var profile = JSON.parse(sessionStorage.getItem("profile"));
      var avatar = ""; var nickName = "";
      if(profile.wechatInfo != null){
        avatar = profile.wechatInfo.avatar;
        nickName = profile.wechatInfo.nickName;
      }else {
        avatar = profile.avatar;
        nickName = profile.nickName;
      }
      if(this.course.role == "expert" || this.course.role == "compere"){
        //专家、主持人
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
        TIM.sendMessage(this.course.groupId, 'txbamaketang', JSON.stringify(paramData), window.that)
      }
    },
    keydown: function(e){
      if(!e){ e = window.event; }
	    if(e.keyCode == 13){
        if(e.target.value.trim() == ""){ return; }
        this.sendMessage(e.target.value);
	    }
    },
    showQuestionFn: function () {
      this.$emit('closeWindows');
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
    setQuestion: function(question, content){
      this.question = question;
      this.content = content;
    },
    delComment: function(uuid, msgTime){
      Dialog.confirm({
        message: '删除该评论？',
        confirmButtonColor: '#FF6B88'
      }).then(() => {
        var that = this;
        request.putDelChat({uuid: uuid, msgTime: msgTime}).then((json) => {
          if(json.code == 200){
            that.initiData(); Toast('评论 删除 成功。');
          }
        });
      });
    },
    btnMuted: function(userId){
      this.$emit('setGroupMuted', userId);
    },
    onTheWallFn: function (content) {
      this.$emit('showOnTheWall', true, new Object({...content}));
    },
    initiData: function(done){
      var that = this;
      request.chatsHistory({uuid: this.course.groupId, displayPos: 'barrage', isQuestion: true}).then((json) => {
        if(json.code == 200){
          for (let i = 0; i < json.data.results.length; i++) {
            json.data.results[i].content = JSON.parse(json.data.results[i].content)
          }
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    }
  },
  mounted() {
    this.question = this.proQuestion;
    this.content = this.proContent;
    this.initiData();
  },
  watch: {
    question: function(newValue, oldValue){
      this.$emit('setQuestion', newValue, this.content);
    },
    content: function(newValue, oldValue){
      this.$emit('setQuestion', this.question, newValue);
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
  .divQuestion .divItems{
    overflow-x: hidden; overflow-y: auto; height: auto;
  }
  .divQuestion .divTitle{
    border-bottom: 1px solid #F5F5F5;
    padding-left: 15px; padding-right: 15px;
    padding-top: 10px; padding-bottom: 10px;
    box-sizing: border-box;
    display: flex; align-items: center; justify-content: space-between;
  }
  .divQuestion .divTitle .divName{
    font-size: 16px; font-weight: 500; color: #333333;
    display: flex; align-items: center;
  }
  .divQuestion .divTitle .divName .divSquare{
    background-color: #D8D8D8; border-radius: 3px;
    height: 13px; width: 13px; margin-right: 8px; margin-top: -3px
  }
  .divQuestion .divTitle .imgDown{
    width: 14px;
  }
  .divQuestion .divItem{
    display: flex; align-items: flex-start; padding: 10px;
    box-sizing: border-box;
  }
  .divQuestion .divItem .imgAvatar{
    border-radius: 50%; width: 50px; height: 50px; margin-right: 8px;
  }
  .divQuestion .divItem .divContent{
    flex: 1; padding-top: 5px; box-sizing: border-box;
  }
  .divQuestion .divItem .divContent .divFlex{
    display: flex; align-items: center;
  }
  .divQuestion .divItem .divContent .divFlex .divLeft{
    flex: 1;
  }
  .divQuestion .divItem .divContent .divFlex .divLeft .divName{
    font-size: 16px; color: #333333; display: flex; align-items: center; flex-direction: row;
  }
  .divQuestion .divItem .divContent .divFlex .divLeft .divName .divText{
    display: -webkit-box; -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divQuestion .divItem .divContent .divFlex .divLeft .divName .divOperate{
    display: flex; align-items: center; justify-content: flex-start; align-items: center;
    flex: 1; min-width: 79px;
  }
  .divQuestion .divItem .divContent .divFlex .divLeft .divName .divOperate .divDelete{
    font-size: 14px; color: #FF6B88; margin-left: 10px;
  }
  .divQuestion .divItem .divContent .divFlex .btnRight{
    border: 1px solid #FF6B88; font-size: 14px; color: #FF6B88;
    border-radius: 5px; background-color: transparent;
    width: 60px; padding: 5px;
  }
  .divQuestion .divItem .divContent .divFlex .btnRightDisable{
    border: 1px solid #999999; font-size: 14px; color: #999999;
    border-radius: 5px; background-color: transparent; line-height: 22px;
    width: 60px;
  }
  .divQuestion .divItem .divContent .divTimer{
    font-size: 13px; color: #999999; margin-top: 5px;
  }
  .divQuestion .divItem .divContent .divTxt{
    font-size: 14px; color: #333333; margin-top: 4px; line-height: 19px;
  }

  .divQuestion .divBottom{
    position: fixed; width: 100%; bottom: 0px;
    padding-bottom: 8px; display: flex; align-items: center;
    background-color: #FFF; padding-top: 5px; z-index: 1;
  }
  .divQuestion .divBottom .divButton{
    display: flex; align-items: center;
  }
  .divQuestion .divBottom .divButton .imgMsg{
    width: 24px; margin-right: 6px;
  }
  .divQuestion .divBottom .divComment{
    border-radius: 20px; display: flex;
    background-color: rgb(245, 249, 255);
    flex: 1; margin-left: 10px; margin-right: 8px;
    height: 35px; padding-left: 12px; padding-right: 12px;
  }
  .divQuestion .divBottom .divComment .iptComment{
    font-size: 14px; font-weight: 500; border: none;
    background-color: rgb(245, 249, 255); width: 100%;
  }
  .divQuestion .divBottom .divFavorites{
    display: flex; align-items: center;
    justify-content: center; margin-right: 10px;
  }
  .divQuestion .divBottom .divFavorites .imgFavorites{
    width: 26px; margin-right: 2px;
  }
  .divQuestion .divBottom .divFavorites .spanGray{
    margin-top: 5px; font-size: 14px; color: #333333;
  }
  .divQuestion .divBottom .divFavorites .spanRed{
    margin-top: 5px; font-size: 14px; color: #FF6B88;
  }
  .divQuestion .divBottom .vanRadio{
    width: 53px;
    height: 28px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .divQuestion .divBottom .vanRadio .label{
    font-size: 13px;
    margin-left: -3px; color: #999999;
  }
</style>
