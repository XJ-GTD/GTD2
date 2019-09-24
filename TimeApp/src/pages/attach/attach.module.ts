import { NgModule } from '@angular/core';
import { AttachPage } from './attach';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {File} from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject  } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Chooser } from '@ionic-native/chooser';

@NgModule({
  declarations: [
    AttachPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    DirectivesModule,
    FileTransfer,
    File,
    Camera,
    Chooser
  ],
  providers: [
  ],
  entryComponents:[
    AttachPage
  ],
  exports:[
    AttachPage
  ]
})
export class AttachPageModule {}
