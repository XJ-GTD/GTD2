import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {File} from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject  } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Chooser } from '@ionic-native/chooser';
import { FilePath } from '@ionic-native/file-path';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {FjData, Attachment} from "../../service/business/event.service";

@IonicPage()
@Component({
  selector: 'page-attach',
  template: `
  <modal-box title="附件" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
    <ion-grid>
      <ion-row>
        暂无附件
      </ion-row>
      <ion-row>
        <button ion-button icon-start clear (click)="shot()">
          <ion-icon ios="ios-camera" md="ios-camera"></ion-icon>
          <div>拍照</div>
        </button>
        <button ion-button icon-start clear (click)="select()">
          <ion-icon ios="ios-albums" md="ios-albums"></ion-icon>
          <div>相册</div>
        </button>
      </ion-row>
      <ion-row>
        <ion-textarea rows="8" no-margin [(ngModel)]="bw"  placeholder="输入你想要添加的附件说明主题"></ion-textarea>
          <button ion-button clear (click)="saveFile()" class="font-normal">
               确认保存
          </button>
      </ion-row>
      <ion-row>
          <ion-list>
            <ng-container *ngFor="let fj of fjArray">
                <ion-item>
                   <ion-label>{{fj.fjn}}</ion-label>
                   <ion-label>查看</ion-label>
                   <ion-label>下载</ion-label>
                 </ion-item>
            </ng-container>
          </ion-list>
      </ion-row>
    </ion-grid>
  </modal-box>
  `
})

export class AttachPage {
  statusBarColor: string = "#3c4d55";
  imgUrl: string = "";
  fjArray: Array<Attachment> = new Array<Attachment>();
  fjData: Attachment = {} as Attachment;
  obt: string = "" ;
  obi: string = "";
  bw: string = "";
  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private file: File,
              private camera: Camera,
              private chooser: Chooser,
              private transfer:FileTransfer,
              private filePath: FilePath,
              private keyboard: Keyboard) {
    if (this.navParams && this.navParams.data) {
      this.obt  = this.navParams.data.obt;
      this.obi = this.navParams.data.obi;
      this.fjArray = this.navParams.data.attach;
    }
    //验证缓存文件目录是否存在
    this.file.checkDir(this.file.externalDataDirectory,'/timeAppfile')
      .then(_ => console.log('Directory exists'))
      .catch(err => {
            this.file.createDir(this.file.externalDataDirectory,"timeAppfile",true).then(result=>{
               console.log("success")
            }).catch(err=>{
              console.log("err:"+JSON.stringify(err))
            })
    });
  }


  ionViewDidEnter() {

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
       sourceType: this.camera.PictureSourceType.CAMERA , //打开方式 PHOTOLIBRARY  相册 CAMERA  拍照
       saveToPhotoAlbum: true //是否保存相册
    }
    this.camera.getPicture(options).then((imageData) => {
      console.info("开始拍照上传照片");
      //let fjData: FjData = {} as FjData;
      if (imageData !=''){

        let fileName: string  = imageData.substr(imageData.lastIndexOf("/")+1,imageData.length);
        let ext: string = fileName.split(".")[1];
        //将文件copy至缓存文件
        let imgFileDir: string  =  imageData.substr(0,imageData.lastIndexOf("/")+1);
        this.fjData.obt = this.obt;
        this.fjData.obi = this.obi;
        this.fjData.fjn = fileName;
        this.fjData.ext = ext;
        this.fjData.fj = this.file.externalDataDirectory+"/timeAppfile/"+fileName;
        this.file.copyFile(imgFileDir,fileName,this.file.externalDataDirectory+"/timeAppfile",fileName);

      }
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.imgUrl = base64Image;
      // alert(this.imgUrl);
      //TODO  调研图片上传的Service,并将附件的返回值返回给上一页
      //this.upload();
    }, (err) => {
        console.info("拍照上传附件异常，异常信息："+ err);
    });
  }

  /**
  * 文件上传  ying<343253410@qq.com>
  */
  select() {

    //测试数据
    // let fjData: FjData = {} as FjData;
    // fjData.obt = this.obt;
    // fjData.obi = this.obi;
    // fjData.fjn = this.bw;
    // fjData.ext = "jpg";
    // fjData.fj = "/home/storage/ying/liqianna/123.jpg";
    // this.fjArray.push(fjData);
    //正式代码
      this.chooser.getFile('*/*').then((file) => {
          this.filePath.resolveNativePath(file.uri)
          .then((filePath) =>{
            if(filePath !=''){
              let fileName: string  = filePath.substr(filePath.lastIndexOf("/")+1,filePath.length);
              let ext: string = fileName.split(".")[1];
              let imgFileDir: string  =  filePath.substr(0,filePath.lastIndexOf("/")+1);
              // let fjData: FjData = {} as FjData;
              this.fjData.obt = this.obt;
              this.fjData.obi = this.obi;
              this.fjData.fjn = fileName;
              this.fjData.ext = ext;
              this.fjData.fj = this.file.externalDataDirectory+"/timeAppfile/"+fileName;
              //this.fjArray.push(fjData);
              this.file.copyFile(imgFileDir,fileName,this.file.externalDataDirectory+"/timeAppfile",fileName);
            }
          })
          .catch(err => console.log(err));
        }
      )
     .catch((error: any)=> console.error(error));
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
         console.info("上传成功"+JSON.stringify(data));
      }, (err) => {
          // error
           console.info("上传失败"+JSON.stringify(err));
      })
  }
  // 点击确认，保存文件
  saveFile() {
    if(this.bw){
      this.fjData.fjn = this.bw
    }
    this.fjArray.push(this.fjData);
     this.fjData = {} as Attachment;
  }
}
