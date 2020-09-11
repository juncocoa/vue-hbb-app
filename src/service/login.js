import { service } from './http'

const clientLogin = (data) => service.post('/api/client/login/', data) //登录系统
const clientRegister = (data) => service.post('/api/client/register/', data) //注册账户
const clientSendCode = (data) => service.post('/api/client/sendcode/', data) //发送验证码
const clientWechatLogin = (data) => service.post('/api/client/wechatlogin/', data) //微信登录
const clientBindTel = (data) => service.post('/api/client/bindtel/', data) //微信登录绑定手机号
const clientChangePwd = (data) => service.post('/api/client/changepwd/', data) //修改密码
const clientChangeTel = (data) => service.post('/api/client/changetel/', data) //更换手机号
const clientUserInfo = () => service.get('/api/client/userInfo/') //获取个人信息
const clientChangeInfo = (data) => service.post('/api/client/changeinfo/', data) //修改个人资料
const fileUpload = (data) => service.postFileUpload('https://appupload.hbbclub.com/api/oss/upload', data) //文件上传到 阿里云

const bindWechat = (data) => service.post('/api/client/bindwechat/', data) //手机号登录绑定微信
const queryTel = (data) => service.post('/api/client/querytel/', data) //查询手机号是否注册

const postLogOut = () => service.post('/api/client/logout/') //退出登录

export {
  clientLogin,
  clientRegister,
  clientSendCode,
  clientWechatLogin,
  clientChangePwd,
  clientChangeTel,
  clientBindTel,
  clientUserInfo,
  clientChangeInfo,
  fileUpload,
  bindWechat,
  queryTel,
  postLogOut
}
