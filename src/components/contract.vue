<template>
  <div class="page divContract">
    <div class="divScroll" :style="{height: height}">
      <div class="divTitle">尊敬的专家：</div>
      <div class="divItem">
        迎您参与北京好呗呗网络科技有限公司（以下简称好呗呗）课程内容的录制，感谢您给予的大力协助！
      </div>
      <div class="divItem">
        基于本公司录制的课程内容承担着传播知识、社会教育、文化娱乐、母婴育儿服务等多种功能。为了使您参与的节目实现多种社会价值，我公司将课程内容进行录制、播出及保存的同时，还将进行其他形式的利用。同时，为了使课程宣传效果最大化，增强您个人品牌的打造，为此，请您在充分理解该宗旨的基础上，就您的个人肖像权、个人资料、课程内容的播出、使用予以事先确认并给予您的授权。正是因为有了您的参与及协助，才会使课程更加精彩！
      </div>
      <div class="divItem">
        第一条&nbsp;&nbsp;&nbsp;&nbsp;好呗呗拥有专家参与合作内容的著作权和相关版权。包括在国内、外各地区以各种形式（包含但不限于音频、视频、图片、文字等），在各种渠道上刊登、传播或出版（包含付费平台）。
      </div>
      <div class="divItem">
        第二条&nbsp;&nbsp;&nbsp;&nbsp;专家授权好呗呗使用其肖像权，用于合作内容的相关宣传(包含互联网平台及线下实体平台的宣传)。好呗呗拥有录制合作内容的制作权、发行权、传播权，将制作内容发布在自有平台及合作平台，并不再支付给专家其他费用。
      </div>
      <div class="divItem">
        第三条&nbsp;&nbsp;&nbsp;&nbsp;好呗呗拥有录制合作内容的再创作权利，对合作内容进行整合，产生产品（包含但不限于音像制品、电子出版物）并实施销售。好呗呗可以自己出版，也可以转让第三方出版。
      </div>
      <div class="divItem">
        第四条&nbsp;&nbsp;&nbsp;&nbsp;专家为好呗呗录制的课程内容，不得违反宪法和法律，不得损害公共利益。同时，好呗呗承诺专家相关内容的传播不得违反宪法和法律。
      </div>
      <div class="divItem">
        第五条&nbsp;&nbsp;&nbsp;&nbsp;因上述权利的行使侵犯他人著作权及名誉权、署名权等人身权内容的，专家应承担全部责任并赔偿因此给好呗呗造成的经济损失。
      </div>
      <div class="divItem">
        第六条&nbsp;&nbsp;&nbsp;&nbsp;未经好呗呗书面同意，专家不得将本课程的全部或一部分，或将其内容稍加修改后以原名或更换名称授权第三者出版、传播。若违反本规定，专家应承担全部责任并赔偿因此给好呗呗造成的经济损失。
      </div>
      <div class="divItem">
        第七条&nbsp;&nbsp;&nbsp;&nbsp;合同的变更及其它未尽事宜，由双方另行商定。
      </div>
    </div>
    <div class="divBottom">
      <div class="divRefuse" @click="btnRefuse">不同意</div>
      <div class="divAgree" @click="btnAgree">我同意</div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant';

export default {
  name: 'contract',
  props: { },
  data: ()=>({
    height: (window.innerHeight - 53) + "px"
  }),
  methods: {
    //继续播放
    btnRefuse: function(){
      Dialog({message: '必须同意协议，才能直播。'});
    },
    btnAgree: function(){
      this.$emit("closeContract");
    },
  }
}
</script>
<style lang="scss" scoped>
  .divContract{
    width: 100%; padding-left: 15px; padding-right: 15px;
    box-sizing: border-box; background-color: #F7F7F7;
  }
  .divContract .divScroll{
    overflow-x: hidden; overflow-y: auto;
  }
  .divContract .divTitle{
    font-size: 18px; color: #333333; font-weight: bold;
    text-align: center; margin-top: 15px; margin-bottom: 15px;
  }
  .divContract .divItem{
    font-size: 16px; color: #333333; font-weight: 500;
    margin-bottom: 15px;
  }
  .divContract .divBottom{
    display: flex; flex-direction: row; align-items: center;
    justify-content: center; background-color: #FFF; position: fixed;
    bottom: 0; left: 0; width: 100%; height: 50px;
  }
  .divContract .divBottom .divRefuse{
    flex: 1; font-size: 16px; font-weight: 500; color: #333333;
    height: 50px; display: flex; justify-content: center;
    align-items: center;
  }
  .divContract .divBottom .divRefuse:active{
    background-color: #FBFBFB;
  }
  .divContract .divBottom .divAgree{
    flex: 1; font-size: 16px; font-weight: 500; color: #FF6B88;
    border-left: 1px solid #F5F5F5; height: 50px;
    display: flex; justify-content: center; align-items: center;
  }
  .divContract .divBottom .divAgree:active{
    background-color: #FBFBFB;
  }
</style>
