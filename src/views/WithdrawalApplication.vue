<template>
  <div class="page divProgress">
    <div class="divStatus">
      <img src="@/assets/images/myProfile/status.png" class="imgStatus"/>
      <div class="divTxt">提现申请已提交</div>
    </div>
    <van-steps direction="vertical" :active="0" active-color="#2F8DFB">
      <van-step>
        <div class="divTitle">申请已提交</div>
        <div class="divTimer">{{timer | formatDateByFormat('yyyy-MM-dd hh:mm:ss')}}</div>
      </van-step>
      <van-step>
        <div class="divTitle">申请已受理</div>
        <div class="divTimer">{{(timer + 7200000) | formatDateByFormat('yyyy-MM-dd hh:mm:ss')}}</div>
      </van-step>
      <van-step>
        <div class="divTitle">预计到账时间</div>
        <div class="divTimer">{{(timer + 172800000) | formatDateByFormat('yyyy-MM-dd hh:mm:ss')}}</div>
      </van-step>
    </van-steps>
    <van-button color="#FF6B88" block class="btnBack" @click="submitBack">返回</van-button>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';

export default {
  name: 'withdrawalApplication',
  data: () => ({
    timer: new Date().getTime()
  }),
  methods: {
    submitBack: function(event){
      this.$router.push('/myProfile');
    }
  }
}
</script>
<style lang="scss" scoped>
  .divProgress{
    background-color: #F7F7F7;
  }
  .divProgress .divStatus{
    background-color: #FFF; width: 100%; height: 140px;
    display: flex; flex-direction: row; align-items: center; justify-content: center;
  }
  .divProgress .divStatus .imgStatus{
    width: 30px; height: 30px; margin-right: 10px;
  }
  .divProgress .divStatus .divTxt{
    font-size: 16px; font-weight: bold; color: #FF6B88;
    margin-top: 2px;
  }
  .divProgress .divTitle{
    font-size: 16px;
  }
  .divProgress .divTimer{
    font-size: 14px; margin-top: 6px; margin-bottom: 10px;
  }
  .btnBack{
    width: 85%; letter-spacing: 1px;
    margin-left: auto; margin-right: auto;
    margin-top: 30px; border-radius: 25px;
    box-shadow: 0 5px 10px #ffb5c4;
    font-size: 18px;
  }
</style>
