<template>
  <div class="divChapterList">
    <div class="divTop">
      <div class="divTitle" v-if="showChapter">共 {{preChapter}} 节 | 已更新至{{chapters.length}}节</div>
      <div v-if="showChapter == false && continuePlay == true"></div>
      <button class="btnContinue" v-if="continuePlay" @click="btnContinue">继续播放</button>
    </div>

    <div class="divItems">
      <div v-if="chapters.length <= 0" class="divText">对不起，没有添加章节</div>
      <div class="divItem" @click="itemClick(item.uuid)" v-for="(item, index) in chapters" :key="index">
        <div class="divHeader">
          <div class="divLive" v-if="item.chapterStyle == 1">直</div>
          <img src="@/assets/images/course/video.png" v-if="item.chapterStyle == 3" class="imgType"/>
          <img src="@/assets/images/course/audio.png" v-if="item.chapterStyle == 2" class="imgType"/>
          <label class="lblNum">{{index | sequence}}</label>
        </div>
        <div class="divContext">
          <div class="divSubTitle">{{item.name}}</div>
          <div class="divBase">
            <div class="divTimer" v-if="item.chapterStyle != 1">时长 {{item.duration | formatDuration}}</div>
            <div class="divTimer" v-if="item.chapterStyle == 1 && item.liveSatus == 1">开始 {{item.startTime | formatDateByFormat('yyyy-MM-dd hh:mm')}}{{(item.endTime == null)?"": "~" + new Date(item.endTime).Format('hh:mm')}}</div>
            <div class="divTimer divColorRed" v-if="item.chapterStyle == 1 && item.liveSatus == 2">直播中...</div>
            <div class="divTimer divColorGray" v-if="item.chapterStyle == 1 && item.liveSatus == 3">已结束</div>
            <div class="divStatus">
              <img src="@/assets/images/course/lock.png" v-if="item.playStatus != 'playing' && canStudy == false && item.isTry == false" class="imgStatus"/>
              <img src="@/assets/images/course/audition.png" v-if="item.playStatus != 'playing' && canStudy == false && item.isTry == true" class="imgAudition"/>
              <div class="divPlaying" v-if="item.playStatus == 'playing'">
                <img src="@/assets/images/course/playing.png" class="imgPlaying"/>
                播放中
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';

export default {
  name: 'chapterList',
  props: {
    chapters: {
      type: Array,
      default: []
    },
    preChapter: {
      type: Number,
      default: 0
    },
    canStudy: {
      type: Boolean,
      default: false
    },
    showChapter: {
      type: Boolean,
      default: false
    },
    itemClickCallback: {
      type: Boolean,
      default: null
    },
    continuePlay: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    itemClick: function(uuid) {
      this.$emit('itemClick', uuid)
    },
    //继续播放
    btnContinue: function(){
      debugger;
    },
  }
}
</script>
<style lang="scss" scoped>
  .divChapterList{
    padding: 10px; box-sizing: border-box;
    padding-left: 15px; padding-right: 15px;
    margin-bottom: 4px;
  }
  .divChapterList .divTop{
    display: flex; flex-direction: row;
    justify-content: space-between; align-items: center;
  }
  .divChapterList .divTop .divTitle{
    color: #999999; font-size: 12px;
    margin-bottom: 10px;
  }
  .divChapterList .divTop .btnContinue{
    font-size: 13px; color: #FFF; background:linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    border: none; border-radius: 20px; padding: 5px;
    padding-left: 10px; padding-right: 10px;
  }
  .divChapterList .divItems{
    margin-top: 10px;
  }
  .divChapterList .divItems .divText{
    font-size: 14px; text-align: center; color: #999;
    border: 1px dashed #ccc; padding: 10px;
  }
  .divChapterList .divItems .divItem{
    display: flex; align-items: flex-start;
  }
  .divChapterList .divItems .divItem .divHeader{
    display: flex; justify-content: flex-start; align-items: center;
    width: 48px;
  }
  .divChapterList .divItems .divItem .divHeader .imgType{
    width: 16px; margin-right: 5px;
  }
  .divChapterList .divItems .divItem .divHeader .lblNum{
    font-size: 16px; color: #333333;
  }
  .divChapterList .divItems .divItem .divHeader .divLive{
    background:linear-gradient(137deg, #3a37fa 0%, #00a375 100%);
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
  .divChapterList .divItems .divItem .divContext{
    flex: 1; margin-bottom: 8px;
  }
  .divChapterList .divItems .divItem .divContext .divSubTitle{
    font-size: 16px; color: #333333;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .divChapterList .divItems .divItem .divContext .divBase{
    display: flex; flex-direction: row; justify-content: space-between;
    border-bottom: 1px solid #EFEFEF; margin-top: 0px;
    align-items: flex-end; padding-bottom: 5px;
  }
  .divChapterList .divItems .divItem .divContext .divBase .divTimer{
    font-size: 14px; color: #999999; flex: 1;
  }
  .divChapterList .divItems .divItem .divContext .divBase .divColorRed{
    color: #ff708c;
  }
  .divChapterList .divItems .divItem .divContext .divBase .divColorGray{
    color: #2479fd;
  }
  .divChapterList .divItems .divItem .divContext .divBase .divStatus{
    height: 25px; width: 80px;
    display: flex; flex-direction: row; justify-content: flex-end;
  }
  .divChapterList .divItems .divItem .divContext .divBase .divStatus .imgStatus{
    width: 30px; height: 30px; margin-top: -3px;
    display: block;
  }
  .divChapterList .divItems .divItem .divContext .divBase .divStatus .imgAudition{
    height: 20px; margin-top: 2px;
  }
  .divChapterList .divItems .divItem .divContext .divBase .divStatus .divPlaying{
    display: flex; flex-direction: row;
    align-items: center; justify-content: center;
    font-size: 13px; color: #333333;
  }
  .divChapterList .divItems .divItem .divContext .divBase .divStatus .divPlaying .imgPlaying{
    width: 14px; height: 14px; margin-right: 3px;
  }
</style>
