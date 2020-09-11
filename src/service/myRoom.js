import { service } from './http'

const getMyRoom = (data) => service.get('/api/client/myRoom/', data) //我的直播间列表

export {
  getMyRoom
}
