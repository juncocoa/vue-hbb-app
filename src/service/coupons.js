import { service } from './http';

const getCoupons = (data) => service.get('/api/client/coupons/', data) //优惠券列表
const getUserCoupons = (data) => service.get('/api/client/userCoupons/', data) //用户优惠券列表
const postUserCoupons = (data) => service.post('/api/client/userCoupons/', data) //领用优惠券
const getCouponsCourse = (data) => service.get('/api/client/couponsCourse/', data) //品类券、通用券可用课程

export {
  getCoupons,
  getUserCoupons,
  postUserCoupons,
  getCouponsCourse
}
