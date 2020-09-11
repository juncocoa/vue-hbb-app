<template>
  <div class="divCommentList">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="showPullRefresh" :style="{paddingBottom: (showReply)?'45px':'0px'}">
      <div v-if="commentList.length <= 0" class="divDefInfo">
        <img src="@/assets/images/default/msg.png" class="imgDefault"/>
        <div class="divTip">没有评论</div>
      </div>
      <div class="divItem" v-for="(item, index) in commentList" :key="index">
        <van-image :src="item.user.avatar" lazy-load class="imgAvatar">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
          <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgDefaultAvatar"/></template>
        </van-image>
        <div class="divContext">
          <div class="divFlex">
            <div class="divLeft">
              <div class="divName">{{item.user.nickName}}</div>
              <div class="divTimer">{{item.createTime | formatDateByFormat('yyyy-MM-dd')}}</div>
            </div>
            <div class="divRight">
              <img src="@/assets/images/course/like.png" class="imgThumbsUp" v-if="item.isLike == true" @click="isLikeAndNoLike(item.uuid, 'like')"/>
              <img src="@/assets/images/course/unLike.png" class="imgThumbsUp" v-if="item.isLike == false" @click="isLikeAndNoLike(item.uuid, 'unLike')"/>
              <label>{{item.likeCount}}</label>
            </div>
          </div>
          <div class="divContent">{{item.content}}</div>
        </div>
      </div>
    </van-pull-refresh>
    <div v-if="!showPullRefresh" :style="{paddingBottom: (showReply)?'45px':'0px'}">
      <div v-if="commentList.length <= 0" class="divText">对不起，没有相关评论</div>
      <div class="divItem" v-for="(item, index) in commentList" :key="index">
        <van-image :src="item.user.avatar" lazy-load class="imgAvatar">
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
          <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/></template>
        </van-image>
        <div class="divContext">
          <div class="divFlex">
            <div class="divLeft">
              <div class="divName">{{item.user.nickName}}</div>
              <div class="divTimer">{{item.createTime | formatDateByFormat('yyyy-MM-dd')}}</div>
            </div>
            <div class="divRight">
              <img src="@/assets/images/course/like.png" class="imgThumbsUp" v-if="item.isLike == true" @click="isLikeAndNoLike(item.uuid, 'like')"/>
              <img src="@/assets/images/course/unLike.png" class="imgThumbsUp" v-if="item.isLike == false" @click="isLikeAndNoLike(item.uuid, 'unLike')"/>
              <label>{{item.likeCount}}</label>
            </div>
          </div>
          <div class="divContent">{{item.content}}</div>
        </div>
      </div>
    </div>
    <div class="divBottom" v-if="showReply">
      <div class="divComment">
        <input placeholder="输入评论内容或提问" class="iptComment" v-model="content" v-on:keydown="keydown" v-on:blur="onBlur"/>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/course';

export default {
  name: 'commentList',
  props: {
    courseUUID: {
      type: String,
      default: ""
    },
    showReply: {
      type: Boolean,
      default: false
    },
    showPullRefresh: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    isLoading: false,
    commentList: [],
    content: ''
  }),
  methods: {
    onBlur(){
      var timeout = setTimeout(function(){
        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0)); clearTimeout(timeout);
      }, 100);
    },
    initiaData: function(){
      if(this.courseUUID != ""){
        var that = this;
        request.getCommentList({uuid: this.courseUUID}).then((json) => {
          if(json.code == 200){
            that.commentList = json.data.results;
          }
        });
      }
    },
    onRefresh: function(){
      var that = this;
      request.getCommentList({uuid: this.courseUUID}).then((json) => {
        if(json.code == 200){
          that.isLoading = false;
          that.commentList = json.data.results;
        }
      });
    },
    isLikeAndNoLike: function (uuid, type) {
      var that = this;
      if(type == 'like'){
        request.getDelCommentLike({uuid: uuid}).then((json) => {
          if(json.code == 200){
            that.initiaData(); Toast(json.msg);
          }
        });
      }else if(type == 'unLike'){
        request.getCommentLike({uuid: uuid}).then((json) => {
          if(json.code == 200){
            that.initiaData(); Toast(json.msg);
          }
        });
      }
    },
    keydown (e){
      if(!e){ e = window.event; }
	    if(e.keyCode == 13){
        var that = this; this.isLoading = true;
        request.getAddComment({uuid: this.courseUUID, content: e.target.value}).then((json) => {
          if(json.code == 200){
            this.content = ''; this.isLoading = false;
            that.initiaData(); Toast(json.msg);
          }
        });
	    }
    }
  },
  mounted() {
    this.initiaData();
  },
}
</script>
<style lang="scss" scoped>
  .divCommentList{
    padding-left: 10px; padding-right: 10px; padding-top: 10px;
    border-top: 1px solid #F5F5F5; padding-bottom: 25px;
  }
  .divCommentList .divItem{
    margin-top: 8px; display: flex;
  }
  .divCommentList .divItem .divContext{
    border-bottom: 1px solid rgb(247,247,247);
    padding-bottom: 15px; flex: 1;
  }
  .divCommentList .divItem .imgAvatar{
    border-radius: 50%; width: 50px; height: 50px;
    margin-right: 8px; overflow: hidden;
  }
  .divCommentList .divItem .divFlex{
    display: flex; flex-direction: row; align-items: center;
    margin-top: 10px;
  }
  .divCommentList .divItem .divFlex .divLeft{
    flex: 1;
  }
  .divCommentList .divItem .divFlex .divLeft .divName{
    font-size: 14px; color: #333333;
    display: -webkit-box; -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divCommentList .divItem .divFlex .divLeft .divTimer{
    font-size: 14px; color: #999999; margin-top: 5px;
  }
  .divCommentList .divItem .divFlex .divRight{
    width: 60px; display: flex; align-items: center; justify-content: flex-end;
  }
  .divCommentList .divItem .divFlex .divRight .imgThumbsUp{
    width: 16px; margin-right: 5px;
  }
  .divCommentList .divItem .divFlex .divRight label{
    font-size: 14px; color: #999999; overflow: hidden;
  }
  .divCommentList .divItem .divContent{
    font-size: 14px; color: #333333; margin-top: 10px;
    display: -webkit-box; -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; overflow: hidden;
  }
  .divCommentList .divBottom{
    position: fixed; width: 100%; bottom: 0px;
    padding-bottom: 8px; background-color: #FFF;
    margin-left: -10px; padding-top: 6px;
  }
  .divCommentList .divBottom .divComment{
    border-radius: 20px; display: flex; width: 87%;
    background-color: rgb(245, 249, 255); flex: 1;
    height: 35px; padding-left: 12px; padding-right: 12px;
    margin-left: auto; margin-right: auto; margin-bottom: 4px;
  }
  .divCommentList .divBottom .divComment .iptComment{
    font-size: 14px; font-weight: 500; border: none;
    background-color: rgb(245, 249, 255); width: 100%;
  }
  .divCommentList .divDefInfo{
    text-align: center;
  }
  .divCommentList .divDefInfo .imgDefault{
    width: 160px; margin-top: -10px;
  }
  .divCommentList .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -25px; padding-bottom: 20px;
  }
  .divCommentList .divText{
    font-size: 14px; text-align: center; color: #999;
    border: 1px dashed #ccc; padding: 10px; width: 92%;
    margin-left: auto; margin-right: auto;
  }
</style>
