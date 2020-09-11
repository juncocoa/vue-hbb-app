<template>
  <div class="page divModal">
    <div v-if="list.length <= 0" class="divDefInfo" :style="{height: height}">
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
        <div style="padding-bottom: 20px;">
          <van-row type="flex" class="divCards" gutter="10" justify="space-between" v-if="list.length > 0 & showType == 2">
            <van-col span="12" @click="gotoCourse(subItem.uuid)" v-for="(subItem, index) in list" :key="subItem.uuid">
              <div class="divCard">
                <div class="divCourse">
                  <van-image :src="subItem.icon" lazy-load class="imgCourse">
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                    <template v-slot:error><img src="@/assets/images/home/card.png" class="imgCourse"/></template>
                  </van-image>
                  <div class="divRadius" v-if="subItem.courseType == 1 && subItem.chapterStyle == 1  && subItem.endTime == null">
                    <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                    <label class="lblTimer">{{subItem.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(subItem.endTime == null)?"": "-" + new Date(subItem.endTime).Format('hh:mm')}}</label>
                  </div>
                </div>
                <div class="divTitle1">
                  <div class="divPeriod" v-if="subItem.courseType == 2">系</div>
                  <div v-if="subItem.courseType == 1 && subItem.chapterStyle == 1" class="divPeriod divLive">直</div>
                  <img src="@/assets/images/home/music.png" v-if="subItem.courseType == 1 && subItem.chapterStyle == 2" class="imgIcon"/>
                  <img src="@/assets/images/home/play.png" v-if="subItem.courseType == 1 && subItem.chapterStyle == 3" class="imgIcon"/>

                  <div class="txtTitle">{{subItem.name}}</div>
                </div>
                <div class="divDesc">{{subItem.expert.name}} {{subItem.expert.hospital}}</div>
                <div class="divBottom">
                  <div class="divPrice">
                    <span class="divDiscountPrice" v-if="subItem.coursePermission == 1">免费</span>
                    <span class="divDiscountPrice" v-if="subItem.coursePermission != 1">¥{{subItem.realPrice | formatMoney}}</span>
                    <span class="divOriginalPrice" v-if="subItem.coursePermission != 1 && subItem.originalPrice > 0">{{subItem.originalPrice | formatMoney}}</span>
                  </div>
                  <div class="divNum">{{subItem.vPopularity + '人学习'}}</div>
                </div>
              </div>
            </van-col>
          </van-row>
          <div class="divItems" v-if="list.length > 0 & showType == 1">
            <div class="divItem" @click="gotoCourse(subItem.uuid)" v-for="(subItem, index) in list" :key="subItem.uuid">
              <div class="divCourse">
                <van-image :src="subItem.icon" lazy-load :class="(subItem.courseType == 1 && subItem.chapterStyle == 1 && subItem.endTime == null)?'imgItem1':'imgItem'">>
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error><img src="@/assets/images/home/item.png" class="imgItem"/></template>
                </van-image>
                <div class="divRadius" v-if="subItem.courseType == 1 && subItem.chapterStyle == 1 && subItem.endTime == null">
                  <img src="@/assets/images/home/timer.png" class="imgTimer"/>
                  <label class="lblTimer">{{subItem.startTime | formatDateByFormat('MM-dd hh:mm')}}{{(subItem.endTime == null)?"": "-" + new Date(subItem.endTime).Format('hh:mm')}}</label>
                </div>
              </div>
              <div class="divContent" style="flex: 1;">
                <div class="divTop">
                  <div class="divTitle1">
                    <div class="divPeriod" v-if="subItem.courseType == 2">系</div>
                    <div v-if="subItem.courseType == 1 && subItem.chapterStyle == 1" class="divPeriod divLive">直</div>
                    <img src="@/assets/images/home/music.png" v-if="subItem.courseType == 1 && subItem.chapterStyle == 2" class="imgIcon"/>
                    <img src="@/assets/images/home/play.png" v-if="subItem.courseType == 1 && subItem.chapterStyle == 3" class="imgIcon"/>
                    {{subItem.name}}
                  </div>
                </div>
                <div class="divDesc">{{subItem.expert.name}} {{subItem.expert.hospital}}</div>
                <div class="divBottom">
                  <div class="divPrice" v-if="subItem.coursePermission == 1">免费</div>
                  <div class="divPrice" v-if="subItem.coursePermission != 1">¥{{subItem.realPrice | formatMoney}}</div>
                  <span class="divOriginalPrice" v-if="subItem.coursePermission != 1 && subItem.originalPrice > 0">{{subItem.originalPrice | formatMoney}}</span>
                  <div class="divNumber">
                    <img src="@/assets/images/home/fire.png" class="imgNum"/>
                    <div class="divNum">{{subItem.vPopularity + '人学习'}}</div>
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
</template>

<script>
import { Toast } from 'vant';
import * as request from '../service/home'

export default {
  name: 'SectionMore',
  data: () => ({
    height: window.innerHeight + "px",
    list: [],
    total: 0,
    currentPage: 1,
    showType: 1
  }),
  methods: {
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    initiData: function(done){
      var that = this; var data = JSON.parse(this.$route.params.data);
      request.clientSectionMore({uuid: data.uuid}).then((json) => {
        if(json.code == 200){
          that.list = json.data.results;
          that.total = json.data.count;
          that.currentPage = 1;
          if(done != undefined){ done(); }
        }
      });
    },
    loadMoreFn: function (done) {
      if(this.list.length < this.total){
        var data = JSON.parse(this.$route.params.data);
        var that = this; that.currentPage++;
        request.clientSectionMore({uuid: data.uuid}, that.currentPage).then((json) => {
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
    var data = JSON.parse(this.$route.params.data);
    document.getElementsByTagName("title")[0].innerText = data.name; this.showType = data.showType;
    this.initiData();
  }
}
</script>
<style lang="scss" scoped>
  .divModal{
    overflow-x: hidden; background-color: #F7F7F7;
  }
  .divModal .divCards{
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
    padding-left: 15px; padding-right: 15px;
    align-content: baseline;
  }
  .divModal .divCards .divCard{
    border-radius: 10px; overflow: hidden;
    background-color: #FFF;
    flex: 1; height: 195px; margin-bottom: 10px;
  }
  .divModal .divCards .divCard .divCourse{
    width: 100%;
    position: relative;
  }
  .divModal .divCards .divCard .divCourse .imgCourse{
    width: 100%; height: 108px; background-color: #FFF;
  }
  .divModal .divCards .divCard .divCourse .divRadius{
    position: absolute;
    width: 100%;
    background-color: rgba(255,107,136,0.72);
    border-radius: 11px 11px 0px 0px;
    height: 25px;
    left: 0;
    bottom: 11px;
    display: flex;
    align-items: center;
  }
  .divModal .divCards .divCard .divCourse .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 10px;
    margin-right: 5px;
  }
  .divModal .divCards .divCard .divCourse .divRadius .lblTimer{
    color: #FFF;
    font-size: 15px;
    margin-top: 1px;
  }
  .divModal .divCards .divCard .divTitle1{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
  }
  .divModal .divCards .divCard .divTitle1 .imgIcon{
    width: 18px; height: 18px;
    margin-top: -3px;
    margin-right: 5px;
  }
  .divModal .divCards .divCard .divTitle1 .divPeriod{
    background:linear-gradient(137deg,rgba(73,205,172,1) 0%,rgba(3,207,149,1) 100%);
    border-radius:6px;
    width: 22px;
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
  .divModal .divCards .divCard .divTitle1 .txtTitle{
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    flex: 1;
    width: 90px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divModal .divCards .divCard .divDesc{
    margin-left: auto;
    margin-right: auto;
    font-size: 0.3rem;
    color: #999999;
    margin-top: 0.2rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    padding-left: 8px;
  }
  .divModal .divCards .divCard .divBottom{
    display: flex;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 7px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: space-between;
  }
  .divModal .divCards .divCard .divBottom .divPrice{
    display: flex;
    font-size: 14px;
    color: #999999;
  }
  .divModal .divCards .divCard .divBottom .divPrice .divDiscountPrice{
    text-decoration: initial;
    font-size: 14px;
    color: #FF6B88;
    margin-right: 5px;
  }
  .divModal .divCards .divCard .divBottom .divPrice .divOriginalPrice{
    text-decoration: line-through; margin-right: 5px;
  }
  .divModal .divCards .divCard .divBottom .divNum{
    font-size: 14px;
    color: #999999;
    text-align: right;
    width: 81px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divModal .divItems{
    padding-bottom: 10px;
  }
  .divModal .divItems .divItem{
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    padding: 10px; padding-bottom: 5px;
    margin-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
  }
  .divModal .divItems .divItem .divCourse{
    width: 144px;
    position: relative;
    margin-right: 5px;
    height: 100px;
  }
  .divModal .divItems .divItem .divCourse .imgItem{
    border-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divModal .divItems .divItem .divCourse .imgItem1{
    border-top-left-radius: 6px; border-top-right-radius: 6px;
    width: 144px;
    height: 95px;
    overflow: hidden;
  }
  .divModal .divItems .divItem .divCourse .divRadius{
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
  .divModal .divItems .divItem .divCourse .divRadius .imgTimer{
    width: 16px;
    height: 16px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .divModal .divItems .divItem .divCourse .divRadius .lblTimer{
    color: #FFF;
    font-size: 15px;
    margin-top: 1px;
  }
  .divModal .divItems .divItem .divContent .divTop{
    flex: 1;
    display: flex;
    align-items: center;
  }
  .divModal .divItems .divItem .divContent .divTop .divTitle1{
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    flex: 1; width: 120px; height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; padding-top: 5px;
  }
  .divModal .divItems .divItem .divContent .divTop .divTitle1 .divPeriod{
    background:linear-gradient(137deg,rgba(73,205,172,1) 0%,rgba(3,207,149,1) 100%);
    border-radius:6px;
    width: 22px;
    font-size: 12px;
    color: #FFF;
    display: inline-block;
    text-align: center;
    padding-top: 5px; padding-bottom: 3px;
    padding-left: 0px;
    padding-right: 0px;
    vertical-align: middle;
    margin-top: -4px;
  }
  .divModal .divItems .divItem .divContent .divTop .divTitle1 .divLive{
    background:linear-gradient(137deg, #3a37fa 0%, #00a375 100%);
  }
  .divModal .divItems .divItem .divContent .divTop .divTitle1 .imgIcon{
    width: 19px; height: 19px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .divModal .divItems .divItem .divContent .divDesc{
    font-size: 14px;
    color: #999999;
    letter-spacing: 1px;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .divModal .divItems .divItem .divContent .divBottom{
    margin-top: 7px;
    display: flex;
    align-items: center;
  }
  .divModal .divItems .divItem .divContent .divBottom .divPrice{
    font-size: 16px;
    font-weight: 500;
    color: #FF6B88;
  }
  .divModal .divItems .divItem .divContent .divBottom .divOriginalPrice{
    font-size: 11px;
    color: #999999;
    margin-left: 3px;
    text-decoration: line-through;
  }
  .divModal .divItems .divItem .divContent .divBottom .divNumber{
    flex: 1; display: flex; align-items: center; justify-content: flex-end;
  }
  .divModal .divItems .divItem .divContent .divBottom .divNumber .imgNum{
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }
  .divModal .divItems .divItem .divContent .divBottom .divNumber .divNum{
    font-size: 14px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .divModal .divDefInfo{
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
  }
  .divModal .divDefInfo .imgDefault{
    width: 160px;
  }
  .divModal .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
