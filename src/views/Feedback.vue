<template>
  <div class="page divFeedback" :style="{height: height}">
    <div class="divTitle">
      <div>反馈内容</div>
      <div>{{txtNum}}/500</div>
    </div>
    <div class="divContent">
      <textarea placeholder="请输入反馈内容..." v-model="txtContent" class="iptText"/>
    </div>
    <div class="divTitle">
      <div>上传问题截图</div>
      <div>{{imgNum}}/4</div>
    </div>
    <div class="divUpdata">
      <van-uploader v-model="fileList" multiple :max-count="4" preview-size="100" :before-delete="beforeDelete" :after-read="afterRead">
        <img src="@/assets/images/feedback/add.png" class="imgAdd"/>
      </van-uploader>
    </div>
    <van-button color="#FF6B88" :disabled="!verify" block class="btnLogin" @click="submitFeedback">提交</van-button>
  </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/feedback.js'
import { fileUpload } from '../service/fileUpload.js'

export default {
  name: 'feedback',
  data: () => ({
    height: window.innerHeight + "px",
    txtNum: 0,
    imgNum: 0,
    txtContent: '',
    fileList: []
  }),
  computed: {
    verify() {
      if(this.txtContent.trim() == ''){
        return false;
      }else {
        return true;
      }
    }
  },
  methods: {
    submitFeedback: function(event){
      var icons = []; var that = this;
      for (let i = 0; i < this.fileList.length; i++) {
        if(this.fileList[i].url != undefined){
          icons.push(this.fileList[i].url);
        }
      }
      var paramData = {
        content: this.txtContent,
        icon: icons
      }
      request.postFeedback(paramData).then((json)=>{
        if(json.code == 200){
          Toast(json.msg); that.$router.back();
        }
      })
    },
    uploadFile: function(file){
      var that = this;
      if (file.file.type !== 'image/jpeg' && file.file.type !== 'image/png') {
        Toast('请上传 jpg 或 png 格式图片');
        return false;
      }
      let formData = new FormData();
      formData.append('file', file.file);
      //文件上传
      fileUpload(formData).then((json)=>{
        if(json.data.code == 200){
          for (let i = 0; i < that.fileList.length; i++) {
            var fileObj = that.fileList[i].file;
            if(fileObj.name == json.data.data.fileName && fileObj.size == json.data.data.fileSize){
               that.fileList[i].url = json.data.data.url; break;
            }
          }
          Toast.clear();
        }
      });
    },
    afterRead: function(file, detail){
      Toast.loading({
        message: '上传中...',
        forbidClick: true,
        duration: 0
      });
      if(file.constructor === Array){
        for (let i = 0; i < file.length; i++) {
          this.uploadFile(file[i]);
        }
      }else {
        this.uploadFile(file);
      }
      return false;
    },
    beforeDelete: function (file, detail) {
      this.imgNum = file.length;
      return true;
    }
  },
  watch: {
   txtContent: function (val) {
     this.txtNum = val.length;
   },
   fileList: function (val){
     this.imgNum = val.length;
   }
  }
}
</script>
<style lang="scss" scoped>
  ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: #999999;
  }
  ::-moz-placeholder { /* Firefox 19+ */
    color: #999999;
  }
  :-ms-input-placeholder { /* IE 10+ */
   color: #999999;
  }
  :-moz-placeholder { /* Firefox 18- */
   color: #999999;
  }
  .divFeedback{
    background-color: #F5F5F5;
  }
  .divFeedback .divTitle{
    font-size: 14px; color: #999999; padding: 8px;
    display: flex; justify-content: space-between;
    padding-right: 15px; padding-left: 15px;
  }
  .divFeedback .divContent{
    background-color: #FFF; padding: 10px;
  }
  .divFeedback .divContent .iptText{
    font-size: 14px; color: #333333; width: -webkit-fill-available;
    border: none; height: 150px; resize: none;
    margin-left: 3px; margin-right: 3px;
    display: block; letter-spacing: 1px;
  }
  .divFeedback .divUpdata{
    background-color: #FFF; padding: 15px;
    display: flex; flex-direction: row; flex-wrap: wrap;
    padding-bottom: 5px;
  }
  .divFeedback .divUpdata .imgAdd{
    width: 95px; height: 95px;
  }
  .divFeedback .btnLogin{
    width: 93%; border-radius: 25px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 55px;
  }
</style>
