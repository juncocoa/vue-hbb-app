import config from "./WebIMConfig";
import websdk from "easemob-websdk";
// import emedia from "easemob-emedia";
// import webrtc from "easemob-webrtc";

// 初始化IM SDK
var WebIM = {};
WebIM = window.WebIM = websdk;
WebIM.config = config;
WebIM.conn = new WebIM.connection({
	appKey: WebIM.config.appkey,
	isHttpDNS: WebIM.config.isHttpDNS,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: WebIM.config.https,
	url: WebIM.config.xmppURL,
	apiUrl: WebIM.config.apiURL,
	isAutoLogin: true,
	heartBeatWait: WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
	isStropheLog: WebIM.config.isStropheLog,
	delivery: WebIM.config.delivery
});
if (!WebIM.conn.apiUrl) {
	WebIM.conn.apiUrl = WebIM.config.apiURL;
}

// 需要发送已读回执的消息id
function ack(message) {
	var bodyId = message.id;
	var msg = new WebIM.message("read", WebIM.conn.getUniqueId());
	msg.set({
		id: bodyId,
		to: message.from
	});
	WebIM.conn.send(msg.body);
}

// 注册监听回调
WebIM.conn.listen({
	onOpened: function () {
    // 连接成功回调（登录或注册成功后 跳转到好友页面）
		console.log('环信 登录 成功。')
	},
	onClosed: function (message) {
    // 连接关闭回调
    debugger;
		console.log('onClosed', message)
	},
	onTextMessage: function (message) {
    // 收到文本消息
    debugger;
		console.log('onTextMessage', message)
	},
	onEmojiMessage: function (message) {
    // 收到表情消息
    debugger;
		console.log("onEmojiMessage", message);
	},
	onPictureMessage: function (message) {
		// 收到图片消息
    debugger;
    console.log('onPictureMessage', message)
	},
	onCmdMessage: function (message) {
    // 收到命令消息
    debugger;
		console.log("onCmdMessage", message);
	},
	onAudioMessage: function (message) {
    // 收到音频消息
    debugger;
		console.log("onAudioMessage", message);
	},
	onLocationMessage: function (message) {
    // 收到位置消息
    debugger;
		console.log("onLocationMessage", message);
	},
	onFileMessage: function (message) {
    // 收到文件消息
    debugger;
    console.log("onFileMessage", message);
	},
	onVideoMessage: function (message) {
    // 收到视频消息
    debugger;
    console.log("onVideoMessage", message);
	},
	onPresence: function (message) {
    // 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
    debugger;
		console.log("onPresence", message);
		switch (message.type) {
			case "subscribe":
        //订阅
        debugger;
        alert(message.from + " " + "订阅");
				break;
			case "subscribed":
        // 已订阅
        debugger;
        alert(message.from + " " + "已订阅");
				break;
			case "unsubscribed":
        //取消订阅
        debugger;
				if ("code" in message) {
					alert(message.from + " " + "请求被拒绝");
				}else {
          alert(message.from + " " + "已退订");
				}
				break;
			case "direct_joined":
        // 被拉进群--不需要同意
        debugger;
        alert(`${message.from} 邀请您加入群：${message.gid}`)
				break;
			case "invite":
        //收到（邀请）进群的通知
				debugger;
        alert(message);
				break;
			case "joinGroupNotifications":
        // 收到 (申请) 进群的通知
        debugger;
				alert(message);
				break;
			case "memberJoinPublicGroupSuccess":
        // 成员加入（聊天室）成功回调
        debugger;
        alert(`${message.from}已加入群组`);
				break;
			case "joinPublicGroupSuccess":
        // 申请加入（群组）成功回调
        debugger;
        alert(message);
				break;
			case "deleteGroupChat":
        // 解散群组
        debugger;
        alert(`${message.from}将群：${message.gid} 已解散`);
				break
			case "removedFromGroup":
        // 被（群主）踢出群
				debugger;
        alert(`已被 ${message.from} 移除群：${message.gid}`);
				break;
			case "leaveGroup":
        //离开群消息
        debugger;
        alert(message);
        break;
			default:
				break;
		}
	},
	onRoster: function (message) {
    // 处理好友申请
    debugger;
		console.log("onRoster", message);
	},
	onInviteMessage: function (message) {
    // 处理群组邀请
    debugger;
		console.log("onInviteMessage", message);
	},
	onOnline: function () {
    // 本机网络连接成功
    debugger;
		console.log("onOnline 网络已连接");
	},
	onOffline: function () {
    // 本机网络掉线
    debugger;
		console.log("onOffline 网络已断开");
	},
	onError: function (message) {
    // 失败回调
    debugger;
		console.log("onError", message);
		if (message.type == 28) {
			//未登陆
		} else if (JSON.parse(_.get(message, 'data.data.error_description')) == "user not found") {
			//用户名不存在！
		} else if (JSON.parse(_.get(message, 'data.data.error_description')) == "invalid password") {
			//密码无效！
		} else if (JSON.parse(_.get(message, 'data.data.error_description')) == "user not activated") {
			//用户已被封禁！
		} else if (message.type == "504") {
			//消息撤回失败
		}
	},
	onRecallMessage: function(message) {
    debugger;
		console.log("撤回消息", message);
		message.status = "recall";
		message.msg = "对方撤回了一条消息";
		// Vue.$store.commit("updateMessageStatus", message);
	},
	onBlacklistUpdate: function (list) { // 黑名单变动
		// 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
		// 更新好友黑名单
    debugger;
		console.log("黑名单变动", list);
	},
	onReceivedMessage: function (message) {
    // 收到消息送达服务器回执
    debugger;
		console.log("onReceivedMessage", message);
		// updateMessageMid
		message.status = "sent";
		// updateMessageStatus
	},

	onDeliveredMessage: function (message) {
    // 收到消息送达客户端回执
    debugger;
		console.log("onDeliveredMessage", message);
	},
	onReadMessage: function (message) {
    // 收到消息已读回执
    debugger;
		console.log("onReadMessage", message);
		message.status = "read";
	},
	onCreateGroup: function (message) {
    // 创建群组成功回执（需调用createGroupNew）
    debugger;
		console.log("onCreateGroup", message);
	},
	onMutedMessage: function (message) {
    // 如果用户在 A 群组被禁言，在 A 群发消息会走这个回调并且消息不会传递给群其它成员
    debugger;
		console.log("onMutedMessage", message);
	}
});

// WebIM.WebRTC = webrtc;
// WebIM.EMedia = emedia;
export default WebIM;
