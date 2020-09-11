import { service } from './http';

const getDefaultSearch = () => service.get('/api/client/defaultSearch/') //默认搜索词
const getTags = () => service.get('/api/client/tags/') //首页标签
const getBanners = () => service.get('/api/client/banner/') //获取首页 banner
const getLives = () => service.get('/api/client/lives/') //大咖直播
const getSection = () => service.get('/api/client/section/') //首页模块展示
const getCategroy = (data, page) => service.get(((page == undefined)?'/api/client/categroy/':'/api/client/categroy/?page=' + page), data) //分类筛选
const clientCourse = (data) => service.get('/api/client/course/', data) //课程模块查看（免费专区，排行榜）
const clientSectionMore = (data, page) => service.get(((page == undefined)?'/api/client/sectionMore/':'/api/client/sectionMore/?page=' + page), data) //模块展示更多

export {
  getDefaultSearch,
  getBanners,
  getTags,
  getSection,
  getCategroy,
  getLives,
  clientCourse,
  clientSectionMore
}
