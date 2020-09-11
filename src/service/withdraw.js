import { service } from './http';

const clientSendCode = (data) => service.post('/api/client/sendcode/', data) //发送验证码
const postChecktel = (data) => service.post('/api/client/checktel/', data) //验证手机号
const postRealAuth = (data) => service.post('/api/client/realauth/', data) //设置交易密码
const postChangeTradePwd = (data) => service.post('/api/client/changeTradePwd/', data) //重置交易密码
const postCashRequest = (data) => service.post('/api/client/cashRequest/', data) //提现申请
const getBillList = (data) => service.get('/api/client/billList/', data) //流水列表

export {
  clientSendCode,
  postChecktel,
  postRealAuth,
  postChangeTradePwd,
  postCashRequest,
  getBillList,
}
