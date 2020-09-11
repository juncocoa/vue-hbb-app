import { service } from './http'

const getPromote = (data) => service.get('/api/client/promote/', data) //课程列表
const postUserCoupons = (data) => service.post('/api/client/userCoupons/', data) //领用优惠券
const getPromoteCoupons = (data) => service.get('/api/client/promoteCoupons/', data) //优惠券列表

export {
  getPromote,
  postUserCoupons,
  getPromoteCoupons
}
