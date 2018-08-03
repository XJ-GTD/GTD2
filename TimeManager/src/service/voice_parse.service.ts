// import { Injectable } from "@angular/core";
// import { Media, MediaObject } from '@ionic-native/media';
// import { Platform } from "ionic-angular";
// import { File } from '@ionic-native/file';
// import {
//   FileTransfer,
//   FileUploadOptions,
//   FileTransferObject,
//   FileUploadResult,
//   FileTransferError
// } from '@ionic-native/file-transfer';
// import { AppConfig } from "../app/app.config";
//
// declare var cordova: any;
//
// @Injectable()
// export class VoiceParseService {
//
//   storageDirectory: string = '';
//   fileName: string = '';
//
//   public voiceStart(platform: Platform, media: Media, file: File, transfer: FileTransfer) {
//
//     platform.ready().then(() => {
//       // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
//       if (!platform.is('cordova')) {
//         return false;
//       }
//
//       if (platform.is('ios')) {
//         this.storageDirectory = cordova.file.tempDirectory;
//       }
//       else if (platform.is('android')) {
//         this.storageDirectory = cordova.file.dataDirectory;
//         this.startRecording_Media(platform, media, file, transfer);
//       }
//       else {
//         // exit otherwise, but you could add further types here e.g. Windows
//         return false;
//       }
//     });
//   }
//
//   // cordova-plugin-media 的使用
//   startRecording_Media(platform: Platform, media: Media, file: File, transfer: FileTransfer) {
//     platform.ready().then(() => {
//
//       let mediaObj;
//       var recordName = "voice.wav";
//       this.fileName = recordName;
//
//       if (platform.is('ios')) {
//         file.createFile(file.documentsDirectory, recordName, true).then(() => {
//           mediaObj = media.create(file.documentsDirectory.replace(/^file:\/\//, '') + recordName);
//           this.doRecord_Media(mediaObj, transfer, file);
//         });
//       } else if (platform.is('android')) {
//
//         mediaObj = media.create(recordName);
//         this.doRecord_Media(mediaObj, transfer, file);
//       } else {
//         alert("Not cordova!");
//         return;
//       }
//     });
//   }
//
//   doRecord_Media(mediaObj: MediaObject, transfer: FileTransfer, file: File) {
//     // 开始录音
//     mediaObj.startRecord();
//
//     // 监测录音状态的回调
//     mediaObj.onStatusUpdate.subscribe(status => this.showRecordStatus(status));
//
//     // 录音成功后的处理，如上传录音
//     // mediaObj.onSuccess.subscribe(() => this.upload(transfer, this.fileName));
//     mediaObj.onSuccess.subscribe(() => mediaObj.play());
//
//     // 录音失败后的处理，如提示错误码
//     mediaObj.onError.subscribe(error => alert('Record fail! Error: ' + error));
//
//     // 设置录音的长度，单位毫秒，ios / android 均有效
//     window.setTimeout(() => mediaObj.stopRecord(), 10 * 1000);
//   }
//
//   // 根据录音状态码返回录音状态的方法
//   showRecordStatus(status) {
//     var statusStr = "";
//     switch (status) {
//       case 0:
//         statusStr = "None";
//         break;
//       case 1:
//         statusStr = "Start";
//         break;
//       case 2:
//         statusStr = "Running";
//         break;
//       case 3:
//         statusStr = "Paused";
//         break;
//       case 4:
//         statusStr = "Stopped";
//         break;
//       default:
//         statusStr = "None";
//     }
//     alert("status: " + statusStr);
//   }
//
//   upload(transfer: FileTransfer, file_path: string) {
//     // ionic 官方文档例子漏写了这句话
//     // http://ionicframework.com/docs/native/file-transfer/
//     //
//
//     // const fileTransfer: FileTransferObject = transfer.create();
//     // // 更多的 Options 可以点进去自己看看，不懂的就谷歌翻译他的注释
//     // let options: FileUploadOptions = {
//     //   fileKey: 'file',
//     //   fileName: this.fileName,  // 文件类型
//     //   mimeType: "audio/wav"
//     // }
//     // alert(file_path);
//     // fileTransfer.upload(file_path, encodeURI(AppConfig.XUNFEI_URL_AUDIO_TRANSLATE), options)
//     //   .then((data) => {
//     //     // success
//     //     alert("上传成功" + data)
//     //   }, (err) => {
//     //     // error
//     //     alert("上传出错" + err.code)
//     //   })
//   }
// }
