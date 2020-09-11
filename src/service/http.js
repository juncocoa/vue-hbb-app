import axios from 'axios'
import { Dialog, Toast } from 'vant';
import { BASE_URL } from '../config'

/**
 * http父类
 */
class Http {
  constructor(BASE_URL, options = {}) {
    if (!BASE_URL) throw Error('need first param BASE_URL ')
    let { headers = {}, auth = false, ...others } = options
    this.auth = auth
    this.agent = axios.create({
      baseURL: BASE_URL,
      headers: {
        // 'Cache-Control': 'max-age=50',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
      },
      ...others
    })
    this.agentFile = axios.create({
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    this.initInterceptors()
  }
  // 初始化拦截器
  initInterceptors() {
    // 请求拦截器，发送请求前执行
    this.agent.interceptors.request.use((config) => {
      if (this.auth) {
        if(sessionStorage.getItem("token") != null){
          config.headers.token = sessionStorage.getItem("token")
        }
      }
      return config
      // 此处可以添加token 到 config.data
    })

    // 响应拦截器，收到数据后执行
    this.agent.interceptors.response.use((res) => {
      return res.data;
    })
  }
  get(url, params = {}) {
    // 如果出错，外层 Promise 会一直处于pending状态
    // getBanner().then(res => console.log(res)).catch(err => console.log(err)) 的 then 和 catch都不会执行
    // 包含 await getBanner() 代码块的下方代码不会被执行
    return new Promise((resolve, reject) => {
      this.agent.get(url, { params })
      .then(res => {
        if (res.code === 200) {
          resolve(res)
        }
      })
      .catch((err) => {
        if(err.response != undefined){
          if(err.response.data.code == 400){
            Dialog({ message: err.response.data.msg });
          }else if(err.response.status == 403){
            Dialog({ message: err.response.data.msg, beforeClose: ()=>{
              sessionStorage.removeItem("token");
              location.href = "/login";
            }});
          }
        }else {
          Dialog({ message: '对不起，网络链接错误' });
        }
        reject(err);
      })
    })
  }
  post(url, params = {}, config = {}) {
    // 同 get 方法
    return new Promise((resolve, reject) => {
      this.agent.post(url, params, config)
      .then((res) => {
        if (res.code === 200) {
          resolve(res);
        }
      })
      .catch((err) => {
        if(err.response != undefined){
          if(err.response.data.code == 400){
            Dialog({ message: err.response.data.msg });
          }else if(err.response.status == 403){
            Dialog({ message: err.response.data.msg, beforeClose: ()=>{
              sessionStorage.removeItem("token");
              location.href = "/login";
            }});
          }
        }else {
          Dialog({ message: '对不起，网络链接错误' });
        }
        reject(err);
      })
    })
  }
  delete(url, params = {}) {
    return new Promise((resolve, reject) => {
      this.agent.delete(url, { data: params })
      .then(res => {
        if (res.code === 200) {
          resolve(res)
        }
      })
      .catch((err) => {
        if(err.response != undefined){
          if(err.response.data.code == 400){
            Dialog({ message: err.response.data.msg });
          }else if(err.response.status == 403){
            Dialog({ message: err.response.data.msg, beforeClose: ()=>{
              sessionStorage.removeItem("token");
              location.href = "/login";
            }});
          }
        }else {
          Dialog({ message: '对不起，网络链接错误' });
        }
        reject(err);
      })
    })
  }
  put(url, params = {}) {
    return new Promise((resolve, reject) => {
      this.agent.put(url, params)
      .then(res => {
        if (res.code === 200) {
          resolve(res)
        }
      })
      .catch((err) => {
        if(err.response != undefined){
          if(err.response.data.code == 400){
            Dialog({ message: err.response.data.msg });
          }else if(err.response.status == 403){
            Dialog({ message: err.response.data.msg, beforeClose: ()=>{
              sessionStorage.removeItem("token");
              location.href = "/login";
            }});
          }
        }else {
          Dialog({ message: '对不起，网络链接错误' });
        }
        reject(err);
      })
    })
  }
  postFileUpload(url, params = {}, config = {}) {
    // 同 get 方法
    return new Promise((resolve, reject) => {
      this.agentFile.post(url, params, config)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        Toast.clear();
        Dialog({ message: '对不起，文件上传失败。' });
      })
    })
  }
}

/**
 * http子类
 */
class HomeService extends Http {
  constructor(options = {}) {
    super(BASE_URL, options)
  }
  // 针对该 class 初始化拦截器
  // initInterceptors() {
  //   // 请求拦截器，发送请求前执行
  //   this.agent.interceptors.request.use((config) => {
  //     // console.log(config)
  //     // 此处可以添加token 到 config.data
  //   })

  //   // 响应拦截器，收到数据后执行
  //   this.agent.interceptors.response.use((res) => {
  //     // console.log(res)
  //   })
  // }
}

const service = new HomeService({ auth: true })

export {
  Http,
  service
}
