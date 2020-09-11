import { service } from './http'

const fileUpload = (data) => service.postFileUpload('https://appupload.hbbclub.com/api/oss/upload', data) //文件上传到 阿里云

export {
  fileUpload
}
