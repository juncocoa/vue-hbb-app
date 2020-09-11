<template>
  <div class="page divMemberCard">
    <div class="divHeader">
      <img src="@/assets/images/myProfile/avatar.png" class="imgAvatar"/>
      <div class="divBase">
        <div class="divName">我的昵称</div>
        <div class="divText">有效期 <label>2019-06-22&gt;</label></div>
      </div>
      <button class="btnRedemptionCode" @click="">兑换码通道<button>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import * as request from '../service/member.js'

export default {
  name: 'memberCard',
  data: () => ({

  }),
  methods: {

  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
  .divMemberCard{

  }
</style>
