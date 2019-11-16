import {Component} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ActionSheetController,
} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {File} from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Chooser} from '@ionic-native/chooser';
import {FileOpener} from '@ionic-native/file-opener';
import {FilePath} from '@ionic-native/file-path';
import {EventService, FjData, CacheFilePathJson, Attachment, Member,generateCacheFilePathJson} from "../../service/business/event.service";
import {UtilService} from "../../service/util-service/util.service";
import * as moment from "moment";
import {DelType, SyncType} from "../../data.enum";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {DataRestful,DownloadInData} from "../../service/restful/datasev";

@IonicPage()
@Component({
  selector: 'page-attach',
  template: `

    <modal-box title="补充信息" [buttons]="buttons" (onCancel)="cancel()" (onCreate)="openselect()"  (onRefresh)="flushData()">

      <ion-toolbar>
        <ion-buttons end>
          <button ion-button outline (click)="saveComment()" class="font-normal">
            <ion-icon class="fad fa-comments"></ion-icon>
          </button>

        </ion-buttons>
        <ion-textarea row="2" [(ngModel)]="bw" placeholder="输入补充信息" class="font-normal"></ion-textarea>
      </ion-toolbar>
      <ion-scroll scrollY="true" scrollheightAuto>

        <ion-grid class="list-grid-content">
          <ng-container  *ngFor="let fja of fjArray">
            <ion-row class="item-content item-content-backgroud" leftmargin toppaddingsamll bottompaddingsamll rightmargin
                     *ngIf="fja.del != deleted" >
              <div class="line font-normal topheader" leftmargin rightmargin >
                <div class="st font-small"> {{fja.wtt * 1000 | transfromdate:'withNow'}}</div>
                <div class="person font-small" *ngIf="fja.ui!=currentuser" end>---{{fja.ui | formatuser: currentuser: friends}}</div>
              </div>
              <div class="line font-normal" leftmargin rightmargin >
                <div class="sn towline">{{(fja.tb == synch? "" : "[*] ") + fja.fjn}}</div>
              </div>
              <div class="line font-normal" leftmargin rightmargin >
                <div *ngIf="(fja.ext=='PDF'||fja.ext=='pdf')&& (fja.fj !='')" >
                  <ion-icon class="fas fa-file-pdf" (click)="opnePdf(fja.fjurl,fja.ext)"></ion-icon>
                </div>
                <div *ngIf="(fja.ext=='png'||fja.ext=='PNG'||fja.ext=='jpg'||fja.ext=='JPG'||fja.ext=='bmp'||fja.ext=='BMP')&& (fja.fj !='')">
                      <ion-thumbnail (click)="photoShow(fja.fjurl)">
                        <img  *ngIf="fja.fjurl!=''" src="{{fja.fjurl}}" />
                        <img  *ngIf="fja.fjurl ==''" src="{{defaultimg}}" />
                      </ion-thumbnail>
                </div>
                <div *ngIf="(fja.ext=='mp4'||fja.ext=='MP4')&& (fja.fj !='')">
                    <ion-icon class="fas fa-file-pdf" (click)="opnePdf(fja.fjurl,fja.ext)"></ion-icon>
                </div>
                <div *ngIf="(fja.ext=='mp3'||fja.ext=='MP3')&& (fja.fj !='')">
                    <ion-icon class="fas fa-file-pdf" (click)="opnePdf(fja.fjurl,fja.ext)"></ion-icon>
                </div>
                <div *ngIf="(fja.ext=='doc'||fja.ext=='DOC'||fja.ext=='xls'||fja.ext=='XLS'||fja.ext=='ppt'||fja.ext=='PPT'||fja.ext=='DOCX'||fja.ext=='docx'
                  ||fja.ext=='xlsx'||fja.ext=='XLSX'||fja.ext=='PPTX'||fja.ext=='pptx')&& (fja.fj !='')">
                    <ion-icon class="fas fa-file-pdf" (click)="opnePdf(fja.fjurl,fja.ext)"></ion-icon>
                </div>
                <div *ngIf="(fja.ext=='txt'||fja.ext=='TXT')&& (fja.fj !='')">
                    <ion-icon class="fas fa-file-pdf" (click)="opnePdf(fja.fjurl,fja.ext)"></ion-icon>
                </div>

                <div class="icon" *ngIf="fja.ui == currentuser" end>
                  <ion-icon class="fal fa-minus-circle" (click)="delAttach(fja)"></ion-icon>
                </div>
              </div>
            </ion-row>
          </ng-container>
        </ion-grid>
      </ion-scroll>
    </modal-box>
  `
})

export class AttachPage {
  statusBarColor: string = "#3c4d55";
  imgUrl: string = "";
  fjArray: Array<Attachment> = new Array<Attachment>();
  fjData: Attachment = {} as Attachment;
  obt: string = "";
  obi: string = "";
  bw: string = "";
  browserurl: string ="http://pluto.guobaa.com/abl/store/local/getContent/";
  members: Array<Member>  = new Array<Member>();
  buttons: any = {
    create: true,
    save: false,
    cancel: true,
    refresh:true
  };
  defaultimg: string = DataConfig.HUIBASE64_LARGE;

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;

  deleted: DelType = DelType.del;

  synch: SyncType = SyncType.synch;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private file: File,
              private camera: Camera,
              private chooser: Chooser,
              private transfer: FileTransfer,
              private filePath: FilePath,
              private eventService: EventService,
              private keyboard: Keyboard,
              private fileOpener: FileOpener,
              private actionSheetCtrl: ActionSheetController,
              private dataRestful: DataRestful,
              private util:UtilService) {
    if (this.navParams && this.navParams.data) {
      this.obt = this.navParams.data.obt;
      this.obi = this.navParams.data.obi;
      this.fjArray = this.navParams.data.attach;
      this.members  = this.navParams.data.members;

      this.fjData.obt = this.obt;
      this.fjData.obi = this.obi;
      // this.currentuser = this.navParams.data.userId
    }
    //验证缓存文件目录是否存在
    if (this.util.hasCordova()) {
      this.file.checkDir(this.file.dataDirectory, '/cachefiles')
      .then(_ => console.log('Directory exists'))
      .catch(err => {
        //alert("检查文件夹不存在："+err);
        //alert("开始创建文件，文件路径："+this.file.externalDataDirectory+"/cached");
        this.file.createDir(this.file.dataDirectory, "cachefiles", true).then(result => {
          console.log("success");
          //alert("文件路径创建成功");
        }).catch(err => {
          console.log("err:" + JSON.stringify(err));
          //alert("文件路径创建失败");
        })
      });
    }

    //调用刷新
    this.flushData();

    // 不进行自动下载
    // for (let attachment of this.fjArray) {
    //   attachment.members = this.members;
    //
    //   // 判断是否是残留数据或文字附件
    //   if (attachment.ext) {
    //     if (this.util.isJsonString(attachment.fj)) {
    //         attachment.fpjson = generateCacheFilePathJson(attachment.fpjson, attachment.fj);
    //
    //         // 附件存储JSON是否存在
    //         if (attachment.fpjson && attachment.fpjson.remote) {
    //           attachment.fjurl = this.browserurl + attachment.fpjson.remote;
    //
    //           // 判断是否是手机
    //           if (this.util.hasCordova()) {
    //             let fileName: string  = attachment.fpjson.local.substr(1, attachment.fpjson.local.length);
    //
    //             // 本地文件存在，页面上显示本地文件, 无法形成同步，只能异步改变fjArray
    //             this.file.checkFile(this.file.dataDirectory + attachment.fpjson.getCacheDir(), fileName)
    //             .then(_ => {
    //               attachment.fjurl = attachment.fpjson.getLocalFilePath(this.file.dataDirectory);
    //             });
    //           }
    //         }
    //     } else {
    //       //历史遗留数据构造
    //       attachment.fjurl = attachment.fj;
    //     }
    //   }
    // }

    // for(let i: number =0; i<this.fjArray.length; i++) {
    //     this.fjArray[i].members = this.members;
    //
    //     if (this.fjArray[i].ext) {
    //       //处理历史遗留数据，按照原来的显示
    //       if (this.util.isJsonString(this.fjArray[i].fj)) {
    //         //获取新赋值
    //         let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
    //         this.fjArray[i].fpjson = generateCacheFilePathJson(this.fjArray[i].fpjson, this.fjArray[i].fj);
    //         //目前直接在该页面直接存储附件，则直接将文件位置赋值给
    //         this.fjArray[i].fjurl =this.browserurl+this.fjArray[i].fpjson.remote;
    //
    //         //检查该文件夹下是否存在该文件，如果不存在，则根据remote下载同步该文件
    //         if (this.fjArray[i].fpjson) {
    //           if (this.util.hasCordova()) {
    //             let fileName: string  = this.fjArray[i].fpjson.local.substr(1,this.fjArray[i].fpjson.local.length);
    //             this.file.checkFile(this.file.dataDirectory+this.fjArray[i].fpjson.getCacheDir(),fileName)
    //             .then(_ => {
    //               // 文件存在
    //               this.fjArray[i].fjurl = this.fjArray[i].fpjson.getLocalFilePath(this.file.dataDirectory);
    //             })
    //             .catch(err => {
    //                 //根据remote 拉取文件
    //                 // if (this.fjArray[i].fpjson.remote) {
    //                 //   //根据地址拉取文件
    //                 //   //验证是否为浏览器
    //                 //   if (this.util.hasCordova()) {
    //                 //     //拉取数据
    //                 //     let downloadInData : DownloadInData = new DownloadInData();
    //                 //     downloadInData.id = this.fjArray[i].fpjson.remote;
    //                 //     downloadInData.filepath = this.file.dataDirectory+this.fjArray[i].fpjson.getCacheDir();
    //                 //     this.dataRestful.download(downloadInData);
    //                 //   } else {
    //                 //     this.fjArray[i].fjurl =this.browserurl+this.fjArray[i].fpjson.remote;
    //                 //   }
    //                 // }
    //             });
    //           } else {
    //             this.fjArray[i].fjurl =this.browserurl+this.fjArray[i].fpjson.remote;
    //           }
    //         } else {
    //           if (this.fjArray[i].fpjson.remote) {
    //             //根据地址拉取文件
    //             if (this.util.hasCordova()) {
    //               //拉取数据
    //               let downloadInData : DownloadInData = new DownloadInData();
    //               downloadInData.id = this.fjArray[i].fpjson.remote;
    //               downloadInData.filepath = this.file.dataDirectory+this.fjArray[i].fpjson.getCacheDir();
    //               this.dataRestful.download(downloadInData);
    //             } else {
    //               this.fjArray[i].fjurl =this.browserurl+this.fjArray[i].fpjson.remote;
    //             }
    //           }
    //         }
    //       }
    //       else {
    //         //历史遗留数据构造
    //         this.fjArray[i].fjurl = this.fjArray[i].fj;
    //         this.fjArray[i].members = this.members;
    //       }
    //     }
    //   }

  }


  ionViewDidEnter() {

  }

  openimg(url){
    this.util.photoViews(url);
  }


  openselect() {
    const actionSheet = this.actionSheetCtrl.create({
      title: "选择补充文件",
      cssClass: "page-attach",
      buttons: [
        {
          text: '拍照',
          role: 'camera',
          icon: "ios-camera",
          cssClass: "cameraXX",
          handler: () => {
            this.shot();
          }
        }, {
          text: '相册',
          role: 'albums',
          icon: "ios-albums",
          handler: () => {
            this.select();
          }
        }
      ]
    });
    actionSheet.present();
  }

  cancel() {
    let data: Object = {attach: this.fjArray.filter((ele) => {
      return ele.del != DelType.del;
    })};
    this.viewCtrl.dismiss(data);
  }

  /**
   * 拍照  ying<343253410@qq.com>
   */
  shot() {
    const options: CameraOptions = {
      quality: 95,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA, //打开方式 PHOTOLIBRARY  相册 CAMERA  拍照
      saveToPhotoAlbum: true //是否保存相册
    }
    this.camera.getPicture(options).then((imageData) => {
      console.info("开始拍照上传照片");
      //let fjData: FjData = {} as FjData;
      if (imageData != '') {

        let fileName: string = imageData.substr(imageData.lastIndexOf("/") + 1, imageData.length);
        let ext: string = fileName.substr(fileName.lastIndexOf(".") + 1);
        //将文件copy至缓存文件
        let imgFileDir: string = imageData.substr(0, imageData.lastIndexOf("/") + 1);
        let newFileName = this.util.getUuid()+"."+ext;
        this.fjData.obt = this.obt;
        this.fjData.obi = this.obi;
        this.fjData.fjn = newFileName;
        this.fjData.ext = ext;
        //构造地址文件
        let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
        cacheFilePathJson.local = "/"+newFileName;
        //this.fjData.fj = this.file.externalDataDirectory + "/timeAppfile/" + fileName;
        this.fjData.fj = JSON.stringify(cacheFilePathJson);
        this.fjData.fpjson = cacheFilePathJson;
        this.fjData.fjurl = this.fjData.fpjson.getLocalFilePath(this.file.dataDirectory);
        this.fjData.ui = this.currentuser;
        this.fjData.del = DelType.undel;
        this.fjData.tb = SyncType.unsynch;
        this.fjData.wtt = moment().unix();
        this.fjData.members = this.members;
        if(!this.bw) {
          this.bw = fileName;
        }
        this.file.copyFile(imgFileDir, fileName, this.file.dataDirectory + cacheFilePathJson.getCacheDir(), newFileName);

      }
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.imgUrl = base64Image;
      // alert(this.imgUrl);
      //TODO  调研图片上传的Service,并将附件的返回值返回给上一页
      //this.upload();
    }, (err) => {
      console.info("拍照上传附件异常，异常信息：" + err);
    });
  }

  /**
   * 文件上传  ying<343253410@qq.com>
   */
  select() {


    this.chooser.getFile('*/*').then((file) => {
        this.filePath.resolveNativePath(file.uri)
          .then((filePath) => {
            //alert("选择的PDF文件filePath："+JSON.stringify(filePath));
            if (filePath != '') {
              let fileName: string = filePath.substr(filePath.lastIndexOf("/") + 1, filePath.length);
              let ext: string = fileName.substr(fileName.lastIndexOf(".") + 1);
              let imgFileDir: string = filePath.substr(0, filePath.lastIndexOf("/") + 1);
              let newFileName = this.util.getUuid()+"."+ext;
              // let fjData: FjData = {} as FjData;
              this.fjData.obt = this.obt;
              this.fjData.obi = this.obi;
              this.fjData.fjn = newFileName;
              this.fjData.ext = ext;
              this.fjData.ui = this.currentuser;
              this.fjData.del = DelType.undel;
              this.fjData.tb = SyncType.unsynch;
              this.fjData.wtt = moment().unix();
              let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
              cacheFilePathJson.local = "/"+newFileName;
              this.fjData.fj = JSON.stringify(cacheFilePathJson);
              this.fjData.fpjson = cacheFilePathJson;
              this.fjData.fjurl = this.fjData.fpjson.getLocalFilePath(this.file.dataDirectory);
              this.fjData.members = this.members;
              //this.fjData.fj = this.file.externalDataDirectory + "/timeAppfile/" + fileName;
              //this.fjArray.push(fjData);
              if(!this.bw) {
                this.bw = fileName;
              }
              //alert("存储值："+JSON.stringify(this.fjData));
              this.file.copyFile(imgFileDir, fileName, this.file.dataDirectory + cacheFilePathJson.getCacheDir(), newFileName);
            }
          })
          .catch(err => console.log(err));
      }
    )
      .catch((error: any) => console.error(error));
  }

  /**
   * 调用文件上传接口
   */
  upload() {
    let fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',
      headers: {},
      params: {}
    }

    fileTransfer.upload(this.imgUrl, 'http://www.baidu.com', options).then((data) => {
      // success
      console.info("上传成功" + JSON.stringify(data));
    }, (err) => {
      // error
      console.info("上传失败" + JSON.stringify(err));
    })
  }

  // 点击确认，保存文件
 async saveComment() {
    if (this.bw && this.bw.trim() != '') {
      this.fjData.fjn = this.bw;
      this.fjData.ui = this.currentuser;
      this.fjData.del = DelType.undel;
      this.fjData.tb = SyncType.unsynch;
      this.fjData.wtt = moment().unix();
      this.fjData.members = this.members;
      //1.对当前数据进行存储
      let retAt: Attachment = {}  as Attachment;
      this.util.loadingStart();
      retAt = await this.eventService.saveAttachment(this.fjData);
      this.util.loadingEnd();
      //alert("上传后的数据："+JSON.stringify(retAt));
      this.fjArray.unshift(retAt);
      this.fjData = {} as Attachment;
      this.fjData.obt = this.obt;
      this.fjData.obi = this.obi;
      this.bw = "";
    }
  }

  // 删除当前项
  async delAttach(at: Attachment) {
    if (at) {
      await this.eventService.removeAttachment(at);
    }
  }
  //打开本地PDF
  opnePdf(fj: string, fileType: string) {
    this.fileOpener.open(fj,this.getFileMimeType(fileType))
    .then(() => console.info('File is opened'))
    .catch(e => console.info('Error opening file', e));
  }
  //放大图片
  photoShow(fj: string) {
      this.util.photoViews(fj);
  }
  //刷新数据
  async flushData() {
    //清空数据
    this.fjArray = new Array<Attachment>();
    let attachments: Array<Attachment> = new Array<Attachment>();
    attachments = await this.eventService.selectAttachments(this.obt,this.obi);
    //alert("刷新查询数据："+JSON.stringify(attachments))
    for (let attachment of attachments) {
      attachment.members = this.members;
      // 判断是否是残留数据或文字附件
      if (attachment.ext) {
        if (this.util.isJsonString(attachment.fj)) {
            attachment.fpjson = generateCacheFilePathJson(attachment.fpjson, attachment.fj);
            // 附件存储JSON是否存在
            if (attachment.fpjson && attachment.fpjson.remote) {
              attachment.fjurl = this.browserurl + attachment.fpjson.remote;
              // 判断是否是手机
              if (this.util.hasCordova()) {
                //alert("进入真机测试模式");
                let fileName: string  = attachment.fpjson.local.substr(1, attachment.fpjson.local.length);
                //alert("fileName："+fileName);
                // 本地文件存在，页面上显示本地文件
                //let checked = await this.file.checkFile(this.file.dataDirectory + attachment.fpjson.getCacheDir(), fileName);
                let checked =  await this.isExistFile(attachment.fpjson.getCacheDir(), fileName);
                //alert("刷新验证存在本地文件:"+checked);
                if (checked == true) {
                  attachment.fjurl = attachment.fpjson.getLocalFilePath(this.file.dataDirectory);
                }
              }
            }
        } else {
          //历史遗留数据构造
          attachment.fjurl = attachment.fj;
        }
      }
    }
    //alert("循环结束attachments："+JSON.stringify(attachments));
    this.fjArray = attachments;
    //alert("循环结束this.fjArray："+JSON.stringify(this.fjArray));
  }

  //获取打开的文件类型
  getFileMimeType(fileType: string): string {
    let mimeType: string = '';
    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      // case 'mp4':
      //     mimeType = 'video/mp4';
      //     break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }

  isExistFile(dir:string, fileName:string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        this.file.checkFile(this.file.dataDirectory + dir, fileName).then(_=>{
          resolve(true);
        }).catch(err => {
           resolve(false);
        });
      });
  }

}
