<template>
  <div class="page">
    <div class="divSearch">
      <div class="iptSearch">
        <img src="@/assets/images/home/search.png" class="imgSearch"/>
        <input type="text" class="lblText" v-on:keydown="keydown" v-on:input="debounceInput" v-model="searchInput" :placeholder="defaultSearch" @focus="onFocus" v-on:blur="onBlur" />
      </div>
      <router-link to="/home">
        <div class="txtClose">取消</div>
      </router-link>
    </div>

    <div class="divHistory" v-if="historyList.length > 0">
      <div class="divTop">
        <div class="divTitle">搜索历史</div>
        <div class="divClearAll" @click="clearSearchHistory">
          <img src="@/assets/images/search/delete.png" class="imgIcon"/>清空
        </div>
      </div>
      <div class="divContent">
        <div class="divItem" v-for="(item, index) in historyList" :key="index" @click="searchKeyword(item.keyword)">{{item.keyword}}</div>
      </div>
    </div>

    <div class="divHotSearch" v-if="hotList.length > 0">
      <div class="divTop">
        <div class="divTitle">热门搜索</div>
      </div>
      <div class="divContent">
        <div class="divItem" v-for="(item, index) in hotList" :key="index" @click="searchKeyword(item.keyword)">
          <img src="@/assets/images/search/hot.png" v-if="item.icon" class="imgIcon"/>
          {{item.keyword}}
        </div>
      </div>
    </div>
    <div class="divIndexKey" v-if="showKeyword" :style="{height: height}">
      <div class="divItem" v-for="(item, index) in keywordlist" :key="index" @click="searchKeyword(item.name)">
        <img src="@/assets/images/home/search.png" class="imgIcon" />
        <div class="txtIndexKey" v-html="item.name"></div>
      </div>
    </div>

    <div class="divResults" v-if="showResults" :style="{height: height}">
      <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
        <img src="@/assets/images/default/recording.png" class="imgDefault" style="margin-top: 0px;"/>
        <div class="divTip" style="margin-top: -10px;">暂时没有课程哦</div>
      </div>
      <EasyRefresh
          v-if="list.length > 0"
          :userSelect="false"
          :loadMore="loadMoreFn">
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
          <div style="padding-bottom: 20px">
            <div class="divItems" v-if="list.length > 0">
              <div class="divItem" @click="gotoCourse(item.object.uuid)" v-for="(item, index) in list" :key="item.uuid">
                <div class="divCourse">
                  <van-image :src="item.object.icon" lazy-load class="imgItem">
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                    <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                  </van-image>
                  <div class="divRadius" v-if="item.object.courseType == 1 && item.object.chapterStyle == 1">
                    <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                    <label class="lblTimer">{{item.object.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(item.object.endTime == null)?"": "-" + new Date(item.object.endTime).Format('hh:mm')}}</label>
                  </div>
                </div>
                <div class="divContent" style="flex: 1;">
                  <div class="divTop">
                    <div class="divTitle1">
                      <div class="divPeriod" v-if="item.object.courseType == 2">系</div>
                      <img :src="((item.object.chapterStyle == 2)?require('@/assets/images/home/music.png'):require('@/assets/images/home/play.png'))" v-if="item.object.courseType == 1" class="imgIcon"/>
                      {{item.object.name}}
                    </div>
                  </div>
                  <div class="divDesc" v-if="item.object.expert != null">{{item.object.expert.name}} {{item.object.expert.hospital}}</div>
                  <div class="divDesc" v-if="item.object.expert == null">暂无</div>
                  <div class="divBottom">
                    <div class="divPrice" v-if="item.object.coursePermission == 1">免费</div>
                    <div class="divPrice" v-if="item.object.coursePermission != 1">¥{{item.object.realPrice | formatMoney}}</div>
                    <span class="divOriginalPrice" v-if="item.object.coursePermission != 1 && item.object.originalPrice > 0">{{item.object.originalPrice | formatMoney}}</span>
                    <div class="divNumber">
                      <img src="@/assets/images/home/fire.png" class="imgNum"/>
                      <div class="divNum">{{item.object.vPopularity + '人学习'}}</div>
                    </div>
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
import _ from 'lodash';
import * as request from '../service/search';

export default {
  name: 'search',
  created(){
    this.debounceInput = _.debounce(this.debounceInput, 800)
    this.onBlur = _.debounce(this.onBlur, 100);
  },
  data: () => ({
    defaultSearch: '',
    showKeyword: false,
    showResults: false,
    height: (window.innerHeight-49) + "px",
    searchInput: '',
    historyList: [],
    keywordlist: [],
    hotList: [],

    list: [],
    total: 0,
    currentPage: 1,
  }),
  methods: {
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    debounceInput () {
      var that = this;
      request.getSearchLike({keyword: this.searchInput}).then((json) => {
        if(json.code == 200){
          that.keywordlist = json.data; that.showKeyword = true;
          that.showResults = false;
        }
      });
    },
    keydown (e){
      if(!e){ e = window.event; }
	    if(e.keyCode == 13){
        this.showKeyword = false; this.getCourseSearch(e.target.value);
	    }
    },
    getCourseSearch: function (val) {
      var that = this;
      request.getCourseSearch({ text: val }).then((json) => {
        if(json.code == 200){
          that.total = json.data.count;
          that.currentPage = 1;
          that.list = json.data.results; that.getSearchHistory();
          that.showResults = true; that.showKeyword = false;
        }
      });
    },
    getSearchHistory: function(){
      var that = this;
      request.getSearchHistory().then((json) => {
        if(json.code == 200){
          that.historyList = json.data;
        }
      });
    },
    searchKeyword: function(keyword){
      var keyword = keyword.replace("<font color='#F9626A'>", "");
      var keyword = keyword.replace("</font>", "");
      this.searchInput = keyword; this.getCourseSearch(this.searchInput);
    },
    onBlur: function(event){
      this.showKeyword = false; this.showResults = false;
    },
    onFocus: function(event) {
      this.showKeyword = true; this.showResults = false;
      this.keywordlist = [];
    },
    clearSearchHistory: function(){
      var that = this;
      Dialog.confirm({
        message: '你确定要清空搜索历史吗？',
        beforeClose: (action, done)=>{
          if (action === 'confirm') {
            request.clearSearchHistory().then((json) => {
              if(json.code == 200){
                that.historyList = []; done();
              }
            });
          } else {
            done();
          }
        }
      });
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; that.currentPage++;
        request.getCourseSearch({text: this.searchInput, page: that.currentPage}).then((json) => {
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
    }
  },
  mounted() {
    var that = this;
    request.getDefaultSearch().then((json) => {
      if(json.code == 200){
        if(json.data.length > 0){
          that.defaultSearch = json.data[0].keyword;
        }
      }
    });
    request.getHotKeyword().then((json) => {
      if(json.code == 200){
        that.hotList = json.data;
      }
    });
    this.getSearchHistory();
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
  .divSearch{
    padding: 10px; padding-left: 15px;
    padding-top: 5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
  }
  .divSearch .iptSearch{
    background-color: #F7F7F7;
    border-radius: 30px;
    flex: 1;
    display: flex;
    align-items: center;
    height: 38px;
  }
  .divSearch .iptSearch .imgSearch{
    width: 17px;
    height: 17px;
    margin-right: 7px;
    margin-left: 15px;
  }
  .divSearch .iptSearch .lblText{
    border: none; background-color: #F7F7F7;
    font-size: 15px;
    color: #999999;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 240px; margin-top: 1px;
  }
  .divSearch .txtClose{
    font-size: 14px;
    color: #333333;
    width: 41px;
    height: 32px;
    margin-left: 15px;
    padding-top: 17px;
    letter-spacing: 2px;
  }
  .divHistory{
    padding-left: 15px; padding-right: 15px;
  }
  .divHistory .divTop{
    display: flex; align-items: center;

  }
  .divHistory .divTop .divTitle{
    font-size: 18px; color: #333333; font-weight: 500; flex: 1;
    font-weight: bold;
  }
  .divHistory .divTop .divClearAll{
    font-size: 14px; color: #333333; display: flex; align-items: center;justify-content: center;
  }
  .divHistory .divTop .divClearAll .imgIcon{
    width: 13px; height: 13px; margin-right: 5px;
  }
  .divHistory .divContent{
    margin-top: 8px; line-height: 16px;
  }
  .divHistory .divContent .divItem{
    color: #333333; font-size: 14px; padding: 8px; padding-left: 15px; padding-right: 15px;
    display: inline-block; margin-right: 10px; border-radius: 5px;
    background-color: #F7F7F7; margin-bottom: 5px; white-space: nowrap;
    max-width: 100px; overflow: hidden; text-overflow: ellipsis;
  }
  .divHotSearch{
    padding-left: 15px; padding-right: 15px; margin-top: 20px;
  }
  .divHotSearch .divTop{
    display: flex; align-items: center;

  }
  .divHotSearch .divTop .divTitle{
    font-size: 18px; color: #333333; font-weight: 500; flex: 1;
    font-weight: bold;
  }
  .divHotSearch .divContent{
    margin-top: 8px; line-height: 16px;
  }
  .divHotSearch .divContent .divItem{
    color: #FF6B88; font-size: 14px; padding: 8px; padding-left: 15px; padding-right: 15px;
    display: inline-block; margin-right: 10px; border-radius: 5px;
    border: 1px solid #FF6B88; margin-bottom: 5px;
  }
  .divHotSearch .divContent .divItem .imgIcon{
    height: 16px; position: absolute; margin-left: -5px; margin-top: -16px;
  }
  .divIndexKey{
    width: 100%; position: absolute; top: 48px;
    background-color: #FFF; height: 600px; z-index: 1;
  }
  .divIndexKey .divItem{
    display: flex; align-items: center;
  }
  .divIndexKey .divItem .imgIcon{
    width: 16px; height: 16px; margin-left: 15px; margin-right: 10px;
  }
  .divIndexKey .divItem .txtIndexKey{
    font-size: 14px; color: #333333; border-bottom: 1px solid #F5F5F5;
    flex: 1; line-height: 42px;
    overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
  }
  .divIndexKey .divItem:active{
    background-color: #F5F5F5;
  }
  .divIndexKey .divItem .txtIndexKey span{
    font-size: 14px; color: #F9626A;
  }
  .divResults{
    width: 100%; position: absolute; top: 48px;
    background-color: #FFF; height: 600px; z-index: 2;
    overflow-y: auto;
  }
  .divItems{
    padding-bottom: 10px;
  }
  .divItems .divItem{
    background-color: #fafafa;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
  }
  .divItems .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divItems .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divItems .divItem .divCourse .divRadius{
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
  .divItems .divItem .divCourse .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .divItems .divItem .divCourse .divRadius .lblTimer{
    color: #FFF;
    font-size: 14px;
    margin-top: 1px;
  }
  .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    flex: 1; width: 120px; height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
    background:linear-gradient(137deg,rgba(73,205,172,1) 0%,rgba(3,207,149,1) 100%);
    border-radius:6px;
    width: 22px;
    font-size: 12px;
    color: #FFF;
    display: inline-block;
    text-align: center;
    padding: 4px;
    padding-left: 1px;
    padding-right: 0px;
    vertical-align: middle;
    margin-top: -4px;
  }
  .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divItems .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divItems .divItem .divContent .divBottom{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divItems .divItem .divContent .divBottom .divOriginalPrice{
    font-size: 11px;
    color: #999999;
    margin-left: 3px;
    text-decoration: line-through;
  }
  .divItems .divItem .divContent .divBottom .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divItems .divItem .divContent .divBottom .divNumber .imgNum{
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  .divItems .divItem .divContent .divBottom .divNumber .divNum{
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divResults .divDefInfo{
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
  }
  .divResults .divDefInfo .imgDefault{
    width: 160px; margin-top: 20px;
  }
  .divResults .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
