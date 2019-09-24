import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {File} from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject  } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Chooser } from '@ionic-native/chooser';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";

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
    </ion-grid>
  </modal-box>
  `
})
export class AttachPage {
  statusBarColor: string = "#3c4d55";
  imgUrl: string = "";
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
              private keyboard: Keyboard) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {

      }
    }
  }


  ionViewDidEnter() {

  }

  save() {
    let data: Object = {attach: {}};
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
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imgUrl = base64Image;
      alert(this.imgUrl);
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
      this.chooser.getFile().then(file => console.log(file ? file.name : 'canceled'))
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
}
