<template>
  <div class="page divBrowsingHistory" :style="{height: height}">
    <div v-if="list.length <= 0" class="divDefInfo" :style="{height: scrollHeight}">
      <img src="@/assets/images/default/recording.png" class="imgDefault"/>
      <div class="divTip">没有历史记录</div>
    </div>
    <van-checkbox-group class="divGroup" ref="checkboxGroup" :style="{height: scrollHeight}" v-if="list.length > 0" v-model="result">
      <div class="divItem" v-for="(item, index) in list" :key="index">
        <div class="divTitle">
          {{item.date}}
          <a href="javascript:;" class="checkAll" v-if="index == 0 && showHistory == true" @click="selectAll">全选</a>
        </div>
        <div class="divSubItem" v-for="(subItem, subIndex) in item.items" :key="subIndex">
          <div class="divLeft">
            <van-checkbox :name="subItem.uuid" checked-color="#FF6B88" class="checkbox" v-if="showHistory"/>
            <div class="divTimer">{{subItem.createTime | formatDateByFormat('hh:mm')}}</div>
          </div>
          <div class="divRight" @click="gotoCourse(subItem.course.uuid)">
            <div class="divName">{{subItem.course.name}}</div>
            <div class="divType">{{subItem.course.intro | contentIsEmpty}}</div>
          </div>
        </div>
      </div>
    </van-checkbox-group>

    <div class="divBottom">
      <button class="divDelete" @click="deleteHistory">删除</button>
      <button class="divCarryOut" @click="showDelete">{{txtEdit}}</button>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/history.js'

export default {
  name: 'browsingHistory',
  data: () => ({
    height: window.innerHeight + 'px',
    scrollHeight: (window.innerHeight - 88) + 'px',
    checkbox: false,
    showHistory: false,
    list: [],
    result: [],
    txtEdit: '编辑'
  }),
  methods: {
    gotoCourse(uuid){
      this.$router.push('/course/' + uuid);
    },
    refreshData: function(){
      var that = this;
      request.getStudyHistory().then((json) => {
        if(json.code == 200){
          that.list = json.data;
        }
      });
    },
    selectAll: function(){
      if(this.checkbox == false){
        this.checkbox = true;
        this.$refs.checkboxGroup.toggleAll(true);
      }else {
        this.checkbox = false;
        this.$refs.checkboxGroup.toggleAll();
      }
    },
    showDelete: function(){
      if(this.showHistory == true){
        this.showHistory = false; this.txtEdit = '编辑'
      }else {
        this.showHistory = true; this.txtEdit = '完成'
      }
    },
    deleteHistory: function(){
      var that = this;
      if(this.showHistory == false){
        Toast('编辑 模式，才可删除。');
        return;
      }
      if(this.result.length <= 0){
        Toast('至少要选择一条记录。');
        return;
      }

      Dialog.confirm({
        message: '确定要删除历史记录吗？'
      }).then(() => {
        request.deleteStudyHistory({uuidList: that.result}).then((json) => {
          if(json.code == 200){
            Toast(json.msg); that.refreshData();
          }
        });
      })
    }
  },
  mounted() {
    this.refreshData();
  }
}
</script>
<style lang="scss" scoped>
  .divBrowsingHistory{
    background-color: #F5F5F5; width: 100%;
  }
  .divBrowsingHistory .divGroup{
    padding: 15px; padding-top: 20px; background-color: #FFF;
    overflow-x: hidden; overflow-y: auto;
  }
  .divBrowsingHistory .divGroup .divItem{
    margin-bottom: 20px;
  }
  .divBrowsingHistory .divGroup .divItem:last-child{
    margin-bottom: 0px;
  }
  .divBrowsingHistory .divGroup .divItem .divTitle{
    font-size: 16px; color: #333333; margin-bottom: 15px;
    display: flex; flex-direction: row; align-items: center;
    justify-content: space-between; font-weight: bold;
  }
  .divBrowsingHistory .divGroup .divItem .divTitle .checkAll{
    font-size: 16px; color: #2F8DFB; font-weight: bold;
  }
  .divBrowsingHistory .divGroup .divItem .divSubItem{
    display: flex; flex-direction: row; align-items: center;
    margin-bottom: 15px;
  }
  .divBrowsingHistory .divGroup .divItem .divSubItem:last-child{
    margin-bottom: 0;
  }
  .divBrowsingHistory .divGroup .divItem .divSubItem .divLeft{
    width: 85px; display: flex; align-items: center;
    border-right: 1px solid #F7F7F7;
  }
  .divBrowsingHistory .divGroup .divItem .divSubItem .divLeft .checkbox{

  }
  .divBrowsingHistory .divGroup .divItem .divSubItem .divLeft .divTimer{
    font-size: 14px; color: #999999; margin-left: 9px; margin-top: -3px;
  }
  .divBrowsingHistory .divGroup .divItem .divSubItem .divRight{
    flex: 1; padding-left: 18px; box-sizing: border-box;
  }
  .divBrowsingHistory .divGroup .divItem .divSubItem .divRight .divName{
    font-size: 15px; color: #333333; font-weight: bold; height: 17px;
    display: -webkit-box; -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; overflow: hidden;
  }
  .divBrowsingHistory .divGroup .divItem .divSubItem .divRight .divType{
    font-size: 13px; color: #999999; margin-top: 5px;
    display: -webkit-box; -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; overflow: hidden;
  }
  .divBrowsingHistory .divBottom{
    position: fixed; bottom: 0; width: 100%; background-color: #FFF;
    padding: 10px; display: flex; flex-direction: row; align-items: center;
    justify-content: space-around; box-sizing: border-box;
  }
  .divBrowsingHistory .divBottom .divDelete{
    border: 1px solid #FF6B88; background-color: #FF6B88; font-size: 14px;
    color: #FFF; border-radius: 20px; width: 100px; padding: 9px;
  }
  .divBrowsingHistory .divBottom .divCarryOut{
    border: 1px solid #FF6B88; background-color: #FFF; font-size: 14px;
    color: #FF6B88; border-radius: 20px; width: 100px; padding: 9px;
  }
  .divBrowsingHistory .divDefInfo{
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
  }
  .divBrowsingHistory .divDefInfo .imgDefault{
    width: 160px; margin-top: 20px;
  }
  .divBrowsingHistory .divDefInfo .divTip{
    font-size: 14px; color: #999999;
    margin-top: -15px;
  }
</style>
