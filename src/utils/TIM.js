import TIM from 'tim-js-sdk';
import { Dialog, Toast } from 'vant';
import * as request from '../service/live.js'

// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
let options = {
  SDKAppID: 1400304449 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
};
let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
// tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用

// 监听事件，如：
// 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
tim.on(TIM.EVENT.SDK_READY, function(event) {
  console.log("TIM 登录成功");
  var timeout = setTimeout(()=>{
    getMessageList(window.that.course.groupId);
    clearTimeout(timeout);
  }, 1000);
  // debugger;
});

// 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
  var txt = JSON.parse(event.data[0].payload.data);
  if(txt.role == "expert" || txt.role == "compere"){
    if (txt.type == 'ppt-pos' && (window.that.course.role == "normal" || window.that.course.role == "inviter")){
      //PPT 自动翻页
      window.that.$refs.swipe.swipeTo(txt.content); return;
    }
    if(txt.type == 'ended'){
      window.that.liveEnd = true;
      Dialog({ message: '直播已结束' }); return;
    }else {
      window.that.contentList.push(txt); if(txt.type == 'txt'){ window.that.lecturerContent = ''; }
      var timeout = setTimeout(() => {
        document.getElementById('divChat').scrollTop = document.getElementById('divChat').scrollHeight;
        clearTimeout(timeout);
      }, 200);
    }
  }else if(txt.role == "normal" || txt.role == "inviter"){
    window.that.groupChatList.push(txt); window.that.content = '';
    var timeout = setTimeout(() => {
      document.getElementById('divReplys').scrollTop = document.getElementById('divReplys').scrollHeight;
      clearTimeout(timeout);
    }, 200);
  }
  // debugger;
});

// 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
  // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
  // event.data - 存储 Conversation 对象的数组 - [Conversation]
  // debugger;
});

// 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
  // event.name - TIM.EVENT.GROUP_LIST_UPDATED
  // event.data - 存储 Group 对象的数组 - [Group]
  // debugger;
});

// 收到新的群系统通知
tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function(event) {
  // event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
  // event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 <a href="https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html#.GroupSystemNoticePayload"> operationType 枚举值说明</a>
  // event.data.message - Message 对象，可将 event.data.message.content 渲染到到页面
  // debugger;
});

// 收到自己或好友的资料变更通知
tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
  // event.name - TIM.EVENT.PROFILE_UPDATED
  // event.data - 存储 Profile 对象的数组 - [Profile]
  // debugger;
});

// 收到黑名单列表更新通知
tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
  // event.name - TIM.EVENT.BLACKLIST_UPDATED
  // event.data - 存储 userID 的数组 - [userID]
  // debugger;
});

// 收到 SDK 发生错误通知，可以获取错误码和错误信息
tim.on(TIM.EVENT.ERROR, function(event) {
  // event.name - TIM.EVENT.ERROR
  // event.data.code - 错误码
  // event.data.message - 错误信息
  // debugger;
});

// 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
  console.log("TIM 退出聊天系统");
  // debugger;
});

// 收到被踢下线通知
tim.on(TIM.EVENT.KICKED_OUT, function(event) {
  // event.name - TIM.EVENT.KICKED_OUT
  // event.data.type - 被踢下线的原因，例如 TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多账号登录被踢
  Dialog({ message: '你已在其它地方登录，确定退出直播间。' }).then(()=>{
    location.href = "/login";
  });
});

// 开始登录 {userID: 'your userID', userSig: 'your userSig'}
var login = (paramData, that)=>{
  tim.login(paramData)
  .then(function(imResponse) {
    window.that = that; that.maskLoading = '消息列表，稍等...'
    if(that.course.role == 'normal'){
      joinGroup(that.course.groupId, that);
    }
  }).catch(function(imError) {
    that.showOverlay = false;
    Dialog({ message: 'TIM 登录失败。' });
  });
};
//退群，并注销用户
let quitGroup = (groupID, that)=>{
  tim.quitGroup(groupID).then(function(imResponse) {
    console.log("TIM 退群成功");
    tim.logout();
  }).catch(function(imError){
    console.warn("TIM 退群失败");
  });
};
//注销用户
let logout = ()=>{
  tim.logout();
};
//加入群
let joinGroup = (groupID, that)=>{
  tim.joinGroup({ groupID: groupID, type: TIM.TYPES.GRP_AVCHATROOM })
  .then(function(imResponse) {
    switch (imResponse.data.status) {
      case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
        console.log('TIM 等待管理员同意');
        break;
      case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
        console.log('TIM 加入群（' + imResponse.data.group.groupID + "）");
        break;
      case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:
        console.log('TIM 已经在群中');
        break;
      default:
        break;
    }
  }).catch(function(imError){
    console.warn('TIM 加入群失败');
  });
};
// 发送文本消息，Web 端
let sendMessage = (groupId, appid, paramData, that)=>{
  let msg = tim.createCustomMessage({
    to: groupId,
    conversationType: TIM.TYPES.CONV_GROUP,
    payload: {
      data: paramData,
      description: 'H5 分销',
      extension: appid
    }
  });
  // 2. 发送消息
  tim.sendMessage(msg).then((imRes)=>{
    // 发送成功
    var txt = JSON.parse(imRes.data.message.payload.data);
    if(txt.role == "expert" || txt.role == "compere"){
      if(txt.type == 'txt'){
        that.lecturerContent = ''; if(that.$refs.question != undefined){ that.$refs.question.content = ''; that.showQuestion = false;}
      }else if(txt.type == 'qna'){
        that.textarea = ''; that.objQuestion = {}; that.showOnTheWall = false;
        //调用小春春接口，标记上墙成功。
        request.putWall({uuid: txt.question.from_uid, msgTime: txt.question.msg_time}).then((json) => {
          if(json.code == 200){
            that.$refs.question.initiData(); Toast('上墙成功');
          }
        });
      }else if(txt.type == 'voice'){
        wx.pauseVoice({ localId: that.localId });
        that.currentRate = 0; that.recordPlayStatus = 'Play';
        that.txtVoice = '轻触点击录音'; that.timerTick = 60; that.localId = '';
        that.recordState = "Start"; that.recordPlayStatus = 'Play'; that.showOverlay = false;
      }else if(txt.type == 'ppt-pos'){
        that.showOverlay = false;
        return;
      }
      that.contentList.push(txt);
      var timeout = setTimeout(() => {
        document.getElementById('divChat').scrollTop = document.getElementById('divChat').scrollHeight;
        clearTimeout(timeout);
      }, 200);
    }else if(txt.role == "normal" || txt.role == "inviter"){
      that.groupChatList.push(txt); that.content = '';
      if(that.$refs.question != undefined){ that.$refs.question.content = ''; that.showQuestion = false; }
      var timeout = setTimeout(() => {
        document.getElementById('divReplys').scrollTop = document.getElementById('divReplys').scrollHeight;
        clearTimeout(timeout);
      }, 200);
    }
    that.showOverlay = false;
  }).catch((imErr)=>{
    if(imErr.code == 10017){
      Toast('你已被禁言，联系管理员。');
    }else {
      Toast('消息发送失败');
    }
  });
}

function getMessageList(groupId, nextReqMessageID){
  var paramData = {
    conversationID: 'GROUP' + groupId,
    count: 800
  }; window.that.liveStart = true;
  if(nextReqMessageID != undefined){
    paramData.nextReqMessageID = nextReqMessageID;
  }
  tim.getMessageList(paramData).then(function(imResponse) {
    const messageList = imResponse.data.messageList; // 消息列表。
    for (var i = 0; i < messageList.length; i++) {
       try {
         var data = JSON.parse(messageList[i].payload.data);
         if(data.type == 'ppt-pos'){ continue; } //忽略 PPT 自动翻页功能
         if(data.role == 'expert' || data.role == 'compere'){
           //专家，主持人
           if(data.type == "voice"){ data.percentage = 0; data.playStatus = 'stop';}
           that.contentList.push(data);
         }else if(data.role == 'inviter' || data.role == 'normal'){
           //普通用户、嘉宾
           that.groupChatList.push(data);
         }
       } catch (e) {
         console.warn("错误数据格式：" + messageList[i].payload.data);
       }
    }
    window.that.showOverlay = false; that.getGroupMemberList();

    if(window.that.course.isEnd == true){
      window.that.liveEnd = true;
      Dialog.confirm({
        message: '直播已结束',
        confirmButtonText: '从头播放',
        cancelButtonText: '直接进入',
        confirmButtonColor: '#FF6B88',
        cancelButtonColor: '#999999'
      }).then(() => {
        //自动播放
      }).catch(() => {
        var timeout = setTimeout(() => {
          document.getElementById('divChat').scrollTop = document.getElementById('divChat').scrollHeight;
          document.getElementById('divReplys').scrollTop = document.getElementById('divReplys').scrollHeight;
          clearTimeout(timeout);
        }, 500);
      });
    }else if(window.that.course.isEnd == false){
      Dialog.confirm({
        message: '正在直播中',
        confirmButtonText: '从头播放',
        cancelButtonText: '直接进入',
        confirmButtonColor: '#FF6B88',
        cancelButtonColor: '#999999'
      }).then(() => {
        //自动播放
      }).catch(() => {
        var timeout = setTimeout(() => {
          document.getElementById('divChat').scrollTop = document.getElementById('divChat').scrollHeight;
          document.getElementById('divReplys').scrollTop = document.getElementById('divReplys').scrollHeight;
          clearTimeout(timeout);
        }, 500);
      });
    }
  });
}
let setGroupMemberMuteTime = (groupId, userId, muteTime, that)=>{
  tim.setGroupMemberMuteTime({
    groupID: groupId,
    userID: userId,
    muteTime: muteTime // 禁言10分钟；设为 0，则表示取消禁言
  }).then(function(imResponse) {
    Toast('禁言成功（10 分钟）');
  }).catch(function(imError) {
    Toast('禁言失败');
  });
}
let getGroupMemberList = (groupID, that) => {
  tim.getGroupMemberList({ groupID: groupID, count: 5000, offset:0 })
  .then(function(imResponse) {
    if((imResponse.data.memberList.length - 1) <= 0){
      that.memberCount = 0;
    }else {
      that.memberCount = (imResponse.data.memberList.length - 1);
    }
  }).catch(function(imError) {
    console.log('getGroupMemberList:', imError);
  });
}

let setMessageRead = (conversationID, that)=>{
  tim.setMessageRead({conversationID: conversationID})
  .then(function(imResponse) {
    // 已读上报成功
    debugger;
    console.log("已读上报成功");
  }).catch(function(imError) {
    // 已读上报失败
    debugger;
    console.warn('已读上报失败 error:', imError);
  });
}

export {
  tim,
  login,
  logout,
  quitGroup,
  sendMessage,
  setGroupMemberMuteTime,
  getGroupMemberList,
  setMessageRead
}
