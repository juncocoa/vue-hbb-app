import { service } from './http';

const getLiveDetails = (data) => service.get('/api/client/room/', data) //直播详情
const postIMSignUp = (data) => service.post('/api/im/login/', data) //检测腾讯IM是否注册
const getJsSdk = (data) => service.get('/api/client/getJsSdk/', data) //录音微信授权

const postLikeRoom = (data) => service.post('/api/client/likeRoom/', data) //收藏聊天室
const deleteLikeRoom = (data) => service.delete('/api/client/likeRoom/', data) //取消收藏

const chatsHistory = (data) => service.get('/api/client/chatsHistory/', data) //聊天记录
const getTranscoding = (data) => service.get('/api/client/getFile/', data) //文件转码
const putDelChat = (data) => service.put('/api/client/delChat/', data) //删除聊天
const putWall = (data) => service.put('/api/client/putWall/', data) //消息上墙
const getRoomMsg = (data) => service.get('/api/client/roomMsg/', data) //自动播放课件
const getIMStatus = (data) => service.get('/api/client/queryStatus/', data) //查询用户在线状态

export {
  getLiveDetails,
  postIMSignUp,
  getJsSdk,

  postLikeRoom,
  deleteLikeRoom,
  chatsHistory,
  getTranscoding,
  putDelChat,
  putWall,
  getRoomMsg,
  getIMStatus,
}
