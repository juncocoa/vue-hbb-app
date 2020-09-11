import { service } from './http';

const getMayLike = (page) => service.get(((page == undefined)?'/api/client/mayLike/':'/api/client/mayLike/?page=' + page)) //猜你喜欢
const getBehavior = (data, page) => service.get(((page == undefined)?'/api/client/behavior/':'/api/client/behavior/?page=' + page), data) //最近学习: 3
const getPurchasedBehavior = (data, page) => service.get(((page == undefined)?'/api/client/behavior/':'/api/client/behavior/?page=' + page), data) //已购课程: 5
const getBuyCourses = (data) => service.get('/api/client/buyCourses/', data) //已购课程
const cancelBehavior = (data) => service.put('/api/client/behavior/cancel/', data) //取消收藏
const getLikeRoom = (page) => service.get(((page == undefined)?'/api/client/likeRoom/':'/api/client/likeRoom/?page=' + page)) //聊天室收藏列表
const getRoomRight = (data) => service.get('/api/client/roomRight/', data) //是否拥有聊天室权限

export {
  getMayLike,
  getBehavior,
  getPurchasedBehavior,
  getBuyCourses,
  cancelBehavior,
  getLikeRoom,
  getRoomRight
}
