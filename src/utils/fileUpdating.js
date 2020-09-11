import * as axios from 'axios';
import OSS from 'ali-oss';
// import moment from 'moment';
import { Toast } from 'vant';

// 大文件上传(MP4)
export function checkedFileMD5ByMP4(that, file){
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
      chunkSize = 2097152,                             // Read in chunks of 2MB
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        spark.append(e.target.result);                   // Append array buffer
        let fileMD5 = spark.end();
        currentChunk++;

        if(currentChunk < chunks){
          loadNext();
        } else {
          axios.get(`${GLOBAL.baseURL.IP2}/api/manage/upload/status?MD5=${fileMD5}`).then((response)=>{
            if(response.data.code == 200){
              let mediaInfo = response.data.data.mediaInfo;
              if(mediaInfo.isExist){
                //文件已存在
                that.sendFileMsg(mediaInfo.url, file);
              } else {
                //文件不存在，上传阿里云
                let serverAccess = {
                  accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                  accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                  stsToken: mediaInfo.stsToken.credentials.securityToken,
                  bucket: mediaInfo.stsToken.bucket,
                  region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
                }
                let updateFile = OSS({
                  ...serverAccess,
                  secure: true,
                  useFetch: true,
                  timeout: 3600000  //一个小时
                });
                updateFile.multipartUpload(getUUID(file.name), file, {
                  parallel: 4,
                  partSize: 1024 * 1024,
                  mime: file.type,
                  progress: function (p, cpt, res) {
                    that.maskLoading = '上传中，请稍后...' + parseInt(p*100) + ' %';
                  }
                }).then(function (result) {
                  if(result.res.requestUrls[0].includes('?uploadId') == true){
                    var paramData = {
                      MD5: fileMD5,
                      url: result.res.requestUrls[0].substr(0, result.res.requestUrls[0].indexOf('?uploadId'))
                    }
                    uploadMP4Info(that, paramData, file);
                  }else {
                    var paramData = {
                      MD5: fileMD5,
                      url: result.res.requestUrls[0]
                    }
                    uploadMP4Info(that, paramData, file);
                  }
                }).catch(function (err) {
                  that.showOverlay = false; Toast('发送失败（文件上传问题）');
                });
              }
            }else {
              that.showOverlay = false; Toast('发送失败');
            }
          }).catch(function(err){
            that.showOverlay = false;
            Toast('发送失败（文件效验问题）');
          });
        }
      }
      fileReader.onerror = (err) => {
        that.showOverlay = false;
        Toast('发送失败（文件读取失败）');
      }
      function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
}

//大文件回调存档（MP4）
function uploadMP4Info(that, paramData, file){
  axios.post(`${GLOBAL.baseURL.IP2}/api/manage/upload/fileinfo`, paramData, {headers: {token: sessionStorage.getItem("token")}})
  .then((response)=>{
    if(response.data.code == 200){
      that.sendFileMsg(response.data.data.url, file);
    }else {
      that.showOverlay = false; Toast('发送失败');
    }
  }).catch(function(err){
    that.showOverlay = false;
    Toast('发送失败（文件记录失败）');
  });
}

//获取 File UUID
function getUUID(filename) {
  var mydate = new Date();
  var random = Math.floor(Math.random () * 900) + 100;
  var uuid = "file" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds() + random;
  //文件扩展名
  var index = filename.lastIndexOf(".");
  var suffix = filename.substr(index);
  return uuid + suffix;
}
