<template>
  <div class="divContext" :style="{height: contentHeight}">
    <div class="divType" id="divTypeHeight">
      <div id="divSubTypes" class="divSubTypes" :style="{overflowY: overflowY, maxHeight: maxHeight}">
        <div :class="nowLabel === '全部'?'divSelect':'divItem'" @click="selectItem('全部')">全部</div>
        <div :class="nowLabel === item.name?'divSelect':'divItem'" @click="selectItem(item.name, item.uuid)" v-for='(item, index) in typeItem'>{{item.name}}</div>
      </div>
      <img src="@/assets/images/home/down.png" class="imgDown" :style="{transform: transform}" @click="btnOpenExpand"/>
    </div>
    <div class="divItems" :style="{height: listHeight}">
      <div v-if="list.length <= 0" class="divDefInfo" :style="{height: listHeight}">
        <img src="@/assets/images/default/video.png" class="imgDefault"/>
        <div class="divTip">暂时没有课程哦</div>
      </div>
      <EasyRefresh
          v-if="list.length > 0"
          ref="easyRefresh"
          :userSelect="false"
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
          <div style="padding-bottom: 20px;">
          <div class="divItem" v-for="(item, index) in list" :key="index" @click="gotoCourse(item.uuid)">
            <div class="divCourse">
              <van-image :src="item.icon" lazy-load :class="(item.courseType == 1 && item.chapterStyle == 1 && item.endTime == null)?'imgItem1':'imgItem'">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
                <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
              </van-image>
              <div class="divRadius" v-if="item.courseType == 1 && item.chapterStyle == 1 && item.endTime == null">
                <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                <label class="lblTimer">{{item.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(item.endTime == null)?"": "-" + new Date(item.endTime).Format('hh:mm')}}</label>
              </div>
            </div>
            <div class="divContent" style="flex: 1;">
              <div class="divTop">
                <div class="divTitle1">
                  <div class="divPeriod" v-if="item.courseType == 2">系</div>
                  <div v-if="item.courseType == 1 && item.chapterStyle == 1" class="divPeriod divLive">直</div>
                  <img src="@/assets/images/home/music.png" v-if="item.courseType == 1 && item.chapterStyle == 2" class="imgIcon"/>
                  <img src="@/assets/images/home/play.png" v-if="item.courseType == 1 && item.chapterStyle == 3" class="imgIcon"/>
                  {{item.name}}
                </div>
              </div>
              <div class="divDesc">{{item.expert.name}} {{item.expert.hospital}}</div>
              <div class="divBottom">
                <div class="divPrice" v-if="item.coursePermission == 1">免费</div>
                <div class="divPrice" v-if="item.coursePermission != 1">¥{{item.realPrice | formatMoney}}</div>
                <span class="divOriginalPrice" v-if="item.coursePermission != 1 && item.originalPrice > 0">{{item.originalPrice | formatMoney}}</span>
                <div class="divNumber">
                  <img src="@/assets/images/home/fire.png" class="imgNum"/>
                  <div class="divNum">{{item.vPopularity + '人学习'}}</div>
                </div>
              </div>
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
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/home';

export default {
  name: 'typeList',
  props: {
    typeItem: {
      type: Array,
      default: []
    },
    typeUUID: {
      type: String,
      default: ''
    },
  },
  data: () => ({
    expandType: false,
    overflowY: 'hidden',
    maxHeight: '30px',
    listHeight: (window.innerHeight - 169) + 'px',
    contentHeight: (window.innerHeight - 158) + 'px',
    transform: 'rotateZ(0deg)',
    list: [],
    total: 0,
    currentPage: 1,
    nowLabel:'全部',
  }),
  methods: {
    initiData: function(done){
      var that = this;
      request.getCategroy({uuid: this.typeUUID}).then((json) => {
        if(json.code == 200){
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    btnOpenExpand: function (event) {
      if(this.expandType == true){
        //关闭子类
        this.expandType = false; this.overflowY = 'hidden';
        this.maxHeight = '30px';
        this.transform = 'rotateZ(0deg)'; document.getElementById("divSubTypes").scrollTop = 0;
      }else if(this.expandType == false){
        //打开子类
        this.expandType = true; this.overflowY = 'auto';
        this.maxHeight = '100px';
        this.transform = 'rotateZ(180deg)'; document.getElementById("divSubTypes").scrollTop = 0;
      }
      this.listHeight = (window.innerHeight - (159 + document.getElementById("divTypeHeight").offsetHeight)) + 'px';
    },
    selectItem: function (name, uuid) {
      this.nowLabel = name; var that = this;
      if(uuid == undefined){
        request.getCategroy({uuid: this.typeUUID}).then((json) => {
          if(json.code == 200){
            that.list = json.data.results;
            var timeout = setTimeout(function(){
              clearTimeout(timeout);
              that.$refs.easyRefresh.scrollTo(0, true);
            }, 100);
          }
        });
      }else {
        request.getCategroy({uuid: uuid}).then((json) => {
          if(json.code == 200){
            that.list = json.data.results;
            var timeout = setTimeout(function(){
              clearTimeout(timeout);
              that.$refs.easyRefresh.scrollTo(0, true);
            }, 100);
          }
        });
      }
    },
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; that.currentPage++;
        request.getCategroy({uuid: this.typeUUID}, that.currentPage).then((json) => {
          if(json.code == 200){
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
    onRefreshFn: function (done) {
      this.initiData(done);
    }
  },
  mounted() {
    this.listHeight = (window.innerHeight - (159 + document.getElementById("divTypeHeight").offsetHeight)) + 'px';
    this.initiData();
  }
}
</script>
<style lang="scss" scoped>
  .divContext{
    background-color: #F7F7F7;
    height: 600px;
  }
  .divContext .divType{
    background-color: #FFF;
    position: relative;
    width: 100%;
    display: flex;
    align-items: flex-end;
    padding-top: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #efefef;
  }
  .divContext .divType .divSubTypes{
    margin-left: 10px;
    overflow-x: hidden; overflow-y: auto;
    max-height: 100px; flex: 1; transition: max-height 0.3s;
    display: flex; flex-direction: row;
    flex-wrap: wrap; align-items: baseline;
  }
  .divContext .divType .divSubTypes .divSelect{
    background:linear-gradient(135deg,rgba(255,145,174,1) 0%,rgba(243,101,128,1) 100%);
    border-radius: 15px;
    font-size: 14px;
    height: 13px;
    color: #FFF;
    margin-right: 10px;
    padding: 6px;
    padding-left: 12px;
    padding-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }
  .divContext .divType .divSubTypes .divItem{
    border-radius: 15px;
    background-color: #F7F7F7;
    color: #666666;
    height: 13px;
    font-size: 14px;
    margin-right: 10px;
    padding: 6px;
    padding-left: 12px;
    padding-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }
  .divContext .divType .imgDown{
    width: 15px; height: 8px;
    padding: 8px; padding-bottom: 4px;
  }
  .divContext .divItems{
    overflow-x: hidden;
    overflow-y: auto;
  }
  .divContext .divItems .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
  }
  .divContext .divItems .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divContext .divItems .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divContext .divItems .divItem .divCourse .imgItem1{
    border-top-left-radius: 6px; border-top-right-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divContext .divItems .divItem .divCourse .divRadius{
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
  .divContext .divItems .divItem .divCourse .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .divContext .divItems .divItem .divCourse .divRadius .lblTimer{
    color: #FFF;
    font-size: 14px;
    margin-top: 1px;
  }
  .divContext .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divContext .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    flex: 1; width: 120px; height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divContext .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
    background:linear-gradient(137deg,rgba(73,205,172,1) 0%,rgba(3,207,149,1) 100%);
    border-radius:6px;
    width: 22px;
    font-size: 12px;
    letter-spacing: 1px;
    color: #FFF;
    display: inline-block;
    text-align: center;
    padding-top: 5px; padding-bottom: 3px;
    padding-left: 0px;
    padding-right: 0px;
    margin-right: 2px;
    vertical-align: middle;
    margin-top: -4px;
  }
  .divContext .divItems .divItem .divContent .divTop .divTitle1 .divLive{
    background:linear-gradient(137deg, #3a37fa 0%, #00a375 100%);
  }
  .divContext .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divContext .divItems .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 5px;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divContext .divItems .divItem .divContent .divBottom{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divContext .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divContext .divItems .divItem .divContent .divBottom .divOriginalPrice{
    font-size: 11px;
    color: #999999;
    margin-left: 3px;
    text-decoration: line-through;
  }
  .divContext .divItems .divItem .divContent .divBottom .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divContext .divItems .divItem .divContent .divBottom .divNumber .imgNum{
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  .divContext .divItems .divItem .divContent .divBottom .divNumber .divNum{
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divContext .divItems .divDefInfo{
    margin-top: -10px;
    display: flex; align-items: center;
    justify-content: center; flex-direction: column;
  }
  .divContext .divItems .divDefInfo .imgDefault{
    width: 160px;
  }
  .divContext .divItems .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
