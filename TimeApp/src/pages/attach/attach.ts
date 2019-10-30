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
import {EventService,FjData, Attachment} from "../../service/business/event.service";
import {UtilService} from "../../service/util-service/util.service";
import * as moment from "moment";
import {DelType, SyncType} from "../../data.enum";
import {UserConfig} from "../../service/config/user.config";

@IonicPage()
@Component({
  selector: 'page-attach',
  template: `

    <modal-box title="补充信息" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()" (onCreate)="openselect()">

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
                <div class="st font-small"> {{fja.wtt * 1000 | date: "yyyy-MM-dd HH:mm"}}</div>
                <div class="person font-small" *ngIf="fja.ui!=currentuser" end>---{{fja.ui | formatuser: currentuser: friends}}</div>
              </div>
              <div class="line font-normal" leftmargin rightmargin >
                <div class="sn towline">{{fja.fjn}}</div>
              </div>
              <div class="line font-normal" leftmargin rightmargin >
                <div *ngIf="(fja.ext=='PDF'||fja.ext=='pdf')&& (fja.fj !='')" >
                  <ion-icon class="fas fa-file-pdf" (click)="opnePdf(fja.fj)"></ion-icon>
                </div>
                <div *ngIf="(fja.ext=='png'||fja.ext=='PNG'||fja.ext=='jpg'||fja.ext=='JPG'||fja.ext=='bmp'||fja.ext=='BMP'||fja.ext=='mp4'||fja.ext=='MP4')&& (fja.fj !='')">
                      <ion-thumbnail>
                      <img src="{{fja.fj}}" />
                      </ion-thumbnail>
                </div>

                <div class="icon" *ngIf="(fja.tb=='unsynch')&&(fja.ui==currentuser) " end >
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
  buttons: any = {
    create: true,
    save: true,
    cancel: true
  };

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;

  deleted: DelType = DelType.del;

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
              private uitl:UtilService) {
    if (this.navParams && this.navParams.data) {
      this.obt = this.navParams.data.obt;
      this.obi = this.navParams.data.obi;
      this.fjArray = this.navParams.data.attach;
      // this.currentuser = this.navParams.data.userId
    }
    //验证缓存文件目录是否存在
    // this.file.checkDir(this.file.externalDataDirectory, '/timeAppfile')
    //   .then(_ => console.log('Directory exists'))
    //   .catch(err => {
    //     this.file.createDir(this.file.externalDataDirectory, "timeAppfile", true).then(result => {
    //       console.log("success")
    //     }).catch(err => {
    //       console.log("err:" + JSON.stringify(err))
    //     })
    //   });
    //1.验证是否有原有的值传的过来
    if (this.fjArray) {
      //2.当有值传递过来的情况下，将fj的值转换给fpjson
      for(let i=0; i<this.fjArray.length;i++) {
        if (this.fjArray[i].fj && this.fjArray[i].ext) {
          //处理历史遗留数据，按照原来的显示
          if (this.uitl.isJsonString(this.fjArray[i].fj)) {
            //获取新赋值
            let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
            this.fjArray[i].fpjson = this.eventService.generateCacheFilePathJson(cacheFilePathJson,this.fjArray[i].fj);
            //目前直接在该页面直接存储附件，则直接将文件位置赋值给
            this.fjArray[i].fj = this.fjArray[i].fpjson.getLocalFilePath(this.file.cacheDirectory);
            //检查该文件夹下是否存在该文件，如果不存在，则根据remote下载同步该文件
            this.file.checkFile(this.file.cacheDirectory+this.fjArray[i].fpjson.getCacheDir(), this.fjArray[i].fpjson.local)
            .then(_ => console.log('Directory exists'))
            .catch(err => {
                  //根据remote 拉取文件
                  if (this.fjArray[i].fpjson.remote) {
                    //根据地址拉取文件
                  }
            });
          }

        }
      }
    }

  }


  ionViewDidEnter() {

  }

  openimg(url){
    this.uitl.photoViews(url);
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

  async save() {
    // let data: Object = {attach: this.fjArray};
    //
    // let uploads = this.fjArray.filter((element) => {
    //   return (element.tb != SyncType.synch);
    // });
    // if (uploads && uploads.length > 0) {
    //   await this.eventService.syncAttachments(uploads);
    // }
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.navCtrl.pop();
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
        this.fjData.obt = this.obt;
        this.fjData.obi = this.obi;
        this.fjData.fjn = fileName;
        this.fjData.ext = ext;
        //构造地址文件
        let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
        cacheFilePathJson.local = fileName;
        //this.fjData.fj = this.file.externalDataDirectory + "/timeAppfile/" + fileName;
        this.fjData.fj = JSON.stringify(cacheFilePathJson);
        this.fjData.ui = this.currentuser;
        this.fjData.del = DelType.undel;
        this.fjData.tb = SyncType.unsynch;
        this.fjData.wtt = moment().unix();
        if(!this.bw) {
          this.bw = fileName;
        }
        this.file.copyFile(imgFileDir, fileName, this.file.cacheDirectory + cacheFilePathJson.getCacheDir(), fileName);

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
            alert("选择的PDF文件filePath："+JSON.stringify(filePath));
            if (filePath != '') {
              let fileName: string = filePath.substr(filePath.lastIndexOf("/") + 1, filePath.length);
              let ext: string = fileName.substr(fileName.lastIndexOf(".") + 1);
              let imgFileDir: string = filePath.substr(0, filePath.lastIndexOf("/") + 1);
              // let fjData: FjData = {} as FjData;
              this.fjData.obt = this.obt;
              this.fjData.obi = this.obi;
              this.fjData.fjn = fileName;
              this.fjData.ext = ext;
              this.fjData.ui = this.currentuser;
              this.fjData.del = DelType.undel;
              this.fjData.tb = SyncType.unsynch;
              this.fjData.wtt = moment().unix();
              let cacheFilePathJson: CacheFilePathJson = new CacheFilePathJson();
              cacheFilePathJson.local = fileName;
              this.fjData.fj = JSON.stringify(cacheFilePathJson);
              this.fjData.fpjson = cacheFilePathJson;
              //this.fjData.fj = this.file.externalDataDirectory + "/timeAppfile/" + fileName;
              //this.fjArray.push(fjData);
              if(!this.bw) {
                this.bw = fileName;
              }
              alert("存储值："+JSON.stringify(this.fjData));
              this.file.copyFile(imgFileDir, fileName, this.file.cacheDirectory + cacheFilePathJson.getCacheDir(), fileName);
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
      this.fjData.fjn = this.bw
      this.fjData.ui = this.currentuser;
      this.fjData.del = DelType.undel;
      this.fjData.tb = SyncType.unsynch;
      this.fjData.wtt = moment().unix();
      //1.对当前数据进行存储
      let retAt: Attachment = {}  as Attachment;
      retAt = await this.eventService.syncSaveAttachment(this.fjData);
      //2.上传文件
      let attachArray: Array<Attachment> = new Array<Attachment>();
      attachArray.push(retAt);
      await this.eventService.syncAttachments(attachArray);
      //3.将当前数据存的到fjArray中去
      this.fjData.fj = this.fjData.fpjson.getLocalFilePath(this.file.cacheDirectory);
      this.fjArray.push(this.fjData);
      this.fjData = {} as Attachment;
      this.bw = "";
      //4. TODO 同步通知参与人，新增数据
    }
  }

  // 删除当前项
  delAttach(at: Attachment) {
    if (at) {
        for (let fj of this.fjArray) {
            if ((fj.fji == at.fji)&&(fj.obt == at.obt)
              &&(fj.obi == at.obi)&&(fj.fjn == at.fjn)
              &&(fj.ext == at.ext)&&(fj.fj == at.fj)
              &&(fj.tb == at.tb)&&(fj.del == at.del)&&(fj.wtt == at.wtt)) {
                  fj.del = DelType.del;
                  //当存在数据库中的情况下，更新数据中的删除状态位
                  if(fj.fji) {
                     await this.eventService.syncUpdateAttachment(fj.fji);
                     //同步通知参与删除相关内容
                  }
            }
        }
    }
  }
  //打开本地PDF
  opnePdf(fj: string) {
    this.fileOpener.open(fj,'application/pdf')
    .then(() => console.info('File is opened'))
    .catch(e => console.info('Error opening file', e));
  }

}
