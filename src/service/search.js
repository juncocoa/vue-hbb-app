import { service } from './http';

const getDefaultSearch = () => service.get('/api/client/defaultSearch/') //默认搜索词
const getSearchHistory = () => service.get('/api/client/searchHistory/') //搜索历史
const clearSearchHistory = () => service.delete('/api/client/searchHistory/clear/') //清空搜索历史
const getHotKeyword = () => service.get('/api/client/hotKeyword/') //热搜词

const getCourseSearch = (data) => service.get('/api/client/courses/search/', data) //es搜索课程
const getSearchLike = (data) => service.get('/api/client/searchLike/', data) //模糊匹配

export {
  getDefaultSearch,
  getSearchHistory,
  clearSearchHistory,
  getHotKeyword,
  getCourseSearch,
  getSearchLike
}
