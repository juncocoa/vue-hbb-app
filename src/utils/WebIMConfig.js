/**
 * git 不控制 webim.config.js
 * 每个人都应将 webim.config.js.demo 复制到 webim.config.js
 * 并有自己的配置
 * 这样，其他人在git pull时不会受到此配置的影响。
 */
function getUrl(){
    var apiUrl = (window.location.protocol === "https:" ? "https:" : "http:") + "//a1.easemob.com"
    var xmppUrl = (window.location.protocol === "https:" ? "https:" : "http:") + "//im-api-v2.easemob.com/ws"

    return {
        apiUrl: apiUrl,
        xmppUrl: xmppUrl
    }
}

var config = {
    /*
     * XMPP Server 地址
     */
    xmppURL: getUrl().xmppUrl,
    /*
     * rest Server 地址
     */
    apiURL: getUrl().apiUrl,

    /*
     * Application AppKey
     */
    appkey: "1129191202107672#hbbyunying",
    /*
     * Application Host
     */
    Host: "easemob.com",
    /*
     * 是否使用 HTTPS
     * @parameter {Boolean} true or false
     */
    https: false,
    /*
     * 3.0 SDK支持，防止 DNS 劫持从服务端获取 XMPPUrl、restUrl
     */
    isHttpDNS: true,
    /*
     * true: 访问者可以登录多个网页并在所有网页上接收消息。
     * false: 访客只能登录一个网页，并在该网页上接收消息。
     */
    isMultiLoginSessions: false,
    /**
     * 是否使用 window.doQuery()
     * @parameter {Boolean} true or false
     */
    isWindowSDK: false,
    /**
     * isSandBox=true:  xmppURL: 'im-api.sandbox.easemob.com',  apiURL: '//a1.sdb.easemob.com',
     * isSandBox=false: xmppURL: 'im-api.easemob.com',          apiURL: '//a1.easemob.com',
     * @parameter {Boolean} true or false
     */
    isSandBox: false,
    /**
     * 打开调试，会自动打印 log，在控制台的 console 中查看 log
     * @parameter {Boolean} true or false
     */
    isDebug: true,
    /**
     * 是否在日志中显示日志
     * @parameter {Boolean} true or false
     */
    isStropheLog: false,
    /**
     * 当客户端离线时，它将在后台自动连接 xmpp 服务器的 autoReconnectNumMax 次。
     * 如果 autoReconnectNumMax = 0，将不会自动连接。
     */
    autoReconnectNumMax: 5,
    /**
     * 每次自动重新连接之间的间隔秒数。
     * 仅在 autoReconnectMaxNum >= 2 时有效。
     */
    autoReconnectInterval: 2,
    /**
     * webrtc 仅支持 WebKit 和 https
     */
    isWebRTC: false, //window.RTCPeerConnection && /^https\:$/.test(window.location.protocol),
    /**
     *  cn: chinese
     *  us: english
     */
    i18n: "cn",
    /*
     * 设置为自动登录
     */
    isAutoLogin: true,
    /**
     * 消息缓存的大小，点 到 点
     */
    p2pMessageCacheSize: 500,
    /**
     * 消息到达时，接收方将确认消息发送到
     * 发件人，以便告诉发件人消息已传递。
     * 请参阅 onReceivedMessage 的回调函数
     */
    delivery: true,
    /**
     * 群组，聊天室 等群组聊天的消息缓存大小
     */
    groupMessageCacheSize: 200,
    /**
     * 5 种日志输入优先级，可供选择：
     * 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'
     */
    loglevel: "ERROR",

    /**
     * 为历史消息 启用 本地存储
     */
    enableLocalStorage: true
}
export default config
