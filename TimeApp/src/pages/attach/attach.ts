import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams,ViewController, ActionSheetController} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {File} from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Chooser} from '@ionic-native/chooser';
import {FileOpener} from '@ionic-native/file-opener';
import {FilePath} from '@ionic-native/file-path';
import { EventService, FjData, CacheFilePathJson,Attachment, Member,generateCacheFilePathJson} from "../../service/business/event.service";
import {UtilService} from "../../service/util-service/util.service";
import {DelType, PageDirection, SyncType} from "../../data.enum";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {DataRestful, DownloadInData} from "../../service/restful/datasev";
import {NativeAudio} from "@ionic-native/native-audio";
import BScroll from "better-scroll";

@IonicPage()
@Component({
  selector: 'page-attach',
  template: `

    <modal-box title="补充信息" [buttons]="buttons" (onCancel)="cancel()">

      <div scrollheightAuto class="dataWapper">
          <ion-grid class="list-grid-content">
            <ng-container *ngFor="let fja of fjArray">
              <ion-row class="item-content item-content-backgroud" leftmargin toppaddingsamll bottompaddingsamll
                       rightmargin
                       *ngIf="fja.del != deleted">

                <div class="line font-normal topheader" leftmargin rightmargin>
                  <div class="other">
                    <div class="person  font-normal" class="person font-small"
                         *ngIf="fja.ui!=currentuser">{{fja.ui | formatuser: currentuser: friends}}</div>
                  </div>
                  <div class="st font-small"> {{fja.wtt * 1000 | transfromdate:'withNow'}}</div>
                  <div class="self" (click)="delAttach(fja)">
                    <ion-icon class="fal fa-minus-circle" *ngIf="fja.ui==currentuser"></ion-icon>
                    <div class="{{fja.fji}}" class="person font-normal" *ngIf="fja.ui==currentuser">自己</div>
                  </div>
                </div>
                <div class="line font-normal" leftmargin rightmargin>
                  <div class="attcomment" [class.selfattcomment]="fja.ui==currentuser"
                       [class.otherwarpattcomment]="fja.ui!=currentuser">
                    <div class="sn borderback">
                      <span>{{fja.fjn}}</span>
                      <ion-thumbnail (click)="photoShow(fja.fjurl)"
                                     *ngIf="(fja.ext=='png'||fja.ext=='PNG'||fja.ext=='jpg'||fja.ext=='JPG'||fja.ext=='bmp'||fja.ext=='BMP')&& (fja.fj !='')">
                        <img *ngIf="fja.fjurl!=''" src="{{fja.fjurl}}"/>
                        <img *ngIf="fja.fjurl ==''" src="{{defaultimg}}"/>
                      </ion-thumbnail>
                      <div *ngIf="(fja.ext=='PDF'||fja.ext=='pdf')&& (fja.fj !='')"
                           (click)="openPdf(fja.fjurl,fja.ext,fja.fji)">
                        <ion-icon class="fas fa-file-pdf"></ion-icon>
                      </div>
                      <div *ngIf="(fja.ext=='mp4'||fja.ext=='MP4')&& (fja.fj !='')"
                           (click)="openPdf(fja.fjurl,fja.ext,fja.fji)">
                        <ion-icon class="fas fa-file-audio"></ion-icon>
                      </div>
                      <div *ngIf="(fja.ext=='mp3'||fja.ext=='MP3')&& (fja.fj !='')"
                           (click)="openPdf(fja.fjurl,fja.ext,fja.fji)">
                        <ion-icon class="fas fa-file-music"></ion-icon>
                      </div>
                      <div *ngIf="(fja.ext=='doc'||fja.ext=='DOC'||fja.ext=='xls'||fja.ext=='XLS'||fja.ext=='ppt'||fja.ext=='PPT'||fja.ext=='DOCX'||fja.ext=='docx'
                  ||fja.ext=='xlsx'||fja.ext=='XLSX'||fja.ext=='PPTX'||fja.ext=='pptx')&& (fja.fj !='')"
                           (click)="openPdf(fja.fjurl,fja.ext,fja.fji)">
                        <ion-icon class="fas fa-file-powerpoint"></ion-icon>
                      </div>
                      <div *ngIf="(fja.ext=='txt'||fja.ext=='TXT')&& (fja.fj !='')"
                           (click)="openPdf(fja.fjurl,fja.ext,fja.fji)">
                        <ion-icon class="fas fa-file-plus"></ion-icon>
                      </div>
                    </div>

                  </div>

                </div>
              </ion-row>
            </ng-container>
          </ion-grid>
        <div class="pulldown-wrapper" style="top: -50px;"><div class="before-trigger">刷新中</div></div>
      </div>
      <div class="inputwarp">
        <ion-toolbar>
          <ion-buttons start>
            <button ion-button outline (click)="openselect()" class="font-normal">
              <ion-icon class="fad fa-plus-square"></ion-icon>
            </button>
          </ion-buttons>
          <ion-buttons end>
            <button ion-button outline (click)="saveComment()" class="font-normal">
              发送
            </button>
          </ion-buttons>
          <ion-input [(ngModel)]="bw" class="font-normal"></ion-input>
        </ion-toolbar>
      </div>
    </modal-box>

  `
})

export class AttachPage {
  imgUrl: string = "";
  fjArray: Array<Attachment> = new Array<Attachment>();
  fjData: Attachment = {} as Attachment;
  obt: string = "";
  obi: string = "";
  bw: string = "";
  //原图
  browserurlBig: string = "http://pluto.guobaa.com/abl/store/local/getContent/";
  //缩略图
  browserurl: string = "http://pluto.guobaa.com/abl/store/local/getSnapshot/";
  members: Array<Member> = new Array<Member>();
  buttons: any = {
    cancel: true,
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
              private nativeAudio: NativeAudio,
              private changeDetectorRef: ChangeDetectorRef,
              private util: UtilService) {
    if (this.navParams && this.navParams.data) {
      this.obt = this.navParams.data.obt;
      this.obi = this.navParams.data.obi;
      this.fjArray = this.navParams.data.attach;
      this.members = this.navParams.data.members;

      this.fjData.obt = this.obt;
      this.fjData.obi = this.obi;
    }
    //验证缓存文件目录是否存在
    if (this.util.hasCordova()) {
      this.file.checkDir(this.file.dataDirectory, '/cachefiles')
        .then(_ => console.log('Directory exists'))
        .catch(err => {
          this.file.createDir(this.file.dataDirectory, "cachefiles", true).then(result => {
            console.log("success");
            //alert("文件路径创建成功");
          }).catch(err => {
            console.log("err:" + JSON.stringify(err));
            //alert("文件路径创建失败");
          })
        });
    }

  }

  bscroll:BScroll;
  ionViewDidEnter() {
    this.flushData().then(()=>{
      this.bscroll = new BScroll('.dataWapper', {
        click: true,
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        },
        scrollY:true
      });
      this.bscroll.on("pullingDown",()=>{
        //调用刷新
        this.flushData().then(()=>{
          this.changeDetectorRef.detectChanges();
          this.bscroll.refresh();
          this.bscroll.finishPullDown();
        })
      });
    });
  }

  openimg(url) {
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
    let data: Object = {
      attach: this.fjArray.filter((ele) => {
        return ele.del != DelType.del;
      })
    };
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
      if (imageData != '') {

        let fileName: string = imageData.substr(imageData.lastIndexOf("/") + 1, imageData.length);
        let ext: string = fileName.substr(fileName.lastIndexOf(".") + 1);
        //将文件copy至缓存文件
        let imgFileDir: string = imageData.substr(0, imageData.lastIndexOf("/") + 1);
        let newFileName = this.util.getUuid() + "." + ext;
        this.fjData.obt = this.obt;
        this.fjData.obi = this.obi;
        this.fjData.fjn = newFileName;
        this.fjData.ext = ext;
        //构造地址文件
        let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
        cacheFilePathJson.local = "/" + newFileName;
        this.fjData.fj = JSON.stringify(cacheFilePathJson);
        this.fjData.fpjson = cacheFilePathJson;
        this.fjData.fjurl = this.fjData.fpjson.getLocalFilePath(this.file.dataDirectory);
        this.fjData.ui = this.currentuser;
        this.fjData.members = this.members;
        // if(!this.bw) {
        //   this.bw = fileName;
        // }
        this.file.copyFile(imgFileDir, fileName, this.file.dataDirectory + cacheFilePathJson.getCacheDir(), newFileName).then(_ => {
          this.saveFile();
        });
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
            if (filePath != '') {
              let fileName: string = filePath.substr(filePath.lastIndexOf("/") + 1, filePath.length);
              let ext: string = fileName.substr(fileName.lastIndexOf(".") + 1);
              let imgFileDir: string = filePath.substr(0, filePath.lastIndexOf("/") + 1);
              let newFileName = this.util.getUuid() + "." + ext;
              this.fjData.obt = this.obt;
              this.fjData.obi = this.obi;
              this.fjData.fjn = newFileName;
              this.fjData.ext = ext;
              this.fjData.ui = this.currentuser;
              let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
              cacheFilePathJson.local = "/" + newFileName;
              this.fjData.fj = JSON.stringify(cacheFilePathJson);
              this.fjData.fpjson = cacheFilePathJson;
              this.fjData.fjurl = this.fjData.fpjson.getLocalFilePath(this.file.dataDirectory);
              this.fjData.members = this.members;
              // if(!this.bw) {
              //   this.bw = fileName;
              // }
              this.file.copyFile(imgFileDir, fileName, this.file.dataDirectory + cacheFilePathJson.getCacheDir(), newFileName).then(_ => {
                this.saveFile();
              });
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
      this.fjData.members = this.members;
      //1.对当前数据进行存储
      let retAt: Attachment = {} as Attachment;
      this.util.loadingStart();
      retAt = await this.eventService.saveAttachment(this.fjData);
      //alert("上传返回值："+JSON.stringify(retAt));
      this.util.loadingEnd();
      this.fjArray.unshift(retAt);
      this.fjData = {} as Attachment;
      this.fjData.obt = this.obt;
      this.fjData.obi = this.obi;
      this.bw = "";
    }
  }

  //保存文件
  async saveFile() {
    this.util.loadingStart();
    let retAt: Attachment = {} as Attachment;
    retAt = await this.eventService.saveAttachment(this.fjData);
    this.fjArray.unshift(retAt);
    this.util.loadingEnd();
    this.fjData = {} as Attachment;
    this.fjData.obt = this.obt;
    this.fjData.obi = this.obi;
    this.bw = "";
  }


  // 删除当前项
  async delAttach(at: Attachment) {
    if (at) {
      await this.eventService.removeAttachment(at);
    }
  }

  //打开本地PDF
  openPdf(fj: string, fileType: string, fji: string) {
    if (fj && fj.indexOf("http") > 0) {
      //当时mp3的情况下
      if (fileType && (fileType == 'mp3' || fileType == 'MP3')) {
        this.nativeAudio.preloadSimple(fji, fj).then((data) => {

        }, (error) => {

        });
        this.nativeAudio.play(fji).then((data) => {

        }, (error) => {

        });
      }
    } else {
      this.fileOpener.open(fj, this.getFileMimeType(fileType))
        .then(() => console.info('File is opened'))
        .catch(e => console.info('Error opening file', e));
    }

  }

  //放大图片
  photoShow(fj: string) {
    if (fj && fj.indexOf("http") > 0) {
      let remoteId: string = fj.substr(fj.lastIndexOf("/") + 1, fj.length);
      fj = this.browserurlBig + remoteId
    }
    this.util.photoViews(fj);
  }

  //刷新数据
  async flushData() {
    //清空数据
    this.fjArray = new Array<Attachment>();
    let attachments: Array<Attachment> = new Array<Attachment>();
    attachments = await this.eventService.selectAttachments(this.obt, this.obi);
    //alert("刷新返回值："+JSON.stringify(attachments));
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
              let fileName: string = attachment.fpjson.local.substr(1, attachment.fpjson.local.length);
              // 本地文件存在，页面上显示本地文件
              let checked = await this.isExistFile(attachment.fpjson.getCacheDir(), fileName);
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

  isExistFile(dir: string, fileName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.file.checkFile(this.file.dataDirectory + dir, fileName).then(_ => {
        resolve(true);
      }).catch(err => {
        resolve(false);
      });
    });
  }

}
