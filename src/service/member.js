import { service } from './http'

const getMemberCard = () => service.get('/api/client/memberCard/') //会员卡列表
const postExchange = (data) => service.post('/api/client/exchange/', data) //兑换码兑换会员

export {
  getMemberCard,
  postExchange
}
