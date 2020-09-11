import { service } from './http';

const getCourseDetail = (data) => service.get('/api/client/courseDetail/'+ data.uuid + "/") //课程详情
const getCourseSource = (data) => service.get('/api/client/courseSource/', data) //课件播放列表
const behavior = (data) => service.post('/api/client/behavior/', data) //收藏课程
const cancelBehavior = (data) => service.put('/api/client/behavior/cancel/', data) //取消收藏

const getCommentList = (data) => service.get('/api/client/courseComments/', data) //课程评论
const getAddComment = (data) => service.post('/api/client/comment/', data) //发表评论
const getCommentLike = (data) => service.post('/api/client/commentLike/', data) //点赞评论
const getDelCommentLike = (data) => service.delete('/api/client/commentLike/del/', data) //取消评论点赞


const getCourseCoupons = (data) => service.get('/api/client/courseCoupons/', data) //课程可用优惠券
const postUserCoupons = (data) => service.post('/api/client/userCoupons/', data) //领用优惠券
const postWXPayParams = (data) => service.post('/api/client/wxpayparams/', data) //统一下单
const getWXPayQuery = (data) => service.get('/api/client/wxpayquery/', data) //订单支付结果查询接口

const getShareImg = (data) => service.get('/api/client/shareImg/?uuid=' + data) //分销图片获取
const postPayZero = (data) => service.post('/api/client/payZero/', data) //价格为 0 接口
const getRelateCourses = (data) => service.get('/api/client/relateCourses/', data) //相关课程

export {
  getCourseDetail,
  getCourseSource,
  behavior,
  cancelBehavior,
  getCommentList,
  getAddComment,
  getCommentLike,
  getDelCommentLike,

  getCourseCoupons,
  postUserCoupons,
  postWXPayParams,
  getWXPayQuery,

  getShareImg,
  postPayZero,
  getRelateCourses,
}
