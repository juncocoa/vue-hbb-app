
import { service } from './http';

const getExpert = (data) => service.get('/api/client/expert/'+ data.uuid + "/") //专家详情
const getExpertCourses = (data) => service.get('/api/client/expertCourses/', data) //专家课程列表
const postFollowExpert = (data) => service.post('/api/client/followExpert/', data) //关注取消关注

export {
  getExpert,
  getExpertCourses,
  postFollowExpert
}
