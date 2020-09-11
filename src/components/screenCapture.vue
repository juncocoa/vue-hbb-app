<template>
  <div class="page">
    <div class="divBG" :style="{height: height}">
      <img src="@/assets/images/course/close.png" class="imgClose" @click="closeShare"/>
      <div class="divContext">
        <van-loading type="spinner" size="35" v-if="imgSource == ''" style="margin-bottom: 20px"/>
        <div class="divStyle" v-if="imgSource != ''">
          <van-image class="imgIcon" fit="contain" :src="imgSource">
            <template v-slot:loading>
              <van-loading type="spinner" size="20"/>
            </template>
            <template v-slot:error><img src="@/assets/images/course/default.png" class="imgErrorIcon"/></template>
          </van-image>
        </div>
        <div class="divTip">长按保存邀请卡片发送给好友</div>
      </div>
    </div>
    <div class="divBottom">
      <div :class="(type == 0)?'divBtnSelect':'divBtn'" @click="switchTab(0)">样式1</div>
      <div :class="(type == 1)?'divBtnSelect':'divBtn'" v-if="false" @click="switchTab(1)">样式2</div>
    </div>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/course.js'

export default {
  name: 'screenCapture',
  props: {
    courseUUID: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    height: window.innerHeight + "px",
    uuid: '',
    list: [],
    imgSource: '',
    type: 0
  }),
  methods: {
    switchTab: function(val){
      this.type = val;
      this.imgSource = this.list[val];
    },
    closeShare: function () {
      this.$emit("closeShare");
    }
  },
  mounted() {
    this.uuid = this.courseUUID; var that = this;
    request.getShareImg(this.uuid).then((json)=>{
      if(json.code == 200){
        that.list = json.data;
        if(json.data.length > 0){
          that.imgSource = json.data[0];
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .divBG{
    background-color: RGBA(0, 0, 0, 0.7); display: flex; justify-content: center;
    align-items: center; position: fixed; top: 0; left: 0; z-index: 2; width: 100%;
  }
  .divBG .imgClose{
    width: 30px; height: 30px;
    position: absolute; top: 15px; left: 15px;
  }
  .divBG .divContext{
    text-align: center;
  }
  .divBG .divContext .divStyle{
    border-radius: 18px; overflow: hidden; background-color: #FFF;
    width: 340px; margin-left: auto; margin-right: auto;
    height: 394px; box-sizing: border-box;
  }
  .divBG .divContext .divStyle .imgIcon{
    width: 340px;
  }
  .divBG .divContext .divStyle .imgErrorIcon{
    width: 340px;
  }
  // 底部样式
  .divBG .divContext .divTip{
    font-size: 14px; color: #F7F6F6; margin-top: 20px;
  }
  .divBottom{
    background-color: #FFF; padding-left: 20px; padding-top: 20px;
    padding-bottom: 20px; box-sizing: border-box; position: fixed;
    width: 100%; display: flex; bottom: 0; z-index: 3;
  }
  .divBottom .divBtn {
    border-radius: 4px; border: 1px solid #999999;
    font-size: 14px; color: #999999; padding: 4px;
    padding-left: 8px; padding-right: 8px;
  }
  .divBottom div{
    margin-right: 15px;
  }
  .divBottom .divBtnSelect{
    border-radius: 4px; border: 1px solid #FF6B88;
    font-size: 14px; color: #FF6B88; padding: 4px;
    padding-left: 8px; padding-right: 8px;
  }
</style>
