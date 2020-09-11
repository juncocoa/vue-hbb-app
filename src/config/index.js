// pxToRem rootValue
// 此处的rootValue应该与 vue.config.js中的rootValue一致
const rootValue = 50

var BASE_URL = 'http://192.168.100.235:8888'  //小春春 测试服务器
window.CallbackURL = "http://192.168.100.87:8080"; //微信登入回调
window.GLOBAL = {
  baseURL: {
    IP2: 'http://screentest.hbbclub.com', //彭博文件校验(阿里云)
  }
}; 

let location = null;
if ('location' in window) {
  location = window.location
}

if (location) {
  let hostname = location.hostname
  if (hostname.includes("192.168.100.87") == true || hostname.includes("localhost") == true) {
    BASE_URL = 'http://192.168.100.235:8888'; // 测试服务器地址  199(York)
    window.CallbackURL = "http://192.168.100.235:8020"; //微信登入回调
  } else if (hostname.includes("fenxiaoh5.hbbclub.com")) {
    BASE_URL = 'http://fenxiaoserver.hbbclub.com'; // 正式服务器地址
    window.CallbackURL = "http://fenxiaoh5.hbbclub.com"; //微信登入回调(fenxiaoh5.hbbclub.com)
  }
}

export {
  BASE_URL,
  rootValue
}
