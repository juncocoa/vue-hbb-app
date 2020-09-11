import { rootValue } from '../config'

export const pxToRem = (px) => {
  let p = px
  let html = document.getElementById('html')
  let rootFontSize = window.getComputedStyle(html, null)['fontSize']

  if (typeof p === 'string') {
    p = p.substring(0, p.length - 2)
  }

  // return `${p * (parseInt(rootFontSize) / rootValue) / rootValue}rem`
  return `${p / rootValue}rem`
}
//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//数组是否包含 val 值
Array.prototype.contains = function ( val ) {
  for (var i = 0; i < this.length; i++) {
      if(this[i] == val){
          return false;
          break;
      }
  }
  return true;
}
//对象深拷贝
Object.deepClone = function( obj ){
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = Object.deepClone(obj[key]);   //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
Array.prototype.unique = function(){
     let result = {};
     let finalResult = [];
     for(let i = 0; i < this.length; i++){
         result[this[i].date] = this[i];
     }
     for(item in result){
         finalResult.push(result[item]);
     }
     return finalResult;
}
String.prototype.bool = function() {
    return (/^true$/i).test(this);
};

export const formatDuration = (value) => {
  if(value == null || typeof(value) != 'number'){return '00:00';}
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  if (theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
      }
  }

  var result = "" + parseInt(theTime);//秒
  if (10 > theTime > 0) {
      result = "0" + parseInt(theTime);//秒
  } else {
      result = "" + parseInt(theTime);//秒
  }

  if (10 > theTime1 > 0) {
      result = "0" + parseInt(theTime1) + ":" + result;//分，不足两位数，首位补充0，
  } else {
      result = "" + parseInt(theTime1) + ":" + result;//分
  }
  if (theTime2 > 0) {
      result = "" + parseInt(theTime2) + ":" + result;//时
  }
  return result;
}
