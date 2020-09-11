<template>
  <div class="page" style="background-color: #F7F7F7;">
    <div class="divSetPwd">
      <div style="background-color: #FFF; height: 310px;">
        <div class="divTip">
          <div class="divTitle">实名身份验证</div>
          <div class="divContent">为保护账户安全，需要验证身份信息</div>
        </div>
        <div class="divCode">
          <input placeholder="请输入您的真实姓名" v-model="realName" autocomplete="off"/>
        </div>
        <div class="divCode">
          <input type="tel" maxlength="18" placeholder="请输入 18 位身份证号" v-model="idCard" autocomplete="off"/>
        </div>
        <div class="divTip1">身份证绑定后将无法修改，请确认与本人微信绑定的身份证号一致</div>
      </div>
      <van-button color="#FF6B88" :disabled="!verifyOld" block class="btnLogin" @click="submitVerify">确定</van-button>
    </div>
    <van-popup v-model="showSetPwd" position="bottom" :style="{ height: '100%' }">
      <vue-transaction-pwd ref="transactionPwd" :proIdCard="idCard" :proRealName="realName" />
    </van-popup>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import transactionPwd from '../components/transactionPwd.vue';

export default {
  name: 'identityAuth',
  data: () => ({
    realName: '',
    idCard: '',
    showSetPwd: false
  }),
  components: {
    "vue-transaction-pwd": transactionPwd,
  },
  computed: {
    verifyOld() {
      return this.realName && this.idCard
    },
    verifyIDCode(){
      if(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(this.idCard)){
        return false;
      }else {
        return true;
      }
    }
  },
  methods: {
    submitVerify: function(event){
      if (this.verifyIDCode) {
        Dialog.alert({ message: '身份证 格式不正确。' });
        return;
      }
      this.showSetPwd = true; Toast('设置交易密码');
      if(this.$refs.transactionPwd != undefined){
        this.$refs.transactionPwd.setParams(this.realName, this.idCard);
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  .divSetPwd{
    background-color: #F7F7F7;
  }
  .divCode{
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 46px;
    border-bottom: 1px solid #F5F5F5;
  }
  .divCode input{
    border: none;
    flex: 1; width: 100%;
    font-size: 0.29rem;
  }
  .divTip1{
    font-size: 14px; color: #999999;
    margin-top: 13px; margin-left: 20px; margin-right: 20px;
    box-sizing: border-box;
  }
  .btnLogin{
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px; border-radius: 25px;
    box-shadow: 0 5px 10px #ffb5c4;
  }
  .divSetPwd .divTip{
    padding-top: 64px;
    margin-left: 20px;
    margin-bottom: 35px;
  }
  .divSetPwd .divTip .divTitle{
    font-size: 18px; font-weight: bold;
    color: #333333; margin-bottom: 9px;
  }
  .divSetPwd .divTip .divContent{
    font-size: 14px; color: #999999;
  }
</style>
