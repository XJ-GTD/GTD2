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
import {FilePath} from '@ionic-native/file-path';
import {FjData, Attachment} from "../../service/business/event.service";
import {UtilService} from "../../service/util-service/util.service";
import * as moment from "moment";

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
                     *ngIf="fja.del=='undel'" >
              <div class="line font-normal topheader" leftmargin rightmargin >
                <div class="st font-small" end> {{fja.wtt | date: "yyyy-MM-dd HH:mm"}}</div>
                <div class="person font-small">{{fja.ui}}</div>
              </div>
              <div class="line font-normal" leftmargin rightmargin >
                <div class="sn towline">{{fja.fjn}}</div>
              </div>
              <div class="line font-normal" leftmargin rightmargin>
                <div *ngIf="fja.ext=='PDF'||fja.ext=='pdf'">
                  <ion-icon class="fas fa-file-pdf" (click)="window.open({{fja.fj}})"></ion-icon>
                </div>
                <div *ngIf="fja.ext=='png'||fja.ext=='PNG'||fja.ext=='jpg'||fja.ext=='JPG'||fja.ext=='bmp'||fja.ext=='BMP'||fja.ext=='mp4'||fja.ext=='MP4'">
                      <img src="file:///{{fja.fj}}" />
                </div>

                <div class="icon" *ngIf="(fja.tb=='unsynch')&&(fja.ui==currentuser) " (click)="delAttach(fja)"  end >
                  <ion-icon class="fal fa-minus-circle"></ion-icon>
                </div>
              </div>
            </ion-row>
          </ng-container>
          <ion-row class="item-content item-content-backgroud" leftmargin toppaddingsamll bottompaddingsamll rightmargin>

            <div class="line font-normal topheader" leftmargin rightmargin>
              <div class="st font-small"> 12:00</div>
              <div class="person font-small" end>---来自谷子地</div>
            </div>
            <div class="line font-normal" leftmargin rightmargin>
              <div class="sn towline">官网的其中一个图片.png</div>
            </div>
            <div class="line font-normal" leftmargin rightmargin>
              <div><ion-thumbnail  (click)="openimg('https://pluto.guobaa.com/cal/img/5.png')">
                <img src="https://pluto.guobaa.com/cal/img/5.png" />
              </ion-thumbnail></div>
              <div class="icon" end>
                <ion-icon class="fal fa-minus-circle"></ion-icon>
              </div>
            </div>
          </ion-row>


          <ion-row class="item-content item-content-backgroud" leftmargin toppaddingsamll bottompaddingsamll rightmargin>

            <div class="line font-normal topheader" leftmargin rightmargin>
              <div class="st font-small"> 12:00</div>
              <div class="person font-small" end>---来自谷子地</div>
            </div>
            <div class="line font-normal" leftmargin rightmargin>
              <div class="sn towline">B2008_WindEDITLiteUsersCS.pdf</div>
            </div>
            <div class="line font-normal" leftmargin rightmargin>
              <div>

                <ion-icon class="fas fa-file-pdf" (click)="window.open('www.idec.com/language/chinese_s/AO/B2008_WindEDITLiteUsersCS.pdf')"></ion-icon>
              </div>
              <div class="icon" end>
                <ion-icon class="fal fa-minus-circle font-large-x"></ion-icon>
              </div>
            </div>
          </ion-row>

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
  currentuser: string = "";
  buttons: any = {
    create: true,
    save: true,
    cancel: true
  };

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private file: File,
              private camera: Camera,
              private chooser: Chooser,
              private transfer: FileTransfer,
              private filePath: FilePath,
              private keyboard: Keyboard,
              private actionSheetCtrl: ActionSheetController,
              private uitl:UtilService) {
    if (this.navParams && this.navParams.data) {
      this.obt = this.navParams.data.obt;
      this.obi = this.navParams.data.obi;
      this.fjArray = this.navParams.data.attach;
      this.currentuser = this.navParams.data.userId
    }
    //验证缓存文件目录是否存在
    this.file.checkDir(this.file.externalDataDirectory, '/timeAppfile')
      .then(_ => console.log('Directory exists'))
      .catch(err => {
        this.file.createDir(this.file.externalDataDirectory, "timeAppfile", true).then(result => {
          console.log("success")
        }).catch(err => {
          console.log("err:" + JSON.stringify(err))
        })
      });
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

  save() {
    let data: Object = {attach: this.fjArray};
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
        let ext: string = fileName.split(".")[1];
        //将文件copy至缓存文件
        let imgFileDir: string = imageData.substr(0, imageData.lastIndexOf("/") + 1);
        this.fjData.obt = this.obt;
        this.fjData.obi = this.obi;
        this.fjData.fjn = fileName;
        this.fjData.ext = ext;
        this.fjData.fj = this.file.externalDataDirectory + "/timeAppfile/" + fileName;
        this.fjData.ui = this.currentuser;
        this.fjData.del = 'undel';
        this.fjData.tb = 'unsynch';
        this.fjData.wtt = moment().unix();
        this.file.copyFile(imgFileDir, fileName, this.file.externalDataDirectory + "/timeAppfile", fileName);

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
              let ext: string = fileName.split(".")[1];
              let imgFileDir: string = filePath.substr(0, filePath.lastIndexOf("/") + 1);
              // let fjData: FjData = {} as FjData;
              this.fjData.obt = this.obt;
              this.fjData.obi = this.obi;
              this.fjData.fjn = fileName;
              this.fjData.ext = ext;
              this.fjData.ui = this.currentuser;
              this.fjData.del = 'undel';
              this.fjData.tb = 'unsynch';
              this.fjData.wtt = moment().unix();
              this.fjData.fj = this.file.externalDataDirectory + "/timeAppfile/" + fileName;
              //this.fjArray.push(fjData);
              this.file.copyFile(imgFileDir, fileName, this.file.externalDataDirectory + "/timeAppfile", fileName);
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
  saveComment() {
    if (this.bw && this.bw.trim() != '') {
      this.fjData.fjn = this.bw
      this.fjData.ui = this.currentuser;
      this.fjData.del = 'undel';
      this.fjData.tb = 'unsynch';
      this.fjData.wtt = moment().unix();
      this.fjArray.push(this.fjData);
      this.fjData = {} as Attachment;
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
                  fj.del = 'del';
            }
        }
    }
  }

}
