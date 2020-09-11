<template>
  <div class="page divExpertIntro">
    <div class="divBaseInfo">
      <div class="divFlex">
        <div class="divTest">
          <van-image :src="profile.avatar" lazy-load class="imgAvatar">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error><img src="@/assets/images/myProfile/avatar.png" class="imgDefaultAvatar"/></template>
          </van-image>
          <div class="divInfo">
            <div class="divName">{{profile.name}}</div>
            <div class="divDesc" v-if="profile.hospital != null | profile.jobTitle != null">{{profile.hospital}} {{((profile.department == null)?"":profile.department) + profile.jobTitle}}</div>
          </div>
        </div>
        <div class="divFollow">
          <button :class="(profile.isFollower)?'btnFollowDisable':'btnFollow'" @click="focusOnExperts">{{(profile.isFollower)?'已关注':'关注'}}</button>
          <div class="divNum">{{profile.followCount}}人关注</div>
        </div>
      </div>
      <div class="divDoctorIntro">{{profile.intro | contentIsEmpty}}</div>
    </div>
    <div class="divCourse">
      <div class="divName1">课程</div>
      <div v-if="list.length <= 0" class="divDefInfo">
        <img src="@/assets/images/default/recording.png" class="imgDefault" style="margin-top: 0px;"/>
        <div class="divTip" style="margin-top: -10px;">暂时没有课程哦</div>
      </div>
      <EasyRefresh
          v-if="list.length > 0"
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
          <div class="divItems" v-if="list.length > 0">
            <div class="divItem" @click="gotoCourse(item.uuid)" v-for="(item, index) in list" :key="item.uuid">
              <div class="divCourse1">
                <van-image :src="item.icon" lazy-load class="imgItem">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                </van-image>
                <div class="divRadius" v-if="item.courseType == 1 && item.chapterStyle == 1">
                  <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                  <label class="lblTimer">{{item.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(item.endTime == null)?"": "-" + new Date(item.endTime).Format('hh:mm')}}</label>
                </div>
              </div>
              <div class="divContent" style="flex: 1;">
                <div class="divTop">
                  <div class="divTitle1">
                    <div class="divPeriod" v-if="item.courseType == 2">系</div>
                    <img :src="((item.chapterStyle == 2)?require('@/assets/images/home/music.png'):require('@/assets/images/home/play.png'))" v-if="item.courseType == 1" class="imgIcon"/>
                    {{item.name}}
                  </div>
                </div>
                <div class="divDesc">{{item.expert.name}} {{item.expert.hospital}}</div>
                <div class="divBottom">
                  <div class="divPrice" v-if="item.coursePermission == 1">免费</div>
                  <div class="divPrice" v-if="item.coursePermission != 1">¥{{item.realPrice | formatMoney}}</div>
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
import * as request from '../service/expert.js'

export default {
  name: 'expertIntro',
  data: () => ({
    profile: {},
    list: [],
    total: 0,
    currentPage: 1,
  }),
  methods: {
    initiaData: function () {
      var that = this;
      request.getExpert({uuid: this.$route.params.uuid}).then((json)=>{
        if(json.code == 200){
          that.profile = json.data;
        }
      });
      this.loadList();
    },
    loadList: function (done) {
      var that = this;
      request.getExpertCourses({uuid: this.$route.params.uuid}).then((json)=>{
        if(json.code == 200){
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    focusOnExperts: function (event) {
      var that = this;
      if(this.profile.isFollower == true){
        request.postFollowExpert({uuid: this.$route.params.uuid, type: "unFollow"}).then((json)=>{
          if(json.code == 200){
            Toast('取消关注'); that.initiaData();
          }
        });
      }else if(this.profile.isFollower == false){
        request.postFollowExpert({uuid: this.$route.params.uuid, type: "follow"}).then((json)=>{
          if(json.code == 200){
            Toast('关注成功'); that.initiaData();
          }
        });
      }
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var that = this; that.currentPage++;
        request.getExpertCourses({uuid: this.$route.params.uuid, page: that.currentPage}).then((json) => {
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
      this.loadList(done);
    }
  },
  mounted() {
    this.initiaData();
  }
}
</script>
<style lang="scss" scoped>
  .divExpertIntro{
    display: flex; flex-direction: column;
  }
  .divBaseInfo{
    background-color: #FFF; width: 100%;
    padding: 15px; box-sizing: border-box;
    padding-top: 20px; padding-bottom: 10px;
  }
  .divBaseInfo .divFlex{
    display: flex; flex-direction: row;
    justify-content: center; align-items: center;
  }
  .divBaseInfo .divFlex .divTest{
    flex: 1; display: flex; align-items: center;
    justify-content: center;
  }
  .divBaseInfo .divFlex .divTest .imgAvatar{
    width: 52px; height: 52px; margin-right: 8px; border-radius: 50%;
    overflow: hidden;
  }
  .divBaseInfo .divFlex .divTest .imgDefaultAvatar{
    width: 52px; height: 52px; border-radius: 50%;
  }
  .divBaseInfo .divFlex .divTest .divInfo{
    flex: 1;
  }
  .divBaseInfo .divFlex .divTest .divInfo .divName{
    font-size: #333333; font-size: 19px; font-weight: bold;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden; display: -webkit-box;
  }
  .divBaseInfo .divFlex .divTest .divInfo .divDesc{
    margin-top: 6px; font-size: 14px; color: #999999;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden; display: -webkit-box;
  }
  .divBaseInfo .divFollow{
    display: flex; flex-direction: column; text-align: center;
    width: 80px;
  }
  .divBaseInfo .divFollow .btnFollow{
    border: 1px solid #FF6B88; border-radius: 20px;
    line-height: 26px; font-size: 14px; color: #FF6B88;
    letter-spacing: 1px; padding-left: 5px;
    padding-right: 5px; background-color: #FFF;
  }
  .divBaseInfo .divFollow .btnFollowDisable{
    border: 1px solid #F7F7F7; border-radius: 20px;
    line-height: 26px; font-size: 14px; color: #999999;
    letter-spacing: 1px; padding-left: 5px;
    padding-right: 5px; background-color: #F7F7F7;
  }
  .divBaseInfo .divFollow .divNum{
    font-size: 12px; color: #999999; margin-top: 6px;
    overflow: hidden; text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divBaseInfo .divDoctorIntro{
    color: #666666; font-size: 14px;
    margin-top: 13px; line-height: 20px;
  }
  .divCourse{
    margin-top: 10px; background-color: #F7F7F7; flex: 1;
    padding:15px; box-sizing: border-box; padding-top: 20px; padding-bottom: 0px;
    display: flex; flex-direction: column; box-sizing: border-box;
  }
  .divCourse .divName1{
    font-size: 18px; color: #333333; letter-spacing: 1px;
    font-weight: bold;
  }
  .divCourse .divItems{
    flex: 1; padding-bottom: 10px;
  }
  .divCourse .divItems .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-top: 10px;
  }
  .divCourse .divItems .divItem:last-child{
    margin-bottom: 10px;
  }
  .divCourse .divItems .divItem .divCourse1{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divCourse .divItems .divItem .divCourse1 .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divCourse .divItems .divItem .divCourse1 .divRadius{
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
  .divCourse .divItems .divItem .divCourse1 .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .divCourse .divItems .divItem .divCourse1 .divRadius .lblTimer{
    color: #FFF;
    font-size: 14px;
    margin-top: 1px;
  }
  .divCourse .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divCourse .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    flex: 1; width: 120px; height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divCourse .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
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
  .divCourse .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divCourse .divItems .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divCourse .divItems .divItem .divContent .divBottom{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divCourse .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divCourse .divItems .divItem .divContent .divBottom .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divCourse .divItems .divItem .divContent .divBottom .divNumber .imgNum{
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  .divCourse .divItems .divItem .divContent .divBottom .divNumber .divNum{
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divCourse .divDefInfo{
    text-align: center; margin-top: 30px;
  }
  .divCourse .divDefInfo .imgDefault{
    width: 160px; margin-top: -10px;
  }
  .divCourse .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -25px; padding-bottom: 20px;
  }
</style>
