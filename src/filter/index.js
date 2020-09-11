import Vue from 'vue'
import { pxToRem, formatDuration } from '../utils'

Vue.filter('pxToRem', (value) => {
  return pxToRem(value)
})
//格式化成（12"23'）
Vue.filter('formatTime', (value) => {
  var seconds = (value/1000);
  var minute = parseInt(seconds/60);
  var second = parseInt(seconds%60);

  if(minute <= 0){
    return `${second}"`;
  }else {
    return `60"`;
  }
})
//格式化金钱
Vue.filter('formatMoney', (value) => {
  if(value == undefined){ return "0.00"; }
  var formatStr = 0;
  if(value%100 == 0){
    formatStr = value/100 + ".00";
  }else {
    formatStr = value/100
  }
  return formatStr;
})
//1.取金额 到 精确到元
Vue.filter('formatMoneyByDollar', (value) => {
  var formatStr = 0;
  if(value%100 == 0){
    formatStr = value/100;
  }else {
    formatStr = parseInt(value/100);
  }
  return formatStr;
})
//2.取金额 到 精确到分
Vue.filter('formatMoneyByDollar1', (value) => {
  var formatStr = 0;
  formatStr = value/100;
  return formatStr;
})
//1.优惠卷，只显示角分
Vue.filter('formatMoneyByDollar2', (value) => {
  var formatStr = (value/100).toString();
  if(formatStr.includes(".") == true){
    return "." + formatStr.split(".")[1];
  }else {
    return "";
  }
})
//格式化日期
Vue.filter('formatDate', (value) => {
  var date = new Date(value);
  var strDate = (date.getMonth() + 1) + "-" + ((date.getDate()<10)?"0"+date.getDate():date.getDate()) + " " + date.getHours() + ":" + date.getMinutes();
  return strDate;
})
//格式化日期
Vue.filter('formatDateByFormat', (value, str) => {
  var date = new Date(value);
  return date.Format(str);
})
//优惠券类型
Vue.filter('couponType', value => {
  if(value==='') return
  const list = {1:'单品券',2:'品类券',3:'通用券'}
  return list[value] ? list[value] : ''
})
//自动序号
Vue.filter('sequence', (value) => {
  if((value + 1) < 10){
    return "0" + (value + 1) + ".";
  }else {
    return (value + 1) + ".";
  }
})
//内容为空：暂无
Vue.filter('contentIsEmpty', (value) => {
  if(value == null || value.trim() == ""){
    return '暂无';
  }else {
    return value;
  }
})
//格式化时间（hh:mm:ss）
Vue.filter('formatDuration', (value) => {
  if(value == undefined){
    return '00:00';
  }else {
    return formatDuration(value)
  }
})
//格式化码率显示（1.0x、1.5x）
Vue.filter('playbackRate', (value) => {
  switch (value) {
    case 0.8:
      return '0.8x';
    case 1:
      return '1.0x';
    case 1.5:
      return '1.5x';
    case 2.0:
      return '2.0x';
    default:
      break;
  }
})
