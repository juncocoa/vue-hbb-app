import { service } from './http';

const getStudyHistory = () => service.get('/api/client/studyHistory/') //浏览历史
const deleteStudyHistory = (data) => service.delete('/api/client/studyHistory/', data) //删除浏览历史

export {
  getStudyHistory,
  deleteStudyHistory
}
